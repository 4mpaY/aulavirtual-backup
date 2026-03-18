'use client'

import React, { useState } from 'react'

import { PayPalButtons } from '@paypal/react-paypal-js'

import { Box, CircularProgress } from '@mui/material'

interface PayPalPaymentButtonProps {
  cursoIds: string[]
  codigoCupon?: string
  onSuccess: (pedidoId: string) => void
  onError: (error: string) => void
}

export const PayPalPaymentButton: React.FC<PayPalPaymentButtonProps> = ({
  cursoIds,
  codigoCupon,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false)

  const [pedidoId, setPedidoId] = useState<string | null>(null)

  const createOrder = async () => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/paypal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoIds, codigoCupon })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Error al crear orden')

      setPedidoId(data.result.pedidoId)

      return data.result.paypalOrderId
    } catch (err: any) {
      onError(err.message || 'Error al iniciar PayPal')
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  const onApprove = async (data: any) => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          pedidoId: pedidoId
        })
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.message || 'Error al capturar el pago')

      onSuccess(result.result.pedido.id)
    } catch (err: any) {
      onError(err.message || 'Error al procesar el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Box sx={{ width: '100%', mt: 2, position: 'relative' }}>
      {isProcessing && (
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          bgcolor: 'rgba(255,255,255,0.7)', zIndex: 1, borderRadius: '12px'
        }}>
          <CircularProgress />
        </Box>
      )}
      <PayPalButtons
        style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
        fundingSource="paypal"
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={async () => {
          if (pedidoId) {
            await fetch('/api/paypal/cancel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pedidoId })
            })
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err)
          onError('Ocurrió un error con PayPal')
        }}
      />
    </Box>
  )
}
