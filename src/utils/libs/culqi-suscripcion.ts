const BASE = 'https://api.culqi.com/v2'
const KEY = process.env.CULQI_SECRET_KEY!

async function req(method: string, path: string, body?: object) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.user_message ?? data.merchant_message ?? 'Error Culqi')

  return data
}

export type IntervaloSuscripcion = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'

// El panel de Culqi muestra 4 opciones fijas: Mensual, Trimestral, Semestral, Anual.
// Mapeo probable: interval_unit_time 1=Mensual, 2=Trimestral, 3=Semestral, 4=Anual
// con interval_count siempre en 1. A verificar en API Logs tras primera prueba.
export function calcularCulqiIntervalo(intervalo: IntervaloSuscripcion): {
  culqi_interval_unit: number
  culqi_interval_count: number
} {
  const map: Record<IntervaloSuscripcion, { culqi_interval_unit: number; culqi_interval_count: number }> = {
    MENSUAL:    { culqi_interval_unit: 1, culqi_interval_count: 1 },
    TRIMESTRAL: { culqi_interval_unit: 2, culqi_interval_count: 1 },
    SEMESTRAL:  { culqi_interval_unit: 3, culqi_interval_count: 1 },
    ANUAL:      { culqi_interval_unit: 4, culqi_interval_count: 1 }
  }

  return map[intervalo]
}

export const culqiSuscripcion = {
  crearPlan: (payload: {
    name: string
    short_name: string
    description?: string
    amount: number
    currency: string
    interval_unit_time: number
    interval_count: number
    initial_cycles?: {
      count: number
      amount: number
      has_initial_charge: boolean
      interval_unit_time: number
    }
    metadata?: Record<string, string>
  }) => req('POST', '/plans', payload),

  actualizarPlan: (planId: string, payload: { name?: string; description?: string }) =>
    req('PATCH', `/plans/${planId}`, payload),

  eliminarPlan: (planId: string) =>
    req('DELETE', `/plans/${planId}`),

  crearCliente: (payload: {
    first_name: string
    last_name: string
    email: string
    address: string
    phone_number: string
  }) => req('POST', '/customers', payload),

  crearTarjeta: (payload: { customer_id: string; token_id: string }) =>
    req('POST', '/cards', payload),

  crearSuscripcion: (payload: {
    card_id: string
    plan_id: string
    tyc: boolean
    metadata?: Record<string, string>
  }) => req('POST', '/subscriptions', payload),

  cancelarSuscripcion: (suscripcionId: string) =>
    req('DELETE', `/subscriptions/${suscripcionId}`)
}
