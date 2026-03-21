import { jsPDF } from 'jspdf'

/**
 * Genera un PDF con el detalle del pedido.
 * Retorna un Buffer con el contenido del PDF.
 */
export async function generateOrderPDF(pedido: any): Promise<Buffer> {
  const doc = new jsPDF()

  // Margen y posición inicial
  const margin = 20
  let y = 30

  // Título
  doc.setFontSize(22)
  doc.setTextColor(19, 31, 242) // Color primario aproximado
  doc.text('Detalle de tu Pedido', margin, y)

  y += 15
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text(`Número de Pedido: #${String(pedido.numero_pedido).padStart(6, '0')}`, margin, y)

  y += 7
  doc.text(`Fecha: ${new Date(pedido.pagado_en || pedido.creado_en).toLocaleDateString('es-PE')}`, margin, y)

  y += 7
  doc.text(`Cliente: ${pedido.usuario.nombre} ${pedido.usuario.apellido}`, margin, y)

  y += 15
  doc.setFontSize(14)
  doc.text('Resumen de la Compra:', margin, y)

  y += 10

  // Cabecera de tabla simple
  doc.setFontSize(10)
  doc.text('Curso', margin, y)
  doc.text('Precio', 160, y)

  y += 2
  doc.line(margin, y, 190, y)

  y += 8

  // Detalle de cursos
  pedido.detalles.forEach((det: any) => {
    const cursoTitulo = det.curso.titulo
    const precio = `${pedido.moneda} ${Number(det.total).toFixed(2)}`

    // Si el título es muy largo, lo cortamos o lo envolvemos (aquí cortamos por simplicidad)
    const textLimit = 60
    const displayTitle = cursoTitulo.length > textLimit ? cursoTitulo.substring(0, textLimit) + '...' : cursoTitulo

    doc.text(displayTitle, margin, y)
    doc.text(precio, 160, y)
    y += 8
  })

  y += 5
  doc.line(margin, y, 190, y)

  y += 10
  doc.setFontSize(12)
  doc.text('TOTAL:', 140, y)
  doc.text(`${pedido.moneda} ${Number(pedido.total).toFixed(2)}`, 160, y)

  y += 20
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text('Gracias por confiar en nuestra Aula Virtual.', margin, y)
  doc.text('Puedes acceder a tus cursos desde tu panel de estudiante.', margin, y + 5)

  // Convertir a Buffer (usando arraybuffer en Node)
  const output = doc.output('arraybuffer')

  return Buffer.from(output)
}
