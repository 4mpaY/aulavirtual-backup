import prisma from '../src/utils/libs/prisma'

async function check() {
  console.log('Prisma Models:', Object.keys(prisma))
  if ('comentario' in prisma) {
    console.log('Comentario model FOUND')
  } else {
    console.log('Comentario model NOT FOUND')
  }
  process.exit(0)
}

check()
