import { headers } from 'next/headers'

/**
 * Helper para manejar la resolución de multitenancy por dominios.
 * En el futuro, esto consultará la base de datos para validar dominios registrados.
 */
export const getTenantConfig = () => {
  const headersList = headers()
  const host = headersList.get('host') || 'localhost:3000'
  
  // Lógica de mapeo demo/provisional
  // Se puede expandir para obtener configuraciones específicas (colores, logo, id del tenant en DB)
  const tenantConfigs: Record<string, any> = {
    'localhost:3000': {
      id: 'default-tenant',
      name: 'Abeja Smart',
      domain: 'localhost:3000',
      color_primario: '#2e7d32', // Verde original
      color_secundario: '#0284c7',
    },
    'aulavirtual.pro': {
      id: 'pro-tenant',
      name: 'Abeja Smart Pro',
      domain: 'aulavirtual.pro',
      color_primario: '#c2410c', // Naranja para distinguir
      color_secundario: '#1e293b',
    }
  }

  // Si el host no está en el mapa, devolvemos un default o intentamos extraer el subdominio
  const config = tenantConfigs[host] || tenantConfigs['localhost:3000']

  return config
}

/**
 * Obtiene el ID del tenant para filtrar en consultas de base de datos
 */
export const getTenantId = () => {
  return getTenantConfig().id
}
