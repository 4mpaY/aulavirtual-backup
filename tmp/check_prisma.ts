import prisma from '../src/utils/libs/prisma'

async function check() {
  console.log('Prisma Models:', Object.keys(prisma))
  if ('notificacion' in prisma) {
    console.log('Notificacion model FOUND')
  } else {
    console.log('Notificacion model NOT FOUND')
  }
  process.exit(0)
}

check()
