const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Update main whatsapp number
  await prisma.configuracion.upsert({
    where: { clave: 'WHATSAPP_NUMERO' },
    update: { valor: '51994356180' },
    create: { clave: 'WHATSAPP_NUMERO', valor: '51994356180' }
  })

  // Update payment whatsapp number if it exists
  const pagoManual = await prisma.configuracion.findUnique({
    where: { clave: 'PAGO_MANUAL_WHATSAPP_NUMERO' }
  })
  if (pagoManual) {
    await prisma.configuracion.update({
      where: { clave: 'PAGO_MANUAL_WHATSAPP_NUMERO' },
      data: { valor: '51994356180' }
    })
  } else {
    await prisma.configuracion.create({
        data: { clave: 'PAGO_MANUAL_WHATSAPP_NUMERO', valor: '51994356180' }
    })
  }
  
  console.log('Successfully updated whatsapp numbers in database')
}

main().catch(console.error).finally(() => prisma.$disconnect())
