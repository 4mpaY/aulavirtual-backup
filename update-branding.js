const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.configuracion.upsert({
    where: { clave: 'TEMPLATE_NAME' },
    update: { valor: 'AGENDA 2050' },
    create: { clave: 'TEMPLATE_NAME', valor: 'AGENDA 2050' }
  })
  
  await prisma.configuracion.upsert({
    where: { clave: 'TEMPLATE_SLOGAN' },
    update: { valor: 'La educación abre caminos. La tecnología los multiplica.' },
    create: { clave: 'TEMPLATE_SLOGAN', valor: 'La educación abre caminos. La tecnología los multiplica.' }
  })
  
  await prisma.configuracion.upsert({
    where: { clave: 'CERTIFICADO_INSTITUTION_NAME' },
    update: { valor: 'AGENDA 2050 PERÚ' },
    create: { clave: 'CERTIFICADO_INSTITUTION_NAME', valor: 'AGENDA 2050 PERÚ' }
  })
  
  console.log('Successfully updated branding configurations in DB')
}

main().catch(console.error).finally(() => prisma.$disconnect())
