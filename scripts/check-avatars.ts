import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const usuarios = await prisma.usuario.findMany({
    where: { role: 'PROFESOR' },
    select: { nombre: true, apellido: true, avatar: true }
  })

  console.log('--- Avatares de Profesores ---')
  usuarios.forEach(u => {
    console.log(`${u.nombre} ${u.apellido}: [${u.avatar}]`)
  })
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
