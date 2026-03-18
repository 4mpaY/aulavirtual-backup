import { PrismaClient, TipoEmision, EstadoCurso, NivelCurso } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la RUTA DE MANTENIMIENTO...')

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
    where: { slug: 'mantenimiento' },
    update: {},
    create: {
      nombre: 'Mantenimiento',
      slug: 'mantenimiento',
      descripcion: 'Cursos especializados en fundamentos, seguridad, lubricación y optimización del mantenimiento industrial.'
    }
  })

  const cursos = [
    {
      titulo: 'Fundamentos de Mantenimiento Industrial',
      slug: 'fundamentos-mantenimiento-industrial',
      descripcion: 'Curso base para comprender los principios, tipos y estrategias de mantenimiento utilizados en la industria moderna.',
      nivel: NivelCurso.BASICO,
      duracion: '16–24 horas',
      miniatura: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&q=80',
      objetivos: [
        'Comprender los tipos de mantenimiento y su aplicación.',
        'Interpretar indicadores clave como MTBF, MTTR y disponibilidad.',
        'Conocer herramientas básicas de planificación y ejecución.',
        'Desarrollar pensamiento técnico orientado a confiabilidad.'
      ],
      beneficios: [
        { title: 'Confianza Técnica', desc: 'Asumir tareas de mantenimiento con claridad técnica.', icon: 'tabler-manual-gearbox' },
        { title: 'Empleabilidad', desc: 'Dominar conceptos exigidos por toda empresa industrial.', icon: 'tabler-briefcase' },
        { title: 'Base Técnica', desc: 'Preparación para predictivo, RCM y confiabilidad.', icon: 'tabler-stairs-up' },
        { title: 'Mejor Desempeño', desc: 'Optimizar roles operativos y técnicos.', icon: 'tabler-user-check' }
      ],
      metodologia: [
        { title: 'Plantillas de OT', desc: 'Uso de plantillas reales de órdenes de trabajo.', icon: 'tabler-file-report' },
        { title: 'Casos Industriales', desc: 'Ejemplos prácticos de plantas reales.', icon: 'tabler-building-factory' }
      ],
      incluye: [
        { text: 'Certificado ARM – Fundamentos', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Plantillas de órdenes de trabajo descargables', active: true },
        { text: 'Recomendación: Avanzar hacia Lubricación o Predictivo', active: true }
      ],
      temario: [
        'Conceptos fundamentales del mantenimiento.',
        'Tipos de mantenimiento: correctivo, preventivo, predictivo.',
        'Indicadores clave: MTBF, MTTR, disponibilidad.',
        'Gestión de órdenes de trabajo.',
        'Planificación y programación básica.',
        'Introducción a sistemas CMMS.',
        'Seguridad y procedimientos básicos.',
        'Casos prácticos industriales.'
      ]
    },
    {
      titulo: 'Seguridad y Procedimientos en Mantenimiento',
      slug: 'seguridad-procedimientos-mantenimiento',
      descripcion: 'Curso esencial para garantizar intervenciones seguras, controladas y alineadas a estándares industriales.',
      nivel: NivelCurso.BASICO,
      duracion: '16–20 horas',
      miniatura: 'https://images.unsplash.com/photo-1590402444521-4ea2e069151c?w=800&q=80',
      objetivos: [
        'Aplicar procedimientos seguros en actividades de mantenimiento.',
        'Implementar sistemas de permisos de trabajo.',
        'Ejecutar bloqueo y etiquetado (LOTO).',
        'Identificar riesgos y aplicar controles.'
      ],
      beneficios: [
        { title: 'Seguridad Personal', desc: 'Garantizar la integridad física propia y del equipo.', icon: 'tabler-shield-lock' },
        { title: 'Reducción Incidentes', desc: 'Minimizar riesgos y paradas no planificadas.', icon: 'tabler-alert-triangle' },
        { title: 'Confianza Profesional', desc: 'Ejecutar tareas críticas con total control.', icon: 'tabler-user-bolt' },
        { title: 'Cumplimiento Normativo', desc: 'Alineación con estándares de seguridad industrial.', icon: 'tabler-gavel' }
      ],
      metodologia: [
        { title: 'Simulaciones', desc: 'Simulacros de permisos de trabajo y bloqueo.', icon: 'tabler-run' },
        { title: 'Plantillas ATS/JSA', desc: 'Uso de herramientas de análisis de riesgo listas para usar.', icon: 'tabler-layout-list' }
      ],
      incluye: [
        { text: 'Certificado ARM – Seguridad Operacional', active: true },
        { text: 'Plantillas de ATS y JSA incluidas', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Integrar en Ruta de Seguridad', active: true }
      ],
      temario: [
        'Principios de seguridad industrial.',
        'Permisos de trabajo: caliente, altura, espacios confinados.',
        'Procedimiento LOTO: pasos y verificación.',
        'Análisis de riesgos: IPERC, ATS, JSA.',
        'Equipos de protección personal (EPP).',
        'Procedimientos estándar de trabajo (SOP).',
        'Respuesta ante emergencias.',
        'Casos reales y lecciones aprendidas.'
      ]
    },
    {
      titulo: 'Lubricación Industrial y Análisis de Aceite (Preparación MLA I)',
      slug: 'lubricacion-analisis-aceite-mla1',
      descripcion: 'Formación técnica en tribología, lubricación y análisis de aceite, alineada a estándares ICML.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '24–32 horas',
      miniatura: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80',
      objetivos: [
        'Seleccionar lubricantes adecuados según aplicación.',
        'Controlar contaminación y almacenamiento.',
        'Interpretar reportes de análisis de aceite.',
        'Preparar al participante para certificación MLA I.'
      ],
      beneficios: [
        { title: 'Confiabilidad Crítica', desc: 'Extender vida útil de equipos de alto valor.', icon: 'tabler-rotate' },
        { title: 'Prevención de Fallas', desc: 'Evitar errores comunes de lubricación.', icon: 'tabler-droplet-off' },
        { title: 'Prestigio Técnico', desc: 'Dominar una de las áreas más demandadas.', icon: 'tabler-award' },
        { title: 'Certificación ICML', desc: 'Preparación para el estándar internacional MLA I.', icon: 'tabler-id' }
      ],
      metodologia: [
        { title: 'Casos Reales', desc: 'Análisis de aceite y fallas en equipos.', icon: 'tabler-report-search' },
        { title: 'Diseño de Programas', desc: 'Taller para crear planes de lubricación eficientes.', icon: 'tabler-settings-automation' }
      ],
      incluye: [
        { text: 'Certificado ARM – Lubricación Técnica', active: true },
        { text: 'Guía de preparación MLA I', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Ruta hacia MLA I / II', active: true }
      ],
      temario: [
        'Fundamentos de tribología.',
        'Tipos de lubricantes y seleción.',
        'Contaminación: causas y control.',
        'Técnicas de muestreo profesional.',
        'Interpretación de reportes de laboratorio.',
        'Diseño de programas de lubricación.',
        'Preparación para examen MLA I.'
      ]
    },
    {
      titulo: 'Mantenimiento Predictivo y Técnicas de Diagnóstico',
      slug: 'predictivo-tecnicas-diagnostico',
      descripcion: 'Curso especializado en técnicas predictivas (CBM) para detectar fallas antes de que ocurran.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '32–48 horas',
      miniatura: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
      objetivos: [
        'Comprender principios del mantenimiento basado en condición.',
        'Aplicar técnicas predictivas para diagnóstico temprano.',
        'Interpretar señales y patrones de falla.',
        'Integrar predictivo con estrategias de mantenimiento.'
      ],
      beneficios: [
        { title: 'Anticipación', desc: 'Detectar fallas críticas antes del desastre.', icon: 'tabler-eye-check' },
        { title: 'Ahorro de Costos', desc: 'Evitar reparaciones de emergencia costosas.', icon: 'tabler-receipt-refund' },
        { title: 'Experto en Diagnóstico', desc: 'Reconocimiento como analista predictivo.', icon: 'tabler-stethoscope' },
        { title: 'Decisiones Estratégicas', desc: 'Mantenimiento inteligente basado en datos.', icon: 'tabler-brain' }
      ],
      metodologia: [
        { title: 'Talleres de Señales', desc: 'Análisis de vibraciones y termografía real.', icon: 'tabler-wave-sine' },
        { title: 'Enfoque Multimodal', desc: 'Uso combinado de acústica, calor y vibración.', icon: 'tabler-layers-linked' }
      ],
      incluye: [
        { text: 'Certificado ARM – Predictivo Especializado', active: true },
        { text: 'Talleres prácticos integrados', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia VA I / II', active: true }
      ],
      temario: [
        'Fundamentos del predictivo.',
        'Vibraciones: espectros y severidad.',
        'Termografía: puntos calientes y eléctrica.',
        'Ultrasonido: fugas e inspección.',
        'Análisis eléctrico y motores.',
        'Integración CBM con planes.',
        'Casos reales de diagnóstico exitoso.'
      ]
    },
    {
      titulo: 'Análisis de Criticidad y Estrategias de Mantenimiento',
      slug: 'analisis-criticidad-estrategias',
      descripcion: 'Curso orientado a priorizar activos y definir estrategias de mantenimiento basadas en riesgo.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '16–24 horas',
      miniatura: 'https://images.unsplash.com/photo-1454165833767-027eeef1596b?w=800&q=80',
      objetivos: [
        'Construir matrices de criticidad profesionales.',
        'Evaluar probabilidad y consecuencia.',
        'Priorizar activos y sistemas estratégicos.',
        'Diseñar estrategias de mantenimiento basadas en riesgo.'
      ],
      beneficios: [
        { title: 'Enfoque de Recursos', desc: 'Optimizar dinero en los activos correctos.', icon: 'tabler-target-arrow' },
        { title: 'Reducción de Riesgos', desc: 'Controlar fallas de alto impacto.', icon: 'tabler-alert-square' },
        { title: 'Claridad Estratégica', desc: 'Visión ejecutiva para jefes de área.', icon: 'tabler-compass' },
        { title: 'Justificación Técnica', desc: 'Sustentar planes ante gerencia.', icon: 'tabler-file-spreadsheet' }
      ],
      metodologia: [
        { title: 'Matrices Listas', desc: 'Plantillas profesionales de criticidad.', icon: 'tabler-layout-grid-add' },
        { title: 'Ejemplos Industriales', desc: 'Casos reales de minería y energía.', icon: 'tabler-mountain' }
      ],
      incluye: [
        { text: 'Certificado ARM – Criticidad Técnica', active: true },
        { text: 'Matrices de riesgo descargables', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia RCM', active: true }
      ],
      temario: [
        'Conceptos de criticidad y riesgo.',
        'Matrices de probabilidad e impacto.',
        'Priorización de activos.',
        'Selección de estrategias (PM, CBM, RCM).',
        'Integración con planes maestros.',
        'Casos reales de priorización empresarial.'
      ]
    },
    {
      titulo: 'Mantenimiento Centrado en Confiabilidad (RCM)',
      slug: 'rcm-especialista-confiabilidad',
      descripcion: 'Formación avanzada basada en el estándar SAE JA1011 para diseñar estrategias de mantenimiento de alto impacto.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '32–40 horas',
      miniatura: 'https://images.unsplash.com/photo-1581093458791-4e78a635678b?w=800&q=80',
      objetivos: [
        'Identificar funciones y fallas funcionales.',
        'Analizar modos de falla y causas raíz.',
        'Evaluar consecuencias (Seguridad, Entorno, Economía).',
        'Seleccionar tareas óptimas de mantenimiento.'
      ],
      beneficios: [
        { title: 'Planes Optimizados', desc: 'Eliminar tareas que no agregan valor.', icon: 'tabler-settings-check' },
        { title: 'Mayor Confiabilidad', desc: 'Mejorar disponibilidad en equipos críticos.', icon: 'tabler-chart-line' },
        { title: 'Reducción Costos', desc: 'Evitar fallas repetitivas mal diseñadas.', icon: 'tabler-coin-off' },
        { title: 'Liderazgo Técnico', desc: 'Criterio profesional basado en riesgo.', icon: 'tabler-users' }
      ],
      metodologia: [
        { title: 'Taller RCM Completo', desc: 'Análisis funcional de un activo real.', icon: 'tabler-tools' },
        { title: 'Alineado ISO 55000', desc: 'Enfoque internacional SAE JA1011.', icon: 'tabler-world' }
      ],
      incluye: [
        { text: 'Certificado ARM – Especialista en RCM', active: true },
        { text: 'Plantillas de análisis RCM', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia CMRP / CAMA', active: true }
      ],
      temario: [
        'Fundamentos RCM y SAE JA1011.',
        'Funciones y fallas funcionales.',
        'Modos de falla y causas.',
        'Consecuencias: seguridad y entorno.',
        'Selección de tareas preventivas/predictivas.',
        'Taller de aplicación práctica.',
        'Indicadores de efectividad RCM.'
      ]
    },
    {
      titulo: 'Optimización de Planes de Mantenimiento',
      slug: 'optimizacion-planes-mantenimiento',
      descripcion: 'Curso avanzado para revisar y depurar planes existentes eliminando tareas redundantes e ineficientes.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '20–30 horas',
      miniatura: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      objetivos: [
        'Evaluar la efectividad de planes actuales.',
        'Identificar tareas redundantes o sin impacto.',
        'Rediseñar estrategias basadas en riesgo.',
        'Optimizar costos y frecuencias.'
      ],
      beneficios: [
        { title: 'Menos Gastos', desc: 'Reducción de costos por tareas innecesarias.', icon: 'tabler-filter-off' },
        { title: 'Más Disponibilidad', desc: 'Eliminar intervenciones ineficientes.', icon: 'tabler-clock-play' },
        { title: 'Eficiencia Operativa', desc: 'Planes alineados a la realidad.', icon: 'tabler-bolt' },
        { title: 'Justificación Gerencial', desc: 'Datos sólidos para tomar decisiones.', icon: 'tabler-report-analytics' }
      ],
      metodologia: [
        { title: 'Metodología Propia', desc: 'Procesos de depuración de PMO probados.', icon: 'tabler-brand-shopee' },
        { title: 'Taller con Datos', desc: 'Revisión de planes reales de planta.', icon: 'tabler-archive' }
      ],
      incluye: [
        { text: 'Certificado ARM – Optimización Mantenimiento', active: true },
        { text: 'Manual de optimización PMO', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: RCA y RCM', active: true }
      ],
      temario: [
        'Diagnóstico de planes actuales.',
        'Evaluación de valor y frecuencia.',
        'Integración de criticidad y RCM.',
        'Optimización basada en riesgo real.',
        'Ajuste de ventanas de intervención.',
        'Integración con CMMS.',
        'Caso práctico de optimización.'
      ]
    },
    {
      titulo: 'Análisis de Fallas y RCA (Root Cause Analysis)',
      slug: 'analisis-fallas-rca-profesional',
      descripcion: 'Curso avanzado para identificar causas raíz y diseñar acciones correctivas sostenibles.',
      nivel: NivelCurso.INTERMEDIO,
      duracion: '16–24 horas',
      miniatura: 'https://images.unsplash.com/photo-1542332213-31f87348057f?w=800&q=80',
      objetivos: [
        'Aplicar metodologías RCA estructuradas.',
        'Identificar causas técnicas, humanas y organizativas.',
        'Diseñar acciones correctivas que eliminen el problema.',
        'Documentar análisis profesionales.'
      ],
      beneficios: [
        { title: 'Eliminar Repetitivas', desc: 'Adiós a las fallas crónicas en equipos.', icon: 'tabler-trash-x' },
        { title: 'Foco en Confiabilidad', desc: 'Mejorar MTBF de forma drástica.', icon: 'tabler-chart-arrows' },
        { title: 'Especialista Lince', desc: 'Solucionador experto de problemas complejos.', icon: 'tabler-user-search' },
        { title: 'Comunicación Senior', desc: 'Mejor influencia ante la alta gerencia.', icon: 'tabler-messages' }
      ],
      metodologia: [
        { title: 'Fallas Críticas', desc: 'Análisis de casos de desastres industriales.', icon: 'tabler-flame' },
        { title: 'Plantillas RCA', desc: 'Árbol lógico e Ishikawa listos para usar.', icon: 'tabler-binary-tree' }
      ],
      incluye: [
        { text: 'Certificado ARM – Solucionador RCA', active: true },
        { text: 'Plantillas de análisis de fallas', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: VA II, RCM o CMRP', active: true }
      ],
      temario: [
        'Introducción al análisis de fallas.',
        'Metodologías: 5 Porqués, Ishikawa, RCA.',
        'Evidencia y reconstrucción de eventos.',
        'Causas técnicas vs. organizacionales.',
        'Acciones correctivas vs. preventivas.',
        'Verificación de efectividad.',
        'Casos industriales reales.'
      ]
    },
    {
      titulo: 'Preparación CMRT – Certified Maintenance & Reliability Technician',
      slug: 'preparacion-cmrt-tecnico-certificado',
      descripcion: 'Programa de preparación para la certificación CMRT de la SMRP, la más importante para técnicos a nivel mundial.',
      nivel: NivelCurso.AVANZADO,
      duracion: '30–40 horas',
      miniatura: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
      objetivos: [
        'Dominar los cuatro dominios del examen CMRT.',
        'Comprender técnicas de diagnóstico predictivo.',
        'Aplicar prácticas seguras internacionales.',
        'Resolver preguntas situacionales del examen real.'
      ],
      beneficios: [
        { title: 'Validación Global', desc: 'Sello de calidad SMRP para tu carrera.', icon: 'tabler-certificate-2' },
        { title: 'Crecimiento Salarial', desc: 'Certificación reconocida que impacta ingresos.', icon: 'tabler-trending-up-3' },
        { title: 'Liderazgo Técnico', desc: 'Asumir roles de mayor responsabilidad.', icon: 'tabler-shield-up' },
        { title: 'Dominio PM/PdM', desc: 'Maestría en preventivo y predictivo.', icon: 'tabler-settings-automation' }
      ],
      metodologia: [
        { title: 'Simulacros SMRP', desc: 'Práctica intensiva con preguntas tipo examen.', icon: 'tabler-checklist' },
        { title: 'Enfoque Técnico', desc: 'Con ejemplos directos de campo para técnicos.', icon: 'tabler-tool' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación CMRT', active: true },
        { text: 'Simulacros cronometrados', active: true },
        { text: 'Guía técnica SMRP para técnicos', active: true },
        { text: 'Modalidad: Online en vivo', active: true }
      ],
      temario: [
        'Dominio 1: Preventivo y Predictivo.',
        'Dominio 2: Mantenimiento Correctivo.',
        'Dominio 3: Confiabilidad para técnicos.',
        'Dominio 4: Seguridad y Medio Ambiente.',
        'Técnicas de diagnóstico por monitoreo.',
        'Práctica y simulacros oficiales.'
      ]
    },
    {
      titulo: 'Preparación MLA I / MLA II – Machine Lubrication Analyst (ICML)',
      slug: 'preparacion-mla1-mla2-icml',
      descripcion: 'Programa avanzado para certificarse ante el ICML en lubricación y análisis de aceite.',
      nivel: NivelCurso.AVANZADO,
      duracion: '30–40 horas',
      miniatura: 'https://images.unsplash.com/photo-1596753426921-d007440c3451?w=800&q=80',
      objetivos: [
        'Dominar principios avanzados de lubricación.',
        'Interpretar tendencias y reportes complejos de aceite.',
        'Diseñar programas de lubricación industriales.',
        'Preparar al participante para examen MLA I/II.'
      ],
      beneficios: [
        { title: 'Certificación Elite', desc: 'Estatus internacional ICML altamente valorado.', icon: 'tabler-medal-2' },
        { title: 'Experto Aceites', desc: 'Dominio absoluto de la tribología industrial.', icon: 'tabler-flask-2' },
        { title: 'Impacto en Planta', desc: 'Eliminar fallas catastróficas por lubricantes.', icon: 'tabler-alert-square-rounded' },
        { title: 'Consultoría Senior', desc: 'Capacidad de asesorar en gestión de lubricación.', icon: 'tabler-report-money' }
      ],
      metodologia: [
        { title: 'Alineación ICML', desc: 'Contenido riguroso bajo estándares ICML.', icon: 'tabler-id' },
        { title: 'Simulacros de Examen', desc: 'Preparación para el día de la certificación.', icon: 'tabler-forms' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación MLA I / II', active: true },
        { text: 'Banco de preguntas ICML', active: true },
        { text: 'Manual de tribología avanzada', active: true },
        { text: 'Modalidad: Online en vivo', active: true }
      ],
      temario: [
        'Principios de tribología avanzada.',
        'Propiedades y mezclas de lubricantes.',
        'Control total de contaminación.',
        'Metodologías de muestreo ICML.',
        'Análisis de tendencias MLA II.',
        'Gobernanza de programas de lubricación.',
        'Simulacros finales MLA.'
      ]
    },
    {
      titulo: 'Preparación RCT I / RCT II – Reliability Centered Technician (Mobius)',
      slug: 'preparacion-rct1-rct2-mobius-cat',
      descripcion: 'Preparación para certificaciones de técnicos de confiabilidad del Mobius Institute.',
      nivel: NivelCurso.AVANZADO,
      duracion: '24–36 horas',
      miniatura: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&q=80',
      objetivos: [
        'Dominar fundamentos de confiabilidad aplicados.',
        'Ejecutar inspecciones basadas en condición (CBM).',
        'Identificar fallas en campo con técnicas predictivas.',
        'Preparar para examen oficial RCT Mobius.'
      ],
      beneficios: [
        { title: 'Reconocimiento Mobius', desc: 'Calidad internacional del instituto Mobius.', icon: 'tabler-world-latitude' },
        { title: 'Diagnostico Superior', desc: 'Detectar fallas que otros pasan por alto.', icon: 'tabler-binary' },
        { title: 'Crecimiento Técnico', desc: 'Paso directo hacia VA Nivel I.', icon: 'tabler-arrow-bear-right' },
        { title: 'Inspecciones Robustas', desc: 'Garantizar confiabilidad desde la ejecución.', icon: 'tabler-checkup-list' }
      ],
      metodologia: [
        { title: 'Certificación Mobius', desc: 'Preparación total para el examen internacional.', icon: 'tabler-id' },
        { title: 'Enfoque Operativo', desc: 'Diseñado específicamente para técnicos de campo.', icon: 'tabler-tool' }
      ],
      incluye: [
        { text: 'Certificado ARM – Preparación RCT I / II', active: true },
        { text: 'Material de inspección Mobius', active: true },
        { text: 'Modalidad: Online en vivo', active: true },
        { text: 'Recomendación: Avanzar hacia VA I o CMRT', active: true }
      ],
      temario: [
        'Fundamentos de confiabilidad operacional.',
        'Inspecciones de campo efectivas.',
        'Lubricación y monitoreo básico.',
        'Vibraciones y ultrasonido para técnicos.',
        'Toma de datos y diagnóstico inicial.',
        'Simulacros oficiales Mobius RCT.'
      ]
    }
  ]

  for (const cData of cursos) {
    const { temario, ...data } = cData
    
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

  console.log('🎉 Seed de la RUTA DE MANTENIMIENTO completado con éxito!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
