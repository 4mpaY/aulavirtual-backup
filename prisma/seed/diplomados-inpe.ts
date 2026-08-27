import { PrismaClient, Rol, TipoCurso, NivelCurso, TipoEmision, EstadoCurso, EstadoLeccion } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_MINIATURA = '/uploads/cursos/default/icono-academy-default.jpg'

const materialDescargable = (id: string, nombre: string, url: string = '/uploads/cursos/plataforma-educativa.pdf') => [
  { id, nombre, url, tipo: 'archivo' }
]

async function main() {
  console.log('🌱 Iniciando seed de Diplomados (GRD, SST) y Curso INPE...')

  // ─── LIMPIEZA INICIAL ───────────────────────────────────────────────────────
  console.log('🧹 Limpiando cursos, inscripciones, pedidos y progresos anteriores...')

  // 1. Progresos, certificados y comentarios
  await prisma.progresoLeccion.deleteMany()
  await prisma.progresoCurso.deleteMany()
  await prisma.certificado.deleteMany()
  await prisma.valoracionCurso.deleteMany()
  await prisma.comentario.deleteMany()

  // 2. Evaluaciones, entregas y actividades
  await prisma.entregaTrabajo.deleteMany()
  await prisma.trabajo.deleteMany()
  await prisma.entregaActividad.deleteMany()
  await prisma.actividad.deleteMany()
  await prisma.respuestaIntento.deleteMany()
  await prisma.intentoExamen.deleteMany()
  await prisma.opcionPregunta.deleteMany()
  await prisma.pregunta.deleteMany()
  await prisma.examen.deleteMany()

  // 3. Contenidos, lecciones y módulos
  await prisma.contenidoLeccion.deleteMany()
  await prisma.leccion.deleteMany()
  await prisma.modulo.deleteMany()

  // 4. Inscripciones y pedidos
  await prisma.inscripcion.deleteMany()
  await prisma.detallePedido.deleteMany()
  await prisma.pedido.deleteMany()

  // 5. Relaciones de cursos en rutas, planes y cupones
  await prisma.cuponCurso.deleteMany()
  await prisma.cursoEnRuta.deleteMany()
  await prisma.cursoEnPlan.deleteMany()

  // 6. Eliminar todos los cursos
  await prisma.curso.deleteMany()

  console.log('✅ Catálogo de cursos, inscripciones y pedidos limpiados con éxito.')

  // 1. Obtener o crear administrador como encargado por defecto
  let admin = await prisma.usuario.findFirst({
    where: { rol: Rol.ADMIN }
  })

  if (!admin) {
    const passwordHash = await bcrypt.hash('Admin123@', 10)
    admin = await prisma.usuario.create({
      data: {
        correo: 'admin@instituto.edu.pe',
        contrasena: passwordHash,
        nombre: 'Administrador',
        apellido: 'Sistema',
        numero_documento: '00000001',
        celular: '900000001',
        rol: Rol.ADMIN,
        esta_activo: true
      }
    })
    console.log('✅ Administrador creado como encargado:', admin.correo)
  } else {
    console.log('✅ Usando administrador existente como encargado:', admin.nombre, admin.apellido, `(${admin.correo})`)
  }

  const adminId = admin.id

  // 2. Categorías
  const catGRD = await prisma.categoria.upsert({
    where: { slug: 'gestion-del-riesgo-de-desastres' },
    update: {
      nombre: 'Gestión del Riesgo de Desastres',
      descripcion: 'Programas y diplomados en SINAGERD, evaluación, prevención y resiliencia territorial'
    },
    create: {
      nombre: 'Gestión del Riesgo de Desastres',
      slug: 'gestion-del-riesgo-de-desastres',
      descripcion: 'Programas y diplomados en SINAGERD, evaluación, prevención y resiliencia territorial',
      esta_activo: true,
      orden: 3
    }
  })

  const catSST = await prisma.categoria.upsert({
    where: { slug: 'seguridad-y-salud-en-el-trabajo' },
    update: {
      nombre: 'Seguridad y Salud en el Trabajo',
      descripcion: 'Programas y diplomados en compliance de SST, IPERC, ergonomía y auditoría ISO 45001'
    },
    create: {
      nombre: 'Seguridad y Salud en el Trabajo',
      slug: 'seguridad-y-salud-en-el-trabajo',
      descripcion: 'Programas y diplomados en compliance de SST, IPERC, ergonomía y auditoría ISO 45001',
      esta_activo: true,
      orden: 4
    }
  })

  const catINPE = await prisma.categoria.upsert({
    where: { slug: 'inpe' },
    update: {
      nombre: 'INPE',
      descripcion: 'Cursos y programas especializados en seguridad, custodia y tratamiento penitenciario'
    },
    create: {
      nombre: 'INPE',
      slug: 'inpe',
      descripcion: 'Cursos y programas especializados en seguridad, custodia y tratamiento penitenciario',
      esta_activo: true,
      orden: 5
    }
  })

  console.log('✅ Categorías verificadas/creadas: GRD, SST, INPE')

  // Helper para crear o sincronizar curso con módulos y lecciones de forma limpia
  async function upsertCursoCompleto(data: {
    slug: string
    codigo: string
    titulo: string
    descripcion: string
    miniatura?: string
    duracion: string
    precio: number
    precio_falso: number
    tipo: TipoCurso
    nivel: NivelCurso
    categoria_id: string
    objetivos: string[]
    beneficios: string[]
    incluye: string[]
    metodologia: string[]
    modulos: {
      titulo: string
      orden: number
      descripcion?: string
      lecciones: {
        titulo: string
        orden: number
        duracion: number
        es_vista_previa?: boolean
        video_url?: string
        recursos?: any
      }[]
    }[]
  }) {
    const { modulos, ...cursoData } = data

    const cursoExistente = await prisma.curso.findUnique({
      where: { slug: data.slug },
      select: { id: true }
    })

    let cursoId: string

    if (cursoExistente) {
      cursoId = cursoExistente.id
      await prisma.curso.update({
        where: { id: cursoId },
        data: {
          titulo: cursoData.titulo,
          codigo: cursoData.codigo,
          descripcion: cursoData.descripcion,
          miniatura: cursoData.miniatura || DEFAULT_MINIATURA,
          duracion: cursoData.duracion,
          precio: cursoData.precio,
          precio_falso: cursoData.precio_falso,
          tipo: cursoData.tipo,
          nivel: cursoData.nivel,
          profesor_id: adminId,
          categoria_id: cursoData.categoria_id,
          objetivos: cursoData.objetivos,
          beneficios: cursoData.beneficios,
          incluye: cursoData.incluye,
          metodologia: cursoData.metodologia,
          tipo_emision: TipoEmision.ASINCRONO,
          estado: EstadoCurso.PUBLICADO
        }
      })
      // Limpiar módulos existentes para sincronización limpia
      await prisma.modulo.deleteMany({
        where: { curso_id: cursoId }
      })
    } else {
      const nuevoCurso = await prisma.curso.create({
        data: {
          ...cursoData,
          profesor_id: adminId,
          tipo_emision: TipoEmision.ASINCRONO,
          estado: EstadoCurso.PUBLICADO
        }
      })
      cursoId = nuevoCurso.id
    }

    // Crear módulos y lecciones
    for (const mod of modulos) {
      await prisma.modulo.create({
        data: {
          curso_id: cursoId,
          titulo: mod.titulo,
          descripcion: mod.descripcion || null,
          orden: mod.orden,
          lecciones: {
            create: mod.lecciones.map(lec => ({
              titulo: lec.titulo,
              orden: lec.orden,
              duracion: lec.duracion,
              es_vista_previa: lec.es_vista_previa || false,
              video_url: lec.video_url || 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
              recursos: lec.recursos || [],
              estado: EstadoLeccion.PUBLICADO
            }))
          }
        }
      })
    }

    console.log(`✅ [${data.tipo}] ${data.titulo} sembrado con éxito (${modulos.length} módulos).`)
  }

  // ─── 1. DIPLOMADO EN GESTIÓN ESTRATÉGICA DEL RIESGO DE DESASTRES ─────────────
  await upsertCursoCompleto({
    slug: 'diplomado-gestion-estrategica-del-riesgo-de-desastres',
    codigo: 'GRD-DIP',
    titulo: 'DIPLOMADO EN GESTIÓN ESTRATÉGICA DEL RIESGO DE DESASTRES',
    descripcion:
      'Programa de alta especialización enfocado en la gobernanza, evaluación, prevención, reducción y respuesta estratégica ante el riesgo de desastres en el marco del SINAGERD, los lineamientos de CENEPRED e INDECI y la resiliencia territorial.',
    miniatura: DEFAULT_MINIATURA,
    duracion: '24 Créditos (384 horas)',
    precio: 850.0,
    precio_falso: 1200.0,
    tipo: TipoCurso.DIPLOMADO,
    nivel: NivelCurso.AVANZADO,
    categoria_id: catGRD.id,
    objetivos: [
      'Dominar el marco normativo, institucional y sancionador del SINAGERD en el Perú.',
      'Aplicar la metodología del CENEPRED para la Evaluación del Riesgo de Desastres (EVAR).',
      'Formular e implementar Planes de Prevención y Reducción del Riesgo de Desastres (PPRRD).',
      'Articular la GRD con el presupuesto público (PP 0068) y el Sistema Invierte.pe.',
      'Gestionar la respuesta, logística humanitaria y planes de continuidad operativa.'
    ],
    beneficios: [
      'Certificación Universitaria Oficial por 24 Créditos académicos (384 horas pedagógicas).',
      'Plantillas editables de informes EVAR, matrices de Saaty y planes de contingencia.',
      'Acceso vitalicio a las grabaciones en alta definición y materiales de lectura.',
      'Tutoría personalizada para la sustentación del Proyecto Integrador.'
    ],
    incluye: [
      '8 módulos de especialización avanzada',
      '32 sesiones estructuradas con material descargable',
      'Casos prácticos de municipalidades y gobiernos regionales',
      'Certificado digital con código QR de verificación'
    ],
    metodologia: [
      'Metodología 100% interactiva y aplicada a la realidad nacional',
      'Análisis de casos reales de emergencias y desastres en el Perú',
      'Desarrollo progresivo de un Proyecto Integrador de Gestión del Riesgo'
    ],
    modulos: [
      {
        titulo: 'GRD-01: Gobernanza, Derecho y SINAGERD',
        orden: 0,
        descripcion: 'Marco institucional, político y legal del Sistema Nacional de Gestión del Riesgo de Desastres.',
        lecciones: [
          {
            titulo: 'Marco institucional del SINAGERD: Roles de CENEPRED, INDECI y Gobiernos Subnacionales',
            orden: 0,
            duracion: 30,
            es_vista_previa: true,
            recursos: materialDescargable('mat-grd-1', 'Guía y Ley del SINAGERD N° 29664')
          },
          {
            titulo: 'Política Nacional de Gestión del Riesgo de Desastres al 2050',
            orden: 1,
            duracion: 25
          },
          {
            titulo: 'Responsabilidad administrativa, civil y penal de funcionarios públicos en GRD',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Instrumentos de articulación y gobernanza interinstitucional',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'GRD-02: Ciencia del Riesgo, Peligros y Análisis Territorial',
        orden: 1,
        descripcion: 'Identificación de peligros de origen natural e inducidos por la acción humana y análisis espacial.',
        lecciones: [
          {
            titulo: 'Fenomenología de peligros: Sismos, tsunamis, inundaciones y movimientos en masa',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-2', 'Manual de Geología y Fenómenos Naturales')
          },
          {
            titulo: 'Sistemas de Información Geográfica (SIG) aplicados a la identificación de peligros',
            orden: 1,
            duracion: 35
          },
          {
            titulo: 'Zonificación territorial y análisis de vulnerabilidad física, social y económica',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Elaboración de cartografía temática y modelamiento de escenarios de impacto',
            orden: 3,
            duracion: 30
          }
        ]
      },
      {
        titulo: 'GRD-03: Estimación, Evaluación y Modelamiento del Riesgo',
        orden: 2,
        descripcion: 'Metodología oficial del CENEPRED para la elaboración de informes EVAR.',
        lecciones: [
          {
            titulo: 'Metodología y manual oficial del CENEPRED para la Evaluación del Riesgo (EVAR)',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-3', 'Manual para la Evaluación de Riesgos - CENEPRED')
          },
          {
            titulo: 'Proceso de Análisis Jerárquico (AHP - Saaty) aplicado a matrices de riesgo',
            orden: 1,
            duracion: 35
          },
          {
            titulo: 'Cálculo de niveles de riesgo y zonificación de áreas no mitigables',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Estructura y sustentación técnica del informe de Evaluación del Riesgo',
            orden: 3,
            duracion: 30
          }
        ]
      },
      {
        titulo: 'GRD-04: Prevención, Reducción y Resiliencia Territorial',
        orden: 3,
        descripcion: 'Formulación e implementación de planes PPRRD y medidas estructurales y no estructurales.',
        lecciones: [
          {
            titulo: 'Guía metodológica para la elaboración del Plan de Prevención y Reducción del Riesgo (PPRRD)',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-4', 'Guía para la elaboración de PPRRD')
          },
          {
            titulo: 'Medidas estructurales: Obras de control de inundaciones, defensas y estabilización',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Medidas no estructurales: Control urbano, reasentamiento poblacional y normativas',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Infraestructura resiliente y soluciones basadas en la naturaleza (SbN)',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'GRD-05: Planeamiento, Presupuesto, Inversión y Financiamiento',
        orden: 4,
        descripcion: 'Gestión presupuestal, articulación con Invierte.pe y fondos de contingencia.',
        lecciones: [
          {
            titulo: 'El Programa Presupuestal 0068 (PP 0068 - Reducción de la Vulnerabilidad y Emergencias)',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-5', 'Estructura Funcional del PP 0068')
          },
          {
            titulo: 'Incorporación de la GRD en las fases del Sistema Invierte.pe',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Fondo Para Intervenciones ante la Ocurrencia de Desastres Naturales (FONDES)',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Mecanismos financieros de transferencia y retención del riesgo',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'GRD-06: Preparación, Respuesta, Rehabilitación y Continuidad Operativa',
        orden: 5,
        descripcion: 'Operatividad de los Centros de Operaciones de Emergencia (COE) y Sistema de Comando de Incidentes.',
        lecciones: [
          {
            titulo: 'Organización, funciones y protocolos del Centro de Operaciones de Emergencia (COE)',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-6', 'Manual de Operaciones del COE e INDECI')
          },
          {
            titulo: 'Evaluación de Daños y Análisis de Necesidades (EDAN - Perú) y sistema SINPAD',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Sistema de Comando de Incidentes (SCI) y cadena logística humanitaria',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Planes de Continuidad Operativa (PCO) para instituciones públicas y privadas',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'GRD-07: Cambio Climático, Infraestructura Crítica y Riesgos Emergentes',
        orden: 6,
        descripcion: 'Impactos del cambio climático, infraestructuras estratégicas y sistemas de alerta temprana.',
        lecciones: [
          {
            titulo: 'Adaptación al Cambio Climático y metas de las NDC en el marco de la GRD',
            orden: 0,
            duracion: 25,
            recursos: materialDescargable('mat-grd-7', 'Compendio de Cambio Climático y Gestión del Riesgo')
          },
          {
            titulo: 'Evaluación de la resiliencia y protección de infraestructuras críticas',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Riesgos tecnológicos, biológicos y socio-ambientales emergentes',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Diseño e implementación de Sistemas de Alerta Temprana (SAT)',
            orden: 3,
            duracion: 30
          }
        ]
      },
      {
        titulo: 'GRD-08: Dirección Estratégica, Simulación y Proyecto Integrador',
        orden: 7,
        descripcion: 'Liderazgo en situaciones de crisis, diseño de simulaciones y formulación del proyecto final.',
        lecciones: [
          {
            titulo: 'Liderazgo estratégico y toma de decisiones en contextos de crisis',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-grd-8', 'Guía para el Proyecto Integrador de GRD')
          },
          {
            titulo: 'Metodología para el diseño y conducción de simulaciones y simulacros',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Estructura y lineamientos del Proyecto Integrador de GRD',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Taller de sustentación, revisión y retroalimentación del Proyecto Final',
            orden: 3,
            duracion: 35
          }
        ]
      }
    ]
  })

  // ─── 2. DIPLOMADO EN GESTIÓN ESTRATÉGICA DE LA SEGURIDAD Y SALUD EN EL TRABAJO ─────────
  await upsertCursoCompleto({
    slug: 'diplomado-gestion-estrategica-seguridad-salud-trabajo',
    codigo: 'SST-DIP',
    titulo: 'DIPLOMADO EN GESTIÓN ESTRATÉGICA DE LA SEGURIDAD Y SALUD EN EL TRABAJO',
    descripcion:
      'Diplomado de alto nivel profesional orientado a la planificación, implementación, control y auditoría de Sistemas de Gestión de SST bajo la Ley 29783, reglamentos sectoriales, fiscalización SUNAFIL y la norma internacional ISO 45001:2018.',
    miniatura: DEFAULT_MINIATURA,
    duracion: '24 Créditos (384 horas)',
    precio: 850.0,
    precio_falso: 1200.0,
    tipo: TipoCurso.DIPLOMADO,
    nivel: NivelCurso.AVANZADO,
    categoria_id: catSST.id,
    objetivos: [
      'Dominar el marco legal peruano de SST (Ley 29783 y normas sectoriales) y los criterios inspectivos de SUNAFIL.',
      'Diseñar y desplegar un Sistema de Gestión de SST integrado con la norma ISO 45001:2018.',
      'Elaborar matrices IPERC por procesos, PETS, PETAR y protocolos para trabajos de alto riesgo.',
      'Implementar programas de vigilancia de la salud, ergonomía y monitoreos de agentes ocupacionales.',
      'Liderar auditorías internas, investigaciones de accidentes bajo métodos internacionales y planes de mejora continua.'
    ],
    beneficios: [
      'Certificación Universitaria Oficial por 24 Créditos académicos (384 horas pedagógicas).',
      'Formatos editables en Excel y Word: Matrices IPERC, RISST, PETS, PETAR y registros obligatorios.',
      'Casos reales resueltos de inspecciones y requerimientos de SUNAFIL.',
      'Asesoría técnica continua durante todo el programa de formación.'
    ],
    incluye: [
      '8 módulos de especialización integral en SST',
      '32 sesiones paso a paso con talleres prácticos',
      'Banco de plantillas y modelos documentarios del SGSST',
      'Certificado con código único de validación'
    ],
    metodologia: [
      'Enfoque teórico-práctico orientado al cumplimiento normativo y preventivo',
      'Talleres vivenciales de simulación de fiscalización laboral y auditoría ISO 45001',
      'Elaboración de herramientas de aplicación inmediata en organizaciones'
    ],
    modulos: [
      {
        titulo: 'SST-01: Marco Jurídico y Compliance de SST en el Perú',
        orden: 0,
        descripcion: 'Normativa nacional de SST, reglamentos sectoriales, responsabilidades y fiscalización laboral.',
        lecciones: [
          {
            titulo: 'Ley 29783, D.S. 005-2012-TR y normativas sectoriales (Minería, Construcción, Industria, Electricidad)',
            orden: 0,
            duracion: 30,
            es_vista_previa: true,
            recursos: materialDescargable('mat-sst-1', 'Compendio Normativo de SST en el Perú')
          },
          {
            titulo: 'Responsabilidad civil, penal y administrativa de la alta dirección y supervisores de SST',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Procedimiento inspectivo de SUNAFIL: Protocolos, infracciones y sanciones',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Implementación del programa de Compliance y debida diligencia en SST',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'SST-02: Sistema de Gestión de SST y Liderazgo Preventivo',
        orden: 1,
        descripcion: 'Estructura del SGSST bajo el ciclo PHVA y la norma ISO 45001:2018.',
        lecciones: [
          {
            titulo: 'Requisitos clave de la norma ISO 45001:2018 y su alineamiento con la Ley 29783',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-sst-2', 'Plantilla del Manual del SGSST e ISO 45001')
          },
          {
            titulo: 'Política, objetivos, liderazgo visible y cultura de seguridad en la empresa',
            orden: 1,
            duracion: 25
          },
          {
            titulo: 'Elección, conformación, funcionamiento y facultades del Comité y Supervisor de SST',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Elaboración del Reglamento Interno (RISST) y los 8 registros obligatorios del MTPE',
            orden: 3,
            duracion: 35
          }
        ]
      },
      {
        titulo: 'SST-03: IPERC y Gestión Integral de Riesgos',
        orden: 2,
        descripcion: 'Metodologías de identificación de peligros, evaluación de riesgos y jerarquía de controles.',
        lecciones: [
          {
            titulo: 'Fundamentos, tipos y métodos para la elaboración de la matriz IPERC (Línea Base, Continuo, Específico)',
            orden: 0,
            duracion: 35,
            recursos: materialDescargable('mat-sst-3', 'Plantilla Excel de Matriz IPERC por Puestos de Trabajo')
          },
          {
            titulo: 'Aplicación estricta de la Jerarquía de Controles Operacionales',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Elaboración de Estándares y Procedimientos Escritos de Trabajo Seguro (PETS)',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Análisis de Trabajo Seguro (ATS) y gestión del cambio en las operaciones',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'SST-04: Higiene, Salud Ocupacional y Vigilancia de la Salud',
        orden: 3,
        descripcion: 'Monitoreo de agentes ocupacionales, exámenes médicos y vigilancia médico-ocupacional.',
        lecciones: [
          {
            titulo: 'Monitoreo de agentes físicos, químicos, biológicos y psicosociales en el trabajo',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-sst-4', 'Guía de Monitoreos de Higiene Ocupacional')
          },
          {
            titulo: 'Protocolos de Exámenes Médicos Ocupacionales (EMO) según R.M. 312-2011-MINSA',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Diseño e implementación del Programa Anual de Vigilancia de la Salud de los Trabajadores',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Toxicología laboral y prevención de enfermedades profesionales',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'SST-05: Gestión de Riesgos Críticos y Seguridad Operacional',
        orden: 4,
        descripcion: 'Protocolos y estándares de alto riesgo: Altura, confinados, caliente, eléctrico e izajes.',
        lecciones: [
          {
            titulo: 'Trabajos en altura y espacios confinados: Estándares, equipos de protección y rescate',
            orden: 0,
            duracion: 35,
            recursos: materialDescargable('mat-sst-5', 'Formatos de Permisos PETAR para Trabajos Críticos')
          },
          {
            titulo: 'Seguridad eléctrica y sistema de bloqueo y etiquetado (LOTO / Lockout-Tagout)',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Gestión segura de materiales peligrosos (MATPEL / HazMat) y hojas SDS',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Operaciones de izaje crítico, maquinaria pesada y recipientes a presión',
            orden: 3,
            duracion: 30
          }
        ]
      },
      {
        titulo: 'SST-06: Ergonomía, Factor Humano y Riesgos Psicosociales',
        orden: 5,
        descripcion: 'Norma básica de ergonomía R.M. 375-2008-TR, métodos de evaluación postural y factores psicosociales.',
        lecciones: [
          {
            titulo: 'Norma Básica de Ergonomía R.M. 375-2008-TR y evaluación de puestos laborales',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-sst-6', 'Plantilla de Evaluación Ergonómica RULA y REBA')
          },
          {
            titulo: 'Métodos de evaluación ergonómica postural: RULA, REBA, OWAS y Ecuación NIOSH',
            orden: 1,
            duracion: 35
          },
          {
            titulo: 'Identificación y evaluación de factores de riesgo psicosocial (Método SUSESO / ISTAS 21)',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Programas de pausas activas, ergonomía de oficina y bienestar laboral',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'SST-07: Investigación de Accidentes, Emergencias y Continuidad',
        orden: 6,
        descripcion: 'Metodologías de análisis causal de accidentes, planes de contingencia y reporte oficial.',
        lecciones: [
          {
            titulo: 'Metodologías de investigación de accidentes: Árbol de Causas, 5 Porqués, ICAM y SCAT',
            orden: 0,
            duracion: 35,
            recursos: materialDescargable('mat-sst-7', 'Formato de Informe de Investigación de Accidentes')
          },
          {
            titulo: 'Reporte y notificación obligatoria de accidentes mortales e incidentes peligrosos (SAT / MTPE)',
            orden: 1,
            duracion: 25
          },
          {
            titulo: 'Plan de Preparación y Respuesta ante Emergencias: Conformación de brigadas y simulacros',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Primeros auxilios laborales y planes de contingencia para la continuidad operativa',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'SST-08: Auditoría, Fiscalización y Mejora del SGSST',
        orden: 7,
        descripcion: 'Proceso de auditorías obligatorias del MTPE, directrices ISO 19011 e indicadores de desempeño.',
        lecciones: [
          {
            titulo: 'Auditorías del SGSST según D.S. 014-2013-TR y directrices de la norma ISO 19011:2018',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-sst-8', 'Checklist de Auditoría del SGSST')
          },
          {
            titulo: 'Indicadores reactivos y proactivos de desempeño en seguridad y salud ocupacional (KPIs)',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Tratamiento de No Conformidades, análisis de causa raíz y planes de acción correctiva',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Revisión por la Dirección y formulación del Plan Anual de Mejora Continua',
            orden: 3,
            duracion: 30
          }
        ]
      }
    ]
  })

  // ─── 3. CATEGORÍA INPE: CURSO DE SEGURIDAD INTEGRAL EN EL ÁMBITO PENITENCIARIO ────────
  await upsertCursoCompleto({
    slug: 'curso-seguridad-integral-ambito-penitenciario',
    codigo: 'INPE-SIP',
    titulo: 'CURSO DE SEGURIDAD INTEGRAL EN EL ÁMBITO PENITENCIARIO',
    descripcion:
      'Curso integral dirigido a personal penitenciario, fuerzas del orden y profesionales de la seguridad, enfocado en procedimientos operativos de seguridad carcelaria, control perimétrico e interno, inteligencia penitenciaria, gestión de crisis y respeto a los Derechos Humanos.',
    miniatura: DEFAULT_MINIATURA,
    duracion: '60 horas pedagógicas',
    precio: 199.0,
    precio_falso: 299.0,
    tipo: TipoCurso.CURSO,
    nivel: NivelCurso.INTERMEDIO,
    categoria_id: catINPE.id,
    objetivos: [
      'Aplicar la doctrina y los protocolos oficiales de seguridad interna, perimétrica y externa en penales.',
      'Ejecutar procedimientos de revisión, inspección corporal y operativos de requisa ordinaria y extraordinaria.',
      'Desarrollar capacidades de inteligencia y contrainteligencia penitenciaria para la detección de amenazas.',
      'Gestionar motines, tomas de rehenes, evasiones y situaciones de crisis respetando el uso progresivo de la fuerza y las Reglas Nelson Mandela.'
    ],
    beneficios: [
      'Certificado de aprobación con valor oficial de 60 horas académicas.',
      'Manuales operativos y directivas vigentes de seguridad penitenciaria en formato digital.',
      'Análisis de casos reales de intervenciones y resolución de contingencias penitenciarias.',
      'Acceso flexible desde cualquier dispositivo y soporte académico continuo.'
    ],
    incluye: [
      '4 módulos especializados en seguridad penitenciaria',
      '16 lecciones en video con explicaciones paso a paso',
      'Protocolos y directivas de seguridad descargables',
      'Evaluación final con emisión automática de certificado'
    ],
    metodologia: [
      'Metodología práctica orientada a la doctrina operativa y seguridad carcelaria',
      'Simulación de procedimientos de control de accesos, requisas y respuesta táctica',
      'Estudio de casos críticos y análisis jurisprudencial en derechos humanos'
    ],
    modulos: [
      {
        titulo: 'Módulo 1: Marco Normativo, Derechos Humanos y Doctrina Penitenciaria',
        orden: 0,
        descripcion: 'Fundamentos jurídicos de la seguridad penitenciaria y estándares internacionales.',
        lecciones: [
          {
            titulo: 'Código de Ejecución Penal, su Reglamento y estructura organizativa del INPE',
            orden: 0,
            duracion: 25,
            es_vista_previa: true,
            recursos: materialDescargable('mat-inpe-1', 'Código de Ejecución Penal y Normativa del INPE')
          },
          {
            titulo: 'Estándares internacionales y Reglas Mínimas de las Naciones Unidas (Reglas Nelson Mandela)',
            orden: 1,
            duracion: 25
          },
          {
            titulo: 'Principios y protocolos del uso progresivo y diferenciado de la fuerza en recintos penales',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Deontología penitenciaria, integridad funcional y prevención de actos de corrupción',
            orden: 3,
            duracion: 20
          }
        ]
      },
      {
        titulo: 'Módulo 2: Seguridad Tecnológica, Control de Accesos y Requisas',
        orden: 1,
        descripcion: 'Procedimientos de seguridad perimétrica, inspección y operativos de interdicción.',
        lecciones: [
          {
            titulo: 'Procedimientos de control de ingresos, revisión corporal, de visitas y paquetes',
            orden: 0,
            duracion: 25,
            recursos: materialDescargable('mat-inpe-2', 'Manual de Procedimientos de Revisión e Inspección')
          },
          {
            titulo: 'Uso de tecnologías de seguridad: Escáneres de rayos X, arcos detectores y videovigilancia CCTV',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Planificación, despliegue y ejecución de operativos de requisa ordinaria y extraordinaria',
            orden: 2,
            duracion: 30
          },
          {
            titulo: 'Cadena de custodia y tratamiento legal de armas, sustancias y objetos prohibidos hallados',
            orden: 3,
            duracion: 25
          }
        ]
      },
      {
        titulo: 'Módulo 3: Inteligencia Penitenciaria y Prevención de Riesgos',
        orden: 2,
        descripcion: 'Recolección y análisis de información sensible para neutralizar amenazas internas y externas.',
        lecciones: [
          {
            titulo: 'Fundamentos de inteligencia estratégica y operativa en el entorno penitenciario',
            orden: 0,
            duracion: 25,
            recursos: materialDescargable('mat-inpe-3', 'Guía de Inteligencia Penitenciaria Preventiva')
          },
          {
            titulo: 'Clasificación de internos, perfiles criminológicos y bandas delictivas al interior del penal',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Detección temprana de conspiraciones, vulneración de cercos y planes de fuga',
            orden: 2,
            duracion: 25
          },
          {
            titulo: 'Seguridad en conducción y traslado de internos de mediana y máxima peligrosidad',
            orden: 3,
            duracion: 30
          }
        ]
      },
      {
        titulo: 'Módulo 4: Gestión de Crisis, Motines y Respuesta ante Emergencias',
        orden: 3,
        descripcion: 'Planes de contingencia, tácticas de contención y resolución de motines y emergencias.',
        lecciones: [
          {
            titulo: 'Plan de Seguridad y Contingencia ante motines, incendios, sismos y emergencias sanitarias',
            orden: 0,
            duracion: 30,
            recursos: materialDescargable('mat-inpe-4', 'Plan General de Contingencia Penitenciaria')
          },
          {
            titulo: 'Técnicas de negociación, mediación y resolución no violenta en tomas de rehenes',
            orden: 1,
            duracion: 30
          },
          {
            titulo: 'Tácticas de intervención antimotines, aislamiento y restablecimiento del control penal',
            orden: 2,
            duracion: 35
          },
          {
            titulo: 'Evaluación post-incidente, elaboración de informes técnicos e investigaciones disciplinarias',
            orden: 3,
            duracion: 25
          }
        ]
      }
    ]
  })

  console.log('🎉 Seed de diplomados y curso INPE completado exitosamente.')
}

main()
  .catch(e => {
    console.error('❌ Error ejecutando el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
