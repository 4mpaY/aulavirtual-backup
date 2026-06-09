/**
 * Seed de suscripciones de prueba
 * Crea 5 usuarios estudiantes con suscripciones en distintos estados:
 * ACTIVA, EN_PRUEBA, PENDIENTE, VENCIDA, CANCELADA
 *
 * Ejecutar: pnpm db:seed:suscripciones
 */
import { PrismaClient, Rol, EstadoSuscripcion, EstadoPagoSuscripcion } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const now = new Date()
const hace1Mes = new Date(now); hace1Mes.setMonth(hace1Mes.getMonth() - 1)
const hace2Meses = new Date(now); hace2Meses.setMonth(hace2Meses.getMonth() - 2)
const hace3Meses = new Date(now); hace3Meses.setMonth(hace3Meses.getMonth() - 3)
const en1Semana = new Date(now); en1Semana.setDate(en1Semana.getDate() + 7)
const en1Mes = new Date(now); en1Mes.setMonth(en1Mes.getMonth() + 1)
const en2Meses = new Date(now); en2Meses.setMonth(en2Meses.getMonth() + 2)
const hace2Semanas = new Date(now); hace2Semanas.setDate(hace2Semanas.getDate() - 14)
const hace1Semana = new Date(now); hace1Semana.setDate(hace1Semana.getDate() - 7)

async function main() {
  console.log('🌱 Iniciando seed de suscripciones de prueba...\n')

  // ─── PLANES ───────────────────────────────────────────────────────────────────
  // Los planes deben existir (creados por main.ts).
  // Buscamos los 3 planes del seed principal.
  const planMensual = await prisma.planSuscripcion.findUnique({ where: { id: 'plan-mensual' } })
  const planTrimestral = await prisma.planSuscripcion.findUnique({ where: { id: 'plan-trimestral' } })
  const planAnual = await prisma.planSuscripcion.findUnique({ where: { id: 'plan-anual' } })

  if (!planMensual || !planTrimestral || !planAnual) {
    console.error('❌ Planes no encontrados. Ejecuta primero: pnpm db:main:seed')
    process.exit(1)
  }

  const password = await bcrypt.hash('Test123@', 10)

  // ─── USUARIOS DE PRUEBA ───────────────────────────────────────────────────────

  const carlos = await prisma.usuario.upsert({
    where: { correo: 'carlos.mendoza@test.com' },
    update: {},
    create: {
      correo: 'carlos.mendoza@test.com',
      contrasena: password,
      nombre: 'Carlos',
      apellido: 'Mendoza',
      numero_documento: '72345678',
      celular: '912345678',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  const ana = await prisma.usuario.upsert({
    where: { correo: 'ana.torres@test.com' },
    update: {},
    create: {
      correo: 'ana.torres@test.com',
      contrasena: password,
      nombre: 'Ana',
      apellido: 'Torres',
      numero_documento: '73456789',
      celular: '913456789',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  const pedro = await prisma.usuario.upsert({
    where: { correo: 'pedro.suarez@test.com' },
    update: {},
    create: {
      correo: 'pedro.suarez@test.com',
      contrasena: password,
      nombre: 'Pedro',
      apellido: 'Suárez',
      numero_documento: '74567890',
      celular: '914567890',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  const lucia = await prisma.usuario.upsert({
    where: { correo: 'lucia.ramirez@test.com' },
    update: {},
    create: {
      correo: 'lucia.ramirez@test.com',
      contrasena: password,
      nombre: 'Lucía',
      apellido: 'Ramírez',
      numero_documento: '75678901',
      celular: '915678901',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  const miguel = await prisma.usuario.upsert({
    where: { correo: 'miguel.castro@test.com' },
    update: {},
    create: {
      correo: 'miguel.castro@test.com',
      contrasena: password,
      nombre: 'Miguel',
      apellido: 'Castro',
      numero_documento: '76789012',
      celular: '916789012',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  const valeria = await prisma.usuario.upsert({
    where: { correo: 'valeria.quispe@test.com' },
    update: {},
    create: {
      correo: 'valeria.quispe@test.com',
      contrasena: password,
      nombre: 'Valeria',
      apellido: 'Quispe',
      numero_documento: '77890123',
      celular: '917890123',
      rol: Rol.ESTUDIANTE,
      esta_activo: true
    }
  })

  console.log('✅ Usuarios de prueba creados')

  // ─── HELPER: upsert de suscripción + pago ─────────────────────────────────────
  async function upsertSuscripcion(data: {
    id: string
    usuarioId: string
    planId: string
    estado: EstadoSuscripcion
    culqiSuscripcionId: string
    culqiCustomerId: string
    culqiCardId: string
    fechaInicio: Date
    fechaFin: Date | null
    fechaProximoCobro: Date | null
    fechaCancelacion?: Date | null
    canceladoPorUsuario?: boolean
    pagos: Array<{
      id: string
      monto: number
      moneda: string
      estado: EstadoPagoSuscripcion
      periodoInicio: Date
      periodoFin: Date | null
    }>
  }) {
    const sub = await prisma.suscripcion.upsert({
      where: { id: data.id },
      update: {
        estado: data.estado,
        fecha_proximo_cobro: data.fechaProximoCobro,
        fecha_cancelacion: data.fechaCancelacion ?? null
      },
      create: {
        id: data.id,
        usuario_id: data.usuarioId,
        plan_id: data.planId,
        estado: data.estado,
        culqi_suscripcion_id: data.culqiSuscripcionId,
        culqi_customer_id: data.culqiCustomerId,
        culqi_card_id: data.culqiCardId,
        fecha_inicio: data.fechaInicio,
        fecha_fin: data.fechaFin,
        fecha_proximo_cobro: data.fechaProximoCobro,
        fecha_cancelacion: data.fechaCancelacion ?? null,
        cancelado_por_usuario: data.canceladoPorUsuario ?? false
      }
    })

    for (const pago of data.pagos) {
      await prisma.pagoSuscripcion.upsert({
        where: { id: pago.id },
        update: { estado: pago.estado },
        create: {
          id: pago.id,
          suscripcion_id: sub.id,
          monto: pago.monto,
          moneda: pago.moneda,
          estado: pago.estado,
          periodo_inicio: pago.periodoInicio,
          periodo_fin: pago.periodoFin
        }
      })
    }

    return sub
  }

  // ─── SUSCRIPCIONES DE PRUEBA ──────────────────────────────────────────────────

  // 1. Carlos — Plan Mensual — ACTIVA (lleva 1 mes, próximo cobro en 1 semana)
  await upsertSuscripcion({
    id: 'sub-test-carlos-mensual',
    usuarioId: carlos.id,
    planId: planMensual.id,
    estado: EstadoSuscripcion.ACTIVA,
    culqiSuscripcionId: 'sxn_test_CarlosMensual001',
    culqiCustomerId: 'cus_test_Carlos001',
    culqiCardId: 'crd_test_Carlos001',
    fechaInicio: hace1Mes,
    fechaFin: null,
    fechaProximoCobro: en1Semana,
    pagos: [
      {
        id: 'pago-test-carlos-01',
        monto: 99,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.COMPLETADO,
        periodoInicio: hace1Mes,
        periodoFin: now
      }
    ]
  })

  // 2. Ana — Plan Trimestral — ACTIVA (lleva 2 meses, próximo cobro en 1 mes)
  await upsertSuscripcion({
    id: 'sub-test-ana-trimestral',
    usuarioId: ana.id,
    planId: planTrimestral.id,
    estado: EstadoSuscripcion.ACTIVA,
    culqiSuscripcionId: 'sxn_test_AnaTrimestral001',
    culqiCustomerId: 'cus_test_Ana001',
    culqiCardId: 'crd_test_Ana001',
    fechaInicio: hace2Meses,
    fechaFin: null,
    fechaProximoCobro: en1Mes,
    pagos: [
      {
        id: 'pago-test-ana-01',
        monto: 249,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.COMPLETADO,
        periodoInicio: hace2Meses,
        periodoFin: en1Mes
      }
    ]
  })

  // 3. Pedro — Plan Anual — EN_PRUEBA (comenzó hoy, próximo cobro en 2 meses)
  await upsertSuscripcion({
    id: 'sub-test-pedro-anual-prueba',
    usuarioId: pedro.id,
    planId: planAnual.id,
    estado: EstadoSuscripcion.EN_PRUEBA,
    culqiSuscripcionId: 'sxn_test_PedroAnual001',
    culqiCustomerId: 'cus_test_Pedro001',
    culqiCardId: 'crd_test_Pedro001',
    fechaInicio: now,
    fechaFin: null,
    fechaProximoCobro: en2Meses,
    pagos: [
      {
        id: 'pago-test-pedro-01',
        monto: 0,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.PENDIENTE,
        periodoInicio: now,
        periodoFin: en2Meses
      }
    ]
  })

  // 4. Lucía — Plan Mensual — PENDIENTE (recién creada, sin confirmar pago)
  await upsertSuscripcion({
    id: 'sub-test-lucia-mensual-pendiente',
    usuarioId: lucia.id,
    planId: planMensual.id,
    estado: EstadoSuscripcion.PENDIENTE,
    culqiSuscripcionId: 'sxn_test_LuciaMensual001',
    culqiCustomerId: 'cus_test_Lucia001',
    culqiCardId: 'crd_test_Lucia001',
    fechaInicio: now,
    fechaFin: null,
    fechaProximoCobro: en1Mes,
    pagos: [
      {
        id: 'pago-test-lucia-01',
        monto: 99,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.PENDIENTE,
        periodoInicio: now,
        periodoFin: en1Mes
      }
    ]
  })

  // 5. Miguel — Plan Trimestral — VENCIDA (venció hace 2 semanas)
  await upsertSuscripcion({
    id: 'sub-test-miguel-trimestral-vencida',
    usuarioId: miguel.id,
    planId: planTrimestral.id,
    estado: EstadoSuscripcion.VENCIDA,
    culqiSuscripcionId: 'sxn_test_MiguelTrimestral001',
    culqiCustomerId: 'cus_test_Miguel001',
    culqiCardId: 'crd_test_Miguel001',
    fechaInicio: hace3Meses,
    fechaFin: hace2Semanas,
    fechaProximoCobro: null,
    pagos: [
      {
        id: 'pago-test-miguel-01',
        monto: 249,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.COMPLETADO,
        periodoInicio: hace3Meses,
        periodoFin: hace2Meses
      },
      {
        id: 'pago-test-miguel-02',
        monto: 249,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.FALLIDO,
        periodoInicio: hace2Meses,
        periodoFin: hace2Semanas
      }
    ]
  })

  // 6. Valeria — Plan Anual — CANCELADA (canceló hace 1 semana)
  await upsertSuscripcion({
    id: 'sub-test-valeria-anual-cancelada',
    usuarioId: valeria.id,
    planId: planAnual.id,
    estado: EstadoSuscripcion.CANCELADA,
    culqiSuscripcionId: 'sxn_test_ValeriaAnual001',
    culqiCustomerId: 'cus_test_Valeria001',
    culqiCardId: 'crd_test_Valeria001',
    fechaInicio: hace2Meses,
    fechaFin: hace1Semana,
    fechaProximoCobro: null,
    fechaCancelacion: hace1Semana,
    canceladoPorUsuario: true,
    pagos: [
      {
        id: 'pago-test-valeria-01',
        monto: 799,
        moneda: 'PEN',
        estado: EstadoPagoSuscripcion.COMPLETADO,
        periodoInicio: hace2Meses,
        periodoFin: hace1Semana
      }
    ]
  })

  console.log('✅ Suscripciones de prueba creadas\n')
  console.log('📋 Resumen:')
  console.log('   carlos.mendoza@test.com  → Plan Mensual    → ACTIVA      (próximo cobro: +7 días)')
  console.log('   ana.torres@test.com      → Plan Trimestral → ACTIVA      (próximo cobro: +1 mes)')
  console.log('   pedro.suarez@test.com    → Plan Anual      → EN_PRUEBA   (próximo cobro: +2 meses)')
  console.log('   lucia.ramirez@test.com   → Plan Mensual    → PENDIENTE   (pago sin confirmar)')
  console.log('   miguel.castro@test.com   → Plan Trimestral → VENCIDA     (venció hace 2 semanas)')
  console.log('   valeria.quispe@test.com  → Plan Anual      → CANCELADA   (canceló hace 1 semana)')
  console.log('\n   Contraseña de todos: Test123@')
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed de suscripciones:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
