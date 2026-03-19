import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('Admin123!', 10)

  await prisma.usuario.upsert({
    where: { correo: 'admin@aulavirtual.com' },
    update: {},
    create: {
      correo: 'admin@aulavirtual.com',
      contrasena: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      numero_documento: '12345678',
      celular: '987654321',
      rol: Rol.ADMIN,
      esta_activo: true
    }
  })

  // Crear usuario profesor
  const profesorPassword = await bcrypt.hash('Profesor123!', 10)

   await prisma.usuario.upsert({
    where: { correo: 'profesor@aulavirtual.com' },
    update: {},
    create: {
      correo: 'profesor@aulavirtual.com',
      contrasena: profesorPassword,
      nombre: 'Juan',
      apellido: 'Profesor',
      numero_documento: '87654321',
      celular: '987654322',
      rol: Rol.PROFESOR,
      esta_activo: true
    }
  })





  console.log('✅ Cursos y categorías de ejemplo creados.')
  console.log('🎉 Seed completado!')
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
