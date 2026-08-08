import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Escuela de Tecnología e Innovación...')

  // 1. Create or update the school
  const escuela = await prisma.escuela.upsert({
    where: { slug: 'tecnologia-e-innovacion' },
    update: {
      nombre: 'Tecnología e Innovación',
      descripcion: 'Fortalecer competencias tecnológicas relacionadas con programación, análisis de datos, Inteligencia Artificial y automatización.',
      orden: 1,
      estado: 'DISPONIBLE',
    },
    create: {
      nombre: 'Tecnología e Innovación',
      slug: 'tecnologia-e-innovacion',
      descripcion: 'Fortalecer competencias tecnológicas relacionadas con programación, análisis de datos, Inteligencia Artificial y automatización.',
      orden: 1,
      estado: 'DISPONIBLE',
    },
  })

const adminUser = await prisma.usuario.findFirst({
    where: { rol: 'ADMIN' }
  })
  
  if (!adminUser) {
    throw new Error('No ADMIN user found to assign as professor. Run other seeds first.')
  }

  // 2. Define courses
  const cursosData = [
    { codigo: 'C1', titulo: 'Algoritmos y Fundamentos de Programación' },
    { codigo: 'C2', titulo: 'Python' },
    { codigo: 'C3', titulo: 'Programación Orientada a Objetos' },
    { codigo: 'C4', titulo: 'Fundamentos de Bases de Datos y SQL' },
    { codigo: 'C5', titulo: 'Fundamentos de Estadística y Power BI' },
    { codigo: 'C6', titulo: 'IA Generativa e Ingeniería de Prompting' },
    { codigo: 'C7', titulo: 'Automatización y Aplicaciones con IA' },
  ]

  const createdCursos: Record<string, any> = {}

  for (const c of cursosData) {
    const slug = c.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const curso = await prisma.curso.upsert({
      where: { slug },
      update: {
        titulo: c.titulo,
      },
      create: {
        titulo: c.titulo,
        slug,
        descripcion: `Curso de ${c.titulo}`,
        precio: 0,
        es_gratis: true,
        estado: 'PUBLICADO',
        profesor_id: adminUser.id,
      },
    })
    createdCursos[c.codigo] = curso
  }

  // 3. Define learning paths (Rutas)
  const rutasData = [
    {
      titulo: 'Programador con IA',
      cursos: ['C1', 'C2', 'C3', 'C6', 'C7'],
    },
    {
      titulo: 'Analista de Datos',
      cursos: ['C2', 'C4', 'C5', 'C6'],
    },
    {
      titulo: 'IA Aplicada',
      cursos: ['C2', 'C6', 'C7'],
    },
    {
      titulo: 'Desarrollador de Aplicaciones',
      cursos: ['C1', 'C2', 'C3', 'C4', 'C6'],
    },
    {
      titulo: 'Profesional Digital 2050',
      cursos: ['C1', 'C2', 'C4', 'C5', 'C6', 'C7'],
    },
  ]

  // Clear existing paths for this school to avoid duplicates when running repeatedly
  await prisma.rutaAprendizaje.deleteMany({
    where: { escuela_id: escuela.id },
  })

  // 4. Create routes and associations
  let ordenRuta = 1
  for (const r of rutasData) {
    const slug = r.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    
    const ruta = await prisma.rutaAprendizaje.create({
      data: {
        titulo: r.titulo,
        slug,
        descripcion: `Ruta de aprendizaje: ${r.titulo}`,
        escuela: { connect: { id: escuela.id } },
        esta_activo: true,
      }
    })

    // Associate courses
    let ordenCurso = 1
    for (const codigo of r.cursos) {
      const curso = createdCursos[codigo]
      await prisma.cursoEnRuta.create({
        data: {
          ruta: { connect: { id: ruta.id } },
          curso: { connect: { id: curso.id } },
          orden: ordenCurso++,
        }
      })
    }
    console.log(`Created ruta: ${r.titulo} with ${r.cursos.length} courses`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
