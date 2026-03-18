const { PrismaClient, TipoEmision, StateCurso, NivelCurso } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso de Riesgos...')

  // Buscar profesor existente
  let profesor = await prisma.usuario.findFirst({
    where: { rol: 'PROFESOR' }
  })

  if (!profesor) {
    profesor = await prisma.usuario.findFirst({
      where: { rol: 'ADMIN' }
    })
  }

  if (!profesor) {
    throw new Error('No se encontró ningún usuario para asignar el curso.')
  }

  // Buscar o crear categoría
  const categoria = await prisma.categoria.upsert({
    where: { slug: 'gestion-activos' },
    update: {},
    create: {
      nombre: 'Gestión de Activos',
      slug: 'gestion-activos'
    }
  })

  // Datos del curso
  const cursoData = {
    titulo: 'Riesgos en Gestión de Activos',
    slug: 'riesgos-gestion-activos',
    descripcion: 'Curso especializado en identificar, evaluar y gestionar riesgos asociados al ciclo de vida de los activos, alineado a ISO 31000 e ISO 55001.',
    fecha_inicio: new Date(),
    duracion: '16–24 horas',
    tipo_emision: 'ASINCRONO',
    nivel: 'INTERMEDIO',
    estado: 'PUBLICADO',
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Identificar riesgos técnicos, operativos y estratégicos.',
      'Aplicar metodologías de evaluación de riesgos.',
      'Integrar riesgo con decisiones de mantenimiento y activos.',
      'Diseñar planes de mitigación y control.'
    ],
    
    beneficios: [
      { title: 'Anticipación', desc: 'Mayor capacidad de anticipación ante eventos críticos.', icon: 'tabler-alert-triangle' },
      { title: 'Decisiones Basadas en Riesgo', desc: 'Mejor toma de decisiones basada en riesgo real.', icon: 'tabler-scale' },
      { title: 'Reducción de Pérdidas', desc: 'Reducción de pérdidas por fallas y eventos no planificados.', icon: 'tabler-trending-down' },
      { title: 'Reconocimiento', desc: 'Reconocimiento profesional en roles de gestión.', icon: 'tabler-award' }
    ],

    metodologia: [
      { title: 'Taller de Matrices', desc: 'Taller práctico con matrices de riesgo reales.', icon: 'tabler-table' },
      { title: 'ISO 31000', desc: 'Integración directa con el estándar internacional de riesgos ISO 31000.', icon: 'tabler-world' },
      { title: 'Enfoque en Activos', desc: 'Resuelve la necesidad de garantizar continuidad operativa.', icon: 'tabler-player-play' }
    ],

    incluye: [
      { text: 'Certificado ARM – Riesgos en Gestión de Activos', active: true },
      { text: 'Modalidad: Online en vivo', active: true },
      { text: 'Duración: 16–24 horas interactivas', active: true },
      { text: 'Acceso a matrices de riesgo reales', active: true },
      { text: 'Público: Ingenieros, analistas y gerentes', active: true },
      { text: 'Recomendación: Avanzar hacia CAMA', active: true }
    ]
  }

  const curso = await prisma.curso.upsert({
    where: { slug: cursoData.slug },
    update: cursoData,
    create: cursoData
  })

  console.log(`Curso creado/actualizado: ${curso.titulo}`)

  // Temario
  const temario = [
    'Conceptos de riesgo en gestión de activos.',
    'ISO 31000 e ISO 55001.',
    'Identificación de riesgos: técnicos, operativos, financieros.',
    'Evaluación cualitativa y cuantitativa.',
    'Matrices de riesgo.',
    'Integración con PEGA y planes de mantenimiento.',
    'Taller de análisis de riesgo.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Análisis y Gestión de Riesgos' },
    create: {
      titulo: 'Análisis y Gestión de Riesgos',
      orden: 1,
      curso_id: curso.id
    }
  })

  for (let i = 0; i < temario.length; i++) {
    await prisma.leccion.upsert({
      where: { modulo_id_orden: { modulo_id: modulo.id, orden: i + 1 } },
      update: { titulo: temario[i] },
      create: {
        titulo: temario[i],
        orden: i + 1,
        modulo_id: modulo.id
      }
    })
  }

  console.log(`✅ ${temario.length} lecciones creadas.`)
  console.log('🎉 Seed Riesgos completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
