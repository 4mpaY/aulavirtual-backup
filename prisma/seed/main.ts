import { PrismaClient, Rol } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('Admin123!', 10)

  const admin = await prisma.usuario.upsert({
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

  console.log('✅ Usuario admin creado:', admin.correo)

  // Crear usuario profesor
  const profesorPassword = await bcrypt.hash('Profesor123!', 10)

  const profesor = await prisma.usuario.upsert({
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

  console.log('✅ Usuario profesor creado:', profesor.correo)

  // Crear usuario estudiante
  const estudiantePassword = await bcrypt.hash('Estudiante123!', 10)

  const estudiante = await prisma.usuario.upsert({
    where: { correo: 'estudiante@aulavirtual.com' },
    update: {},
    create: {
      correo: 'estudiante@aulavirtual.com',
      contrasena: estudiantePassword,
      nombre: 'María',
      apellido: 'Estudiante',
      numero_documento: '11223344',
      celular: '987654323',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  console.log('✅ Usuario estudiante creado:', estudiante.correo)
  console.log('')
  console.log('🎉 Seed completado!')
  console.log('')
  console.log('📝 Usuarios de prueba:')
  console.log('   - Admin: admin@aulavirtual.com / Admin123!')
  console.log('   - Profesor: profesor@aulavirtual.com / Profesor123!')
  console.log('   - Estudiante: estudiante@aulavirtual.com / Estudiante123!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
