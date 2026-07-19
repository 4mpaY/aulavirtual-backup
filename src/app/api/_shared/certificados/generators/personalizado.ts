import type { PlantillaCertificadoPersonalizada } from '@prisma/client'

import { fetchImageBuffer, compressImageForPdf, formatDateLong, calcularNotaFinal, hexToRgb } from './utils'

import type { CertificadoData, GeneratorFn, CampoPlantillaPersonalizada } from './types'

const PAGE_W = 297
const PAGE_H = 210

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
    return data.qrDataUrl ? { src: data.qrDataUrl, format: 'PNG' } : null
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

    default: return null
  }
}

async function dibujarCampo(doc: any, campo: CampoPlantillaPersonalizada, data: CertificadoData) {
  const esFirmaDocente =
    campo.key === 'firmaDocenteNombre' || campo.key === 'firmaDocenteCargo' || campo.key === 'firmaDocenteImagen'

  if (esFirmaDocente && !data.mostrarFirmaDocente) return

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

  doc.setFont('helvetica', campo.bold ? 'bold' : campo.italic ? 'italic' : 'normal')
  doc.setFontSize(campo.fontSize ?? 14)

  const [r, g, b] = hexToRgb(campo.color ?? '#000000')

  doc.setTextColor(r, g, b)

  const align = campo.align ?? 'center'

  if (campo.maxWidthPct) {
    const maxWidthMm = (campo.maxWidthPct / 100) * PAGE_W
    const lineas = doc.splitTextToSize(texto, maxWidthMm)

    doc.text(lineas, x, y, { align })
  } else {
    doc.text(texto, x, y, { align })
  }
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

    if (plantilla.cara_reverso_url) {
      doc.addPage()
      await dibujarFondo(plantilla.cara_reverso_url)

      for (const campo of campos.filter(c => c.pagina === 'reverso')) {
        await dibujarCampo(doc, campo, data)
      }
    }

    return doc.output('arraybuffer')
  }
}
