import prisma from '../src/utils/libs/prisma'

async function check() {
  const keys = Object.keys(prisma.notificacion || {})
  console.log('Notificacion Keys:', keys)
  
  // Try to find one or just inspect the model definition (mock check)
  try {
    const dummy = await prisma.notificacion.findFirst()
    console.log('Query attempt OK')
  } catch (e: any) {
    console.log('Query attempt ERRORED:', e.message)
  }
  process.exit(0)
}

check()
