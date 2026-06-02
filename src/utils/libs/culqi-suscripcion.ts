const BASE = 'https://api.culqi.com/v2'
const KEY = process.env.CULQI_SECRET_KEY!

async function req(method: string, url: string, body?: object) {
  const fullUrl = url.startsWith('http') ? url : `${BASE}${url}`

  const res = await fetch(fullUrl, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: body ? JSON.stringify(body) : undefined
  })

  const text = await res.text()

  console.log(`[Culqi] ${method} ${fullUrl} → ${res.status} | ${text || '(empty)'}`)

  const data = text ? JSON.parse(text) : {}

  if (!res.ok) {
    const msg = data.user_message ?? data.merchant_message ?? `Culqi error ${res.status}: ${text || 'empty response'}`

    throw new Error(msg)
  }

  return data
}

export type IntervaloSuscripcion = 'MENSUAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL'

// Valores confirmados en docs oficiales: https://apidocs.culqi.com/#tag/Planes
// interval_unit_time: 1=Diario, 2=Semanal, 3=Mensual, 4=Anual, 5=Trimestral, 6=Semestral
export function calcularCulqiIntervalo(intervalo: IntervaloSuscripcion): {
  culqi_interval_unit: number
  culqi_interval_count: number
} {
  const map: Record<IntervaloSuscripcion, { culqi_interval_unit: number; culqi_interval_count: number }> = {
    MENSUAL:    { culqi_interval_unit: 3, culqi_interval_count: 1 },
    TRIMESTRAL: { culqi_interval_unit: 5, culqi_interval_count: 1 },
    SEMESTRAL:  { culqi_interval_unit: 6, culqi_interval_count: 1 },
    ANUAL:      { culqi_interval_unit: 4, culqi_interval_count: 1 }
  }

  return map[intervalo]
}

export const culqiSuscripcion = {
  crearPlan: (payload: {
    name: string
    short_name: string
    description: string
    amount: number
    currency: string
    interval_unit_time: number
    interval_count: number
    initial_cycles: {
      count: number
      amount: number
      has_initial_charge: boolean
      interval_unit_time: number
    }
    metadata?: Record<string, string>
  }) => req('POST', 'https://api.culqi.com/v2/recurrent/plans/create', payload),

  actualizarPlan: (planId: string, payload: {
    name?: string
    short_name?: string
    description?: string
    status?: number  // 1=Activo, 2=Inactivo
    metadata?: Record<string, string>
  }) => req('PATCH', `${BASE}/recurrent/plans/${planId}`, payload),

  eliminarPlan: (planId: string) =>
    req('DELETE', `${BASE}/recurrent/plans/${planId}`),

  crearCliente: (payload: {
    first_name: string
    last_name: string
    email: string
    address: string
    phone_number: string
  }) => req('POST', `${BASE}/customers`, payload),

  crearTarjeta: (payload: { customer_id: string; token_id: string }) =>
    req('POST', `${BASE}/cards`, payload),

  crearSuscripcion: (payload: {
    card_id: string
    plan_id: string
    tyc: boolean
    metadata?: Record<string, string>
  }) => req('POST', `${BASE}/recurrent/subscriptions/create`, payload),

  consultarSuscripcion: (suscripcionId: string) =>
    req('GET', `${BASE}/recurrent/subscriptions/${suscripcionId}`),

  cancelarSuscripcion: (suscripcionId: string) =>
    req('DELETE', `${BASE}/recurrent/subscriptions/${suscripcionId}`)
}

// Culqi status: 1=Creada, 2=Dias de prueba, 3=Activa, 4=Cancelada, 5=En cola, 6=Finalizada
export function mapearEstadoCulqi(culqiStatus: number): 'ACTIVA' | 'CANCELADA' | 'VENCIDA' | 'PENDIENTE' | 'EN_PRUEBA' {
  const map: Record<number, 'ACTIVA' | 'CANCELADA' | 'VENCIDA' | 'PENDIENTE' | 'EN_PRUEBA'> = {
    1: 'PENDIENTE',
    2: 'EN_PRUEBA',
    3: 'ACTIVA',
    4: 'CANCELADA',
    5: 'PENDIENTE',
    6: 'VENCIDA'
  }

  return map[culqiStatus] ?? 'PENDIENTE'
}
