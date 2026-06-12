'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'

interface Props {
  ebookId: string
}

export const ObtenerEbookGratisButton = ({ ebookId }: Props) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleObtener = async () => {
    setLoading(true)

    try {
      await axios.post(`/api/ebooks/${ebookId}/acceso`)
      router.push(`/estudiante/mis-ebooks/${ebookId}`)
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? 'No se pudo obtener el ebook'

      Swal.fire({ title: 'Error', text: msg, icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant='contained' color='success' fullWidth size='large' onClick={handleObtener} disabled={loading}>
      {loading ? 'Obteniendo...' : 'Obtener gratis'}
    </Button>
  )
}
