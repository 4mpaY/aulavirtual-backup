import prisma from './src/utils/libs/prisma'

async function main() {
  const configs = await prisma.configuracion.findMany()

  console.log(JSON.stringify(configs, null, 2))
}

main().catch(console.error)
