/**
 * Seed de demostración para probar los filtros de /admin/pedidos
 * (estado, curso, rango de fechas) y la exportación a Excel.
 *
 * Crea ~12 estudiantes de prueba y 50 pedidos con estados, cursos,
 * métodos de pago y fechas de creación variados (repartidos en los
 * últimos 6 meses). Requiere que ya existan cursos en la base de datos
 * (ejecutar primero `pnpm db:seed`).
 *
 * Ejecutar: pnpm db:seed:pedidos
 */

import { PrismaClient, Rol } from '@prisma/client'
import type { EstadoPedido, MetodoPago } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ─── DATOS DE MUESTRA ────────────────────────────────────────────────────────

const NOMBRES = [
  'Carlos', 'Ana', 'Luis', 'María', 'José', 'Rosa', 'Pedro', 'Lucía',
  'Miguel', 'Carmen', 'Jorge', 'Elena', 'Diego', 'Paula', 'Andrés', 'Valeria'
]

const APELLIDOS = [
  'Gómez', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez',
  'Torres', 'Ramírez', 'Flores', 'Díaz', 'Vargas', 'Castillo', 'Reyes', 'Mendoza'
]

// Distribución con más peso en COMPLETADO/PENDIENTE, similar a un caso real
const ESTADOS: EstadoPedido[] = [
  'COMPLETADO', 'COMPLETADO', 'COMPLETADO', 'COMPLETADO',
  'PENDIENTE', 'PENDIENTE', 'PENDIENTE',
  'CANCELADO', 'CANCELADO',
  'PROCESANDO',
  'REEMBOLSADO'
]

const METODOS: MetodoPago[] = [
  'TARJETA_CREDITO', 'TARJETA_DEBITO', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'PAYPAL', 'IZIPAY', 'CULQI'
]

const TOTAL_PEDIDOS = 50
const TOTAL_ESTUDIANTES = 12
const MESES_HACIA_ATRAS = 6

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDateInLastMonths(months: number): Date {
  const ahora = Date.now()
  const desde = ahora - months * 30 * 24 * 60 * 60 * 1000

  return new Date(desde + Math.random() * (ahora - desde))
}

async function main() {
  console.log('🌱 Sembrando pedidos de prueba para /admin/pedidos...')

  const cursos = await prisma.curso.findMany({ select: { id: true, titulo: true, precio: true } })

  if (cursos.length === 0) {
    throw new Error('No hay cursos en la base de datos. Ejecuta primero `pnpm db:seed`.')
  }

  // ─── ESTUDIANTES DE PRUEBA ───────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('Alumno123@', 10)
  const estudiantes = []

  for (let i = 1; i <= TOTAL_ESTUDIANTES; i++) {
    const correo = `estudiante.demo${i}@test.com`

    const usuario = await prisma.usuario.upsert({
      where: { correo },
      update: {},
      create: {
        correo,
        contrasena: passwordHash,
        nombre: randomFrom(NOMBRES),
        apellido: randomFrom(APELLIDOS),
        numero_documento: `9${String(10000000 + i)}`,
        celular: `9${String(10000000 + i)}`,
        rol: Rol.ESTUDIANTE,
        esta_activo: true
      }
    })

    estudiantes.push(usuario)
  }

  console.log(`✅ ${estudiantes.length} estudiantes de prueba listos`)

  const cupon = await prisma.cupon.findFirst({ where: { codigo: 'BIENVENIDO20' } })

  // ─── PEDIDOS DE PRUEBA ───────────────────────────────────────────────────────

  const conteoPorEstado: Record<string, number> = {}
  const conteoPorCurso: Record<string, number> = {}

  for (let i = 0; i < TOTAL_PEDIDOS; i++) {
    const usuario = randomFrom(estudiantes)
    const estado = randomFrom(ESTADOS)
    const metodo_pago = randomFrom(METODOS)
    const fecha = randomDateInLastMonths(MESES_HACIA_ATRAS)
    const usarCupon = cupon && Math.random() < 0.2

    const cantidadItems = Math.random() < 0.7 ? 1 : 2

    const cursosSeleccionados = [...cursos]
      .sort(() => Math.random() - 0.5)
      .slice(0, cantidadItems)

    const detalles = cursosSeleccionados.map(curso => {
      const precio = Number(curso.precio)

      conteoPorCurso[curso.titulo] = (conteoPorCurso[curso.titulo] || 0) + 1

      return {
        tipo_item: 'CURSO',
        cantidad: 1,
        precio_unitario: precio,
        subtotal: precio,
        total: precio,
        curso_id: curso.id
      }
    })

    const totalPedido = detalles.reduce((acc, d) => acc + d.total, 0)

    conteoPorEstado[estado] = (conteoPorEstado[estado] || 0) + 1

    await prisma.pedido.create({
      data: {
        estado,
        metodo_pago,
        total: totalPedido,
        moneda: 'PEN',
        creado_en: fecha,
        actualizado_en: fecha,
        pagado_en: estado === 'COMPLETADO' ? fecha : null,
        cancelado_en: estado === 'CANCELADO' ? fecha : null,
        usuario_id: usuario.id,
        cupon_id: usarCupon ? cupon!.id : null,
        detalles: { create: detalles }
      }
    })
  }

  console.log(`✅ ${TOTAL_PEDIDOS} pedidos de prueba creados`)
  console.log('')
  console.log('📊 Por estado:')

  for (const [estado, cantidad] of Object.entries(conteoPorEstado)) {
    console.log(`   ${estado}: ${cantidad}`)
  }

  console.log('')
  console.log('📚 Por curso:')

  for (const [titulo, cantidad] of Object.entries(conteoPorCurso)) {
    console.log(`   ${titulo}: ${cantidad}`)
  }

  console.log('')
  console.log(`🗓️  Fechas repartidas en los últimos ${MESES_HACIA_ATRAS} meses`)
  console.log('')
  console.log('👉 Ve a /admin/pedidos y prueba los filtros de estado, curso, fecha (Desde/Hasta) y "Exportar Excel".')
}

main()
  .catch((e: any) => {
    console.error('❌ Error en seed de pedidos:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
