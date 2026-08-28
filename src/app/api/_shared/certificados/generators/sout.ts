import { fetchImageBuffer, compressImageForPdf } from './utils'
import type { GeneratorFn } from './types'

export const generarSout: GeneratorFn = async data => {
  const {
    nombreCompleto, avatarBuffer, cursoTitulo, cursoDuracion, fechaEmisionVal,
    gerenteGeneral, profesorSnapshot,
    codigoVerificacion, qrDataUrl, modulos, notasPorModulo, notaInscripcion,
    homologacion, usuarioExtra, codigo_instructor_nsc
  } = data

  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4', compress: true })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // ── Helpers
  const fechaFirmadaTxt = new Date(fechaEmisionVal).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
  })

  // ── CARGAR FONDOS SOUT ──
  const bg1Buffer = await fetchImageBuffer('/certificados/1.png')
  const bg2Buffer = await fetchImageBuffer('/certificados/2.png')

  let bg1DataUrl: string | null = null
  let bg2DataUrl: string | null = null

  if (bg1Buffer) {
    const { buffer, mimeType } = await compressImageForPdf(bg1Buffer, { maxWidth: 2000, format: 'jpeg', quality: 90 })

    bg1DataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`
  }

  if (bg2Buffer) {
    const { buffer, mimeType } = await compressImageForPdf(bg2Buffer, { maxWidth: 2000, format: 'jpeg', quality: 90 })

    bg2DataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`
  }

  // ── PÁGINA 1 ─────────────────────────────────────────────────────────
  if (bg1DataUrl) {
    doc.addImage(bg1DataUrl, 'JPEG', 0, 0, pageWidth, pageHeight)
  } else {
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
  }

  const cx = pageWidth / 2
  
  // -- Fechas (Arriba a la izquierda) --
  let yLeft = 60
  const xLeft = 30
  
  doc.setFontSize(12)
  doc.setTextColor(30, 30, 30)
  
  doc.setFont('helvetica', 'bold')
  doc.text('Fecha:', xLeft, yLeft)
  doc.setFont('helvetica', 'normal')
  doc.text(fechaFirmadaTxt, xLeft + 25, yLeft)
  yLeft += 6
  
  doc.setFont('helvetica', 'bold')
  doc.text('Validez:', xLeft, yLeft)
  doc.setFont('helvetica', 'normal')
  doc.text('1 año', xLeft + 25, yLeft)
  yLeft += 10

  // -- Caja de Detalles (Izquierda) --
  const labelX = xLeft
  const valueX = xLeft + 55
  const lineSpacing = 5.5

  const drawRow = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold')
    doc.text(label, labelX, yLeft)
    doc.setFont('helvetica', 'normal')
    doc.text(value || '-', valueX, yLeft)
    yLeft += lineSpacing
  }

  drawRow('Apellidos y Nombres:', nombreCompleto.toUpperCase())
  drawRow('Licencia:', usuarioExtra?.licencia || '-')
  drawRow('Equipo que opera:', usuarioExtra?.equipo_opera || '-')
  drawRow('Empresa:', usuarioExtra?.empresa || '-')
  drawRow('Ciudad-País:', usuarioExtra?.ciudad_pais || '-')
  drawRow('Centro Entrenamiento:', '-')
  const nombreProfesor = profesorSnapshot ? `${profesorSnapshot.nombre} ${profesorSnapshot.apellido || ''}`.trim() : '-'

  drawRow('Instructor NSC:', nombreProfesor || '-')
  drawRow('Código instructor NSC:', codigo_instructor_nsc || '-')

  // -- Centro: Curso y Horas --
  let yCenter = 130
  
  doc.setFontSize(18)
  doc.setTextColor(20, 20, 20)
  doc.setFont('helvetica', 'bold')
  const cursoLines = doc.splitTextToSize(cursoTitulo.toUpperCase(), pageWidth - 100)

  doc.text(cursoLines, cx, yCenter, { align: 'center' })
  yCenter += cursoLines.length * 6 + 4

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`${cursoDuracion || '08'} HORAS LECTIVAS`.toUpperCase(), cx, yCenter, { align: 'center' })
  yCenter += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const descripcionTxt = `Esto certifica que la persona mencionada ha completado con éxito el ${cursoTitulo} teórico - práctico.`
  const descripcionLines = doc.splitTextToSize(descripcionTxt, pageWidth - 100)

  doc.text(descripcionLines, cx, yCenter, { align: 'center' })
  
  yCenter += descripcionLines.length * 5 + 25

  // -- Foto del Auto (Derecha) --
  if (data.fotoAutoBuffer) {
    try {
      const { buffer, mimeType } = await compressImageForPdf(data.fotoAutoBuffer, { maxWidth: 500, format: 'jpeg', quality: 85 })
      const fotoAutoDataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`

      const fw = 75
      const fh = 55
      const fx = pageWidth - fw - 25 // Margen derecho
      const fy = (pageHeight / 2) - (fh / 2) - 20 // Centro vertical un poco más arriba

      // Dibujar borde sutil
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.5)
      doc.roundedRect(fx - 1, fy - 1, fw + 2, fh + 2, 2, 2, 'S')
      
      doc.addImage(fotoAutoDataUrl, 'JPEG', fx, fy, fw, fh)
    } catch (e) {
      // Ignorar si falla la compresión/renderizado
    }
  }

  // -- Firmas --
  doc.setFontSize(10)
  
  const gNombre = gerenteGeneral ? `${gerenteGeneral.nombre} ${gerenteGeneral.apellido || ''}`.trim() : 'ADMINISTRADOR'
  const gCargo = gerenteGeneral?.cargo || 'Gerente General'
  
  const pNombre = profesorSnapshot ? `${profesorSnapshot.nombre} ${profesorSnapshot.apellido || ''}`.trim() : 'ADMINISTRADOR'
  const pCargo = profesorSnapshot?.cargo || 'Instructor'

  doc.setFont('helvetica', 'bold')
  doc.line(cx - 70, yCenter, cx - 20, yCenter)
  doc.text(gNombre.toUpperCase(), cx - 45, yCenter + 5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text(gCargo, cx - 45, yCenter + 9, { align: 'center' })

  doc.setFont('helvetica', 'bold')
  doc.line(cx + 20, yCenter, cx + 70, yCenter)
  doc.text(pNombre.toUpperCase(), cx + 45, yCenter + 5, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.text(pCargo, cx + 45, yCenter + 9, { align: 'center' })

  // -- QR y Autenticidad (Abajo a la izquierda) --
  const qrSz = 25
  const qrX0 = 25
  const qrY0 = pageHeight - qrSz - 40
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('VERIFICAR\nAUTENTICIDAD', qrX0 + qrSz/2, qrY0 - 5, { align: 'center' })
  
  doc.addImage(qrDataUrl, 'PNG', qrX0, qrY0, qrSz, qrSz)
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('www.soutrainingcenter.com', qrX0 + qrSz/2, qrY0 + qrSz + 5, { align: 'center' })

  if (codigoVerificacion) {
    doc.text(`Código: ${codigoVerificacion}`, qrX0 + qrSz/2, qrY0 + qrSz + 10, { align: 'center' })
  }

  if (data.frontPageOnly) {
    return doc.output('arraybuffer')
  }

  // ── PÁGINA 2 ─────────────────────────────────────────────────────────
  doc.addPage()
  
  if (bg2DataUrl) {
    doc.addImage(bg2DataUrl, 'JPEG', 0, 0, pageWidth, pageHeight)
  } else {
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')
  }

  // Cálculos de nota
  const promediosPorModulo = Object.values(notasPorModulo).map(e => {
    const raw = e.puntaje / e.count

    
return raw > 20 ? raw / 5 : raw
  })

  const notaFinal =
    promediosPorModulo.length > 0
      ? promediosPorModulo.reduce((a, b) => a + b, 0) / promediosPorModulo.length
      : (() => {
          const raw = notaInscripcion !== null ? Number(notaInscripcion) : null

          if (raw !== null && isNaN(raw)) return null
          
return raw !== null ? (raw > 20 ? raw / 5 : raw) : null
        })()

  const notaDisplay = notaFinal !== null ? Math.round(Number(notaFinal)).toString().padStart(2, '0') : '14'

  const marginP2 = 15
  const leftW = 105
  const rightX = leftW + marginP2 + 10
  const rightW = pageWidth - rightX - marginP2

  // ================= IZQUIERDA =================
  let yL = marginP2 + 10
  
  // Título del curso
  doc.setFontSize(15)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 50, 20)
  const cursoP2Lines = doc.splitTextToSize(cursoTitulo.toUpperCase(), leftW)

  doc.text(cursoP2Lines, marginP2 + leftW/2, yL, { align: 'center' })
  yL += cursoP2Lines.length * 6 + 2

  // Alturas dinámicas basadas en los bloques de la derecha
  // Vamos a calcular primero cuánto ocupará el bloque de la derecha
  const rightStartY = marginP2 + 10
  const photoSize = 28
  const userBoxH = 28
  const tblH = 22
  const detH = 36
  const gap = 6
  
  const rightEndY = rightStartY + photoSize + gap + userBoxH + gap + tblH + gap + detH
  
  // Caja de Temario igualando la altura
  const temarioY = yL
  const temarioH = rightEndY - temarioY

  doc.setDrawColor(100, 0, 150) // Borde morado
  doc.setLineWidth(0.6)
  doc.roundedRect(marginP2, temarioY, leftW, temarioH, 4, 4, 'S')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('TEMARIO', marginP2 + leftW/2, temarioY + 5, { align: 'center' })
  doc.setDrawColor(200, 200, 200)
  doc.line(marginP2 + 5, temarioY + 7, marginP2 + leftW - 5, temarioY + 7)
  
  let ty = temarioY + 11

  for (const modulo of modulos) {
    if (ty > temarioY + temarioH - 8) break
    const modTxt = `${modulo.orden + 1}. ${modulo.titulo}`.toUpperCase()
    const modLines = doc.splitTextToSize(modTxt, leftW - 6)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 30)
    doc.text(modLines, marginP2 + 3, ty)
    ty += modLines.length * 3.5
    
    for (const leccion of modulo.lecciones) {
      if (ty > temarioY + temarioH - 6) break
      const lecTxt = `${modulo.orden + 1}.${leccion.orden + 1} ${leccion.titulo}`
      const lecLines = doc.splitTextToSize(lecTxt, leftW - 8)

      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)
      doc.text(lecLines, marginP2 + 5, ty)
      ty += lecLines.length * 3
    }

    ty += 2
  }

  // ================= DERECHA =================
  let yR = rightStartY

  // Cuadro NOTA y FOTO (Centrados en rightW)
  const noteW = 45
  const photoGap = 15
  const blockW = noteW + photoGap + photoSize
  const startX = rightX + (rightW - blockW) / 2

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.roundedRect(startX, yR, noteW, photoSize, 3, 3, 'S')
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('NOTA DEL\nPARTICIPANTE:', startX + noteW/2, yR + 7, { align: 'center' })
  doc.setFontSize(26)
  doc.text(notaDisplay, startX + noteW/2, yR + 22, { align: 'center' })

  // Foto
  const photoX = startX + noteW + photoGap

  doc.roundedRect(photoX, yR, photoSize, photoSize, 3, 3, 'S')

  if (avatarBuffer) {
    try {
      const { buffer, mimeType } = await compressImageForPdf(avatarBuffer, { maxWidth: 300, format: 'jpeg', quality: 90 })
      const avatarDataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`

      doc.addImage(avatarDataUrl, 'JPEG', photoX + 1, yR + 1, photoSize - 2, photoSize - 2)
    } catch (e) {
      // ignore
    }
  }

  yR += photoSize + gap

  // Caja Datos de Usuario
  doc.roundedRect(rightX, yR, rightW, userBoxH, 4, 4, 'S')
  
  let uY = yR + 6
  const uLineSpace = 4.8
  const labelRX = rightX + 4
  const valRX = rightX + 42
  
  const drawURow = (lbl: string, val: string) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(lbl, labelRX, uY)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(val || '-', valRX, uY)
    uY += uLineSpace
  }

  drawURow('Apellidos y Nombres:', nombreCompleto.toUpperCase())
  drawURow('Licencia:', usuarioExtra?.licencia || '-')
  drawURow('Equipo que opera:', usuarioExtra?.equipo_opera || '-')
  drawURow('Empresa:', usuarioExtra?.empresa || '-')
  drawURow('Ciudad-País:', usuarioExtra?.ciudad_pais || '-')

  yR += userBoxH + gap

  // Tabla Horas / Certificacion / Homologacion
  doc.roundedRect(rightX, yR, rightW, tblH, 4, 4, 'S')
  const w3 = rightW / 3
  
  const hLineY = yR + 14
  
  // Líneas verticales solo para la parte superior
  doc.line(rightX + w3, yR, rightX + w3, hLineY)
  doc.line(rightX + 2*w3, yR, rightX + 2*w3, hLineY)
  
  // Línea horizontal que separa la parte superior del resultado
  doc.line(rightX, hLineY, rightX + rightW, hLineY)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.text('HORAS', rightX + w3/2, yR + 5, { align: 'center' })
  doc.text('CERTIFICACIÓN', rightX + 1.5*w3, yR + 5, { align: 'center' })
  doc.text('HOMOLOGACIÓN', rightX + 2.5*w3, yR + 5, { align: 'center' })

  // Valores (Fila superior)
  doc.setFontSize(9)
  doc.text(cursoDuracion || '08', rightX + w3/2, yR + 11, { align: 'center' })

  // Bolita roja Certificación
  doc.setFillColor(220, 30, 30)
  doc.roundedRect(rightX + 1.5*w3 - 8, yR + 8, 16, 4, 2, 2, 'F')

  // Bolita Homologación (Gris o Roja)
  if (homologacion) {
    doc.setFillColor(220, 30, 30)
  } else {
    doc.setFillColor(200, 200, 200)
  }

  doc.roundedRect(rightX + 2.5*w3 - 8, yR + 8, 16, 4, 2, 2, 'F')

  // RESULTADO (Fila inferior)
  doc.setFontSize(7.5)
  doc.setTextColor(0, 0, 0)
  doc.text('RESULTADO:', rightX + 5, yR + 19.5)
  
  doc.setFontSize(9)
  doc.setTextColor(200, 40, 40) // Rojo
  doc.text('APTO', rightX + rightW / 2, yR + 19.5, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  yR += tblH + gap

  // Detalles Inferiores
  doc.roundedRect(rightX, yR, rightW, detH, 4, 4, 'S')
  let dY = yR + 6
  
  const drawDRow = (lbl: string, val: string, isRed = false, isBold = false) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(lbl, labelRX, dY)
    
    doc.setFontSize(8.5)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    if (isRed) doc.setTextColor(200, 30, 30)
    doc.text(val || '-', valRX + 5, dY)
    doc.setTextColor(0, 0, 0)
    dY += 5.5
  }

  drawDRow('Fecha:', fechaFirmadaTxt)
  drawDRow('Security control:', `OR-${codigoVerificacion || '0012127'}`, true, true)
  drawDRow('Validez:', '01 año')
  drawDRow('Centro Entrenam. NSC:', 'SOUT TRAINING CENTER ID 2353439', false, true)
  drawDRow('Instructor NSC:', nombreProfesor || '-')
  drawDRow('Código instructor NSC:', codigo_instructor_nsc || '-')

  return doc.output('arraybuffer')
}
