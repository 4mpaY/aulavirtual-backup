import { PrismaClient, Rol, EstadoCurso, NivelCurso, TipoEmision, TipoPregunta, TipoContenido } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed para el curso: Especialización en RCM, PMO, Python, Power BI y MS Project...')

  // 1. Buscar o crear profesor
  let profesor = await prisma.usuario.findFirst({
    where: { rol: Rol.PROFESOR }
  })

  if (!profesor) {
    profesor = await prisma.usuario.findFirst({
      where: { rol: Rol.ADMIN }
    })
  }

  if (!profesor) {
    throw new Error('No se encontró ningún usuario para asignar el curso.')
  }

  // 2. Gestionar Categoría (Jerarquía: Ingeniería > Mantenimiento > Análisis de Datos > Gestión de Proyectos)
  const catIngenieria = await prisma.categoria.upsert({
    where: { slug: 'ingenieria' },
    update: {},
    create: { nombre: 'Ingeniería', slug: 'ingenieria' }
  })

  const catMantenimiento = await prisma.categoria.upsert({
    where: { slug: 'mantenimiento' },
    update: { categoria_padre_id: catIngenieria.id },
    create: { nombre: 'Mantenimiento', slug: 'mantenimiento', categoria_padre_id: catIngenieria.id }
  })

  const catAnalisisDatos = await prisma.categoria.upsert({
    where: { slug: 'analisis-de-datos' },
    update: { categoria_padre_id: catMantenimiento.id },
    create: { 
      nombre: 'Análisis de Datos', 
      slug: 'analisis-de-datos', 
      categoria_padre_id: catMantenimiento.id,
      descripcion: 'Uso de herramientas digitales para el análisis de información técnica.'
    }
  })

  const catGestionProyectos = await prisma.categoria.upsert({
    where: { slug: 'gestion-de-proyectos' },
    update: { categoria_padre_id: catAnalisisDatos.id },
    create: { 
      nombre: 'Gestión de Proyectos', 
      slug: 'gestion-de-proyectos', 
      categoria_padre_id: catAnalisisDatos.id,
      descripcion: 'Planificación y control de proyectos industriales.'
    }
  })

  // 3. Crear el Curso
  const cursoData = {
    titulo: 'Especialización en RCM, PMO, Python, Power BI y MS Project',
    slug: 'especializacion-rcm-pmo-digital',
    descripcion: 'Programa integral que combina metodologías de confiabilidad (RCM y PMO) con herramientas digitales como Python, Power BI y MS Project para optimizar la gestión del mantenimiento, anticipar fallas y tomar decisiones basadas en datos.',
    estado: EstadoCurso.PUBLICADO,
    nivel: NivelCurso.AVANZADO,
    tipo_emision: TipoEmision.MIXTO,
    precio: 852.00,
    precio_oferta: 580.00,
    moneda: 'USD',
    profesor_id: profesor.id,
    categoria_id: catGestionProyectos.id,
    duracion: '40 horas',
    beneficios: [
      { title: 'Integración Metodológica', desc: 'RCM y PMO con herramientas digitales.', icon: 'tabler-binary-tree' },
      { title: 'Modelos Predictivos', desc: 'Anticipación de fallas con Python.', icon: 'tabler-eye-check' },
      { title: 'Toma de decisiones', desc: 'Basada en datos reales.', icon: 'tabler-brain' },
      { title: 'Visualización', desc: 'Habilidades en Power BI.', icon: 'tabler-chart-bar' },
      { title: 'Planificación', desc: 'Eficiencia en MS Project.', icon: 'tabler-calendar-event' }
    ],
    incluye: [
      { text: 'Clases en vivo (Zoom)', active: true },
      { text: '40 horas de formación', active: true },
      { text: 'Casos reales integrados', active: true },
      { text: 'Plantillas profesionales descargables', active: true },
      { text: 'Acceso a plataforma web 24/7', active: true },
      { text: 'Certificación ARM incluida', active: true },
      { text: 'Instalación de software necesario', active: true }
    ],
    objetivos: [
      'Aplicar RCM y PMO en la gestión del mantenimiento',
      'Utilizar Python para análisis predictivo',
      'Crear dashboards en Power BI',
      'Planificar proyectos con MS Project',
      'Integrar datos, confiabilidad y gestión'
    ]
  }

  const curso = await prisma.curso.upsert({
    where: { slug: cursoData.slug },
    update: cursoData as any,
    create: cursoData as any
  })

  console.log(`✅ Curso: ${curso.titulo} creado o actualizado.`)

  // 4. Módulos y Lecciones
  const modulos = [
    {
      titulo: 'Módulo 1: Fundamentos de RCM y Confiabilidad',
      orden: 1,
      lecciones: [
        'Introducción al RCM y selección de activos críticos',
        'Contexto operacional y funciones',
        'Análisis de fallas (AMEF)',
        'Sistemas reparables y no reparables',
        'Herramientas de análisis (Nelson-Allen)'
      ]
    },
    {
      titulo: 'Módulo 2: Python aplicado al Mantenimiento',
      orden: 2,
      lecciones: [
        'Fundamentos de Python y ciencia de datos',
        'Modelo de Weibull y probabilidad de fallas',
        'Análisis avanzado de datos',
        'Modelos predictivos aplicados'
      ]
    },
    {
      titulo: 'Módulo 3: PMO en la Gestión del Mantenimiento',
      orden: 3,
      lecciones: [
        'Fundamentos de PMO',
        'Aplicación práctica y elaboración de informes'
      ]
    },
    {
      titulo: 'Módulo 4: Power BI para Informes de Mantenimiento',
      orden: 4,
      lecciones: [
        'Fundamentos (Power Query, DAX, Power View)',
        'Visualización de datos',
        'Informes dinámicos',
        'Informes avanzados',
        'Exportación y difusión'
      ]
    },
    {
      titulo: 'Módulo 5: MS Project para Planificación',
      orden: 5,
      lecciones: [
        'Fundamentos, EDT y ruta crítica',
        'Configuración de tareas y fechas',
        'Gestión de recursos y dependencias',
        'Proyecto final integrador'
      ]
    }
  ]

  for (const modData of modulos) {
    const modulo = await prisma.modulo.upsert({
      where: { curso_id_orden: { curso_id: curso.id, orden: modData.orden } },
      update: { titulo: modData.titulo },
      create: {
        titulo: modData.titulo,
        orden: modData.orden,
        curso_id: curso.id
      }
    })

    for (let i = 0; i < modData.lecciones.length; i++) {
      await prisma.leccion.upsert({
        where: { modulo_id_orden: { modulo_id: modulo.id, orden: i + 1 } },
        update: { titulo: modData.lecciones[i] },
        create: {
          titulo: modData.lecciones[i],
          orden: i + 1,
          modulo_id: modulo.id,
          video_url: 'https://vimeo.com/placeholder'
        }
      })
    }
  }

  // 5. Examen Final
  const examen = await prisma.examen.upsert({
    where: { id: 'examen-especializacion-digital' },
    update: {
      titulo: 'Evaluación Final de Especialización en Confiabilidad y Herramientas Digitales',
      limite_tiempo: 60,
      puntaje_aprobacion: 70,
      esta_publicado: true,
      intentos_maximos: 3,
      curso_id: curso.id
    },
    create: {
      id: 'examen-especializacion-digital',
      titulo: 'Evaluación Final de Especialización en Confiabilidad y Herramientas Digitales',
      descripcion: 'Evalúa tus conocimientos en metodologías RCM/PMO y el uso de herramientas digitales.',
      limite_tiempo: 60,
      puntaje_aprobacion: 70,
      esta_publicado: true,
      intentos_maximos: 3,
      curso_id: curso.id
    }
  })

  // Preguntas del examen
  const preguntas = [
    {
      texto: '¿Qué permite el modelo de Weibull en mantenimiento?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 1,
      opciones: [
        { texto: 'Reducir costos administrativos', es_correcta: false, orden: 1 },
        { texto: 'Predecir fallas y analizar confiabilidad', es_correcta: true, orden: 2 },
        { texto: 'Gestionar proyectos', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Qué herramienta se utiliza para visualización de datos?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 2,
      opciones: [
        { texto: 'Python', es_correcta: false, orden: 1 },
        { texto: 'Power BI', es_correcta: true, orden: 2 },
        { texto: 'MS Project', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Qué metodología se usa para optimizar estrategias de mantenimiento?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 3,
      opciones: [
        { texto: 'PMO', es_correcta: false, orden: 1 },
        { texto: 'RCM', es_correcta: true, orden: 2 },
        { texto: 'Scrum', es_correcta: false, orden: 3 }
      ]
    }
  ]

  for (const pregData of preguntas) {
    const pregunta = await prisma.pregunta.upsert({
      where: { examen_id_orden: { examen_id: examen.id, orden: pregData.orden } },
      update: { texto: pregData.texto, tipo: pregData.tipo },
      create: {
        texto: pregData.texto,
        tipo: pregData.tipo,
        orden: pregData.orden,
        examen_id: examen.id
      }
    })

    for (const opcData of pregData.opciones) {
      await prisma.opcionPregunta.deleteMany({
        where: { pregunta_id: pregunta.id, orden: opcData.orden }
      })
      await prisma.opcionPregunta.create({
        data: {
          texto: opcData.texto,
          es_correcta: opcData.es_correcta,
          orden: opcData.orden,
          pregunta_id: pregunta.id
        }
      })
    }
  }

  console.log('🎉 Seed de Especialización Digital completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
