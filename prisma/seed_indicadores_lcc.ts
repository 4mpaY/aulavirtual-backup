import { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed del curso Indicadores y Ciclo de Vida...')

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
    titulo: 'Indicadores y Ciclo de Vida de Activos',
    slug: 'indicadores-ciclo-vida-activos',
    descripcion: 'Curso especializado en el análisis del ciclo de vida del activo y los indicadores clave para evaluar desempeño, costo, riesgo y valor.',
    fecha_inicio: new Date(),
    duracion: '16–24 horas',
    tipo_emision: TipoEmision.ASINCRONO,
    nivel: NivelCurso.INTERMEDIO,
    estado: EstadoCurso.PUBLICADO,
    precio: 0,
    es_gratis: true,
    profesor_id: profesor.id,
    categoria_id: categoria.id,
    miniatura: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?w=800&q=80',
    
    // Detalles Premium
    objetivos: [
      'Comprender el ciclo de vida del activo desde diseño hasta retiro.',
      'Calcular indicadores clave de gestión de activos.',
      'Integrar métricas con decisiones estratégicas.',
      'Evaluar desempeño y costo del ciclo de vida (LCC).'
    ],
    
    beneficios: [
      { title: 'Claridad Ciclo Vida', desc: 'Mayor claridad para evaluar activos a lo largo de su vida útil.', icon: 'tabler-refresh' },
      { title: 'Toma Decisiones', desc: 'Mejor toma de decisiones basada en costo, riesgo y desempeño.', icon: 'tabler-brain' },
      { title: 'Justificación', desc: 'Capacidad de justificar inversiones y reemplazos.', icon: 'tabler-file-analytics' },
      { title: 'Visión Estratégica', desc: 'Visión estratégica para roles de ingeniería y gestión.', icon: 'tabler-trending-up' }
    ],

    metodologia: [
      { title: 'Diferenciador: Plantillas', desc: 'Plantillas de LCC y TCO profesionales para el análisis.', icon: 'tabler-template' },
      { title: 'Casos Reales', desc: 'Casos reales de análisis de ciclo de vida aplicados al mercado.', icon: 'tabler-presentation' },
      { title: 'Necesidad del Mercado', desc: 'Optimiza inversiones y estrategias mediante el balance de costo, riesgo y valor.', icon: 'tabler-arrows-left-right' }
    ],

    incluye: [
      { text: 'Certificado ARM – Indicadores y Ciclo de Vida', active: true },
      { text: 'Modalidad: Online en vivo', active: true },
      { text: 'Duración: 16–24 horas interactivas', active: true },
      { text: 'Público: Ingenieros, analistas y gerentes', active: true },
      { text: 'Recomendación: Avanzar hacia PEGA', active: true },
      { text: 'Acceso a plantillas LCC y TCO', active: true }
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
    'Ciclo de vida del activo: diseño, adquisición, operación, mantenimiento, retiro.',
    'Indicadores clave: disponibilidad, confiabilidad, costo del ciclo de vida.',
    'LCC y TCO: conceptos y aplicaciones.',
    'Evaluación de desempeño del activo.',
    'Integración con ISO 55001.',
    'Taller con datos reales.'
  ]

  const modulo = await prisma.modulo.upsert({
    where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
    update: { titulo: 'Desarrollo de Indicadores' },
    create: {
      titulo: 'Desarrollo de Indicadores',
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
  console.log('🎉 Seed Indicadores y Ciclo de Vida completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
