import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ─── USUARIOS ────────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash('Admin123@', 10)

  await prisma.usuario.upsert({
    where: { correo: 'admin@gmail.com' },
    update: {},
    create: {
      correo: 'admin@gmail.com',
      contrasena: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      numero_documento: '00000001',
      celular: '900000001',
      rol: Rol.ADMIN,
      esta_activo: true
    }
  })

  const profesorPassword = await bcrypt.hash('Profesor123!', 10)

  const profesor = await prisma.usuario.upsert({
    where: { correo: 'profesor@gmail.com' },
    update: {},
    create: {
      correo: 'profesor@gmail.com',
      contrasena: profesorPassword,
      nombre: 'Juan',
      apellido: 'García',
      numero_documento: '00000002',
      celular: '900000002',
      rol: Rol.PROFESOR,
      esta_activo: true
    }
  })

  const alumnoPassword = await bcrypt.hash('Alumno123@', 10)

  await prisma.usuario.upsert({
    where: { correo: 'alumno@gmail.com' },
    update: {},
    create: {
      correo: 'alumno@gmail.com',
      contrasena: alumnoPassword,
      nombre: 'María',
      apellido: 'López',
      numero_documento: '00000003',
      celular: '900000003',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  console.log('✅ Usuarios creados')

  // ─── LIMPIEZA DE CATÁLOGO ANTERIOR ────────────────────────────────────────────

  await prisma.curso.deleteMany({
    where: {
      slug: {
        in: ['introduccion-programacion-python', 'marketing-digital-redes-sociales', 'diseno-ux-ui-figma']
      }
    }
  })

  await prisma.categoria.deleteMany({
    where: { slug: { in: ['programacion', 'marketing-digital', 'diseno'] } }
  })

  console.log('✅ Catálogo anterior eliminado')

  // ─── CATEGORÍAS ──────────────────────────────────────────────────────────────

  const catCivil = await prisma.categoria.upsert({
    where: { slug: 'ingenieria-civil' },
    update: {},
    create: {
      nombre: 'Ingeniería Civil',
      slug: 'ingenieria-civil',
      descripcion: 'Cursos de gestión, costos y construcción de obras civiles',
      esta_activo: true,
      orden: 1
    }
  })

  const catIndustrial = await prisma.categoria.upsert({
    where: { slug: 'ingenieria-industrial' },
    update: {},
    create: {
      nombre: 'Ingeniería Industrial',
      slug: 'ingenieria-industrial',
      descripcion: 'Cursos de seguridad, salud ocupacional y gestión industrial',
      esta_activo: true,
      orden: 2
    }
  })

  console.log('✅ Categorías creadas')

  // ─── CURSOS ──────────────────────────────────────────────────────────────────

  const opcionesPregunta = (correcta: number, textos: string[]) =>
    textos.map((texto, i) => ({ texto, es_correcta: i === correcta, orden: i }))

  const materialDescargable = (id: string, nombre: string) => [
    { id, nombre, url: '/uploads/cursos/plataforma-educativa.pdf', tipo: 'archivo' }
  ]

  await prisma.curso.upsert({
    where: { slug: 'costos-presupuestos-obra-s10' },
    update: {},
    create: {
      titulo: 'Elaboración de Costos y Presupuestos de Obra con S10 y MS Project',
      slug: 'costos-presupuestos-obra-s10',
      descripcion: 'Aprende a elaborar presupuestos de obra, análisis de precios unitarios y programación de proyectos usando S10 y MS Project.',
      miniatura: '/uploads/cursos/elaboracion-de-costos.jpg',
      precio: 179.00,
      precio_falso: 249.00,
      moneda: 'PEN',
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      tipo_emision: 'ASINCRONO',
      duracion: '24 horas',
      profesor_id: profesor.id,
      categoria_id: catCivil.id,
      objetivos: ['Elaborar presupuestos de obra', 'Calcular precios unitarios (APU)', 'Programar obras con MS Project'],
      beneficios: ['Acceso de por vida', 'Certificado al completar', 'Plantillas de S10 y MS Project'],
      modulos: {
        create: [
          {
            titulo: 'Fundamentos de Costos y Presupuestos',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Introducción a la gestión de costos en obras',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mat-costos-1', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Análisis de precios unitarios (APU)',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Metrados y partidas según norma técnica',
                  orden: 2,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Manejo de S10 y MS Project',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Configuración de proyectos en S10 Presupuestos',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Programación de obra con MS Project',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Control de costos y curva S',
                  orden: 2,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Costos en Edificaciones y Proyectos Especiales',
            orden: 2,
            lecciones: {
              create: [
                {
                  titulo: 'Presupuesto de obras de edificación',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  recursos: materialDescargable('mat-costos-2', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Gestión de adicionales y reducciones de obra',
                  orden: 1,
                  duracion: 20,
                  es_en_vivo: true,
                  fecha_programada: new Date('2026-07-10T19:00:00-05:00'),
                  fecha_fin: new Date('2026-07-10T21:00:00-05:00'),
                  enlace_reunion: 'https://meet.google.com/abc-defg-hij'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Costos y Presupuestos de Obra',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 60,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué significa la sigla APU en presupuestos de obra?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(1, [
                      'Análisis de Programación Urbana',
                      'Análisis de Precios Unitarios',
                      'Aprobación de Presupuesto Único',
                      'Administración de Proyectos Urbanos'
                    ])
                  }
                },
                {
                  texto: '¿Qué software se utiliza junto con S10 para la programación del cronograma de obra?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(2, ['AutoCAD', 'Excel sin metodología', 'MS Project', 'Photoshop'])
                  }
                },
                {
                  texto: '¿Qué representa la curva S en el control de costos de un proyecto?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 2,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'El avance planificado vs. real de costos en el tiempo',
                      'El número de trabajadores en obra',
                      'El precio de venta del proyecto',
                      'La forma física de los elementos estructurales'
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

  await prisma.curso.upsert({
    where: { slug: 'valorizacion-liquidacion-obras-contrata' },
    update: {},
    create: {
      titulo: 'Valorización y Liquidación de Obras Públicas por Contrata',
      slug: 'valorizacion-liquidacion-obras-contrata',
      descripcion: 'Domina el proceso de valorización mensual y liquidación técnico-financiera de obras públicas ejecutadas por contrata.',
      miniatura: '/uploads/cursos/valorizacion.jpg',
      precio: 169.00,
      precio_falso: 219.00,
      moneda: 'PEN',
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      tipo_emision: 'ASINCRONO',
      duracion: '20 horas',
      profesor_id: profesor.id,
      categoria_id: catCivil.id,
      objetivos: ['Elaborar valorizaciones mensuales', 'Aplicar fórmulas polinómicas de reajuste', 'Liquidar obras técnica y financieramente'],
      beneficios: ['Acceso de por vida', 'Certificado al completar', 'Casos prácticos resueltos'],
      modulos: {
        create: [
          {
            titulo: 'Valorización de Obras',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Marco normativo de contrataciones del Estado',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mat-valorizacion-1', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Elaboración de valorizaciones mensuales',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Reajuste de precios y fórmulas polinómicas',
                  orden: 2,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Liquidación de Obras',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Liquidación técnica y financiera de obra',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Resolución de controversias y ampliaciones de plazo',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Casos Prácticos de Valorización y Liquidación',
            orden: 2,
            lecciones: {
              create: [
                {
                  titulo: 'Resolución de un caso integral de valorización',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  recursos: materialDescargable('mat-valorizacion-2', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Resolución de un caso integral de liquidación de obra',
                  orden: 1,
                  duracion: 30,
                  es_en_vivo: true,
                  fecha_programada: new Date('2026-07-11T19:00:00-05:00'),
                  fecha_fin: new Date('2026-07-11T21:00:00-05:00'),
                  enlace_reunion: 'https://meet.google.com/klm-nopq-rst'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Valorización y Liquidación de Obras',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 60,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Con qué periodicidad se elabora una valorización de obra pública por contrata?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: { create: opcionesPregunta(2, ['Diaria', 'Anual', 'Mensual', 'Trimestral']) }
                },
                {
                  texto: '¿Qué busca corregir el reajuste por fórmula polinómica?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'La variación de precios de los insumos en el tiempo',
                      'El número de trabajadores en obra',
                      'Los errores de diseño estructural',
                      'El plazo de ejecución contractual'
                    ])
                  }
                },
                {
                  texto: '¿Qué tipo de liquidación debe presentarse al finalizar una obra ejecutada por contrata?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 2,
                  opciones: {
                    create: opcionesPregunta(1, [
                      'Solo liquidación administrativa',
                      'Liquidación técnica y financiera',
                      'Liquidación de personal',
                      'Liquidación de garantías únicamente'
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

  await prisma.curso.upsert({
    where: { slug: 'lean-construction-gestion-proyectos' },
    update: {},
    create: {
      titulo: 'Lean Construction: Gestión Eficiente de Proyectos de Construcción',
      slug: 'lean-construction-gestion-proyectos',
      descripcion: 'Aplica la filosofía Lean y sus herramientas para eliminar pérdidas y optimizar la planificación de proyectos de construcción.',
      miniatura: '/uploads/cursos/lean-construccion.jpg',
      precio: 199.00,
      precio_falso: 259.00,
      moneda: 'PEN',
      nivel: 'AVANZADO',
      estado: 'PUBLICADO',
      tipo_emision: 'ASINCRONO',
      duracion: '18 horas',
      profesor_id: profesor.id,
      categoria_id: catCivil.id,
      objetivos: ['Aplicar los principios de Lean Construction', 'Implementar el Last Planner System', 'Reducir pérdidas en obra'],
      beneficios: ['Acceso de por vida', 'Certificado al completar', 'Casos de implementación real'],
      modulos: {
        create: [
          {
            titulo: 'Fundamentos de Lean Construction',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Principios de la filosofía Lean aplicada a construcción',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mat-lean-1', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Identificación de pérdidas y restricciones',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Herramientas Lean',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Last Planner System (LPS)',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Value Stream Mapping en obra',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Implementación de Lean en proyectos reales',
                  orden: 2,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Mejora Continua y Casos de Éxito',
            orden: 2,
            lecciones: {
              create: [
                {
                  titulo: 'Indicadores de desempeño (PPC) en Lean Construction',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  recursos: materialDescargable('mat-lean-2', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Casos de éxito de implementación Lean en el Perú',
                  orden: 1,
                  duracion: 25,
                  es_en_vivo: true,
                  fecha_programada: new Date('2026-07-12T19:00:00-05:00'),
                  fecha_fin: new Date('2026-07-12T21:00:00-05:00'),
                  enlace_reunion: 'https://meet.google.com/uvw-xyzz-123'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Lean Construction',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 60,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Cuál es el objetivo principal de Lean Construction?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: {
                    create: opcionesPregunta(1, [
                      'Aumentar el número de trabajadores en obra',
                      'Eliminar pérdidas y maximizar el valor para el cliente',
                      'Reducir la calidad de los acabados',
                      'Incrementar el uso de papeleo administrativo'
                    ])
                  }
                },
                {
                  texto: '¿Qué herramienta de Lean Construction se usa para la planificación colaborativa de corto plazo?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(2, ['AutoCAD', 'Curva S', 'Last Planner System (LPS)', 'Diagrama de Gantt clásico'])
                  }
                },
                {
                  texto: '¿Qué mide el indicador PPC (Porcentaje de Plan Cumplido)?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 2,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'El porcentaje de actividades planificadas que se completaron según lo programado',
                      'El presupuesto total ejecutado',
                      'El número de trabajadores capacitados',
                      'El tiempo total de retraso de la obra'
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

  await prisma.curso.upsert({
    where: { slug: 'construccion-mantenimiento-rehabilitacion-carreteras' },
    update: {},
    create: {
      titulo: 'Construcción, Mantenimiento y Rehabilitación de Carreteras',
      slug: 'construccion-mantenimiento-rehabilitacion-carreteras',
      descripcion: 'Conoce el diseño, construcción, mantenimiento y rehabilitación de vías, pavimentos y estructuras viales.',
      miniatura: '/uploads/cursos/constrtuccion-y-mantenimiento.jpg',
      precio: 189.00,
      precio_falso: 239.00,
      moneda: 'PEN',
      nivel: 'INTERMEDIO',
      estado: 'PUBLICADO',
      tipo_emision: 'ASINCRONO',
      duracion: '22 horas',
      profesor_id: profesor.id,
      categoria_id: catCivil.id,
      objetivos: ['Diseñar estructuras de pavimento', 'Aplicar técnicas de mantenimiento vial', 'Diagnosticar patologías del pavimento'],
      beneficios: ['Acceso de por vida', 'Certificado al completar', 'Fichas técnicas descargables'],
      modulos: {
        create: [
          {
            titulo: 'Diseño y Construcción Vial',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Geometría y diseño de pavimentos',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mat-carreteras-1', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Materiales y capas estructurales del pavimento',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Mantenimiento y Rehabilitación',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Técnicas de mantenimiento vial preventivo y correctivo',
                  orden: 0,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Patologías del pavimento y métodos de rehabilitación',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Gestión y Conservación Vial',
            orden: 2,
            lecciones: {
              create: [
                {
                  titulo: 'Sistemas de gestión de conservación vial por niveles de servicio',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  recursos: materialDescargable('mat-carreteras-2', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Evaluación de la condición del pavimento (PCI)',
                  orden: 1,
                  duracion: 25,
                  es_en_vivo: true,
                  fecha_programada: new Date('2026-07-13T19:00:00-05:00'),
                  fecha_fin: new Date('2026-07-13T21:00:00-05:00'),
                  enlace_reunion: 'https://meet.google.com/234-5678-9ab'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Construcción y Mantenimiento de Carreteras',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 60,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué tipo de mantenimiento se realiza antes de que aparezcan fallas en el pavimento?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: { create: opcionesPregunta(2, ['Correctivo', 'De emergencia', 'Preventivo', 'Estructural']) }
                },
                {
                  texto: '¿Qué evalúa el índice PCI en un pavimento?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(0, [
                      'La condición o estado superficial del pavimento',
                      'El costo total de la obra',
                      'El tránsito vehicular diario',
                      'El tipo de suelo de la subrasante'
                    ])
                  }
                },
                {
                  texto: '¿Cuál es una causa común de patologías en pavimentos flexibles?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 2,
                  opciones: {
                    create: opcionesPregunta(1, [
                      'Exceso de señalización vial',
                      'Deficiencias en el drenaje y sobrecarga vehicular',
                      'Uso de pintura reflectiva',
                      'Iluminación insuficiente'
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

  await prisma.curso.upsert({
    where: { slug: 'seguridad-salud-ocupacional-obras' },
    update: {},
    create: {
      titulo: 'Seguridad y Salud Ocupacional en Obras de Construcción',
      slug: 'seguridad-salud-ocupacional-obras',
      descripcion: 'Aprende a gestionar la seguridad y salud en el trabajo en obras de construcción conforme a la normativa vigente.',
      miniatura: '/uploads/cursos/seguridad-y-salud.jpg',
      precio: 149.00,
      precio_falso: 199.00,
      moneda: 'PEN',
      nivel: 'BASICO',
      estado: 'PUBLICADO',
      tipo_emision: 'ASINCRONO',
      duracion: '16 horas',
      profesor_id: profesor.id,
      categoria_id: catIndustrial.id,
      objetivos: ['Aplicar la Ley 29783 en obra', 'Elaborar un Plan de Seguridad y Salud en el Trabajo', 'Investigar accidentes e incidentes laborales'],
      beneficios: ['Acceso de por vida', 'Certificado al completar', 'Formatos de gestión SST'],
      modulos: {
        create: [
          {
            titulo: 'Marco Normativo SST',
            orden: 0,
            lecciones: {
              create: [
                {
                  titulo: 'Ley 29783 y su reglamento aplicado a construcción',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  es_vista_previa: true,
                  recursos: materialDescargable('mat-sst-1', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Identificación de peligros y evaluación de riesgos (IPER)',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Gestión de la Seguridad en Obra',
            orden: 1,
            lecciones: {
              create: [
                {
                  titulo: 'Elaboración del Plan de Seguridad y Salud en el Trabajo',
                  orden: 0,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                },
                {
                  titulo: 'Investigación de accidentes e incidentes laborales',
                  orden: 1,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4'
                }
              ]
            }
          },
          {
            titulo: 'Auditoría y Mejora Continua en SST',
            orden: 2,
            lecciones: {
              create: [
                {
                  titulo: 'Auditorías internas del sistema de gestión SST',
                  orden: 0,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=ZUZif1Ll9u4',
                  recursos: materialDescargable('mat-sst-2', 'Guía de la plataforma educativa')
                },
                {
                  titulo: 'Indicadores de seguridad y mejora continua',
                  orden: 1,
                  duracion: 20,
                  es_en_vivo: true,
                  fecha_programada: new Date('2026-07-14T19:00:00-05:00'),
                  fecha_fin: new Date('2026-07-14T21:00:00-05:00'),
                  enlace_reunion: 'https://meet.google.com/cde-fghi-jkl'
                }
              ]
            }
          }
        ]
      },
      examenes: {
        create: [
          {
            titulo: 'Evaluación Final - Seguridad y Salud Ocupacional',
            tipo: 'FINAL',
            peso: 100,
            puntaje_aprobacion: 60,
            intentos_maximos: 2,
            esta_publicado: true,
            preguntas: {
              create: [
                {
                  texto: '¿Qué ley regula la seguridad y salud en el trabajo en el Perú?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 0,
                  opciones: { create: opcionesPregunta(2, ['Ley 27444', 'Ley 30225', 'Ley 29783', 'Ley 28611']) }
                },
                {
                  texto: '¿Qué documento establece las medidas preventivas de una obra conforme a la Ley 29783?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 1,
                  opciones: {
                    create: opcionesPregunta(2, [
                      'El expediente técnico',
                      'El cronograma de obra',
                      'El Plan de Seguridad y Salud en el Trabajo',
                      'El presupuesto de obra'
                    ])
                  }
                },
                {
                  texto: '¿Qué herramienta se usa para identificar peligros y evaluar riesgos en obra?',
                  tipo: 'OPCION_MULTIPLE',
                  orden: 2,
                  opciones: {
                    create: opcionesPregunta(1, [
                      'Curva S',
                      'IPER (Identificación de Peligros y Evaluación de Riesgos)',
                      'Diagrama de Gantt',
                      'Análisis de Precios Unitarios'
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

  console.log('✅ Cursos creados')

  // ─── CUPONES ─────────────────────────────────────────────────────────────────

  await prisma.cupon.upsert({
    where: { codigo: 'BIENVENIDO20' },
    update: {},
    create: {
      codigo: 'BIENVENIDO20',
      valor: 20,
      tipo: 'PORCENTAJE',
      limite_uso: 100,
      esta_activo: true,
      fecha_expiracion: new Date('2027-12-31')
    }
  })

  await prisma.cupon.upsert({
    where: { codigo: 'DESCUENTO50' },
    update: {},
    create: {
      codigo: 'DESCUENTO50',
      valor: 50,
      tipo: 'MONTO_FIJO',
      limite_uso: 50,
      esta_activo: true,
      fecha_expiracion: new Date('2027-12-31')
    }
  })

  console.log('✅ Cupones creados')

  // ─── INSCRIPCIÓN DE PRUEBA ───────────────────────────────────────────────────
  const estudiante = await prisma.usuario.findUnique({ where: { correo: 'alumno@gmail.com' } })

  const cursosInscripcionAlumno = await prisma.curso.findMany({
    where: {
      slug: { in: ['costos-presupuestos-obra-s10', 'valorizacion-liquidacion-obras-contrata'] }
    }
  })

  if (estudiante) {
    for (const curso of cursosInscripcionAlumno) {
      await prisma.inscripcion.upsert({
        where: {
          usuario_id_curso_id: {
            usuario_id: estudiante.id,
            curso_id: curso.id
          }
        },
        update: {},
        create: {
          usuario_id: estudiante.id,
          curso_id: curso.id,
          estado: 'ACTIVO'
        }
      })

      await prisma.progresoCurso.upsert({
        where: {
          usuario_id_curso_id: {
            usuario_id: estudiante.id,
            curso_id: curso.id
          }
        },
        update: {},
        create: {
          usuario_id: estudiante.id,
          curso_id: curso.id,
          porcentaje_progreso: 0
        }
      })
    }

    console.log('✅ Alumno inscrito en: Costos y Presupuestos de Obra, Valorización y Liquidación de Obras')
  }

  // ─── SIMULACROS ──────────────────────────────────────────────────────────────

  const simulacros = [
    {
      titulo: 'Simulacro General — Aptitud Profesional con IA',
      slug: 'simulacro-general-aptitud-profesional-ia',
      descripcion:
        'Pon a prueba tus conocimientos en IA aplicada a entornos profesionales. Cubre herramientas de IA, prompts efectivos, automatización de tareas y uso estratégico de modelos de lenguaje en el trabajo diario.',
      estado: 'PUBLICADO' as const,
      nivel: 'INTERMEDIO' as const,
      duracion: '90 minutos',
      area_tematica: 'Inteligencia Artificial',
      es_gratis: false,
      precio: 49.0,
      preguntas: [
        {
          enunciado: '¿Qué es un "prompt" en el contexto de los modelos de lenguaje?',
          tema: 'Fundamentos de IA',
          opciones: opcionesPregunta(1, [
            'Un tipo de red neuronal',
            'La instrucción o texto de entrada que se da al modelo',
            'Un algoritmo de entrenamiento',
            'Una base de datos vectorial'
          ])
        },
        {
          enunciado: '¿Cuál es una ventaja de automatizar tareas repetitivas con IA?',
          tema: 'Automatización',
          opciones: opcionesPregunta(2, [
            'Aumenta el costo operativo',
            'Reduce la calidad del trabajo',
            'Libera tiempo para tareas de mayor valor',
            'Elimina la necesidad de supervisión humana siempre'
          ])
        },
        {
          enunciado: '¿Qué técnica mejora la precisión de las respuestas de un modelo de lenguaje?',
          tema: 'Prompts efectivos',
          opciones: opcionesPregunta(0, [
            'Dar contexto claro y ejemplos en el prompt',
            'Usar preguntas ambiguas',
            'Evitar especificar el formato de salida',
            'No indicar el rol del modelo'
          ])
        },
        {
          enunciado: '¿Qué es el "few-shot learning"?',
          tema: 'Modelos de lenguaje',
          opciones: opcionesPregunta(3, [
            'Entrenar un modelo desde cero',
            'Reducir el tamaño del modelo',
            'Usar solo datos no etiquetados',
            'Incluir pocos ejemplos en el prompt para guiar la respuesta'
          ])
        },
        {
          enunciado: 'En un entorno profesional, ¿qué riesgo debe considerarse al usar IA generativa?',
          tema: 'Uso estratégico',
          opciones: opcionesPregunta(1, [
            'La IA siempre es 100% precisa',
            'Las respuestas pueden contener errores o sesgos y deben validarse',
            'No es necesario revisar el contenido generado',
            'La IA reemplaza por completo el criterio profesional'
          ])
        }
      ]
    },
    {
      titulo: 'Simulacro Básico — Fundamentos de Construcción',
      slug: 'simulacro-basico-fundamentos-construccion',
      descripcion: 'Evalúa los conceptos fundamentales de construcción civil: materiales, normativa básica y seguridad en obra.',
      estado: 'PUBLICADO' as const,
      nivel: 'BASICO' as const,
      duracion: '60 minutos',
      area_tematica: 'Construcción',
      es_gratis: true,
      precio: 0,
      preguntas: [
        {
          enunciado: '¿Cuál es la función principal del cemento en el concreto?',
          tema: 'Materiales',
          opciones: opcionesPregunta(0, [
            'Actuar como aglomerante que une los agregados',
            'Aportar color al concreto',
            'Reducir el peso de la estructura',
            'Acelerar el fraguado del agua'
          ])
        },
        {
          enunciado: '¿Qué norma regula la seguridad y salud en el trabajo en el Perú?',
          tema: 'Normativa',
          opciones: opcionesPregunta(2, ['Ley 27444', 'Ley 30225', 'Ley 29783', 'Ley 28611'])
        },
        {
          enunciado: '¿Qué equipo de protección personal es indispensable en toda obra de construcción?',
          tema: 'Seguridad',
          opciones: opcionesPregunta(1, ['Guantes de cocina', 'Casco de seguridad', 'Lentes de sol', 'Gorra deportiva'])
        },
        {
          enunciado: '¿Qué significa la sigla "IPER" en seguridad ocupacional?',
          tema: 'Seguridad',
          opciones: opcionesPregunta(3, [
            'Informe de Productividad y Eficiencia en Recursos',
            'Inspección de Procesos y Equipos de Riesgo',
            'Índice de Pérdidas Económicas y Riesgos',
            'Identificación de Peligros y Evaluación de Riesgos'
          ])
        }
      ]
    },
    {
      titulo: 'Simulacro Avanzado — Gestión de Proyectos',
      slug: 'simulacro-avanzado-gestion-proyectos',
      descripcion: 'Mide tu dominio en planificación, control de costos y metodologías de gestión de proyectos de construcción.',
      estado: 'PUBLICADO' as const,
      nivel: 'AVANZADO' as const,
      duracion: '120 minutos',
      area_tematica: 'Gestión de Proyectos',
      es_gratis: false,
      precio: 79.0,
      preguntas: [
        {
          enunciado: '¿Qué representa la "ruta crítica" en un cronograma de proyecto?',
          tema: 'Planificación',
          opciones: opcionesPregunta(0, [
            'La secuencia de actividades que determina la duración mínima del proyecto',
            'Las actividades con mayor holgura',
            'El presupuesto total del proyecto',
            'El equipo con más recursos asignados'
          ])
        },
        {
          enunciado: 'En Lean Construction, ¿qué busca reducir principalmente la metodología?',
          tema: 'Lean Construction',
          opciones: opcionesPregunta(1, [
            'El número de trabajadores',
            'Los desperdicios y actividades que no agregan valor',
            'La calidad de los acabados',
            'El uso de tecnología en obra'
          ])
        },
        {
          enunciado: '¿Qué herramienta se usa comúnmente para el control de costos y presupuestos en obra?',
          tema: 'Control de costos',
          opciones: opcionesPregunta(2, ['AutoCAD', 'Photoshop', 'S10 / MS Project', 'Excel únicamente sin metodología'])
        },
        {
          enunciado: '¿Qué es el "valor ganado" (Earned Value) en gestión de proyectos?',
          tema: 'Control de proyectos',
          opciones: opcionesPregunta(3, [
            'El precio de venta final del proyecto',
            'La utilidad neta del contratista',
            'El monto del contrato firmado',
            'El valor del trabajo realmente completado a una fecha de corte'
          ])
        },
        {
          enunciado: '¿Cuál es un objetivo clave de la liquidación de obra?',
          tema: 'Liquidación de obras',
          opciones: opcionesPregunta(0, [
            'Determinar el costo final real de la obra ejecutada',
            'Iniciar un nuevo proyecto',
            'Contratar más personal',
            'Diseñar los planos definitivos'
          ])
        }
      ]
    },
    {
      titulo: 'Simulacro Intermedio — Seguridad y Salud Ocupacional',
      slug: 'simulacro-intermedio-seguridad-salud-ocupacional',
      descripcion: 'Pon a prueba tu conocimiento sobre gestión de riesgos, normativa SST e investigación de accidentes en obra.',
      estado: 'BORRADOR' as const,
      nivel: 'INTERMEDIO' as const,
      duracion: '75 minutos',
      area_tematica: 'Seguridad y Salud Ocupacional',
      es_gratis: false,
      precio: 59.0,
      preguntas: [
        {
          enunciado: '¿Cuál es el primer paso ante un accidente de trabajo en obra?',
          tema: 'Investigación de accidentes',
          opciones: opcionesPregunta(1, [
            'Limpiar la zona del incidente',
            'Atender al accidentado y asegurar la zona',
            'Llamar directamente a un abogado',
            'Continuar con las labores normalmente'
          ])
        },
        {
          enunciado: '¿Qué documento establece las medidas preventivas de una obra conforme a la Ley 29783?',
          tema: 'Normativa SST',
          opciones: opcionesPregunta(2, [
            'El expediente técnico',
            'El cronograma de obra',
            'El Plan de Seguridad y Salud en el Trabajo',
            'El presupuesto de obra'
          ])
        },
        {
          enunciado: '¿Qué se entiende por "incidente" a diferencia de "accidente" en SST?',
          tema: 'Gestión de riesgos',
          opciones: opcionesPregunta(0, [
            'Un evento que pudo causar daño pero no llegó a generarlo',
            'Un evento que siempre causa lesiones graves',
            'Un sinónimo exacto de accidente',
            'Un reporte administrativo sin relevancia'
          ])
        }
      ]
    }
  ]

  for (const { preguntas, ...simulacroData } of simulacros) {
    await prisma.simulacro.upsert({
      where: { slug: simulacroData.slug },
      update: {},
      create: {
        ...simulacroData,
        moneda: 'PEN',
        numero_preguntas: preguntas.length,
        preguntas: {
          create: preguntas.map((p, orden) => ({
            enunciado: p.enunciado,
            tema: p.tema,
            orden,
            opciones: { create: p.opciones }
          }))
        }
      }
    })
  }

  console.log(`✅ ${simulacros.length} simulacros de prueba creados`)

  // ─── CONFIGURACIONES DEL SISTEMA ────────────────────────────────────────────

  await prisma.configuracion.upsert({
    where: { clave: 'chat_entre_alumnos' },
    update: {},
    create: {
      clave: 'chat_entre_alumnos',
      valor: 'false',
      descripcion: 'Permitir mensajes directos entre alumnos'
    }
  })

  console.log('✅ Configuración de chat creada')

  // ─── RESUMEN ─────────────────────────────────────────────────────────────────

  console.log('')
  console.log('🎉 Seed completado!')
  console.log('')
  console.log('📋 Credenciales:')
  console.log('   Admin:    admin@gmail.com     / Admin123@')
  console.log('   Profesor: profesor@gmail.com  / Profesor123!')
  console.log('   Alumno:   alumno@gmail.com    / Alumno123!')
  console.log('')
  console.log('📚 Cursos:')
  console.log('   1. Elaboración de Costos y Presupuestos de Obra con S10 y MS Project')
  console.log('   2. Valorización y Liquidación de Obras Públicas por Contrata')
  console.log('   3. Lean Construction: Gestión Eficiente de Proyectos de Construcción')
  console.log('   4. Construcción, Mantenimiento y Rehabilitación de Carreteras')
  console.log('   5. Seguridad y Salud Ocupacional en Obras de Construcción')
  console.log('')
  console.log('🎟️  Cupones:')
  console.log('   BIENVENIDO20 → 20% descuento')
  console.log('   DESCUENTO50  → S/. 50 de descuento')
  console.log('')
  console.log('📝 Simulacros:')
  for (const s of simulacros) {
    console.log(`   - ${s.titulo} (${s.nivel}, ${s.es_gratis ? 'gratis' : 'S/. ' + s.precio})`)
  }
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
