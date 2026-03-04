import { PrismaClient, Rol, EstadoCurso } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('Admin123!', 10)

  const admin = await prisma.usuario.upsert({
    where: { correo: 'admin@aulavirtual.com' },
    update: {},
    create: {
      correo: 'admin@aulavirtual.com',
      contrasena: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      numero_documento: '12345678',
      celular: '987654321',
      rol: Rol.ADMIN,
      esta_activo: true
    }
  })

  // Crear usuario profesor
  const profesorPassword = await bcrypt.hash('Profesor123!', 10)

  const profesor = await prisma.usuario.upsert({
    where: { correo: 'profesor@aulavirtual.com' },
    update: {},
    create: {
      correo: 'profesor@aulavirtual.com',
      contrasena: profesorPassword,
      nombre: 'Juan',
      apellido: 'Profesor',
      numero_documento: '87654321',
      celular: '987654322',
      rol: Rol.PROFESOR,
      esta_activo: true
    }
  })

  // Categorías
  const categorias = [
    { nombre: 'Programación', slug: 'programacion' },
    { nombre: 'Diseño', slug: 'diseno' },
    { nombre: 'Marketing', slug: 'marketing' },
    { nombre: 'Negocios', slug: 'negocios' }
  ]

  for (const cat of categorias) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    })
  }

  const catProg = await prisma.categoria.findUnique({ where: { slug: 'programacion' } })
  const catDiseno = await prisma.categoria.findUnique({ where: { slug: 'diseno' } })

  // Cursos de ejemplo
  const cursos = [
    {
      titulo: 'Master en React y Next.js',
      slug: 'master-react-nextjs',
      descripcion: 'Domina React y Next.js desde cero hasta nivel avanzado con los frameworks más potentes.',
      precio: 99.99,
      estado: EstadoCurso.PUBLICADO,
      categoria_id: catProg?.id,
      profesor_id: profesor.id,
      miniatura: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
      nivel: 'AVANZADO',
      tipo_emision: 'ASINCRONO'
    },
    {
      titulo: 'Diseño UI/UX Profesional',
      slug: 'diseno-ui-ux-pro',
      descripcion: 'Crea interfaces impactantes y aprende las mejores prácticas de diseño para apps y web.',
      precio: 79.99,
      estado: EstadoCurso.PUBLICADO,
      categoria_id: catDiseno?.id,
      profesor_id: profesor.id,
      miniatura: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80',
      nivel: 'INTERMEDIO',
      tipo_emision: 'SINCRONO'
    },
    {
      titulo: 'Node.js Avanzado y Microservicios',
      slug: 'nodejs-avanzado',
      descripcion: 'Escala tus aplicaciones backend con arquitecturas robustas y aprende Microservicios.',
      precio: 120.00,
      estado: EstadoCurso.PUBLICADO,
      categoria_id: catProg?.id,
      profesor_id: profesor.id,
      miniatura: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
      nivel: 'AVANZADO',
      tipo_emision: 'MIXTO'
    },
    {
      titulo: 'Curso de Python para Data Science',
      slug: 'python-data-science',
      descripcion: 'Analiza datos y crea modelos de machine learning con el lenguaje de programación más versátil.',
      precio: 0,
      es_gratis: true,
      estado: EstadoCurso.PUBLICADO,
      categoria_id: catProg?.id,
      profesor_id: profesor.id,
      miniatura: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
      nivel: 'BASICO',
      tipo_emision: 'ASINCRONO'
    }
  ]

  for (const cursoData of cursos) {
    const curso = await prisma.curso.upsert({
      where: { slug: cursoData.slug },
      update: cursoData as any,
      create: cursoData as any
    })

    const getModulosForCurso = (titulo: string) => [
      {
        titulo: `Fundamentos de ${titulo}`,
        orden: 1,
        lecciones: [
          { titulo: 'Introducción básica', orden: 1, duracion: 10 },
          { titulo: 'Historia y evolución', orden: 2, duracion: 15 },
          { titulo: 'Primeros pasos prácticos', orden: 3, duracion: 20 },
          { titulo: 'Herramientas esenciales', orden: 4, duracion: 25 }
        ]
      },
      {
        titulo: 'Técnicas Intermedias',
        orden: 2,
        lecciones: [
          { titulo: 'Profundizando en el lenguaje', orden: 1, duracion: 30 },
          { titulo: 'Gestión de estados y datos', orden: 2, duracion: 35 },
          { titulo: 'Integración con APIs externas', orden: 3, duracion: 40 }
        ]
      },
      {
        titulo: 'Proyecto Final y Despliegue',
        orden: 3,
        lecciones: [
          { titulo: 'Arquitectura escalable', orden: 1, duracion: 45 },
          { titulo: 'Testing y Garantía de Calidad', orden: 2, duracion: 30 },
          { titulo: 'Publicación en el mundo real', orden: 3, duracion: 20 }
        ]
      }
    ]

    const modulos = getModulosForCurso(cursoData.titulo)

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
          update: { 
            titulo: lecData.titulo,
            duracion: lecData.duracion
          },
          create: {
            titulo: lecData.titulo,
            orden: lecData.orden,
            duracion: lecData.duracion,
            modulo_id: modulo.id
          }
        })
      }
    }
  }

  console.log('✅ Cursos y categorías de ejemplo creados.')
  console.log('🎉 Seed completado!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
