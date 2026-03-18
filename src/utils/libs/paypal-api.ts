/**
 * PayPal API Helper
 */

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env

/**
 * Genera el Access Token de PayPal
 */
async function generateAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error('MISSING_PAYPAL_CREDENTIALS')
  }

  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET).toString('base64')

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`
    }
  })

  const data = await response.json()

  return data.access_token
}

/**
 * Crea una orden en PayPal
 */
export async function createPaypalOrder(amount: number, currency: string = 'USD') {
  const accessToken = await generateAccessToken()
  const url = `${PAYPAL_API_URL}/v2/checkout/orders`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          }
        }
      ]
    })
  })

  return handleResponse(response)
}

/**
 * Captura una orden aprobada por el usuario
 */
export async function capturePaypalOrder(orderId: string) {
  const accessToken = await generateAccessToken()
  const url = `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    }
  })

  return handleResponse(response)
}

async function handleResponse(response: Response) {
  if (response.status === 200 || response.status === 201) {
    return response.json()
  }

  const errorMessage = await response.text()

  throw new Error(errorMessage)
}
