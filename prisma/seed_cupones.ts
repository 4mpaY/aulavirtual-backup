import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Creando cupones de prueba...')

  const cupones = [
    {
      codigo: 'DESCUENTO10',
      valor: 10.0,
      tipo: 'PORCENTAJE',
      esta_activo: true,
      limite_uso: 100,
      usos_actuales: 0
    },
    {
      codigo: 'PROMOFIJA20',
      valor: 20.0,
      tipo: 'MONTO_FIJO',
      esta_activo: true,
      limite_uso: 50,
      usos_actuales: 0
    },
    {
      codigo: 'EXPIRADO',
      valor: 50.0,
      tipo: 'PORCENTAJE',
      esta_activo: true,
      fecha_expiracion: new Date('2024-01-01'),
      limite_uso: 10,
      usos_actuales: 0
    },
    {
      codigo: 'INACTIVO',
      valor: 15.0,
      tipo: 'PORCENTAJE',
      esta_activo: false,
      limite_uso: 100,
      usos_actuales: 0
    }
  ]

  for (const cuponData of cupones) {
    await prisma.cupon.upsert({
      where: { codigo: cuponData.codigo },
      update: {},
      create: cuponData as any
    })
  }

  console.log('✅ Cupones de prueba creados exitosamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
