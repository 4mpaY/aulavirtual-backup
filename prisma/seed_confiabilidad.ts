import { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la RUTA DE CONFIABILIDAD...')

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
    throw new Error('No se encontró ningún usuario para asignar los cursos.')
  }

  // Buscar o crear categoría
  const categoria = await prisma.categoria.upsert({
    where: { slug: 'confiabilidad' },
    update: {},
    create: {
      nombre: 'Confiabilidad',
      slug: 'confiabilidad',
      descripcion: 'Cursos especializados en confiabilidad, mantenimiento predictivo y monitoreo de condición.'
    }
  })

  const cursos = [
    {
      titulo: 'Confiabilidad Básica para Ingenieros Nuevos',
      slug: 'confiabilidad-basica-ingenieros',
      descripcion: 'Curso fundamental para comprender los principios de confiabilidad aplicados a activos industriales. Ideal para ingenieros que inician su carrera.',
      nivel: NivelCurso.BASICO,
      duracion: '16–20 horas',
      miniatura: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
      objetivos: [
        'Comprender los conceptos esenciales de confiabilidad.',
        'Interpretar indicadores clave como MTBF, MTTR y disponibilidad.',
        'Relacionar confiabilidad con mantenimiento y operación.',
        'Desarrollar pensamiento orientado a análisis y mejora continua.'
      ],
      beneficios: [
        { title: 'Confianza Técnica', desc: 'Comprender el comportamiento de los activos.', icon: 'tabler-shield-check' },
        { title: 'Empleabilidad', desc: 'Base sólida para roles de mantenimiento.', icon: 'tabler-briefcase' },
        { title: 'Base Sólida', desc: 'Preparación para RCM y análisis avanzado.', icon: 'tabler-stairs-up' },
        { title: 'Visión de Mejora', desc: 'Reducir fallas y mejorar disponibilidad.', icon: 'tabler-trending-up' }
      ],
      metodologia: [
        { title: 'Ejemplos Reales', desc: 'Casos prácticos de plantas industriales reales.', icon: 'tabler-factory' },
        { title: 'Enfoque Práctico', desc: 'Desde el primer módulo con aplicaciones directas.', icon: 'tabler-tool' }
      ],
      incluye: [
        { text: 'Certificado ARM – Fundamentos de Confiabilidad', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia Indicadores o Predictivo', active: true }
      ],
      temario: [
        'Conceptos básicos: confiabilidad, disponibilidad, mantenibilidad.',
        'Fallas: tipos, patrones, modos.',
        'Indicadores clave: MTBF, MTTR, disponibilidad.',
        'Introducción al ciclo de vida del activo.',
        'Relación entre mantenimiento y confiabilidad.',
        'Introducción a análisis de fallas.',
        'Casos prácticos industriales.'
      ]
    },
    {
      titulo: 'Indicadores de Confiabilidad (MTBF, MTTR, Disponibilidad)',
      slug: 'indicadores-confiabilidad-mtbf-mttr',
      descripcion: 'Curso especializado en el cálculo, interpretación y aplicación de indicadores clave de confiabilidad para la toma de decisiones.',
      nivel: NivelCurso.BASICO,
      duracion: '16–24 horas',
      miniatura: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      objetivos: [
        'Calcular correctamente MTBF, MTTR, disponibilidad y otros indicadores.',
        'Interpretar tendencias y patrones de falla.',
        'Utilizar indicadores para mejorar planes de mantenimiento.',
        'Integrar métricas en reportes ejecutivos.'
      ],
      beneficios: [
        { title: 'Claridad de Desempeño', desc: 'Evaluar activos con datos reales.', icon: 'tabler-chart-bar' },
        { title: 'Decisiones Basadas en Datos', desc: 'Mejorar toma de decisiones técnicas.', icon: 'tabler-database' },
        { title: 'Justificación de Inversiones', desc: 'Capacidad de sustentar cambios en planes.', icon: 'tabler-currency-dollar' },
        { title: 'Reconocimiento', desc: 'Dominio de métricas ejecutivas clave.', icon: 'tabler-award' }
      ],
      metodologia: [
        { title: 'Taller con Datos Reales', desc: 'Práctica directa con datos de planta.', icon: 'tabler-settings' },
        { title: 'Plantillas Listas', desc: 'Plantillas de cálculo profesional para usar de inmediato.', icon: 'tabler-template' }
      ],
      incluye: [
        { text: 'Certificado ARM – Indicadores de Confiabilidad', active: true },
        { text: 'Plantillas de cálculo incluidas', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia Predictivo o RCM', active: true }
      ],
      temario: [
        'Indicadores fundamentales: MTBF, MTTR, disponibilidad.',
        'Indicadores avanzados: confiabilidad, mantenibilidad, OEE.',
        'Análisis de tendencias y patrones.',
        'Uso de datos históricos y CMMS.',
        'Reportes ejecutivos y toma de decisiones.',
        'Taller con datos reales.'
      ]
    },
    {
      titulo: 'Mantenimiento Predictivo',
      slug: 'mantenimiento-predictivo-especializado',
      descripcion: 'Curso especializado en técnicas predictivas para detectar fallas antes de que ocurran.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '32–48 horas',
      miniatura: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
      objetivos: [
        'Comprender principios del mantenimiento basado en condición.',
        'Aplicar técnicas predictivas para diagnóstico temprano.',
        'Interpretar señales, espectros y patrones de falla.',
        'Integrar predictivo con estrategias de mantenimiento.'
      ],
      beneficios: [
        { title: 'Anticipación', desc: 'Detectar fallas críticas de forma temprana.', icon: 'tabler-eye' },
        { title: 'Reducción de Costos', desc: 'Evitar paradas no planificadas.', icon: 'tabler-coin' },
        { title: 'Especialista en Diagnóstico', desc: 'Reconocimiento técnico profesional.', icon: 'tabler- stethoscope' },
        { title: 'Decisiones CBM', desc: 'Optimizar planes mediante condición.', icon: 'tabler-binary' }
      ],
      metodologia: [
        { title: 'Talleres con Señales', desc: 'Análisis de señales vibratorias y térmicas reales.', icon: 'tabler-wave-sine' },
        { title: 'Enfoque Multimodal', desc: 'Combinación de termografía, ultrasonido y vibraciones.', icon: 'tabler-layers-linked' }
      ],
      incluye: [
        { text: 'Certificado ARM – Predictivo', active: true },
        { text: 'Acceso a software de simulación', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia VA I', active: true }
      ],
      temario: [
        'Fundamentos del mantenimiento predictivo.',
        'Vibraciones: espectros, severidad, modos de falla.',
        'Termografía infrarroja: puntos calientes, conexiones.',
        'Ultrasonido: fugas, rodamientos, inspecciones.',
        'Análisis eléctrico: motores, aislamiento.',
        'Integración CBM con planes de mantenimiento.',
        'Casos reales de diagnóstico.'
      ]
    },
    {
      titulo: 'Lubricación y Tribología',
      slug: 'lubricacion-tribologia-industrial',
      descripcion: 'Curso especializado en lubricación industrial, tribología y control de contaminación.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '20–30 horas',
      miniatura: 'https://images.unsplash.com/photo-1590422204919-610e7b41e20e?w=800&q=80',
      objetivos: [
        'Comprender principios de tribología.',
        'Seleccionar lubricantes adecuados por aplicación.',
        'Controlar contaminación y almacenamiento.',
        'Diseñar programas de lubricación eficientes.'
      ],
      beneficios: [
        { title: 'Confiabilidad Rotativa', desc: 'Extender la vida útil de equipos críticos.', icon: 'tabler-rotate' },
        { title: 'Reducción de Fallas', desc: 'Evitar errores por lubricación incorrecta.', icon: 'tabler-droplet-off' },
        { title: 'Especialización Alta', desc: 'Valorado en minería y energía.', icon: 'tabler-mountain' },
        { title: 'Programas Eficientes', desc: 'Diseño de gestión sostenible de lubricantes.', icon: 'tabler-file-settings' }
      ],
      metodologia: [
        { title: 'Casos Reales', desc: 'Análisis de fallas reales por lubricación.', icon: 'tabler-presentation' },
        { title: 'Plantillas de Programas', desc: 'Documentación lista para implementar en planta.', icon: 'tabler-files' }
      ],
      incluye: [
        { text: 'Certificado ARM – Lubricación y Tribología', active: true },
        { text: 'Guía de control de contaminación', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia MLA I', active: true }
      ],
      temario: [
        'Fundamentos de tribología.',
        'Tipos de lubricantes y propiedades.',
        'Selección por aplicación.',
        'Contaminación: causas, efectos y control.',
        'Técnicas de muestreo y análisis.',
        'Diseño de programas de lubricación.',
        'Casos reales.'
      ]
    },
    {
      titulo: 'Análisis de Vibraciones Nivel I (VA I)',
      slug: 'analisis-vibraciones-va1',
      descripcion: 'Curso introductorio al análisis de vibraciones, alineado al estándar ISO 18436-2.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '24–36 horas',
      miniatura: 'https://images.unsplash.com/photo-1542332213-31f87348057f?w=800&q=80',
      objetivos: [
        'Comprender fundamentos del análisis de vibraciones.',
        'Identificar fallas comunes en equipos rotativos.',
        'Interpretar espectros básicos.',
        'Preparar al participante para certificación VA I.'
      ],
      beneficios: [
        { title: 'Diagnóstico Inicial', desc: 'Detectar fallas como desbalance y holguras.', icon: 'tabler-wave-sawtool' },
        { title: 'Empleabilidad Predictiva', desc: 'Acceder a roles de monitoreo de condición.', icon: 'tabler-chart-line' },
        { title: 'Base VA II', desc: 'Preparación sólida para niveles superiores.', icon: 'tabler-arrow-up-right' },
        { title: 'Reconocimiento Técnico', desc: 'Validación en análisis de vibraciones.', icon: 'tabler-check' }
      ],
      metodologia: [
        { title: 'Espectros Reales', desc: 'Talleres prácticos con señales industriales.', icon: 'tabler-chart-dots' },
        { title: 'Alineado a Mobius', desc: 'Preparación con estándares internacionales.', icon: 'tabler-world-latitude' }
      ],
      incluye: [
        { text: 'Certificado ARM – VA I', active: true },
        { text: 'Simulacros de examen VA I', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia VA II', active: true }
      ],
      temario: [
        'Fundamentos de vibraciones.',
        'Frecuencia, amplitud, fase.',
        'Modos de falla: desbalance, desalineación.',
        'Espectros básicos.',
        'Técnicas de medición.',
        'Interpretación inicial.',
        'Preparación para VA I.'
      ]
    },
    {
      titulo: 'Preparación CMRP – Certified Maintenance & Reliability Professional',
      slug: 'preparacion-cmrp-smrp',
      descripcion: 'Programa de preparación para la certificación CMRP, la credencial más reconocida a nivel mundial en mantenimiento y confiabilidad.',
      nivel: NivelCurso.AVANZADO,
      duracion: '40–60 horas',
      miniatura: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      objetivos: [
        'Dominar los 5 pilares del examen CMRP (SMRP).',
        'Comprender herramientas avanzadas de confiabilidad.',
        'Resolver preguntas situacionales de alta dificultad.',
        'Preparar al participante para aprobar en el primer intento.'
      ],
      beneficios: [
        { title: 'Prestigio Mundial', desc: 'La credencial #1 en mantenimiento y confiabilidad.', icon: 'tabler-world-bolt' },
        { title: 'Salto Profesional', desc: 'Acceso a roles de gerencia y liderazgo técnico.', icon: 'tabler-climbing-wall' },
        { title: 'Dominio Integral', desc: 'Manejo de los 5 pilares estratégicos de la SMRP.', icon: 'tabler-pillar' },
        { title: 'Confianza en Datos', desc: 'Toma de decisiones críticas basada en estrategia.', icon: 'tabler-lock-check' }
      ],
      metodologia: [
        { title: 'Simulacros Exigentes', desc: 'Tests alineados al rigor del examen real.', icon: 'tabler-clipboard-data' },
        { title: 'Enfoque Estratégico', desc: 'No solo teoría, sino casos de negocio e industria.', icon: 'tabler-map-2' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación CMRP', active: true },
        { text: 'Simulacros completos con retroalimentación', active: true },
        { text: 'Guía de los 5 Pilares SMRP', active: true },
        { text: 'Modalidad: Online en vivo', active: true }
      ],
      temario: [
        'Pilar 1: Business & Management — KPIs, costos.',
        'Pilar 2: Manufacturing Process Reliability — procesos, flujo.',
        'Pilar 3: Equipment Reliability — RCM, FMEA.',
        'Pilar 4: Organization & Leadership — liderazgo técnico.',
        'Pilar 5: Work Management — planificación, CMMS.',
        'Preguntas situacionales y simulacros.'
      ]
    },
    {
      titulo: 'Preparación VA I / VA II – Vibration Analyst (Mobius)',
      slug: 'preparacion-va1-va2-mobius',
      descripcion: 'Programa integral para las certificaciones VA I y VA II bajo ISO 18436-2.',
      nivel: NivelCurso.AVANZADO,
      duracion: '30–50 horas',
      miniatura: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80',
      objetivos: [
        'Diagnosticar fallas complejas en equipos rotativos.',
        'Interpretar espectros avanzados y análisis de fase.',
        'Aplicar técnicas de severidad y diagnóstico profundo.',
        'Preparar al participante para certificación Mobius.'
      ],
      beneficios: [
        { title: 'Dominio Avanzado', desc: 'Diagnóstico experto de vibraciones.', icon: 'tabler-target-arrow' },
        { title: 'Autoridad Técnica', desc: 'Manejo preciso de equipos críticos.', icon: 'tabler-bolt-check' },
        { title: 'Resolución de Problemas', desc: 'Solucionar casos complejos de resonancia.', icon: 'tabler-puzzle' },
        { title: 'Validación ISO', desc: 'Preparación para el estándar 18436-2.', icon: 'tabler-id' }
      ],
      metodologia: [
        { title: 'Simulacros Mobius', desc: 'Alineado al material oficial del Mobius Institute.', icon: 'tabler-certificate' },
        { title: 'Casos Profundos', desc: 'Diagnóstico de problemas estructurales y fase.', icon: 'tabler-microscope' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación VA I / VA II', active: true },
        { text: 'Material de espectros avanzados', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Complementar con RCM y RCA', active: true }
      ],
      temario: [
        'Análisis avanzado: fase, órbitas, envolventes.',
        'Fallas complejas: resonancia, problemas estructurales.',
        'Técnicas de severidad y trending.',
        'Diagnóstico profundo de rodamientos y engranes.',
        'Simulacros Mobius VA II.'
      ]
    },
    {
      titulo: 'Preparación RCT I / RCT II – Reliability Centered Technician',
      slug: 'preparacion-rct1-rct2-mobius',
      descripcion: 'Certificación internacional para técnicos de confiabilidad orientada a inspección y monitoreo.',
      nivel: NivelCurso.AVANZADO,
      duracion: '30–40 horas',
      miniatura: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      objetivos: [
        'Realizar inspecciones efectivas basadas en condición.',
        'Integrar múltiples técnicas predictivas en un modelo.',
        'Diagnosticar fallas en campo con precisión técnica.',
        'Preparar al participante para certificación RCT Mobius.'
      ],
      beneficios: [
        { title: 'Capacidad en Campo', desc: 'Inspecciones robustas que evitan fallas.', icon: 'tabler-helmet' },
        { title: 'Multimodalidad', desc: 'Integrar ultrasonido, termografía y vibración.', icon: 'tabler-variable' },
        { title: 'Reconocimiento RCT', desc: 'Validación internacional Mobius para técnicos.', icon: 'tabler-id-badge' },
        { title: 'Prevención Crítica', desc: 'Detección temprana en la línea de fuego.', icon: 'tabler-zoom-check' }
      ],
      metodologia: [
        { title: 'Técnico de Confiabilidad', desc: 'Enfoque práctico para el personal operativo.', icon: 'tabler-manual-gearbox' },
        { title: 'Simulacros RCT', desc: 'Preparación total para el examen de certificación.', icon: 'tabler-forms' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación RCT I / RCT II', active: true },
        { text: 'Guía de inspecciones predictivas', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia VA II o CMRT', active: true }
      ],
      temario: [
        'Fundamentos de confiabilidad para técnicos.',
        'Inspecciones avanzadas basadas en condición.',
        'Integración de vibraciones, ultrasonido y termografía.',
        'Diagnóstico avanzado en campo.',
        'Simulacros Mobius RCT.'
      ]
    }
  ]

  for (const cData of cursos) {
    const { temario, ...data } = cData
    
    // Crear curso
    const curso = await prisma.curso.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        profesor_id: profesor.id,
        categoria_id: categoria.id,
        es_gratis: true,
        precio: 0,
        estado: EstadoCurso.PUBLICADO,
        tipo_emision: TipoEmision.ASINCRONO,
        nivel: data.nivel as NivelCurso,
        fecha_inicio: new Date()
      },
      create: {
        ...data,
        profesor_id: profesor.id,
        categoria_id: categoria.id,
        es_gratis: true,
        precio: 0,
        estado: EstadoCurso.PUBLICADO,
        tipo_emision: TipoEmision.ASINCRONO,
        nivel: data.nivel as NivelCurso,
        fecha_inicio: new Date()
      }
    })

    console.log(`- Curso: ${curso.titulo}`)

    // Crear módulo y lecciones
    const modulo = await prisma.modulo.upsert({
      where: { curso_id_orden: { curso_id: curso.id, orden: 1 } },
      update: { titulo: 'Contenido del Programa' },
      create: {
        titulo: 'Contenido del Programa',
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
  }

  console.log('🎉 Seed de la RUTA DE CONFIABILIDAD completado con éxito!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
