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
      miniatura: '/uploads/cursos/default/elaboracion-de-costos.jpg',
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
      miniatura: '/uploads/cursos/default/valorizacion.jpg',
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
      miniatura: '/uploads/cursos/default/lean-construccion.jpg',
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
      miniatura: '/uploads/cursos/default/constrtuccion-y-mantenimiento.jpg',
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
      miniatura: '/uploads/cursos/default/seguridad-y-salud.jpg',
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

  // ─── TEXTOS POR DEFECTO DE LA HOME ──────────────────────────────────────────
  // Valores iniciales de las secciones administrables de la página principal.
  // Si el admin borra la descripción de una de estas secciones, esa sección
  // deja de mostrarse (ver src/app/(web)/page.tsx).

  const homeDefaults: { clave: string; valor: string; descripcion: string }[] = [
    {
      clave: 'HOME_CURSOS_TITLE',
      valor: 'Cursos destacados',
      descripcion: 'Título de la sección de cursos destacados en la página principal'
    },
    {
      clave: 'HOME_CURSOS_SUBTITLE',
      valor: 'Descubre nuestros cursos más recientes',
      descripcion: 'Descripción de la sección de cursos destacados en la página principal'
    },
    {
      clave: 'HOME_CONVENIOS_TITLE',
      valor: 'Nuestros convenios',
      descripcion: 'Título de la sección "Nuestros convenios" en la página principal'
    },
    {
      clave: 'HOME_CONVENIOS_DESCRIPTION',
      valor: 'Nuestra institución se enorgullece de contar con convenios estratégicos con diversas entidades reconocidas en el campo de la ingeniería. Estos acuerdos brindan a nuestros estudiantes y profesionales oportunidades únicas de desarrollo, colaboración e innovación.',
      descripcion: 'Descripción de la sección "Nuestros convenios" en la página principal'
    },
    {
      clave: 'HOME_POR_QUE_ELEGIRNOS',
      valor: JSON.stringify([
        { icono: 'Presentation', titulo: 'Clases en vivo', descripcion: 'Contamos con las mejores clases online con nuestros especialistas.' },
        { icono: 'GraduationCap', titulo: 'Asesoría Académica', descripcion: 'Contamos con un foro de preguntas y respuestas en todo nuestros cursos.' },
        { icono: 'Monitor', titulo: 'Plataforma Virtual', descripcion: 'Finalizado el curso o especialización y una vez obtenida la certificación, contarás con un periodo adicional de acceso a la plataforma virtual, conforme a las políticas académicas vigentes.' },
        { icono: 'ClipboardList', titulo: 'Seguimiento académico', descripcion: 'Realizamos seguimiento y asesoramiento continuo en el proceso de tu aprendizaje.' },
        { icono: 'FileCheck', titulo: 'Certificación Única', descripcion: 'Nuestros certificados cuenta con código único de validación además de un código QR para poder verificar la autenticidad.' },
        { icono: 'BookOpen', titulo: 'Cursos asincrónicos', descripcion: 'Contamos con cursos o especializaciones grabadas con acceso 24/7.' },
      ]),
      descripcion: 'Tarjetas de la sección "¿Por qué elegirnos?" en la página principal (JSON)'
    },
    {
      clave: 'HOME_LOGOS_SUBTITLE',
      valor: 'Empresas líderes confían en nuestra formación para capacitar a sus equipos.',
      descripcion: 'Descripción (debajo del título) de la sección "Logos de empresas clientes" en la página principal'
    },
    {
      clave: 'HOME_LOGOS_TITLE',
      valor: 'Capacita a tu equipo,\nsin complicaciones',
      descripcion: 'Título de la sección "Logos de empresas clientes" en la página principal'
    },
    {
      clave: 'HOME_DOCENTES_TITLE',
      valor: 'Nuestros docentes',
      descripcion: 'Título de la sección "Nuestros docentes" en la página principal'
    },
    {
      clave: 'HOME_DOCENTES_SUBTITLE',
      valor: 'Descubre a los apasionados educadores que forman parte de nuestro equipo docente, dedicados a inspirar y guiar a nuestros estudiantes en su viaje educativo. Con una combinación única de experiencia, dedicación y creatividad, nuestros profesores están comprometidos a brindar una educación de calidad que prepare a los estudiantes para enfrentar los desafíos del futuro. ¡Conoce más sobre ellos y su impacto en nuestra comunidad educativa!',
      descripcion: 'Descripción de la sección "Nuestros docentes" en la página principal'
    },
  ]

  for (const { clave, valor, descripcion } of homeDefaults) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: {},
      create: { clave, valor, descripcion }
    })
  }

  console.log(`✅ ${homeDefaults.length} textos por defecto de la home creados`)

  // ─── TEXTOS POR DEFECTO DE "NOSOTROS" ───────────────────────────────────────

  const nosotrosDefaults: { clave: string; valor: string; descripcion: string }[] = [
    {
      clave: 'NOSOTROS_HERO_TITLE',
      valor: 'Somos calidad y responsabilidad a tu servicio',
      descripcion: 'Título del hero en la página "Nosotros" (la última palabra se resalta)'
    },
    {
      clave: 'NOSOTROS_HERO_DESCRIPTION',
      valor: 'Somos una plataforma educativa especializada en la formación profesional de alto impacto. Ofrecemos cursos diseñados por expertos del sector, con certificaciones reconocidas que impulsan tu desarrollo profesional y el de tu equipo.',
      descripcion: 'Descripción del hero en la página "Nosotros"'
    },
    {
      clave: 'NOSOTROS_STATS',
      valor: JSON.stringify([
        { value: '+1,200', label: 'Estudiantes formados' },
        { value: '+80', label: 'Cursos disponibles' },
        { value: '+30', label: 'Docentes expertos' },
        { value: '98%', label: 'Tasa de satisfacción' },
      ]),
      descripcion: 'Estadísticas (2x2) del hero en la página "Nosotros" (JSON, 4 items — el ícono es fijo por posición)'
    },
    {
      clave: 'NOSOTROS_MISION_TEXTO',
      valor: 'Brindar formación profesional de alta calidad, accesible y orientada al sector industrial, impulsando el desarrollo de competencias que generan valor real en las organizaciones y en la carrera de nuestros estudiantes.',
      descripcion: 'Texto de la tarjeta "Nuestra Misión" en la página "Nosotros"'
    },
    {
      clave: 'NOSOTROS_VISION_TEXTO',
      valor: 'Ser la plataforma de referencia en formación profesional especializada en Latinoamérica, reconocida por la excelencia de sus contenidos, la solidez de sus certificaciones y su compromiso con la transformación del sector industrial.',
      descripcion: 'Texto de la tarjeta "Nuestra Visión" en la página "Nosotros"'
    },
    {
      clave: 'NOSOTROS_VALORES',
      valor: JSON.stringify([
        { titulo: 'Compromiso', descripcion: 'Nos dedicamos plenamente a la formación de cada estudiante, acompañándolos en cada etapa de su aprendizaje.' },
        { titulo: 'Innovación', descripcion: 'Buscamos constantemente nuevas formas de enseñar y de acercar el conocimiento de manera más efectiva.' },
        { titulo: 'Trabajo en Equipo', descripcion: 'Creemos en la colaboración como motor del aprendizaje y el crecimiento colectivo.' },
        { titulo: 'Mejora Continua', descripcion: 'Actualizamos nuestros contenidos y metodologías para mantenernos a la vanguardia del sector.' },
        { titulo: 'Integridad', descripcion: 'Actuamos con transparencia y honestidad, generando confianza en cada relación con nuestros estudiantes y empresas.' },
      ]),
      descripcion: 'Tarjetas de "Valores" en la página "Nosotros" (JSON, 5 items — el ícono es fijo por posición)'
    },
  ]

  for (const { clave, valor, descripcion } of nosotrosDefaults) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: {},
      create: { clave, valor, descripcion }
    })
  }

  console.log(`✅ ${nosotrosDefaults.length} textos por defecto de "Nosotros" creados`)

  // ─── TEXTOS POR DEFECTO DE PÁGINAS LEGALES ──────────────────────────────────
  // `contenido` de cada sección es texto plano; usa "\n\n" para separar párrafos.
  // La frase "Libro de Reclamaciones" se enlaza automáticamente a /libro-de-reclamaciones.

  const legalDefaults: { clave: string; valor: string; descripcion: string }[] = [
    // Términos y condiciones
    { clave: 'LEGAL_TERMINOS_TITULO', valor: 'Términos y Condiciones', descripcion: 'Título de la página de Términos y Condiciones' },
    { clave: 'LEGAL_TERMINOS_SUBTITULO', valor: 'Última actualización: Noviembre de 2024', descripcion: 'Subtítulo (fecha) de Términos y Condiciones' },
    { clave: 'LEGAL_TERMINOS_INTRO', valor: 'Bienvenido a NOMBRE DE TU EMPRESA ("Nosotros"). Al acceder a nuestro sitio web y utilizar nuestros servicios de Aula Virtual e Ingeniería, usted ("el Usuario") acepta estar sujeto a los presentes Términos y Condiciones. Le sugerimos leer esta página cuidadosamente antes de proceder con cualquier compra o inscripción.', descripcion: 'Párrafo introductorio de Términos y Condiciones' },
    {
      clave: 'LEGAL_TERMINOS_SECCIONES',
      valor: JSON.stringify([
        { titulo: '1. Generalidades de los Servicios', contenido: 'Brindamos servicios de capacitación, consultoría en sistemas de gestión (ISO), capacitaciones y entrenamiento, eventos, activaciones BTL y campañas en SST y respuesta ante emergencias, y actividades de trabajos de alto riesgo.\n\nNuestra Aula Virtual contiene cursos y certificaciones dirigidos a profesionales de las diferentes especialidades y sectores económicos. Al adquirir un curso, está comprando una licencia de acceso individual e intransferible.' },
        { titulo: '2. Pagos, Precios e Impuestos', contenido: 'Todos los pagos procesados en nuestro sitio web se gestionan a través de pasarelas de pago seguras. Los precios expuestos pueden estar sujetos a cambios; no obstante, una vez procesada una orden y validado el pago, el precio se mantendrá respetado. En caso de aplicar cupones de descuento, estos deben validarse antes del check-out final.' },
        { titulo: '3. Políticas de Devolución', contenido: 'Debido a la naturaleza de los bienes digitales (cursos pre-grabados y contenido virtual descargable), las devoluciones o reembolsos no están permitidos una vez que el usuario ingresa al Aula Virtual o se comprueba la descarga del material. Ante cualquier incidencia inusual o fallo técnico, puede escribir a nuestro equipo de soporte que evaluará excepciones únicamente ante defectos probados del sistema.' },
        { titulo: '4. Propiedad Intelectual e Industrial', contenido: 'Todo el material expuesto en la plataforma web (textos, gráficos, videos, diagramas y recursos) pertenece originariamente a NOMBRE DE TU EMPRESA o a sus instructores afiliados. Queda estrictamente prohibida su copia, distribución sin autorización comercial y cualquier modalidad de piratería. Cualquier violación directa implicará el bloqueo irrevocable de la cuenta y potenciales acciones civiles correspondientes.' },
        { titulo: '5. Certificaciones', contenido: 'La emisión de certificados dentro de nuestra plataforma se somete a los requisitos técnicos indicados en cada curso (visualización al 100%, aprobación de evaluaciones, etc.). Nos reservamos el derecho de verificar y cruzar la identidad de los estudiantes y de no emitir certificaciones si constatamos fraude o suplantación.' },
        { titulo: '6. Privacidad y Datos Personales', contenido: 'Nos comprometemos a mantener la confidencialidad de la información proporcionada por los usuarios en el momento del registro (Ley de Protección de Datos Personales o norma correspondiente en territorio peruano). Los datos se utilizan estrictamente para el servicio comercial del curso y fines facturativos, nunca serán cedidos a bases de datos de terceros.' },
        { titulo: '7. Contacto y Libro de Reclamaciones', contenido: 'Para consultas de soporte, envíe sus requerimientos a arm.confiabilidad@gmail.com. De acuerdo a la legislación vigente de protección al consumidor peruano, mantenemos un Libro de Reclamaciones a disposición pública en nuestra plataforma web.' },
      ]),
      descripcion: 'Secciones (título + contenido) de Términos y Condiciones (JSON)'
    },

    // Política de cambios y devoluciones
    { clave: 'LEGAL_DEVOLUCIONES_TITULO', valor: 'Política de Cambios y Devoluciones', descripcion: 'Título de la página de Política de Cambios y Devoluciones' },
    { clave: 'LEGAL_DEVOLUCIONES_SUBTITULO', valor: 'Última actualización: Marzo de 2026', descripcion: 'Subtítulo (fecha) de Política de Cambios y Devoluciones' },
    { clave: 'LEGAL_DEVOLUCIONES_INTRO', valor: 'La presente política regula las condiciones de reembolso y cambios aplicables a los servicios educativos ofrecidos por [NOMBRE DE EMPRESA], con RUC [RUC], con domicilio en [DIRECCIÓN] — a través de su Aula Virtual. Al adquirir cualquier curso, el usuario declara haber leído y aceptado los términos aquí descritos.', descripcion: 'Párrafo introductorio de Política de Cambios y Devoluciones' },
    {
      clave: 'LEGAL_DEVOLUCIONES_SECCIONES',
      valor: JSON.stringify([
        { titulo: '1. Naturaleza del Servicio', contenido: 'Los cursos y materiales ofrecidos en nuestra plataforma constituyen contenido digital de ejecución inmediata. Esto implica que el servicio educativo se activa y se considera prestado desde el momento en que el usuario realiza su primer acceso a la plataforma, visualiza la primera lección o descarga cualquier material complementario del curso adquirido.' },
        { titulo: '2. Excepción por Contenido Digital — Cláusula de Ejecución Inmediata', contenido: 'De conformidad con el Código de Protección y Defensa del Consumidor (Ley N° 29571) y las disposiciones de INDECOPI sobre contratos a distancia y servicios de ejecución inmediata:\n\nEl usuario reconoce expresamente que, al realizar el primer inicio de sesión, visualizar la primera lección o descargar cualquier material del curso, otorga su consentimiento expreso para el inicio inmediato de la prestación del servicio, renunciando con ello a su derecho de arrepentimiento o solicitud de reembolso, dado que el servicio se considera consumido desde el inicio de su ejecución.\n\nEsta condición es aplicable a todos los cursos, rutas de aprendizaje, paquetes y materiales digitales disponibles en la plataforma.' },
        { titulo: '3. Condiciones para Solicitar Reembolso', contenido: 'El usuario podrá solicitar el reembolso total de su compra únicamente bajo las siguientes condiciones:\n\na) Antes del primer acceso: que el usuario no haya ingresado a la plataforma ni visualizado contenido alguno tras la compra. El plazo máximo para esta solicitud es de 7 días calendario desde la fecha de pago confirmado.\n\nb) Falla técnica insubsanable: si existe un error técnico atribuible a nuestra plataforma que impida el acceso al contenido, y que el equipo de soporte no pueda resolver en un plazo de 72 horas hábiles desde la notificación formal del incidente.' },
        { titulo: '4. Proceso de Solicitud de Reembolso', contenido: 'Para iniciar un proceso de devolución (si aplica), el usuario debe:\n\n1. Enviar un correo a correo@gmail.com con el asunto: "Solicitud de Reembolso — [Nombre del Curso]".\n\n2. Adjuntar el comprobante de pago y número de pedido correspondiente.\n\n3. Nuestro equipo auditará los registros de acceso (logs de IP y actividad) para verificar que el contenido no haya sido consumido antes de proceder con la evaluación de la solicitud.' },
        { titulo: '5. Modalidad de Reembolso', contenido: 'Si la solicitud es aprobada, el reembolso se gestionará a través de la pasarela de pago correspondiente. El tiempo de acreditación en la cuenta del cliente dependerá de su entidad bancaria, generalmente entre 15 y 30 días hábiles.\n\nNos reservamos el derecho de descontar las comisiones operativas cobradas por la pasarela de pago que no sean reembolsables por la misma.' },
        { titulo: '6. Contacto y Atención al Cliente', contenido: 'Para consultas relacionadas con esta política, comuníquese con nosotros a través de correo@gmail.com. De acuerdo con la legislación de protección al consumidor vigente, también ponemos a su disposición nuestro Libro de Reclamaciones en la plataforma.' },
      ]),
      descripcion: 'Secciones (título + contenido) de Política de Cambios y Devoluciones (JSON)'
    },

    // Política de privacidad
    { clave: 'LEGAL_PRIVACIDAD_TITULO', valor: 'Política de Privacidad', descripcion: 'Título de la página de Política de Privacidad' },
    { clave: 'LEGAL_PRIVACIDAD_SUBTITULO', valor: 'Última actualización: Marzo de 2026', descripcion: 'Subtítulo (fecha) de Política de Privacidad' },
    { clave: 'LEGAL_PRIVACIDAD_INTRO', valor: 'En [NOMBRE DE EMPRESA] valoramos la confianza que nuestros usuarios depositan al compartir su información personal. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos los datos personales de quienes acceden a nuestra Aula Virtual, de acuerdo con la Ley N° 29733, Ley de Protección de Datos Personales, y su reglamento.', descripcion: 'Párrafo introductorio de Política de Privacidad' },
    {
      clave: 'LEGAL_PRIVACIDAD_SECCIONES',
      valor: JSON.stringify([
        { titulo: '1. Información que Recopilamos', contenido: 'Recopilamos datos proporcionados directamente por el usuario al registrarse, inscribirse a un curso o realizar una compra, tales como: nombres, apellidos, correo electrónico, número de teléfono, documento de identidad y datos de facturación. Asimismo, registramos información de uso de la plataforma (progreso de cursos, intentos de examen y actividad de acceso) con fines académicos.' },
        { titulo: '2. Finalidad del Tratamiento de Datos', contenido: 'Los datos personales se utilizan para: gestionar la inscripción y acceso a los cursos, procesar pagos a través de las pasarelas autorizadas (IziPay, PayPal, Culqi), emitir certificados de finalización, enviar comunicaciones sobre el estado de sus pedidos o cursos, y brindar soporte académico y técnico.' },
        { titulo: '3. Confidencialidad y Terceros', contenido: 'No vendemos ni cedemos la información personal de nuestros usuarios a terceros con fines comerciales. Solo compartimos datos estrictamente necesarios con proveedores de pago y correo electrónico para la correcta prestación del servicio, quienes están obligados a mantener la confidencialidad de dicha información.' },
        { titulo: '4. Derechos del Usuario (ARCO)', contenido: 'El usuario puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición sobre sus datos personales, enviando una solicitud a flyup.sale@gmail.com, adjuntando copia de su documento de identidad para validar la titularidad de la solicitud.' },
        { titulo: '5. Seguridad de la Información', contenido: 'Implementamos medidas técnicas y organizativas razonables (cifrado de contraseñas, conexiones seguras y controles de acceso) para proteger los datos personales contra accesos no autorizados, pérdida o alteración.' },
        { titulo: '6. Cambios a esta Política', contenido: 'Nos reservamos el derecho de actualizar esta Política de Privacidad para reflejar cambios legales o mejoras en nuestros procesos. Cualquier modificación relevante será comunicada a través de la plataforma.' },
        { titulo: '7. Contacto', contenido: 'Para consultas sobre el tratamiento de sus datos personales, escríbanos a flyup.sale@gmail.com. De acuerdo a la legislación de protección al consumidor vigente, también ponemos a su disposición nuestro Libro de Reclamaciones en la plataforma.' },
      ]),
      descripcion: 'Secciones (título + contenido) de Política de Privacidad (JSON)'
    },

    // Libro de reclamaciones (solo textos — el formulario es fijo)
    { clave: 'LEGAL_RECLAMOS_INTRO', valor: 'Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, esta institución cuenta con un Libro de Reclamaciones Virtual a su disposición.', descripcion: 'Párrafo introductorio del Libro de Reclamaciones' },
    { clave: 'LEGAL_RECLAMOS_PROVEEDOR', valor: 'NOMBRE DE TU EMPRESA', descripcion: 'Nombre del proveedor mostrado en el Libro de Reclamaciones' },
    { clave: 'LEGAL_RECLAMOS_RUC', valor: '20600000000', descripcion: 'RUC mostrado en el Libro de Reclamaciones' },
    { clave: 'LEGAL_RECLAMOS_DOMICILIO', valor: '[DIRECCIÓN]', descripcion: 'Domicilio mostrado en el Libro de Reclamaciones' },
  ]

  for (const { clave, valor, descripcion } of legalDefaults) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: {},
      create: { clave, valor, descripcion }
    })
  }

  console.log(`✅ ${legalDefaults.length} textos por defecto de páginas legales creados`)

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
