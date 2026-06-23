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

  await prisma.curso.upsert({
    where: { slug: 'costos-presupuestos-obra-s10' },
    update: {},
    create: {
      titulo: 'Elaboración de Costos y Presupuestos de Obra con S10 y MS Project',
      slug: 'costos-presupuestos-obra-s10',
      descripcion: 'Aprende a elaborar presupuestos de obra, análisis de precios unitarios y programación de proyectos usando S10 y MS Project.',
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
                  video_url: 'https://www.youtube.com/watch?v=example1',
                  es_vista_previa: true
                },
                {
                  titulo: 'Análisis de precios unitarios (APU)',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example2'
                },
                {
                  titulo: 'Metrados y partidas según norma técnica',
                  orden: 2,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=example3'
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
                  video_url: 'https://www.youtube.com/watch?v=example4'
                },
                {
                  titulo: 'Programación de obra con MS Project',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=example5'
                },
                {
                  titulo: 'Control de costos y curva S',
                  orden: 2,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example6'
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
                  video_url: 'https://www.youtube.com/watch?v=example7',
                  es_vista_previa: true
                },
                {
                  titulo: 'Elaboración de valorizaciones mensuales',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example8'
                },
                {
                  titulo: 'Reajuste de precios y fórmulas polinómicas',
                  orden: 2,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example9'
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
                  video_url: 'https://www.youtube.com/watch?v=example10'
                },
                {
                  titulo: 'Resolución de controversias y ampliaciones de plazo',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example11'
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
                  video_url: 'https://www.youtube.com/watch?v=example12',
                  es_vista_previa: true
                },
                {
                  titulo: 'Identificación de pérdidas y restricciones',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example13'
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
                  video_url: 'https://www.youtube.com/watch?v=example14'
                },
                {
                  titulo: 'Value Stream Mapping en obra',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example15'
                },
                {
                  titulo: 'Implementación de Lean en proyectos reales',
                  orden: 2,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=example16'
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
                  video_url: 'https://www.youtube.com/watch?v=example17',
                  es_vista_previa: true
                },
                {
                  titulo: 'Materiales y capas estructurales del pavimento',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=example18'
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
                  video_url: 'https://www.youtube.com/watch?v=example19'
                },
                {
                  titulo: 'Patologías del pavimento y métodos de rehabilitación',
                  orden: 1,
                  duracion: 30,
                  video_url: 'https://www.youtube.com/watch?v=example20'
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
                  video_url: 'https://www.youtube.com/watch?v=example21',
                  es_vista_previa: true
                },
                {
                  titulo: 'Identificación de peligros y evaluación de riesgos (IPER)',
                  orden: 1,
                  duracion: 25,
                  video_url: 'https://www.youtube.com/watch?v=example22'
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
                  video_url: 'https://www.youtube.com/watch?v=example23'
                },
                {
                  titulo: 'Investigación de accidentes e incidentes laborales',
                  orden: 1,
                  duracion: 20,
                  video_url: 'https://www.youtube.com/watch?v=example24'
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
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
