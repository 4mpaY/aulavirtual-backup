import prisma from './prisma'

/**
 * Utilidad para obtener configuraciones desde la base de datos.
 * Incluye un pequeño caché en memoria para optimizar lecturas frecuentes.
 */

let configCache: Record<string, string> | null = null
let lastFetch = 0
const CACHE_TTL = 1000 * 60 * 5 // 5 minutos

// Claves privadas/secretas que SIEMPRE deben venir del .env (nunca de la BD)
// El .env tiene prioridad absoluta sobre la BD para estas claves.
const ENV_OVERRIDES: Record<string, string> = {
  // Culqi
  CULQI_PRIVATE_KEY:     process.env.CULQI_SECRET_KEY      ?? '',
  CULQI_WEBHOOK_SECRET:  process.env.CULQI_WEBHOOK_SECRET  ?? '',

  // IziPay
  IZIPAY_API_KEY:        process.env.IZIPAY_API_KEY        ?? '',

  // PayPal
  PAYPAL_CLIENT_SECRET:  process.env.PAYPAL_CLIENT_SECRET  ?? '',

  // Mercado Pago
  MP_ACCESS_TOKEN:       process.env.MP_ACCESS_TOKEN       ?? '',
}

export async function getConfigs(): Promise<Record<string, string>> {
  const now = Date.now()

  if (configCache && now - lastFetch < CACHE_TTL) {
    return configCache
  }

  try {
    const dbConfigs = await prisma.configuracion.findMany()
    const map: Record<string, string> = {}

    dbConfigs.forEach(c => {
      map[c.clave] = c.valor
    })

    // Las claves privadas del .env sobreescriben siempre lo que haya en BD
    Object.entries(ENV_OVERRIDES).forEach(([key, value]) => {
      if (value) map[key] = value
    })

    configCache = map
    lastFetch = now

    return map
  } catch {
    return { ...ENV_OVERRIDES }
  }
}

export async function getConfig(clave: string, defaultValue: string = ''): Promise<string> {
  const configs = await getConfigs()

  return configs[clave] ?? defaultValue
}

export function clearConfigCache() {
  configCache = null
}
