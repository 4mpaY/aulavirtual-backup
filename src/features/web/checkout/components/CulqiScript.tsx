'use client'

import React, { useEffect } from 'react'

import Script from 'next/script'

interface CulqiScriptProps {
  publicKey: string
  onTokenReceived: (token: string, email: string) => void
  onError: (error: any) => void
  onLoad?: () => void
}

const CulqiScript = ({ publicKey, onTokenReceived, onError, onLoad }: CulqiScriptProps) => {
  useEffect(() => {
    // Configurar llave pública
    if ((window as any).Culqi) {
      (window as any).Culqi.publicKey = publicKey
    }

    // Definir la función global que Culqi llamará automáticamente
    (window as any).culqi = function () {
      if ((window as any).Culqi.token) {
        const token = (window as any).Culqi.token.id
        const email = (window as any).Culqi.token.email

        onTokenReceived(token, email)
      } else {
        const error = (window as any).Culqi.error

        console.error('Error de Culqi:', error)
        onError(error.user_message || error.merchant_message || 'Error al procesar la tarjeta')
      }

      // Cerrar el modal de Culqi manualmente al recibir respuesta (token o error)
      if ((window as any).Culqi) {
        (window as any).Culqi.close()
      }
    }
  }, [publicKey, onTokenReceived, onError])

  return (
    <Script
      src="https://checkout.culqi.com/js/v4"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('Culqi SDK cargado')

        if ((window as any).Culqi) {
          (window as any).Culqi.publicKey = publicKey
          if (onLoad) onLoad()
        }
      }}
    />
  )
}

export default CulqiScript
