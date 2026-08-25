'use client'

import type { DetalleNotasCurso, HistorialNotaItem } from '../entity/Notas'

function fmtNota(n: number) {
  return n.toFixed(2)
}

export async function downloadResumenNotasCurso(detalle: DetalleNotasCurso, estudianteNombre?: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()
  const margin = 20
  let y = 24

  doc.setFontSize(18)
  doc.setTextColor(26, 138, 138)
  doc.text('Resumen de Notas', margin, y)

  y += 12
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(`Curso: ${detalle.curso}`, margin, y)

  y += 7
  doc.text(`Periodo: ${detalle.periodo}`, margin, y)

  y += 7
  doc.text(`Docente: ${detalle.docente}`, margin, y)

  y += 7
  doc.text(`Modalidad: ${detalle.modalidad}`, margin, y)

  y += 7
  doc.text(`Fecha: ${detalle.fecha}`, margin, y)

  if (estudianteNombre) {
    y += 7
    doc.text(`Estudiante: ${estudianteNombre}`, margin, y)
  }

  y += 7
  doc.setFont('helvetica', 'bold')
  doc.text(`Promedio: ${fmtNota(detalle.promedio)}`, margin, y)
  doc.setFont('helvetica', 'normal')

  y += 14
  doc.setFontSize(12)
  doc.text('Detalle de evaluaciones', margin, y)

  y += 8
  doc.setFontSize(10)
  doc.text('Nota', margin, y)
  doc.text('Descripción', margin + 22, y)
  doc.text('Peso', margin + 130, y)
  doc.text('Calificación', margin + 150, y)

  y += 2
  doc.line(margin, y, 190, y)
  y += 7

  detalle.evaluaciones.forEach(ev => {
    doc.text(String(ev.numero), margin, y)
    const desc = ev.descripcion.length > 55 ? `${ev.descripcion.slice(0, 55)}…` : ev.descripcion

    doc.text(desc, margin + 22, y)
    doc.text(String(ev.peso), margin + 130, y)
    doc.text(fmtNota(ev.nota), margin + 150, y)
    y += 7

    if (y > 270) {
      doc.addPage()
      y = 24
    }
  })

  const safeName = detalle.curso.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 40)

  doc.save(`notas-${safeName || detalle.curso_id}.pdf`)
}

export async function downloadHistorialNotasPdf(registros: HistorialNotaItem[], tituloFiltro?: string) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'landscape' })
  const margin = 14
  let y = 18

  doc.setFontSize(16)
  doc.setTextColor(26, 138, 138)
  doc.text('Historial de Notas', margin, y)

  if (tituloFiltro) {
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text(tituloFiltro, margin, y)
  }

  y += 10
  doc.setFontSize(8)
  doc.setTextColor(0, 0, 0)

  const cols = [
    { label: 'Periodo', x: margin },
    { label: 'Curso', x: margin + 28 },
    { label: 'Promedio', x: margin + 120 },
    { label: 'Fecha', x: margin + 145 },
    { label: 'Docente', x: margin + 170 }
  ]

  cols.forEach(c => doc.text(c.label, c.x, y))
  y += 2
  doc.line(margin, y, 283, y)
  y += 5

  registros.forEach(row => {
    doc.text(row.periodo, cols[0].x, y)
    const cursoTxt = row.curso

    doc.text(cursoTxt.length > 48 ? `${cursoTxt.slice(0, 48)}…` : cursoTxt, cols[1].x, y)
    doc.text(fmtNota(row.promedio), cols[2].x, y)
    doc.text(row.fecha, cols[3].x, y)
    doc.text(row.docente.length > 28 ? `${row.docente.slice(0, 28)}…` : row.docente, cols[4].x, y)
    y += 6

    if (y > 190) {
      doc.addPage()
      y = 18
    }
  })

  doc.save('historial-notas.pdf')
}
