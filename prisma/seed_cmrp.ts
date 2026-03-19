import { PrismaClient, Rol, EstadoCurso, NivelCurso, TipoEmision, TipoPregunta, TipoContenido } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed para el curso: Preparación para Certificación CMRP...')

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

  // 2. Buscar Categoría (Ya debería existir por el seed anterior)
  let catConfiabilidad = await prisma.categoria.findUnique({
    where: { slug: 'confiabilidad' }
  })

  if (!catConfiabilidad) {
    // Si no existe, la creamos rápidamente con su jerarquía básica
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

    catConfiabilidad = await prisma.categoria.upsert({
      where: { slug: 'confiabilidad' },
      update: { categoria_padre_id: catMantenimiento.id },
      create: { nombre: 'Confiabilidad', slug: 'confiabilidad', categoria_padre_id: catMantenimiento.id }
    })
  }

  // 3. Crear el Curso
  const cursoData = {
    titulo: 'Preparación para Certificación CMRP',
    slug: 'preparacion-certificacion-cmrp',
    descripcion: 'Programa intensivo diseñado para dominar los cinco pilares del SMRP Body of Knowledge y aprobar el examen CMRP en el primer intento, mediante entrenamiento práctico, simulacros y enfoque en toma de decisiones reales de la industria.',
    estado: EstadoCurso.PUBLICADO,
    nivel: NivelCurso.AVANZADO,
    tipo_emision: TipoEmision.MIXTO,
    precio: 1490.00,
    precio_oferta: 963.00,
    moneda: 'USD',
    profesor_id: profesor.id,
    categoria_id: catConfiabilidad.id,
    duracion: '48 horas',
    beneficios: [
      { title: 'Aprobación CMRP', desc: 'Preparación para el primer intento.', icon: 'tabler-certificate' },
      { title: 'Posicionamiento', desc: 'Reconocimiento internacional.', icon: 'tabler-world' },
      { title: 'SMRP Body of Knowledge', desc: 'Dominio de los 5 pilares.', icon: 'tabler-books' },
      { title: 'Toma de decisiones', desc: 'Mejora en el criterio técnico.', icon: 'tabler-brain' },
      { title: 'Oportunidades', desc: 'Incremento de empleabilidad.', icon: 'tabler-trending-up' }
    ],
    incluye: [
      { text: 'Clases en vivo (Zoom)', active: true },
      { text: '48 horas de formación', active: true },
      { text: 'Simulacros de examen reales', active: true },
      { text: 'Plantillas profesionales de gestión', active: true },
      { text: 'Acceso a plataforma web 24/7', active: true },
      { text: 'Certificación ARM incluida', active: true },
      { text: 'Acompañamiento en inscripción SMRP', active: true }
    ],
    objetivos: [
      'Dominar los cinco pilares del CMRP',
      'Aplicar metodologías de mantenimiento y confiabilidad',
      'Mejorar análisis de fallas e indicadores',
      'Prepararse estratégicamente para el examen',
      'Elevar la competitividad profesional'
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
      titulo: 'Módulo 1: Negocios y Gestión',
      orden: 1,
      lecciones: [
        'Dirección estratégica y planificación de mantenimiento y confiabilidad',
        'Administración del plan estratégico',
        'Medición del desempeño y KPIs',
        'Gestión del cambio organizacional',
        'Comunicación con stakeholders'
      ]
    },
    {
      titulo: 'Módulo 2: Confiabilidad del Proceso',
      orden: 2,
      lecciones: [
        'Procedimientos operativos y estándares',
        'Técnicas de mejora de procesos',
        'Gestión del cambio en procesos',
        'Control de variabilidad'
      ]
    },
    {
      titulo: 'Módulo 3: Confiabilidad del Equipo',
      orden: 3,
      lecciones: [
        'Expectativas de confiabilidad',
        'Evaluación de desempeño',
        'Estrategias para equipos existentes',
        'Estrategias para nuevos equipos',
        'Justificación económica',
        'Implementación de estrategias',
        'Revisión y ajuste'
      ]
    },
    {
      titulo: 'Módulo 4: Liderazgo y Organización',
      orden: 4,
      lecciones: [
        'Requisitos organizacionales',
        'Análisis de capacidades',
        'Diseño organizacional',
        'Desarrollo del personal',
        'Gestión de equipos'
      ]
    },
    {
      titulo: 'Módulo 5: Gestión del Trabajo',
      orden: 5,
      lecciones: [
        'Identificación y aprobación del trabajo',
        'Priorización',
        'Planificación detallada',
        'Programación y backlog',
        'Ejecución y calidad',
        'Análisis y retroalimentación',
        'Medición del desempeño',
        'Gestión de proyectos',
        'Uso de CMMS/EAM',
        'Gestión de recursos'
      ]
    },
    {
      titulo: 'Módulo 6: Simulacros y Estrategia de Examen',
      orden: 6,
      lecciones: [
        'Simulacros por pilar',
        'Gestión del tiempo',
        'Análisis de preguntas',
        'Cierre de brechas',
        'Preparación mental'
      ]
    },
    {
      titulo: 'Módulo 7: Ruta de Certificación',
      orden: 7,
      lecciones: [
        'Inscripción al examen',
        'Recomendaciones clave',
        'Plan de estudio personalizado',
        'Acompañamiento post-curso',
        'Estrategias de posicionamiento profesional'
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
    where: { id: 'examen-preparacion-cmrp' },
    update: {
      titulo: 'Simulacro Final CMRP',
      limite_tiempo: 90,
      puntaje_aprobacion: 70,
      esta_publicado: true,
      intentos_maximos: 3,
      curso_id: curso.id
    },
    create: {
      id: 'examen-preparacion-cmrp',
      titulo: 'Simulacro Final CMRP',
      descripcion: 'Simulacro completo para la certificación CMRP basado en los 5 pilares del SMRP.',
      limite_tiempo: 90,
      puntaje_aprobacion: 70,
      esta_publicado: true,
      intentos_maximos: 3,
      curso_id: curso.id
    }
  })

  // Preguntas del examen
  const preguntas = [
    {
      texto: '¿Qué evalúa el CMRP principalmente?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 1,
      opciones: [
        { texto: 'Memorización teórica', es_correcta: false, orden: 1 },
        { texto: 'Toma de decisiones basada en experiencia', es_correcta: true, orden: 2 },
        { texto: 'Conocimiento básico', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Cuántos pilares tiene el SMRP Body of Knowledge?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 2,
      opciones: [
        { texto: '3', es_correcta: false, orden: 1 },
        { texto: '5', es_correcta: true, orden: 2 },
        { texto: '7', es_correcta: false, orden: 3 }
      ]
    },
    {
      texto: '¿Qué herramienta se usa para gestión de mantenimiento?',
      tipo: TipoPregunta.OPCION_MULTIPLE,
      orden: 3,
      opciones: [
        { texto: 'CRM', es_correcta: false, orden: 1 },
        { texto: 'ERP', es_correcta: false, orden: 2 },
        { texto: 'CMMS/EAM', es_correcta: true, orden: 3 }
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

  console.log('🎉 Seed de CMRP completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
