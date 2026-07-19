import type { PlantillaCertificadoPersonalizada } from '@prisma/client'

import { fetchImageBuffer, compressImageForPdf, formatDateLong, calcularNotaFinal, calcularPromedioModulo, hexToRgb } from './utils'
import { registrarFuentesPersonalizadas } from './fontRegistry'

import type { CertificadoData, GeneratorFn, CampoPlantillaPersonalizada, ModuloData } from './types'

const PAGE_W = 297
const PAGE_H = 210

// Ancho máximo por defecto para campos de texto sin `maxWidthPct` configurado:
// deja un margen automático a cada lado y evita que textos largos (p. ej. el
// título del curso) se salgan de la página o se superpongan con otros campos.
const DEFAULT_MAX_WIDTH_PCT = 92

// 1pt = 25.4/72 mm; se usa 1.15 como interlineado, igual que el editor (ver
// fontSizeToCqw en CampoChip.tsx) para que el preview y el PDF coincidan.
const PT_TO_MM = 25.4 / 72
const FONT_SIZE_MIN = 5

function alturaLineaMm(fontSizePt: number): number {
  return fontSizePt * PT_TO_MM * 1.15
}

type RGB = [number, number, number]

/** Aclara un color mezclándolo con blanco (factor 0 = color puro, 1 = blanco). Usado para fondos pastel. */
function mezclarConBlanco([r, g, b]: RGB, factor: number): RGB {
  return [Math.round(r + (255 - r) * factor), Math.round(g + (255 - g) * factor), Math.round(b + (255 - b) * factor)]
}

/** Mide el tamaño (mm) que ocupará una "pastilla" (rounded rect relleno) con `texto` centrado. */
function medirPill(doc: any, texto: string, fontFamily: string, fontSize: number): { w: number; h: number } {
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(fontSize)

  return { w: doc.getTextWidth(texto) + fontSize * 0.7, h: alturaLineaMm(fontSize) + fontSize * 0.18 }
}

/** Dibuja una "pastilla" (rounded rect relleno) con `texto` centrado; usada para el promedio en varios estilos. */
function dibujarPill(
  doc: any,
  texto: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fontFamily: string,
  fontSize: number,
  bg: RGB,
  fg: RGB
) {
  doc.setFillColor(bg[0], bg[1], bg[2])
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F')
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(fontSize)
  doc.setTextColor(fg[0], fg[1], fg[2])
  doc.text(texto, x + w / 2, y + h / 2, { align: 'center', baseline: 'middle' })
}

/**
 * Resuelve el texto a dibujar para un campo de tipo 'texto' o 'texto_libre'.
 */
function resolveTexto(campo: CampoPlantillaPersonalizada, data: CertificadoData): string {
  if (campo.tipo === 'texto_libre') return campo.texto ?? ''

  switch (campo.key) {
    case 'nombreCompleto': return data.nombreCompleto
    case 'cursoTitulo': return data.cursoTitulo
    case 'cursoDuracion': return data.cursoDuracion || '---'
    case 'fechaEmision': return formatDateLong(data.fechaEmisionVal)
    case 'fechaInicio': return formatDateLong(data.fechaInicioVal)
    case 'fechaFin': return formatDateLong(data.fechaFinVal)
    case 'fechaVigencia': return data.vigenciaHastaVal ? formatDateLong(data.vigenciaHastaVal) : 'Sin vencimiento'
    case 'codigoVerificacion': return data.codigoVerificacion

    case 'notaFinal': {
      const nota = calcularNotaFinal(data.notasPorModulo, data.notaInscripcion)

      return nota !== null ? nota.toFixed(2) : '---'
    }

    case 'firmaDocenteNombre':
      return data.profesorSnapshot ? `${data.profesorSnapshot.nombre} ${data.profesorSnapshot.apellido || ''}`.trim() : ''
    case 'firmaDocenteCargo': return data.profesorSnapshot?.cargo || ''
    case 'firmaGerenteNombre':
      return data.gerenteGeneral ? `${data.gerenteGeneral.nombre} ${data.gerenteGeneral.apellido || ''}`.trim() : ''
    case 'firmaGerenteCargo': return data.gerenteGeneral?.cargo || ''

    case 'firmante1Nombre': return data.firmante1?.nombre || ''
    case 'firmante1Cargo': return data.firmante1?.cargo || ''
    case 'firmante2Nombre': return data.firmante2?.nombre || ''
    case 'firmante2Cargo': return data.firmante2?.cargo || ''
    default: return ''
  }
}

/**
 * Resuelve el buffer/dataURL a dibujar para un campo de tipo 'imagen' o 'qr'.
 */
async function resolveImagen(
  campo: CampoPlantillaPersonalizada,
  data: CertificadoData
): Promise<{ src: string | Buffer; format: string } | null> {
  if (campo.tipo === 'qr' || campo.key === 'qr') {
    if (!data.verifyUrl) return data.qrDataUrl ? { src: data.qrDataUrl, format: 'PNG' } : null

    // Se regenera (en vez de reutilizar data.qrDataUrl) para poder aplicar el color
    // elegido por el admin y una mayor resolución/margen de silencio, de forma que
    // el QR se vea completo y nítido en el PDF.
    const QRCode = await import('qrcode')

    const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, {
      width: 300,
      margin: 2,
      color: { dark: campo.color ?? data.colorPrimario, light: '#ffffff' }
    })

    return { src: qrDataUrl, format: 'PNG' }
  }

  switch (campo.key) {
    case 'logoInstitucion': {
      if (!data.logoBuffer) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(data.logoBuffer, { maxWidth: 600, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmaDocenteImagen': {
      if (!data.mostrarFirmaDocente || !data.profesorSnapshot?.firma) return null
      const buf = await fetchImageBuffer(data.profesorSnapshot.firma)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmaGerenteImagen': {
      if (!data.gerenteGeneral?.firma) return null
      const buf = await fetchImageBuffer(data.gerenteGeneral.firma)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmante1Firma': {
      if (!data.firmante1?.firma) return null
      const buf = await fetchImageBuffer(data.firmante1.firma)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmante1Sello': {
      if (!data.firmante1?.sello) return null
      const buf = await fetchImageBuffer(data.firmante1.sello)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmante2Firma': {
      if (!data.firmante2?.firma) return null
      const buf = await fetchImageBuffer(data.firmante2.firma)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    case 'firmante2Sello': {
      if (!data.firmante2?.sello) return null
      const buf = await fetchImageBuffer(data.firmante2.sello)

      if (!buf) return null
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 300, format: 'png' })

      return { src: buffer, format: jsPdfFormat }
    }

    default: return null
  }
}

/** Texto de lecciones de un módulo unido en una sola línea (usado por los estilos 'compacta' y 'tabla'). */
function leccionesTexto(modulo: ModuloData): string {
  return modulo.lecciones.map(l => `${modulo.orden + 1}.${l.orden + 1} ${l.titulo}`).join('   ·   ')
}

/**
 * Divide los módulos en 2 columnas "a la francesa" (se llena la primera columna
 * completa antes de pasar a la segunda), como columnas de periódico. Con menos
 * de 2 módulos no se divide (se deja una sola columna a ancho completo).
 */
function dividirModulosEnColumnas(modulos: ModuloData[]): [ModuloData[], ModuloData[]] {
  if (modulos.length < 2) return [modulos, []]

  const mitad = Math.ceil(modulos.length / 2)

  return [modulos.slice(0, mitad), modulos.slice(mitad)]
}

/**
 * Dibuja el bloque "Contenido del curso (módulos)" dentro de un cuadro
 * (xPct/yPct = esquina superior izquierda, widthPct/heightPct = tamaño), con
 * el estilo elegido por el admin (`campo.variante`). En todos los estilos el
 * promedio de un módulo se omite por completo si el módulo no tiene ningún
 * examen rendido (no se imprime "Promedio: ---" ni un guion vacío).
 */
function dibujarTablaModulos(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  if (!data.modulos || data.modulos.length === 0) return

  switch (campo.variante ?? 'lista') {
    case 'compacta':
      return dibujarTablaModulosCompacta(doc, campo, data)
    case 'tarjetas':
      return dibujarTablaModulosTarjetas(doc, campo, data)
    case 'tabla':
      return dibujarTablaModulosTabla(doc, campo, data)
    default:
      return dibujarTablaModulosLista(doc, campo, data)
  }
}

/** Estilo 'lista': módulo en negrita, lecciones indentadas debajo, promedio en cursiva gris. */
function dibujarTablaModulosLista(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const modulos = data.modulos

  const boxX = (campo.xPct / 100) * PAGE_W
  const boxY = (campo.yPct / 100) * PAGE_H
  const boxW = ((campo.widthPct ?? 90) / 100) * PAGE_W
  const boxH = ((campo.heightPct ?? 90) / 100) * PAGE_H

  const fontFamily = campo.fontFamily ?? 'helvetica'
  const [r, g, b] = hexToRgb(campo.color ?? '#000000')
  const [pr, pg, pb] = hexToRgb(data.colorPrimario)

  const paddingMm = 2
  const contentW = boxW - paddingMm * 2
  const lessonIndentMm = 3

  const calcAlturaTotal = (fontSize: number): number => {
    let h = 0

    for (const modulo of modulos) {
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(fontSize + 1)
      const modTxt = `${modulo.orden + 1}. ${modulo.titulo}`.toUpperCase()
      const modLines = doc.splitTextToSize(modTxt, contentW)

      h += modLines.length * alturaLineaMm(fontSize + 1) + fontSize * 0.15

      doc.setFont(fontFamily, 'normal')
      doc.setFontSize(fontSize)

      for (const leccion of modulo.lecciones) {
        const lecTxt = `${modulo.orden + 1}.${leccion.orden + 1}  ${leccion.titulo}`
        const lecLines = doc.splitTextToSize(lecTxt, contentW - lessonIndentMm)

        h += lecLines.length * alturaLineaMm(fontSize)
      }

      // línea de "Promedio" (solo si el módulo tiene exámenes rendidos) + separación entre módulos
      if (calcularPromedioModulo(modulo.id, data.notasPorModulo) !== null) {
        h += alturaLineaMm(fontSize)
      }

      h += fontSize * 0.25
    }

    return h
  }

  let fontSize = campo.fontSize ?? 10

  while (fontSize > FONT_SIZE_MIN && calcAlturaTotal(fontSize) > boxH) {
    fontSize -= 0.5
  }

  let y = boxY + paddingMm
  const bottomLimit = boxY + boxH

  for (const modulo of modulos) {
    if (y >= bottomLimit) break

    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(fontSize + 1)
    doc.setTextColor(pr, pg, pb)

    const modTxt = `${modulo.orden + 1}. ${modulo.titulo}`.toUpperCase()
    const modLines = doc.splitTextToSize(modTxt, contentW)

    doc.text(modLines, boxX + paddingMm, y, { baseline: 'top' })
    y += modLines.length * alturaLineaMm(fontSize + 1) + fontSize * 0.15

    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(fontSize)
    doc.setTextColor(r, g, b)

    for (const leccion of modulo.lecciones) {
      if (y >= bottomLimit) break

      const lecTxt = `${modulo.orden + 1}.${leccion.orden + 1}  ${leccion.titulo}`
      const lecLines = doc.splitTextToSize(lecTxt, contentW - lessonIndentMm)

      doc.text(lecLines, boxX + paddingMm + lessonIndentMm, y, { baseline: 'top' })
      y += lecLines.length * alturaLineaMm(fontSize)
    }

    const promedio = calcularPromedioModulo(modulo.id, data.notasPorModulo)

    // Si el módulo no tiene ningún examen rendido no hay promedio que calcular,
    // así que se omite la línea por completo (no se imprime "Promedio: ---").
    if (promedio !== null && y < bottomLimit) {
      doc.setFont(fontFamily, 'italic')
      doc.setFontSize(fontSize)
      doc.setTextColor(120, 120, 120)
      doc.text(`Promedio: ${promedio.toFixed(2)}/20`, boxX + paddingMm + lessonIndentMm, y, { baseline: 'top' })
      y += alturaLineaMm(fontSize)
    }

    y += fontSize * 0.25
  }
}

/** Estilo 'compacta': círculo numerado + título, promedio como pastilla de color, cada lección en su propia línea, en 2 columnas. */
function dibujarTablaModulosCompacta(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const [colIzq, colDer] = dividirModulosEnColumnas(data.modulos)
  const dosColumnas = colDer.length > 0

  const boxX = (campo.xPct / 100) * PAGE_W
  const boxY = (campo.yPct / 100) * PAGE_H
  const boxW = ((campo.widthPct ?? 90) / 100) * PAGE_W
  const boxH = ((campo.heightPct ?? 90) / 100) * PAGE_H

  const fontFamily = campo.fontFamily ?? 'helvetica'
  const [r, g, b] = hexToRgb(campo.color ?? '#000000')
  const primario: RGB = hexToRgb(data.colorPrimario)

  const paddingMm = 2
  const colGapMm = 6
  const contentW = boxW - paddingMm * 2
  const colW = dosColumnas ? (contentW - colGapMm) / 2 : contentW
  const rowGapMm = 1.8

  const medirModulo = (fontSize: number, modulo: ModuloData) => {
    const promedio = calcularPromedioModulo(modulo.id, data.notasPorModulo)
    const promedioTxt = promedio !== null ? `${promedio.toFixed(2)}/20` : null
    const pill = promedioTxt ? medirPill(doc, promedioTxt, fontFamily, fontSize * 0.85) : null

    const badgeD = alturaLineaMm(fontSize + 1) + 1.2
    const tituloX = badgeD + 2.2

    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(fontSize + 1)
    const modTxt = modulo.titulo.toUpperCase()
    const modLines = doc.splitTextToSize(modTxt, colW - tituloX - (pill ? pill.w + 3 : 0)) as string[]
    const tituloAlto = Math.max(modLines.length * alturaLineaMm(fontSize + 1), badgeD)

    let alto = tituloAlto + fontSize * 0.2

    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(fontSize * 0.9)
    const lecLinesPorLeccion = modulo.lecciones.map(leccion => {
      const lecTxt = `${modulo.orden + 1}.${leccion.orden + 1} ${leccion.titulo}`

      return doc.splitTextToSize(lecTxt, colW - tituloX) as string[]
    })

    let lecAlto = 0

    for (const lecLines of lecLinesPorLeccion) {
      lecAlto += lecLines.length * alturaLineaMm(fontSize * 0.9)
    }

    if (lecLinesPorLeccion.length > 0) alto += lecAlto + fontSize * 0.15

    alto += rowGapMm

    return { promedioTxt, pill, badgeD, tituloX, modLines, tituloAlto, lecLinesPorLeccion, alto }
  }

  let fontSize = campo.fontSize ?? 10

  const calcAlturaColumna = (fs: number, col: ModuloData[]) => col.reduce((acc, m) => acc + medirModulo(fs, m).alto, 0)
  const calcAlturaTotal = (fs: number) => Math.max(calcAlturaColumna(fs, colIzq), calcAlturaColumna(fs, colDer))

  while (fontSize > FONT_SIZE_MIN && calcAlturaTotal(fontSize) > boxH) {
    fontSize -= 0.5
  }

  const bottomLimit = boxY + boxH

  const dibujarColumna = (col: ModuloData[], colX: number) => {
    let y = boxY + paddingMm

    col.forEach((modulo, i) => {
      if (y >= bottomLimit) return

      const { promedioTxt, pill, badgeD, tituloX, modLines, tituloAlto, lecLinesPorLeccion } = medirModulo(fontSize, modulo)

      // Círculo numerado
      doc.setFillColor(primario[0], primario[1], primario[2])
      doc.circle(colX + badgeD / 2, y + badgeD / 2, badgeD / 2, 'F')
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(fontSize * 0.95)
      doc.setTextColor(255, 255, 255)
      doc.text(String(modulo.orden + 1), colX + badgeD / 2, y + badgeD / 2, { align: 'center', baseline: 'middle' })

      // Título
      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(fontSize + 1)
      doc.setTextColor(primario[0], primario[1], primario[2])
      doc.text(modLines, colX + tituloX, y, { baseline: 'top' })

      // Promedio en pastilla, alineado a la derecha; se omite si el módulo no tiene exámenes rendidos.
      if (promedioTxt && pill) {
        dibujarPill(
          doc,
          promedioTxt,
          colX + colW - pill.w,
          y + (tituloAlto - pill.h) / 2,
          pill.w,
          pill.h,
          fontFamily,
          fontSize * 0.85,
          primario,
          [255, 255, 255]
        )
      }

      y += tituloAlto + fontSize * 0.2

      if (lecLinesPorLeccion.length > 0) {
        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(fontSize * 0.9)
        doc.setTextColor(r, g, b)

        for (const lecLines of lecLinesPorLeccion) {
          doc.text(lecLines, colX + tituloX, y, { baseline: 'top' })
          y += lecLines.length * alturaLineaMm(fontSize * 0.9)
        }

        y += fontSize * 0.15
      }

      if (i < col.length - 1) {
        doc.setDrawColor(225, 225, 225)
        doc.setLineWidth(0.2)
        doc.line(colX, y + rowGapMm / 2, colX + colW, y + rowGapMm / 2)
      }

      y += rowGapMm
    })
  }

  dibujarColumna(colIzq, boxX + paddingMm)
  if (dosColumnas) dibujarColumna(colDer, boxX + paddingMm + colW + colGapMm)
}

/**
 * Estilo 'tarjetas': banda superior con el título del bloque (`campo.texto`, o
 * "CONTENIDO DEL CURSO" por defecto) y los módulos en 2 columnas; cada módulo
 * tiene una cabecera pastel con su título (y el promedio como pastilla si
 * existe) y sus lecciones debajo con viñetas.
 */
function dibujarTablaModulosTarjetas(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const [colIzq, colDer] = dividirModulosEnColumnas(data.modulos)
  const dosColumnas = colDer.length > 0

  const boxX = (campo.xPct / 100) * PAGE_W
  const boxY = (campo.yPct / 100) * PAGE_H
  const boxW = ((campo.widthPct ?? 90) / 100) * PAGE_W
  const boxH = ((campo.heightPct ?? 90) / 100) * PAGE_H

  const fontFamily = campo.fontFamily ?? 'helvetica'
  const [r, g, b] = hexToRgb(campo.color ?? '#000000')
  const primario: RGB = hexToRgb(data.colorPrimario)
  const fondoHeaderModulo = mezclarConBlanco(primario, 0.9)

  const outerPaddingMm = 1
  const colGapMm = 5
  const headerPadXMm = 2
  const moduloGapMm = 2.8
  const lessonGapMm = 0.6
  const contentW = boxW - outerPaddingMm * 2
  const colW = dosColumnas ? (contentW - colGapMm) / 2 : contentW

  const tituloBanner = (campo.texto?.trim() || 'CONTENIDO DEL CURSO').toUpperCase()
  const medirBanner = (fs: number) => alturaLineaMm(fs + 3) + fs * 0.9

  const medirModulo = (fontSize: number, modulo: ModuloData) => {
    const promedio = calcularPromedioModulo(modulo.id, data.notasPorModulo)
    const promedioTxt = promedio !== null ? `${promedio.toFixed(2)}/20` : null
    const pill = promedioTxt ? medirPill(doc, promedioTxt, fontFamily, fontSize * 0.8) : null

    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(fontSize + 1)
    const modTxt = `${modulo.orden + 1}. ${modulo.titulo}`.toUpperCase()
    const modLines = doc.splitTextToSize(modTxt, colW - headerPadXMm * 2 - (pill ? pill.w + 3 : 0)) as string[]
    const headerH = Math.max(modLines.length * alturaLineaMm(fontSize + 1), pill?.h ?? 0) + headerPadXMm * 1.6

    doc.setFont(fontFamily, 'normal')
    doc.setFontSize(fontSize * 0.92)

    const lecLinesPorLeccion = modulo.lecciones.map(leccion => {
      const lecTxt = `${modulo.orden + 1}.${leccion.orden + 1}  ${leccion.titulo}`

      return doc.splitTextToSize(lecTxt, colW - 4) as string[]
    })

    let lecAlto = 0

    for (const lecLines of lecLinesPorLeccion) {
      lecAlto += lecLines.length * alturaLineaMm(fontSize * 0.92) + lessonGapMm
    }

    const alto = headerH + (lecLinesPorLeccion.length > 0 ? fontSize * 0.3 + lecAlto : 0) + moduloGapMm

    return { promedioTxt, pill, modLines, headerH, lecLinesPorLeccion, alto }
  }

  let fontSize = campo.fontSize ?? 10

  const calcAlturaColumna = (fs: number, col: ModuloData[]) => col.reduce((acc, m) => acc + medirModulo(fs, m).alto, 0)

  const calcAlturaTotal = (fs: number) =>
    medirBanner(fs) + moduloGapMm + Math.max(calcAlturaColumna(fs, colIzq), calcAlturaColumna(fs, colDer))

  while (fontSize > FONT_SIZE_MIN && calcAlturaTotal(fontSize) > boxH) {
    fontSize -= 0.5
  }

  // Banda superior con el título del bloque
  const bannerH = medirBanner(fontSize)

  doc.setFillColor(primario[0], primario[1], primario[2])
  doc.roundedRect(boxX + outerPaddingMm, boxY, contentW, bannerH, 1.3, 1.3, 'F')
  doc.setFont(fontFamily, 'bold')
  doc.setFontSize(fontSize + 3)
  doc.setTextColor(255, 255, 255)
  doc.text(tituloBanner, boxX + outerPaddingMm + contentW / 2, boxY + bannerH / 2, { align: 'center', baseline: 'middle' })

  const bottomLimit = boxY + boxH

  const dibujarColumna = (col: ModuloData[], colX: number) => {
    let y = boxY + bannerH + moduloGapMm

    for (const modulo of col) {
      if (y >= bottomLimit) break

      const { promedioTxt, pill, modLines, headerH, lecLinesPorLeccion } = medirModulo(fontSize, modulo)

      // Cabecera del módulo (fondo pastel, título en color primario)
      doc.setFillColor(fondoHeaderModulo[0], fondoHeaderModulo[1], fondoHeaderModulo[2])
      doc.roundedRect(colX, y, colW, headerH, 1.1, 1.1, 'F')

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(fontSize + 1)
      doc.setTextColor(primario[0], primario[1], primario[2])
      doc.text(modLines, colX + headerPadXMm, y + headerH / 2, { baseline: 'middle' })

      // Promedio en pastilla dentro de la cabecera; se omite si el módulo no tiene exámenes rendidos.
      if (promedioTxt && pill) {
        dibujarPill(
          doc,
          promedioTxt,
          colX + colW - headerPadXMm - pill.w,
          y + (headerH - pill.h) / 2,
          pill.w,
          pill.h,
          fontFamily,
          fontSize * 0.8,
          primario,
          [255, 255, 255]
        )
      }

      let cy = y + headerH

      if (lecLinesPorLeccion.length > 0) {
        cy += fontSize * 0.3
        doc.setFont(fontFamily, 'normal')
        doc.setFontSize(fontSize * 0.92)
        doc.setTextColor(r, g, b)

        for (const lecLines of lecLinesPorLeccion) {
          doc.setFillColor(primario[0], primario[1], primario[2])
          doc.circle(colX + 1.2, cy + alturaLineaMm(fontSize * 0.92) / 2 - 0.3, 0.45, 'F')
          doc.text(lecLines, colX + 3, cy, { baseline: 'top' })
          cy += lecLines.length * alturaLineaMm(fontSize * 0.92) + lessonGapMm
        }
      }

      y = cy + moduloGapMm
    }
  }

  dibujarColumna(colIzq, boxX + outerPaddingMm)
  if (dosColumnas) dibujarColumna(colDer, boxX + outerPaddingMm + colW + colGapMm)
}

/**
 * Estilo 'tabla': encabezado con banda de color, filas con franjas alternadas,
 * promedio en pastilla y marco redondeado; siempre en una sola columna a todo
 * el ancho del cuadro.
 */
function dibujarTablaModulosTabla(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const modulos = data.modulos

  const boxX = (campo.xPct / 100) * PAGE_W
  const boxY = (campo.yPct / 100) * PAGE_H
  const boxW = ((campo.widthPct ?? 90) / 100) * PAGE_W
  const boxH = ((campo.heightPct ?? 90) / 100) * PAGE_H

  const fontFamily = campo.fontFamily ?? 'helvetica'
  const [r, g, b] = hexToRgb(campo.color ?? '#000000')
  const primario: RGB = hexToRgb(data.colorPrimario)
  const filaAlterna = mezclarConBlanco(primario, 0.93)
  const lineaColumna = mezclarConBlanco(primario, 0.55)

  const paddingMm = 1.5
  const cellPadXMm = 2
  const tablaW = boxW - paddingMm * 2
  const moduloColW = tablaW * 0.44
  const leccionesColW = tablaW * 0.38
  const promColW = tablaW - moduloColW - leccionesColW

  const medirFila = (fontSize: number, modulo: ModuloData) => {
    const promedio = calcularPromedioModulo(modulo.id, data.notasPorModulo)
    const promTxt = promedio !== null ? promedio.toFixed(2) : ''

    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(fontSize)
    const modTxt = `${modulo.orden + 1}. ${modulo.titulo}`.toUpperCase()
    const modLines = doc.splitTextToSize(modTxt, moduloColW - cellPadXMm * 2) as string[]

    doc.setFont(fontFamily, 'normal')
    const lecTxt = leccionesTexto(modulo)
    const lecLines = (lecTxt ? doc.splitTextToSize(lecTxt, leccionesColW - cellPadXMm * 2) : []) as string[]

    const lineas = Math.max(modLines.length, lecLines.length, 1)
    const alto = lineas * alturaLineaMm(fontSize) + fontSize * 0.5

    return { modLines, lecLines, promTxt, alto }
  }

  let fontSize = campo.fontSize ?? 10

  const alturaEncabezado = (fs: number) => alturaLineaMm(fs) + fs * 0.7

  const calcAlturaTotal = (fs: number) => alturaEncabezado(fs) + modulos.reduce((acc, m) => acc + medirFila(fs, m).alto, 0)

  while (fontSize > FONT_SIZE_MIN && calcAlturaTotal(fontSize) > boxH) {
    fontSize -= 0.5
  }

  const headerH = alturaEncabezado(fontSize)
  const bottomLimit = boxY + boxH
  const tablaY = boxY + paddingMm

  const dibujarTabla = (grupo: ModuloData[], tablaX: number) => {
    if (grupo.length === 0) return

    const moduloColX = tablaX
    const leccionesColX = moduloColX + moduloColW
    const promColX = leccionesColX + leccionesColW

    const filas: Array<ReturnType<typeof medirFila> & { modulo: ModuloData }> = []
    let tablaH = headerH

    for (const modulo of grupo) {
      const fila = medirFila(fontSize, modulo)

      if (tablaY + tablaH + fila.alto > bottomLimit) break
      filas.push({ ...fila, modulo })
      tablaH += fila.alto
    }

    // Encabezado (banda de color con texto blanco)
    doc.setFillColor(primario[0], primario[1], primario[2])
    doc.rect(tablaX, tablaY, tablaW, headerH, 'F')
    doc.setFont(fontFamily, 'bold')
    doc.setFontSize(fontSize * 0.95)
    doc.setTextColor(255, 255, 255)
    doc.text('MÓDULO', moduloColX + cellPadXMm, tablaY + headerH / 2, { baseline: 'middle' })
    doc.text('LECCIONES', leccionesColX + cellPadXMm, tablaY + headerH / 2, { baseline: 'middle' })
    doc.text('PROM.', promColX + promColW - cellPadXMm, tablaY + headerH / 2, { align: 'right', baseline: 'middle' })

    // Filas, con franjas alternadas para facilitar la lectura
    let y = tablaY + headerH

    filas.forEach((fila, i) => {
      if (i % 2 === 1) {
        doc.setFillColor(filaAlterna[0], filaAlterna[1], filaAlterna[2])
        doc.rect(tablaX, y, tablaW, fila.alto, 'F')
      }

      doc.setFont(fontFamily, 'bold')
      doc.setFontSize(fontSize)
      doc.setTextColor(primario[0], primario[1], primario[2])
      doc.text(fila.modLines, moduloColX + cellPadXMm, y + fontSize * 0.25, { baseline: 'top' })

      doc.setFont(fontFamily, 'normal')
      doc.setTextColor(r, g, b)

      if (fila.lecLines.length > 0) {
        doc.text(fila.lecLines, leccionesColX + cellPadXMm, y + fontSize * 0.25, { baseline: 'top' })
      }

      // Pastilla de promedio; se omite por completo si el módulo no tiene exámenes rendidos.
      if (fila.promTxt) {
        const pill = medirPill(doc, fila.promTxt, fontFamily, fontSize * 0.8)

        dibujarPill(
          doc,
          fila.promTxt,
          promColX + promColW - cellPadXMm - pill.w,
          y + (fila.alto - pill.h) / 2,
          pill.w,
          pill.h,
          fontFamily,
          fontSize * 0.8,
          primario,
          [255, 255, 255]
        )
      }

      y += fila.alto
    })

    // Líneas divisorias entre columnas
    doc.setDrawColor(lineaColumna[0], lineaColumna[1], lineaColumna[2])
    doc.setLineWidth(0.2)
    doc.line(leccionesColX, tablaY + headerH, leccionesColX, tablaY + tablaH)
    doc.line(promColX, tablaY + headerH, promColX, tablaY + tablaH)

    // Marco exterior redondeado
    doc.setDrawColor(primario[0], primario[1], primario[2])
    doc.setLineWidth(0.35)
    doc.roundedRect(tablaX, tablaY, tablaW, tablaH, 1.5, 1.5, 'S')
  }

  dibujarTabla(modulos, boxX + paddingMm)
}

async function dibujarCampo(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const esFirmaDocente =
    campo.key === 'firmaDocenteNombre' || campo.key === 'firmaDocenteCargo' || campo.key === 'firmaDocenteImagen'

  if (esFirmaDocente && !data.mostrarFirmaDocente) return

  if (campo.tipo === 'tabla_modulos') {
    dibujarTablaModulos(doc, campo, data)

    return
  }

  const x = (campo.xPct / 100) * PAGE_W
  const y = (campo.yPct / 100) * PAGE_H

  if (campo.tipo === 'imagen' || campo.tipo === 'qr') {
    const resuelto = await resolveImagen(campo, data)

    if (!resuelto) return

    const widthMm = ((campo.widthPct ?? 15) / 100) * PAGE_W
    let heightMm = widthMm

    if (Buffer.isBuffer(resuelto.src)) {
      try {
        const { default: sharp } = await import('sharp')
        const meta = await sharp(resuelto.src).metadata()

        if (meta.width && meta.height) heightMm = widthMm * (meta.height / meta.width)
      } catch {
        /* mantiene proporción cuadrada por defecto */
      }
    }

    // Las imágenes siempre se centran horizontalmente sobre xPct; verticalmente
    // se anclan según vAlign (arriba/al medio/abajo respecto a yPct).
    const imgX = x - widthMm / 2
    const vAlign = campo.vAlign ?? 'top'
    const imgY = vAlign === 'middle' ? y - heightMm / 2 : vAlign === 'bottom' ? y - heightMm : y

    try {
      doc.addImage(resuelto.src, resuelto.format, imgX, imgY, widthMm, heightMm)
    } catch {
      /* imagen inválida/corrupta, se omite */
    }

    return
  }

  const texto = resolveTexto(campo, data)

  if (!texto) return

  doc.setFont(campo.fontFamily ?? 'helvetica', campo.bold ? 'bold' : campo.italic ? 'italic' : 'normal')
  doc.setFontSize(campo.fontSize ?? 14)

  const [r, g, b] = hexToRgb(campo.color ?? '#000000')

  doc.setTextColor(r, g, b)

  const align = campo.align ?? 'center'

  // El editor posiciona yPct como el borde SUPERIOR del texto (CSS `top`), así que
  // usamos baseline: 'top' para que jsPDF ancle el texto en el mismo punto y no
  // por su línea base (comportamiento por defecto de jsPDF).
  const maxWidthMm = ((campo.maxWidthPct ?? DEFAULT_MAX_WIDTH_PCT) / 100) * PAGE_W
  const lineas = doc.splitTextToSize(texto, maxWidthMm)

  doc.text(lineas, x, y, { align, baseline: 'top' })
}

/**
 * Genera un GeneratorFn para una plantilla de certificado personalizada
 * (imagen de fondo por cara + campos posicionados libremente por el admin).
 */
export function crearGeneradorPersonalizado(plantilla: PlantillaCertificadoPersonalizada): GeneratorFn {
  return async (data: CertificadoData): Promise<ArrayBuffer> => {
    const campos = Array.isArray(plantilla.campos) ? (plantilla.campos as unknown as CampoPlantillaPersonalizada[]) : []

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })

    registrarFuentesPersonalizadas(doc)

    const dibujarFondo = async (url: string) => {
      const buf = await fetchImageBuffer(url)

      if (!buf) return
      const { buffer, jsPdfFormat } = await compressImageForPdf(buf, { maxWidth: 2400, format: 'jpeg', quality: 82 })

      doc.addImage(buffer, jsPdfFormat, 0, 0, PAGE_W, PAGE_H)
    }

    await dibujarFondo(plantilla.cara_frente_url)

    for (const campo of campos.filter(c => c.pagina === 'frente')) {
      await dibujarCampo(doc, campo, data)
    }

    if (plantilla.cara_reverso_url && plantilla.reverso_activo) {
      doc.addPage()
      await dibujarFondo(plantilla.cara_reverso_url)

      for (const campo of campos.filter(c => c.pagina === 'reverso')) {
        await dibujarCampo(doc, campo, data)
      }
    }

    return doc.output('arraybuffer')
  }
}
