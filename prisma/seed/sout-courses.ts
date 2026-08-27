import { PrismaClient, Rol, NivelCurso, EstadoCurso, TipoEmision, TipoCurso } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de cursos SOUT Training Center...')

  // ─── USUARIOS / INSTRUCTORES ──────────────────────────────────────────────────
  let instructor = await prisma.usuario.findFirst({
    where: { rol: { in: [Rol.PROFESOR, Rol.ADMIN] } }
  })

  if (!instructor) {
    const instructorPassword = await bcrypt.hash('Profesor123!', 10)
    instructor = await prisma.usuario.upsert({
      where: { correo: 'profesor@gmail.com' },
      update: {},
      create: {
        correo: 'profesor@gmail.com',
        contrasena: instructorPassword,
        nombre: 'Instructor',
        apellido: 'Certificado NSC',
        numero_documento: '77959001',
        celular: '977959001',
        rol: Rol.PROFESOR,
        esta_activo: true
      }
    })
  }

  console.log(`✅ Instructor asignado: ${instructor.nombre} ${instructor.apellido} (${instructor.correo})`)

  // ─── CATEGORÍAS ──────────────────────────────────────────────────────────────
  const catSeguridadVial = await prisma.categoria.upsert({
    where: { slug: 'seguridad-vial-manejo-defensivo' },
    update: {},
    create: {
      nombre: 'Manejo Defensivo y Seguridad Vial',
      slug: 'seguridad-vial-manejo-defensivo',
      descripcion: 'Programas de manejo defensivo certificados por el National Safety Council (NSC USA) y seguridad en ruta',
      esta_activo: true,
      orden: 1
    }
  })

  const catMineria = await prisma.categoria.upsert({
    where: { slug: 'operaciones-mineras-4x4' },
    update: {},
    create: {
      nombre: 'Operaciones Mineras y Conducción 4x4',
      slug: 'operaciones-mineras-4x4',
      descripcion: 'Entrenamiento especializado en conducción 4x4 en interior mina, superficie y terrenos difíciles',
      esta_activo: true,
      orden: 2
    }
  })

  const catSST = await prisma.categoria.upsert({
    where: { slug: 'seguridad-salud-ocupacional' },
    update: {},
    create: {
      nombre: 'Seguridad y Salud en el Trabajo (SST)',
      slug: 'seguridad-salud-ocupacional',
      descripcion: 'Cursos de primeros auxilios RCP/DEA, lucha contra incendios y materiales peligrosos MATPEL',
      esta_activo: true,
      orden: 3
    }
  })

  const catMaquinaria = await prisma.categoria.upsert({
    where: { slug: 'operacion-maquinaria-equipos' },
    update: {},
    create: {
      nombre: 'Operación de Maquinaria y Equipos Especiales',
      slug: 'operacion-maquinaria-equipos',
      descripcion: 'Formación y certificación de operadores de montacargas, cuatrimotos y evaluación de competencias',
      esta_activo: true,
      orden: 4
    }
  })

  console.log('✅ Categorías creadas')

  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  const opcionesPregunta = (correcta: number, textos: string[]) =>
    textos.map((texto, i) => ({ texto, es_correcta: i === correcta, orden: i }))

  const materialDescargable = (id: string, nombre: string) => [
    { id, nombre, url: '/uploads/cursos/plataforma-educativa.pdf', tipo: 'archivo' }
  ]

  // ─── 13 CURSOS SOUT TRAINING CENTER ──────────────────────────────────────────

  // 1. Manejo Defensivo NSC 6-8 Horas
  await prisma.curso.upsert({
    where: { slug: 'manejo-defensivo-nsc-6-8-horas' },
    update: {},
    create: {
      titulo: 'Manejo Defensivo NSC 6-8 Horas',
      slug: 'manejo-defensivo-nsc-6-8-horas',
      codigo: 'SOUT-MD-01',
      descripcion: 'Programa certificado por el National Safety Council de Estados Unidos. Basado en investigación, multimedia e interactivo. Flexible en duraciones de 4, 6 u 8 horas.',
      miniatura: '/uploads/cursos/curso1.jpeg',
      duracion: '6-8 horas',
      tipo_emision: TipoEmision.MIXTO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.INTERMEDIO,
      tipo: TipoCurso.CURSO,
      precio: 180.00,
      precio_falso: 250.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSeguridadVial.id,
      objetivos: [
        'Identificar peligros en la vía y anticipar maniobras de riesgo',
        'Aplicar la fórmula de prevención de accidentes del NSC',
        'Dominar técnicas de control del vehículo bajo condiciones adversas'
      ],
      beneficios: [
        'Certificación Oficial NSC USA',
        'Material multimedia interactivo',
        'Validez nacional para minería e industria'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Principios y Filosofía del Manejo Defensivo',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Introducción al concepto de Manejo Defensivo NSC',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('md1-mat1', 'Manual del Conductor Defensivo NSC')
                },
                {
                  titulo: 'Fórmula de prevención de accidentes: Reconocer, Entender y Actuar',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Módulo 2: Condiciones Adversas y Control de Riesgos',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Distancia de seguimiento y reglas de los segundos',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Conducción en clima adverso, lluvia y niebla',
                  orden: 1,
                  duracion: 35,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Manejo Defensivo NSC',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cuál es la regla básica de los tres pasos del Manejo Defensivo NSC?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Reconocer el peligro, entender la defensa y actuar a tiempo',
                      'Acelerar, frenar bruscamente y maniobrar',
                      'Ver el espejo, tocar la bocina y continuar',
                      'Esperar la señal del semáforo y avanzar'
                    ])
                  }
                },
                {
                  texto: '¿Cuál es la distancia mínima de seguimiento recomendada en segundos para condiciones normales?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(1, [
                      '1 segundo',
                      '3 a 4 segundos',
                      '10 segundos',
                      '0.5 segundos'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 2. Manejo Defensivo PTD 5ta Edición
  await prisma.curso.upsert({
    where: { slug: 'manejo-defensivo-ptd-5ta-edicion' },
    update: {},
    create: {
      titulo: 'Manejo Defensivo PTD 5ta Edición',
      slug: 'manejo-defensivo-ptd-5ta-edicion',
      codigo: 'SOUT-MD-02',
      descripcion: 'Para conductores profesionales de camiones y buses. Reduce fatalidades significativamente con técnicas probadas de manejo defensivo.',
      miniatura: '/uploads/cursos/defensivo.jpeg',
      duracion: '8 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.AVANZADO,
      tipo: TipoCurso.CURSO,
      precio: 220.00,
      precio_falso: 300.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSeguridadVial.id,
      objetivos: [
        'Dominar la dinámica y puntos ciegos de vehículos pesados y buses',
        'Prevenir volcaduras y colisiones por alcance en transporte pesado',
        'Gestionar la fatiga en rutas de larga distancia'
      ],
      beneficios: [
        'Certificación NSC USA Professional Truck Driver (PTD)',
        'Guías operativas para transporte de carga y pasajeros',
        'Homologación para empresas de transporte'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Dinámica del Vehículo Pesado',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Puntos ciegos y zonas de no visión en camiones y buses',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('ptd-mat1', 'Guía de Puntos Ciegos PTD')
                },
                {
                  titulo: 'Distancia de frenado y transferencia de pesos',
                  orden: 1,
                  duracion: 35,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Manejo Defensivo PTD',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Por qué la distancia de parada de un camión cargado es significativamente mayor?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Por el peso, inercia y tiempo de respuesta del sistema neumático de frenos',
                      'Por el tamaño de los espejos laterales',
                      'Porque tiene más ruedas de apoyo',
                      'Por la altura de la cabina del conductor'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 3. Manejo Defensivo NSC y Uso de 4x4
  await prisma.curso.upsert({
    where: { slug: 'manejo-defensivo-nsc-y-uso-de-4x4' },
    update: {},
    create: {
      titulo: 'Manejo Defensivo NSC y Uso de 4x4',
      slug: 'manejo-defensivo-nsc-y-uso-de-4x4',
      codigo: 'SOUT-4X4-01',
      descripcion: '10ma Edición para minería, petróleo e industria. Técnicas de conducción off-road, terrenos difíciles y condiciones extremas.',
      miniatura: '/uploads/cursos/carro.jpeg',
      duracion: '16 horas',
      tipo_emision: TipoEmision.MIXTO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.INTERMEDIO,
      tipo: TipoCurso.CURSO,
      precio: 290.00,
      precio_falso: 380.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catMineria.id,
      objetivos: [
        'Comprender el funcionamiento de la tracción 4x4 (4H, 4L, Bloqueo de Diferencial)',
        'Aplicar técnicas de ascenso, descenso y vadeo seguro en terrenos agrestes',
        'Manejar situaciones de rescate y autorrescate básico'
      ],
      beneficios: [
        'Doble Certificación NSC USA y SOUT Training Center',
        'Práctica en circuitos con pendientes y curvas cerradas',
        'Válido para ingreso a operaciones mineras'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Sistemas de Tracción 4x4',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Principios de tracción integral: 2H, 4H, 4L y diferenciales',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('4x4-mat1', 'Manual Técnico Conducción 4x4')
                },
                {
                  titulo: 'Técnicas de ascenso y descenso en pendientes pronunciadas',
                  orden: 1,
                  duracion: 40,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Manejo 4x4 y Terrenos Difíciles',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿En qué situación se debe activar la tracción 4L (Low / Reductora)?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'En pendientes pronunciadas, barro profundo, rocas y situaciones que requieren máximo torque y baja velocidad',
                      'En carreteras asfaltadas a alta velocidad',
                      'Únicamente para estacionar en reversa',
                      'Cuando el vehículo se queda sin combustible'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 4. Primeros Auxilios - RCP - DEA
  await prisma.curso.upsert({
    where: { slug: 'primeros-auxilios-rcp-dea' },
    update: {},
    create: {
      titulo: 'Primeros Auxilios - RCP - DEA',
      slug: 'primeros-auxilios-rcp-dea',
      codigo: 'SOUT-PA-01',
      descripcion: 'Capacitación en técnicas de primeros auxilios, reanimación cardiopulmonar y uso de desfibrilador externo automático. Cumple normas OSHA.',
      miniatura: '/uploads/cursos/rcp.png',
      duracion: '8 horas',
      tipo_emision: TipoEmision.MIXTO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.BASICO,
      tipo: TipoCurso.CURSO,
      precio: 160.00,
      precio_falso: 220.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSST.id,
      objetivos: [
        'Aplicar soporte vital básico y compresiones torácicas de alta calidad (RCP)',
        'Operar correctamente un Desfibrilador Externo Automático (DEA)',
        'Atender hemorragias, quemaduras, atragantamientos y fracturas'
      ],
      beneficios: [
        'Certificación bajo estándares OSHA y NSC',
        'Prácticas con maniquíes y simuladores de DEA',
        'Credencial de brigadista de primeros auxilios'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Cadena de Supervivencia y Soporte Vital Básico',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Evaluación de la escena y activación del sistema de emergencia (PAS)',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('rcp-mat1', 'Guía Rápida de RCP y DEA')
                },
                {
                  titulo: 'Técnicas de RCP en adultos y manejo del DEA',
                  orden: 1,
                  duracion: 35,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Primeros Auxilios, RCP y DEA',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cuál es la frecuencia de compresiones por minuto recomendada en RCP para adultos?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(1, [
                      '60 a 80 por minuto',
                      '100 a 120 por minuto',
                      '150 a 180 por minuto',
                      '30 a 50 por minuto'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 5. Uso y Manejo de Extintores
  await prisma.curso.upsert({
    where: { slug: 'uso-y-manejo-de-extintores' },
    update: {},
    create: {
      titulo: 'Uso y Manejo de Extintores',
      slug: 'uso-y-manejo-de-extintores',
      codigo: 'SOUT-EXT-01',
      descripcion: 'Entrenamiento práctico en prevención y combate de incendios. Uso correcto de extintores según tipo de fuego.',
      miniatura: '/uploads/cursos/fire-training.jpg',
      duracion: '4 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.BASICO,
      tipo: TipoCurso.CURSO,
      precio: 120.00,
      precio_falso: 170.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSST.id,
      objetivos: [
        'Identificar las clases de fuego (A, B, C, D, K) y agentes de extinción',
        'Aplicar el método PASS (Tire, Apunte, Presione, Abanique)',
        'Reconocer los límites de intervención y rutas de evacuación'
      ],
      beneficios: [
        'Certificado de capacitación para brigadistas',
        'Cumplimiento de la Ley de SST 29783 y normas NFPA',
        'Fichas técnicas de agentes extintores'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Química del Fuego y Métodos de Extinción',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'El tetraedro del fuego y clasificación de incendios',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('ext-mat1', 'Guía de Clasificación de Extintores NFPA')
                },
                {
                  titulo: 'Operación de extintores PQS, CO2 y Acetato de Potasio',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Combate de Incendios y Extintores',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué tipo de extintor es el más adecuado para fuegos causados por equipos eléctricos energizados (Clase C)?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Dióxido de Carbono (CO2) o PQS no conductor',
                      'Agua presurizada',
                      'Espuma química acuosa simple',
                      'Arena mojada'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 6. Manejo Defensivo 4x4 Interior Mina
  await prisma.curso.upsert({
    where: { slug: 'manejo-defensivo-4x4-interior-mina' },
    update: {},
    create: {
      titulo: 'Manejo Defensivo 4x4 Interior Mina',
      slug: 'manejo-defensivo-4x4-interior-mina',
      codigo: 'SOUT-MINA-01',
      descripcion: 'Especializado para operación en interior de mina, superficie y zonas de exploración. Condiciones de baja visibilidad y espacios confinados.',
      miniatura: '/uploads/cursos/carrousel2.jpeg',
      duracion: '8 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.AVANZADO,
      tipo: TipoCurso.CURSO,
      precio: 250.00,
      precio_falso: 340.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catMineria.id,
      objetivos: [
        'Conducir con seguridad en rampas, labores subterráneas y cruces de interior mina',
        'Gestionar el protocolo de comunicaciones por radio y prioridad de paso',
        'Responder ante emergencias por desprendimiento de rocas y gases'
      ],
      beneficios: [
        'Certificación especializada en minería subterránea',
        'Cumplimiento del D.S. 024-2016-EM',
        'Formato de check-list de camioneta interior mina'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Protocolos de Seguridad en Labores Subterráneas',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Reglamento de seguridad minera y prioridad vehicular subterránea',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mina-mat1', 'Reglamento de Seguridad Interior Mina')
                },
                {
                  titulo: 'Conducción en rampas con gradiente positiva y negativa',
                  orden: 1,
                  duracion: 35,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Manejo en Interior Mina',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Quién tiene la máxima prioridad de paso en las labores de interior mina?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Vehículos de emergencia (ambulancia, rescate) y equipos pesados de acarreo cargados',
                      'Camionetas de supervisión sin carga',
                      'Vehículos de transporte de visitantes',
                      'Cualquier vehículo que toque la bocina primero'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 7. Fatiga y Somnolencia para Conductores
  await prisma.curso.upsert({
    where: { slug: 'fatiga-y-somnolencia-para-conductores' },
    update: {},
    create: {
      titulo: 'Fatiga y Somnolencia para Conductores',
      slug: 'fatiga-y-somnolencia-para-conductores',
      codigo: 'SOUT-FAT-01',
      descripcion: 'Programa de 4 horas para reconocer, prevenir y manejar la fatiga durante la conducción. Reduce accidentes por somnolencia.',
      miniatura: '/uploads/cursos/fatiga.jpeg',
      duracion: '4 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.BASICO,
      tipo: TipoCurso.CURSO,
      precio: 99.00,
      precio_falso: 150.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSeguridadVial.id,
      objetivos: [
        'Comprender el ciclo circadiano y las etapas de la somnolencia al volante',
        'Identificar micro-sueños y señales tempranas de agotamiento',
        'Implementar pausas activas y hábitos de higiene del sueño'
      ],
      beneficios: [
        'Certificado de capacitación en gestión de fatiga',
        'Test de autoevaluación del nivel de somnolencia (Escala de Epworth)',
        'Acceso 100% online y grabado disponible 24/7'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Fisiología de la Fatiga y Micro-sueños',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Factores que inducen el cansancio y ritmos circadianos',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('fatiga-mat1', 'Guía de Higiene del Sueño')
                },
                {
                  titulo: 'Estrategias operativas de prevención y pausas activas',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Gestión de Fatiga y Somnolencia',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué es un micro-sueño y cuál es su peligro principal al conducir?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Un episodio involuntario de sueño de 2 a 30 segundos donde el conductor pierde el control total del vehículo',
                      'Un bostezo normal que no altera los reflejos',
                      'Una pausa programada para tomar café',
                      'Una técnica para descansar la vista sin detener el auto'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 8. Formación de Instructores NSC
  await prisma.curso.upsert({
    where: { slug: 'formacion-de-instructores-nsc' },
    update: {},
    create: {
      titulo: 'Formación de Instructores NSC',
      slug: 'formacion-de-instructores-nsc',
      codigo: 'SOUT-INST-01',
      descripcion: 'Forma instructores certificados de manejo defensivo NSC. Desarrolla competencias pedagógicas y técnicas para capacitar a otros.',
      miniatura: '/uploads/cursos/intructor.jpeg',
      duracion: '40 horas',
      tipo_emision: TipoEmision.MIXTO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.AVANZADO,
      tipo: TipoCurso.ESPECIALIZACION,
      precio: 850.00,
      precio_falso: 1200.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSeguridadVial.id,
      objetivos: [
        'Dominar la metodología andragógica y técnicas de facilitación del NSC',
        'Manejar el kit de instructor internacional y manuales oficiales',
        'Evaluar y certificar a conductores defensivos bajo estándares internacionales'
      ],
      beneficios: [
        'Acreditación oficial como Instructor Certificado NSC USA',
        'Licencia de instructor y código en el registro internacional',
        'Material pedagógico digital y físico completo'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Metodología Pedagógica y Andragogía',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Enseñanza para adultos y dinámicas de grupo efectivas',
                  orden: 0,
                  duracion: 40,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('inst-mat1', 'Kit del Instructor NSC')
                },
                {
                  titulo: 'Estructuración y facilitación del programa de 4, 6 y 8 horas',
                  orden: 1,
                  duracion: 45,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Examen de Certificación de Instructor NSC',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 80,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cuál es el rol principal del instructor facilitador según el National Safety Council?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Guiar la reflexión, el análisis crítico y la adopción de actitudes defensivas en los participantes',
                      'Imponer sanciones de tránsito',
                      'Exclusivamente leer diapositivas de memoria',
                      'Realizar pruebas mecánicas a los vehículos'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 9. Manejo Defensivo NSC - Cuatrimotos
  await prisma.curso.upsert({
    where: { slug: 'manejo-defensivo-nsc-cuatrimotos' },
    update: {},
    create: {
      titulo: 'Manejo Defensivo NSC - Cuatrimotos',
      slug: 'manejo-defensivo-nsc-cuatrimotos',
      codigo: 'SOUT-ATV-01',
      descripcion: 'Técnicas seguras para operación de cuatrimotos (ATVs) en terrenos mineros e industriales.',
      miniatura: '/uploads/cursos/cuatrimoto.jpeg',
      duracion: '6 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.INTERMEDIO,
      tipo: TipoCurso.CURSO,
      precio: 170.00,
      precio_falso: 230.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catMaquinaria.id,
      objetivos: [
        'Comprender la dinámica de equilibrio y desplazamiento del peso corporal en ATV',
        'Operar cuatrimotos en pendientes laterales, curvas y terrenos rocosos',
        'Cumplir con el uso del Equipo de Protección Personal (EPP) adecuado'
      ],
      beneficios: [
        'Certificación NSC USA para operadores de ATVs',
        'Manual de operación segura en minería y exploración',
        'Técnicas de prevención de volcaduras'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Operación Segura de Vehículos Todo Terreno (ATV)',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Inspección pre-operacional y equipo de protección para cuatrimotos',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('atv-mat1', 'Manual del Operador ATV')
                },
                {
                  titulo: 'Distribución del peso corporal en curvas y pendientes',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Operación Segura de Cuatrimotos',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cómo debe posicionarse el cuerpo al girar en una cuatrimoto (ATV)?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Inclinando el cuerpo hacia el interior del giro para contrarrestar la fuerza centrífuga',
                      'Inclinándose hacia el exterior del giro',
                      'Permaneciendo completamente rígido y sin moverse',
                      'Apoyando un pie en el suelo mientras avanza'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 10. Evaluación de Competencias y Selección
  await prisma.curso.upsert({
    where: { slug: 'evaluacion-de-competencias-y-seleccion' },
    update: {},
    create: {
      titulo: 'Evaluación de Competencias y Selección de Conductores',
      slug: 'evaluacion-de-competencias-y-seleccion',
      codigo: 'SOUT-EVAL-01',
      descripcion: 'Evaluación integral de competencias para selección de conductores. Incluye pruebas prácticas y teóricas.',
      miniatura: '/uploads/cursos/competencia.jpeg',
      duracion: 'Según evaluación',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.AVANZADO,
      tipo: TipoCurso.CURSO,
      precio: 190.00,
      precio_falso: 260.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSeguridadVial.id,
      objetivos: [
        'Aplicar rúbricas de evaluación técnica y conductual para selección de choferes',
        'Diseñar circuitos de prueba práctica para minería y transporte',
        'Emitir informes de aptitud y riesgo para áreas de RRHH y SSOMA'
      ],
      beneficios: [
        'Formatos de evaluación estandarizados',
        'Metodología validada para minería e industria',
        'Certificado de competencia laboral'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Criterios y Rúbricas de Evaluación',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Diseño de pruebas teóricas, psicotécnicas y prácticas de manejo',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('eval-mat1', 'Formato de Evaluación de Conductores')
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación de Criterios de Selección',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué aspecto es fundamental evaluar en una prueba de manejo práctica en ruta?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'La actitud defensiva, anticipación a peligros y respeto estricto de los límites de velocidad',
                      'La velocidad con la que completa el circuito',
                      'Si usa el aire acondicionado del vehículo',
                      'El tipo de música que escucha al conducir'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 11. Prácticas de Manejo 4x4 por Horas - Modelo Lima
  await prisma.curso.upsert({
    where: { slug: 'practicas-de-manejo-4x4-por-horas-modelo-lima' },
    update: {},
    create: {
      titulo: 'Prácticas de Manejo 4x4 por Horas - Modelo Lima',
      slug: 'practicas-de-manejo-4x4-por-horas-modelo-lima',
      codigo: 'SOUT-PRAC-01',
      descripcion: 'Entrenamiento práctico en circuito modelo mina. Disponible todos los días en Lima. Sesiones por horas adaptadas a tus necesidades.',
      miniatura: '/uploads/cursos/modelolima.jpeg',
      duracion: 'Flexible por horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.INTERMEDIO,
      tipo: TipoCurso.CURSO,
      precio: 150.00,
      precio_falso: 200.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catMineria.id,
      objetivos: [
        'Desarrollar destrezas prácticas en pistas de prueba con obstáculos modelo mina',
        'Practicar giros cerrados, retroceso con espejos y pendientes pronunciadas',
        'Recibir retroalimentación personalizada de instructores certificados'
      ],
      beneficios: [
        'Entrenamiento personalizado uno a uno',
        'Horarios flexibles todos los días en Lima',
        'Constancia de horas prácticas en circuito'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Fundamentos Prácticos en Circuito Cerrado',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Reglamento del circuito modelo mina y pautas de seguridad',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('prac-mat1', 'Guía del Circuito de Prácticas')
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación de Práctica de Manejo',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cuál es la primera acción obligatoria antes de iniciar la marcha en circuito de prueba?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Realizar la vuelta del gallo (inspección 360°), ajustar asiento, espejos y colocarse el cinturón de seguridad',
                      'Acelerar a fondo para calentar el motor',
                      'Apagar las luces del vehículo',
                      'Desactivar el freno de mano sin revisar alrededor'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 12. Curso de MATPEL (Materiales Peligrosos)
  await prisma.curso.upsert({
    where: { slug: 'curso-de-matpel-materiales-peligrosos' },
    update: {},
    create: {
      titulo: 'Curso de MATPEL (Materiales Peligrosos)',
      slug: 'curso-de-matpel-materiales-peligrosos',
      codigo: 'SOUT-MATPEL-01',
      descripcion: 'Curso de MATPEL nivel advertencia presencial o virtual online 3 horas. Identificación, clasificación y respuesta inicial ante emergencias químicas.',
      miniatura: '/uploads/cursos/matpel.jpeg',
      duracion: '3 horas',
      tipo_emision: TipoEmision.MIXTO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.BASICO,
      tipo: TipoCurso.CURSO,
      precio: 130.00,
      precio_falso: 180.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catSST.id,
      objetivos: [
        'Interpretar los 9 grupos de clasificación de materiales peligrosos según la ONU',
        'Manejar la Guía de Respuesta a Emergencias (GRE / ERG)',
        'Reconocer rombos NFPA 704 y placas DOT para transporte seguro'
      ],
      beneficios: [
        'Certificación NSC y SOUT Training Center',
        'Descarga de la Guía GRE digital actualizada',
        'Válido para transportistas y personal de almacén/planta'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Reconocimiento e Identificación de MATPEL',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Clasificación de las 9 clases de materiales peligrosos ONU',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('matpel-mat1', 'Guía GRE - Respuesta a Emergencias')
                },
                {
                  titulo: 'Uso práctico de la Guía de Respuesta a Emergencias (GRE)',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - MATPEL Nivel Advertencia',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Para qué sirve el número de 4 dígitos que figura en la placa naranja de un vehículo de carga?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'Es el número ONU que identifica la sustancia química específica transportada',
                      'Es la placa de rodaje del vehículo',
                      'Es la fecha de vencimiento de la carga',
                      'Es el número telefónico del conductor'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  // 13. Operación Segura de Montacargas Presencial
  await prisma.curso.upsert({
    where: { slug: 'operacion-segura-de-montacargas' },
    update: {},
    create: {
      titulo: 'Operación Segura de Montacargas Presencial',
      slug: 'operacion-segura-de-montacargas',
      codigo: 'SOUT-MONT-01',
      descripcion: 'Curso presencial de 20 horas teórico-práctico para operadores de montacargas. Entrenamiento todos los días en Lima. Doble certificación de NSC y SOUT Training Center.',
      miniatura: '/uploads/cursos/operador.jpeg',
      duracion: '20 horas',
      tipo_emision: TipoEmision.ASINCRONO,
      estado: EstadoCurso.PUBLICADO,
      nivel: NivelCurso.INTERMEDIO,
      tipo: TipoCurso.CURSO,
      precio: 320.00,
      precio_falso: 420.00,
      moneda: 'PEN',
      profesor_id: instructor.id,
      categoria_id: catMaquinaria.id,
      objetivos: [
        'Comprender el triángulo de estabilidad y capacidad de carga del montacargas',
        'Realizar inspecciones pre-operacionales (check-list diario)',
        'Ejecutar maniobras de apilamiento, transporte y estiba según normas OSHA 1910.178'
      ],
      beneficios: [
        'Doble Certificación NSC USA y SOUT Training Center',
        'Licencia / Carnet de Operador de Montacargas',
        'Entrenamiento práctico con equipos reales en Lima'
      ],
      modulos: {
        create: [
          {
            titulo: 'Módulo 1: Fundamentos y Estabilidad del Montacargas',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Triángulo de estabilidad, centro de gravedad y tabla de capacidades',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mont-mat1', 'Manual del Operador de Montacargas OSHA')
                },
                {
                  titulo: 'Técnicas de carga, estiba, traslado y visibilidad segura',
                  orden: 1,
                  duracion: 35,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Operación Segura de Montacargas',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 70,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué sucede con la estabilidad del montacargas si se traslada con la carga elevada?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'El centro de gravedad se eleva peligrosamente fuera de la base de estabilidad, aumentando drásticamente el riesgo de volcadura',
                      'Mejora la velocidad de desplazamiento',
                      'Aumenta la capacidad de frenado',
                      'No afecta en nada la estabilidad del equipo'
                    ])
                  }
                }
              ]
            }
          }
        ]
      }
    }
  })

  console.log('✅ Los 13 cursos de SOUT Training Center fueron creados exitosamente.')
  console.log('🎉 Seed finalizado correctamente.')
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
