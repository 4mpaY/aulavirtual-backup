'use client'

import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'

import { getBaseURL } from '@/utils/env'
import AppModal from '@/utils/components/AppModal'
import SimulacroPlayer from '@/features/web/simulacros/components/SimulacroPlayer'

interface Opcion { id: string; texto: string; es_correcta: boolean; orden: number }
interface Pregunta {
  id: string; enunciado: string; tema: string | null; fundamento: string | null
  audio_url?: string | null; imagen_url?: string | null; orden: number; opciones: Opcion[]
}

export default function PreviewSimulacroModal({ open, onClose, simulacroId, titulo, duracion }: {
  open: boolean; onClose: () => void; simulacroId: string; titulo: string; duracion: number
}) {
  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? null

  const { data: preguntas = [], isLoading } = useQuery<Pregunta[]>({
    queryKey: ['simulacro-preguntas', simulacroId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )

      return data.result ?? []
    },
    enabled: open && !!simulacroId,
  })

  return (
    <AppModal open={open} handleClose={onClose} sx={{ maxWidth: 960, maxHeight: '85vh', p: 0 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : preguntas.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
          <Icon icon='mdi:clipboard-text-off' fontSize={40} />
          <Typography variant='body1' sx={{ mt: 1.5 }}>
            Aún no hay preguntas en el banco. Agrega al menos una para ver la vista previa.
          </Typography>
          <Button variant='outlined' onClick={onClose} sx={{ mt: 2 }}>Cerrar</Button>
        </Box>
      ) : (
        <SimulacroPlayer preguntas={preguntas} duracionMin={duracion > 0 ? duracion : 60} titulo={titulo || 'Simulacro'} stickyTop={0} />
      )}
    </AppModal>
  )
}
