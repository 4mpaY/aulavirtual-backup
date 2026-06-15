const BASE = 'https://api.culqi.com/v2'
const KEY = process.env.CULQI_SECRET_KEY!

async function req(method: string, path: string, body?: object) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.user_message ?? 'Error Culqi')

  return data
}

export const culqi = {
  crearCliente: (email: string, nombre: string, apellido: string) =>
    req('POST', '/customers', {
      email,
      first_name: nombre,
      last_name: apellido,
      address: '-',
      address_city: 'Lima',
      country_code: 'PE',
      phone_number: '999999999'
    }),

  verificarBasicAuth: (authHeader: string) => {
    const expected = 'Basic ' + Buffer.from(`${process.env.CULQI_WEBHOOK_USER}:${process.env.CULQI_WEBHOOK_SECRET}`).toString('base64')

    return authHeader === expected
  }
}
