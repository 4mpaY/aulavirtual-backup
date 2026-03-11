const { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso CAMA®...')

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
    titulo: 'Gestión de Activos Físicos (Preparación CAMA®)',
    slug: 'preparacion-cama-gestion-activos',
    descripcion: 'Curso avanzado alineado a ISO 55000 e IAM, diseñado para preparar al participante para la certificación CAMA® (Certified Asset Management Assessor).',
    fecha_inicio: new Date(),
    duracion: '40–60 horas',
    tipo_emision: 'ASINCRONO', // Cambiado a ASINCRONO por defecto del seed, aunque se mencione Online en vivo en la ficha, el seed suele requerir este enum
    nivel: 'AVANZADO',
    estado: 'PUBLICADO',
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1454165833767-1314d792348a?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Dominar los requisitos de ISO 55001.',
      'Comprender modelos de madurez y auditoría.',
      'Evaluar sistemas de gestión de activos.',
      'Preparar al participante para aprobar CAMA®.'
    ],
    
    beneficios: [
      { title: 'Prestigio Internacional', desc: 'Prestigio internacional como evaluador de gestión de activos.', icon: 'tabler-world' },
      { title: 'Autoridad Técnica', desc: 'Mayor autoridad técnica en auditorías y madurez.', icon: 'tabler-shield-check' },
      { title: 'Liderazgo ISO 55001', desc: 'Capacidad de liderar implementaciones ISO 55001.', icon: 'tabler-users' },
      { title: 'Oportunidades Senior', desc: 'Incremento de oportunidades en consultoría y gerencia.', icon: 'tabler-trending-up' }
    ],

    metodologia: [
      { title: 'Simulacros CAMA®', desc: 'Simulacros alineados al examen real con preguntas tipo.', icon: 'tabler-checklist' },
      { title: 'Enfoque de Auditoría', desc: 'Enfoque práctico basado en casos reales de evaluación de sistemas.', icon: 'tabler-search' },
      { title: 'Especialización', desc: 'Forma especialistas capaces de evaluar, auditar y mejorar sistemas.', icon: 'tabler-award' }
    ],

    incluye: [
      { text: 'Certificado ARM – Preparación CAMA®', active: true },
      { text: 'Duración: 40–60 horas intensivas', active: true },
      { text: 'Modalidad: Online en vivo / Soporte Premium', active: true },
      { text: 'Simulacros de examen oficial', active: true },
      { text: 'Público: Gerentes, consultores y analistas senior', active: true },
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
    'ISO 55000, 55001 y 55002 en profundidad.',
    'Auditoría y evaluación de sistemas.',
    'Modelos de madurez.',
    'Gobernanza y liderazgo.',
    'Riesgo, valor y ciclo de vida.',
    'Preparación para examen CAMA®.',
    'Simulacros y preguntas tipo.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Contenido de la Certificación' },
    create: {
      titulo: 'Contenido de la Certificación',
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
  console.log('🎉 Seed CAMA® completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
