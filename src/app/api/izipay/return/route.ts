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
function redirectToEstado(request: Request) {
  const url = new URL(request.url)
  const pedidoId = url.searchParams.get('pedidoId') || ''

  return NextResponse.redirect(new URL(`/checkout/izipay/estado?pedidoId=${pedidoId}`, url.origin))
}

export async function GET(request: Request) {
  return redirectToEstado(request)
}

export async function POST(request: Request) {
  return redirectToEstado(request)
}
