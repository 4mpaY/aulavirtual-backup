const { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso IAM Certificate...')

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
    titulo: 'IAM Certificate in Asset Management',
    slug: 'iam-certificate-asset-management',
    descripcion: 'Certificación internacional del Institute of Asset Management (IAM), reconocida globalmente como estándar profesional en gestión de activos.',
    fecha_inicio: new Date(),
    duracion: '40–60 horas',
    tipo_emision: 'ASINCRONO',
    nivel: 'AVANZADO',
    estado: 'PUBLICADO',
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1523240715639-9538dad336af?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Dominar los 5 módulos del IAM Certificate.',
      'Comprender principios, políticas, estrategias y planes.',
      'Integrar riesgo, valor y ciclo de vida.',
      'Preparar al participante para aprobar el examen IAM.'
    ],
    
    beneficios: [
      { title: 'Reconocimiento Global', desc: 'Reconocimiento internacional en gestión de activos por el IAM.', icon: 'tabler-world' },
      { title: 'Mayor Empleabilidad', desc: 'Mayor empleabilidad en empresas certificadas ISO 55001.', icon: 'tabler-briefcase' },
      { title: 'Liderazgo Proyectos', desc: 'Capacidad de liderar proyectos estratégicos de gestión de activos.', icon: 'tabler-users-group' },
      { title: 'Dominio de Principios', desc: 'Dominio integral de los principios fundamentales del IAM.', icon: 'tabler-certificate' }
    ],

    metodologia: [
      { title: 'Simulacros IAM', desc: 'Simulacros de examen alineados rigurosamente al formato oficial.', icon: 'tabler-checklist' },
      { title: 'Enfoque Estratégico', desc: 'Enfoque práctico y estratégico para la toma de decisiones empresariales.', icon: 'tabler-pennant' },
      { title: 'Recomendación', desc: 'Base sólida diseñada para avanzar posteriormente hacia CAMA®.', icon: 'tabler-stairs-up' }
    ],

    incluye: [
      { text: 'Certificado ARM – Preparación IAM Certificate', active: true },
      { text: '5 Módulos oficiales del IAM dominados', active: true },
      { text: 'Simulacros y preguntas tipo examen', active: true },
      { text: 'Público: Gerentes, consultores y analistas senior', active: true },
      { text: 'Modalidad: Online en vivo / Soporte Certificado', active: true },
      { text: 'Duración: 40–60 horas de formación técnica superior', active: true }
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
    'Módulo 1: Principios de gestión de activos.',
    'Módulo 2: Política, estrategia y planificación.',
    'Módulo 3: Gestión del ciclo de vida.',
    'Módulo 4: Información y toma de decisiones.',
    'Módulo 5: Organización y personas.',
    'Simulacros y preguntas tipo examen.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Estructura IAM Certificate' },
    create: {
      titulo: 'Estructura IAM Certificate',
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
  console.log('🎉 Seed IAM Certificate completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
