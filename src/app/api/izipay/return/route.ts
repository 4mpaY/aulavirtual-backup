import { NextResponse } from 'next/server'

/**
 * GET/POST /api/izipay/return
 * Puente de retorno tras el pago en Izipay (successUrl/cancelUrl de CreatePaymentOrder).
 * Next.js App Router no puede renderizar un page.tsx con POST, así que este Route
 * Handler acepta ambos métodos y redirige a la página cliente que hace polling del
 * estado real del pedido. No confía en ningún dato del body/query enviado por Izipay
 * (podría manipularse) - la confirmación real ocurre en /api/izipay/webhook, validada
 * con HMAC.
 */
async function redirectToEstado(request: Request, method: string) {
  const url = new URL(request.url)
  const pedidoId = url.searchParams.get('pedidoId') || ''

  // TEMPORAL: diagnóstico para confirmar que Izipay realmente llega a este endpoint
  // y con qué datos, mientras se depura el flujo end-to-end.
  const rawBody = method === 'POST' ? await request.text().catch(() => '') : ''

  console.log(`[IZIPAY_RETURN][DEBUG] method=${method} url=${url.toString()} pedidoId=${pedidoId}`)
  if (rawBody) console.log('[IZIPAY_RETURN][DEBUG] body:', rawBody)

  // IMPORTANTE: `url.origin` (derivado de request.url) no es confiable en Next.js
  // standalone detrás de nginx - refleja HOSTNAME/PORT del proceso ("0.0.0.0:3000"),
  // no el host público real. Se usan los headers x-forwarded-* en su lugar.
  const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const publicOrigin = forwardedHost ? `${forwardedProto}://${forwardedHost}` : url.origin

  return NextResponse.redirect(new URL(`/checkout/izipay/estado?pedidoId=${pedidoId}`, publicOrigin))
}

export async function GET(request: Request) {
  return redirectToEstado(request, 'GET')
}

export async function POST(request: Request) {
  return redirectToEstado(request, 'POST')
}
