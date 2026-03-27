'use client'

import React, { useEffect } from 'react'

import Script from 'next/script'

interface CulqiScriptProps {
  publicKey: string
  settings: {
    currency: string
    amount: number
    order?: string
    xculqirsaid?: string
    rsapublickey?: string
  }
  client?: {
    email: string
  }
  options?: any
  onTokenReceived: (token: string, email: string) => void
  onError: (error: any) => void
  onLoad?: () => void
}

declare global {
  interface Window {
    CulqiCheckout: any
    Culqi: any
    culqi: any
  }
}

const CulqiScript = ({
  publicKey,
  settings,
  client,
  options,
  onTokenReceived,
  onError,
  onLoad
}: CulqiScriptProps) => {

  useEffect(() => {
    const initCulqi = () => {
      if (window.CulqiCheckout && publicKey) {
        // Limpiar instancia previa si existe para evitar duplicados
        if (window.Culqi) {
          try { window.Culqi.close() } catch (e) { }
        }

        const config = {
          settings,
          client,
          options: {
            modal: true,
            ...options
          }
        }

        const culqi = new window.CulqiCheckout(publicKey, config)

        // En v4 (Custom), Culqi busca la función global culqi() o la propiedad del objeto
        // Usamos la propiedad del objeto para evitar contaminar el scope global si es posible,
        // pero también definimos la global por si acaso.
        const handleCulqiAction = () => {
          if (culqi.token) {
            console.log('Culqi Token received:', culqi.token)
            onTokenReceived(culqi.token.id, culqi.token.email)
          } else if (culqi.order) {
            console.log('Culqi Order/Payment success:', culqi.order)
            onTokenReceived('PAYMENT_SUCCESS', culqi.order.email || client?.email)
          } else if (culqi.error) {
            console.error('Culqi Error:', culqi.error)
            onError(culqi.error.user_message || culqi.error.merchant_message || 'Error al procesar el pago')
          }
        }

        culqi.culqi = handleCulqiAction
        window.Culqi = culqi
      }
    }

    if (window.CulqiCheckout) {
      initCulqi()
    }
  }, [publicKey, settings, client, options, onTokenReceived, onError])

  return (
    <Script
      src="https://js.culqi.com/checkout-js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('Culqi Checkout v4 script loaded')
        if (onLoad) onLoad()
      }}
    />
  )
}

export default CulqiScript
