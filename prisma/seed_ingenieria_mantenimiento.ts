import { PrismaClient, Rol, EstadoCurso, NivelCurso, TipoEmision, TipoPregunta, TipoContenido } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed para el curso: Ingeniería de Mantenimiento...')

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

  // 2. Gestionar Categoría (Jerarquía: Ingeniería > Mantenimiento > Confiabilidad)
  const catIngenieria = await prisma.categoria.upsert({
    where: { slug: 'ingenieria' },
    update: {},
    create: {
      nombre: 'Ingeniería',
      slug: 'ingenieria',
      descripcion: 'Cursos especializados para ingenieros en diversas ramas industriales.'
    }
  })

  const catMantenimiento = await prisma.categoria.upsert({
    where: { slug: 'mantenimiento' },
    update: { categoria_padre_id: catIngenieria.id },
    create: {
      nombre: 'Mantenimiento',
      slug: 'mantenimiento',
      descripcion: 'Gestión y ejecución de actividades de mantenimiento industrial.',
      categoria_padre_id: catIngenieria.id
    }
  })

  const catConfiabilidad = await prisma.categoria.upsert({
    where: { slug: 'confiabilidad' },
    update: { categoria_padre_id: catMantenimiento.id },
    create: {
      nombre: 'Confiabilidad',
      slug: 'confiabilidad',
      descripcion: 'Ingeniería de confiabilidad y optimización de activos.',
      categoria_padre_id: catMantenimiento.id
    }
  })

  // 3. Crear el Curso
  const cursoData = {
    titulo: 'Ingeniería de Mantenimiento',
    slug: 'ingenieria-de-mantenimiento',
    descripcion: 'Programa especializado que forma profesionales capaces de diseñar, optimizar y gestionar estrategias de mantenimiento basadas en confiabilidad, utilizando herramientas estadísticas, metodologías internacionales y casos reales de la industria.',
    estado: EstadoCurso.PUBLICADO,
    nivel: NivelCurso.AVANZADO,
    tipo_emision: TipoEmision.MIXTO,
    precio: 1497.00,
    precio_oferta: 882.00, // Estamos usando el precio "Promoción" como oferta.
    moneda: 'USD',
    profesor_id: profesor.id,
    categoria_id: catConfiabilidad.id,
    duracion: '48 horas',
    beneficios: [
      { title: 'Aplicación inmediata', desc: 'En entorno laboral real.', icon: 'tabler-briefcase' },
      { title: 'Criterio técnico', desc: 'Desarrollo de toma de decisiones.', icon: 'tabler-manual-gearbox' },
      { title: 'Optimización', desc: 'Reducción de fallas y costos.', icon: 'tabler-trending-down' },
      { title: 'Estándares', desc: 'Dominio de normas internacionales.', icon: 'tabler-world' }
    ],
    incluye: [
      { text: 'Clases en vivo (Zoom)', active: true },
      { text: '48 horas de formación', active: true },
      { text: 'Casos reales e industriales', active: true },
      { text: 'Plantillas profesionales descargables', active: true },
      { text: 'Acceso a plataforma web 24/7', active: true },
      { text: 'Certificación ARM incluida', active: true }
    ],
    objetivos: [
      'Comprender el mantenimiento basado en la condición',
      'Diseñar procesos de mantenimiento eficientes',
      'Aplicar modelos estadísticos de confiabilidad',
      'Implementar RCM y TPM',
      'Evaluar indicadores y costos del ciclo de vida'
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
      titulo: 'Módulo 1: Introducción al mantenimiento y MBC',
      orden: 1,
      lecciones: [
        { titulo: 'Lección 1.1: Conceptos básicos y evolución del mantenimiento', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 1.2: Proceso de la función de mantenimiento', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 1.3: Mantenimiento Basado en la Condición (Parte 1)', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 1.4: Mantenimiento Basado en la Condición (Parte 2)', orden: 4, tipo: TipoContenido.VIDEO }
      ]
    },
    {
      titulo: 'Módulo 2: Planificación y programación del mantenimiento',
      orden: 2,
      lecciones: [
        { titulo: 'Lección 2.1: Proceso de planificación del mantenimiento', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 2.2: Proceso de programación del mantenimiento', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 2.3: Gestión de parada de planta (Parte 1)', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 2.4: Gestión de parada de planta (Parte 2)', orden: 4, tipo: TipoContenido.VIDEO }
      ]
    },
    {
      titulo: 'Módulo 3: Confiabilidad estadística aplicada',
      orden: 3,
      lecciones: [
        { titulo: 'Lección 3.1: Conceptos básicos de confiabilidad', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 3.2: Sistemas reparables', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 3.3: Teoría de confiabilidad estadística', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 3.4: Modelos estadísticos', orden: 4, tipo: TipoContenido.VIDEO }
      ]
    },
    {
      titulo: 'Módulo 4: Mantenimiento Centrado en Confiabilidad (RCM)',
      orden: 4,
      lecciones: [
        { titulo: 'Lección 4.1: Fundamentos del RCM', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 4.2: Análisis funcional', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 4.3: Modos de falla y efectos', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 4.4: Estrategias de mantenimiento', orden: 4, tipo: TipoContenido.VIDEO }
      ]
    },
    {
      titulo: 'Módulo 5: Indicadores y metodologías de confiabilidad',
      orden: 5,
      lecciones: [
        { titulo: 'Lección 5.1: Metodologías de confiabilidad (Parte 1)', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 5.2: Metodologías de confiabilidad (Parte 2)', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 5.3: Indicadores de desempeño (Parte 1)', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 5.4: Indicadores de desempeño (Parte 2)', orden: 4, tipo: TipoContenido.VIDEO }
      ]
    },
    {
      titulo: 'Módulo 6: TPM y LCCA',
      orden: 6,
      lecciones: [
        { titulo: 'Lección 6.1: TPM (Parte 1)', orden: 1, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 6.2: TPM (Parte 2)', orden: 2, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 6.3: Introducción al LCCA', orden: 3, tipo: TipoContenido.VIDEO },
        { titulo: 'Lección 6.4: Modelo de Woodward', orden: 4, tipo: TipoContenido.VIDEO }
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

    for (const lecData of modData.lecciones) {
      await prisma.leccion.upsert({
        where: { modulo_id_orden: { modulo_id: modulo.id, orden: lecData.orden } },
        update: { titulo: lecData.titulo },
        create: {
          titulo: lecData.titulo,
          orden: lecData.orden,
          modulo_id: modulo.id,
          video_url: 'https://vimeo.com/placeholder' // Placeholder
        }
      })
    }
  }

  // 5. Examen Final
  const examen = await prisma.examen.upsert({
    where: { id: 'examen-ingenieria-mantenimiento' }, // Usamos un ID fijo para facilitar el upsert si es posible
    update: {
      titulo: 'Evaluación Final de Ingeniería de Mantenimiento',
      limite_tiempo: 60,
      puntaje_aprobacion: 70,
      esta_publicado: true,
      intentos_maximos: 3,
      curso_id: curso.id
    },
    create: {
      id: 'examen-ingenieria-mantenimiento',
      titulo: 'Evaluación Final de Ingeniería de Mantenimiento',
      descripcion: 'Evalúa tus conocimientos adquiridos en el programa de Ingeniería de Mantenimiento.',
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
      texto: '¿Cuál es el objetivo del mantenimiento basado en la condición?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 1,
      opciones: [
        { texto: 'Reparar fallas después de ocurridas', es_correcta: false, orden: 1 },
        { texto: 'Prevenir fallas mediante monitoreo continuo', es_correcta: true, orden: 2 },
        { texto: 'Reducir costos sin análisis', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Qué metodología se enfoca en la confiabilidad de los activos?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 2,
      opciones: [
        { texto: 'TPM', es_correcta: false, orden: 1 },
        { texto: 'RCM', es_correcta: true, orden: 2 },
        { texto: 'LCCA', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Qué mide el LCCA?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 3,
      opciones: [
        { texto: 'Solo costos de mantenimiento', es_correcta: false, orden: 1 },
        { texto: 'Costos totales del ciclo de vida del activo', es_correcta: true, orden: 2 },
        { texto: 'Costos de producción', es_correcta: false, orden: 3 }
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

  console.log('🎉 Seed de Ingeniería de Mantenimiento completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
