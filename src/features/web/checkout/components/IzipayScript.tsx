'use client'

import Script from 'next/script'

import { useConfig } from '@/contexts/ConfigContext'

/**
 * Componente que carga el SDK de Izipay Web Core.
 */
const IzipayScript: React.FC = () => {
  const configs = useConfig()
  const sdkUrl = configs.IZIPAY_SDK_URL || 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js'

  return (
    <Script
      src={sdkUrl}
      strategy="afterInteractive"
      id="izipay-sdk"
    />
  )
}

export default IzipayScript
