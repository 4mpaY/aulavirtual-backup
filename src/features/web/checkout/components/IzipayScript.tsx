'use client'

import Script from 'next/script'

/**
 * Componente que carga el SDK de Izipay Web Core.
 * URL configurable mediante NEXT_PUBLIC_IZIPAY_SDK_URL.
 */
const IzipayScript: React.FC = () => {
  const sdkUrl = process.env.NEXT_PUBLIC_IZIPAY_SDK_URL
    || 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js'

  return (
    <Script
      src={sdkUrl}
      strategy="afterInteractive"
      id="izipay-sdk"
    />
  )
}

export default IzipayScript
