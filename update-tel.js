const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.configuracion.upsert({
    where: { clave: 'TELEFONO' },
    update: { valor: '+51 994 356 180' },
    create: { clave: 'TELEFONO', valor: '+51 994 356 180' }
  })
  
  // also clear whatsapp number just in case there is any other key
  console.log('Successfully updated telephone in database')
}

main().catch(console.error).finally(() => prisma.$disconnect())
