import prisma from '../src/utils/libs/prisma'

async function check() {
  try {
    // We try to create a dummy notification with the new fields to see if TypeScript/Runtime accepts it
    // Note: This won't actually be committed if we don't save or if we handle the error
    const fields = Object.keys(prisma.notificacion?.fields || {})
    console.log('Notificacion Fields:', fields)
    
    // Check if fields exist in the model definition
    const hasTipo = 'tipo' in (prisma.notificacion as any) || fields.includes('tipo')
    const hasEnlace = 'enlace' in (prisma.notificacion as any) || fields.includes('enlace')
    
    console.log('Has tipo:', hasTipo)
    console.log('Has enlace:', hasEnlace)
  } catch (e: any) {
    console.log('Error checking fields:', e.message)
  }
  process.exit(0)
}

check()
