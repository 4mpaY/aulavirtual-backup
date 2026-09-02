import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Try to create or find an existing school matching the frontend slug
  const escuela = await prisma.escuela.upsert({
    where: { slug: 'tecnologia-e-innovacion' },
    update: {},
    create: {
      nombre: 'Escuela de Tecnología e Innovación',
      slug: 'tecnologia-e-innovacion',
      descripcion: 'Fortalece competencias en programación...',
      estado: 'DISPONIBLE',
      orden: 1,
    }
  })

  console.log('Escuela creada/encontrada:', escuela.nombre)

  // Add a test ruta to this school
  const ruta = await prisma.rutaAprendizaje.upsert({
    where: { slug: 'ruta-desarrollo-web-fullstack' },
    update: { escuela_id: escuela.id },
    create: {
      titulo: 'Ruta de Desarrollo Web Fullstack',
      slug: 'ruta-desarrollo-web-fullstack',
      descripcion: 'Aprende a crear aplicaciones web completas',
      esta_activo: true,
      escuela_id: escuela.id
    }
  })

  console.log('Ruta creada/actualizada:', ruta.titulo)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
