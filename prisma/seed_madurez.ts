const { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso de Madurez y Gobernanza...')

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
    titulo: 'Modelos de Madurez y Gobernanza en Gestión de Activos',
    slug: 'madurez-gobernanza-gestion-activos',
    descripcion: 'Curso avanzado para evaluar el nivel de madurez de una organización en gestión de activos y diseñar estrategias de gobernanza alineadas a ISO 55001.',
    fecha_inicio: new Date(),
    duracion: '24–36 horas',
    tipo_emision: 'ASINCRONO',
    nivel: 'AVANZADO',
    estado: 'PUBLICADO',
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Comprender modelos de madurez (IAM, GFMAM, AMAF).',
      'Evaluar brechas y oportunidades de mejora.',
      'Diseñar estrategias de gobernanza.',
      'Integrar madurez con PEGA y CAMA.'
    ],
    
    beneficios: [
      { title: 'Evaluación Integral', desc: 'Capacidad de evaluar organizaciones completas en su gestión.', icon: 'tabler-clipboard-check' },
      { title: 'Influencia Estratégica', desc: 'Mayor influencia estratégica en decisiones corporativas.', icon: 'tabler-trending-up' },
      { title: 'Especialista en Madurez', desc: 'Reconocimiento profesional como especialista certificado en madurez.', icon: 'tabler-award' },
      { title: 'Visión de Sistemas', desc: 'Visión integral del sistema de gestión de activos y sus interconexiones.', icon: 'tabler-binary-tree' }
    ],

    metodologia: [
      { title: 'Plantillas de Evaluación', desc: 'Incluye plantillas profesionales para evaluar niveles de madurez.', icon: 'tabler-layout-grid-add' },
      { title: 'Casos Reales de Auditoría', desc: 'Análisis de casos prácticos de auditoría y evaluación en industrias reales.', icon: 'tabler-report-search' },
      { title: 'Gobernanza Práctica', desc: 'Enfoque en cómo diseñar estructuras de mando y liderazgo efectivas.', icon: 'tabler-tournament' }
    ],

    incluye: [
      { text: 'Certificado ARM – Modelos de Madurez y Gobernanza', active: true },
      { text: 'Modalidad: Online en vivo', active: true },
      { text: 'Duración: 24–36 horas de nivel avanzado', active: true },
      { text: 'Público: Gerentes, consultores y analistas senior', active: true },
      { text: 'Plantillas de evaluación descargables', active: true },
      { text: 'Recomendación: Avanzar hacia IAM Certificate', active: true }
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
    'Modelos de madurez: IAM, GFMAM, AMAF.',
    'Evaluación de brechas.',
    'Gobernanza y liderazgo.',
    'Integración con ISO 55001.',
    'Planes de mejora.',
    'Taller de evaluación de madurez.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Evaluación y Gobernanza Estratégica' },
    create: {
      titulo: 'Evaluación y Gobernanza Estratégica',
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
  console.log('🎉 Seed Madurez y Gobernanza completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
