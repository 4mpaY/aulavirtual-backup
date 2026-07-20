import prisma from '../src/utils/libs/prisma'

async function main() {
  await prisma.configuracion.upsert({
    where: { clave: 'WEB_EMPRESAS_HABILITADO' },
    update: { valor: 'false' },
    create: { clave: 'WEB_EMPRESAS_HABILITADO', valor: 'false', descripcion: 'Mostrar página de Empresas' },
  })
  console.log('WEB_EMPRESAS_HABILITADO set to false')
}

main().finally(() => prisma.$disconnect())
