'use client'

import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import AppModal from '@/utils/components/AppModal'
import type { DetalleNotasCurso } from '../entity/Notas'

type DetalleNotaModalProps = {
  open: boolean
  onClose: () => void
  detalle?: DetalleNotasCurso | null
  isLoading?: boolean
  onDownload?: () => void
  downloading?: boolean
}

export function DetalleNotaModal({
  open,
  onClose,
  detalle,
  isLoading,
  onDownload,
  downloading
}: DetalleNotaModalProps) {
  const evaluaciones = detalle?.evaluaciones ?? []

  return (
    <AppModal open={open} handleClose={onClose} sx={{ maxWidth: 720 }}>
      <Typography variant='h6' sx={{ fontWeight: 800, letterSpacing: '0.04em', mb: 3, pr: 4 }}>
        DETALLES DE NOTA
      </Typography>

      {isLoading ? (
        <Box display='flex' justifyContent='center' py={6}>
          <CircularProgress size={32} />
        </Box>
      ) : !detalle ? (
        <Typography color='text.secondary'>No se pudo cargar el detalle.</Typography>
      ) : (
        <>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {detalle.codigo} — {detalle.curso}
          </Typography>

          <Table size='small' sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {evaluaciones.map(ev => (
                  <TableCell key={ev.examen_id} align='center' sx={{ fontWeight: 700, fontSize: 12 }}>
                    Nota {ev.numero}
                  </TableCell>
                ))}
                {evaluaciones.length === 0 && (
                  <TableCell align='center' sx={{ fontWeight: 700, fontSize: 12 }}>
                    Sin evaluaciones
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {evaluaciones.map(ev => (
                  <TableCell key={ev.examen_id} align='center' sx={{ fontWeight: 700, fontSize: 15 }}>
                    {ev.nota.toFixed(2)}
                  </TableCell>
                ))}
                {evaluaciones.length === 0 && (
                  <TableCell align='center' color='text.secondary'>
                    —
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>

          <Typography variant='subtitle2' sx={{ fontWeight: 800, letterSpacing: '0.06em', mb: 1.5 }}>
            LEYENDA
          </Typography>

          <Table size='small' sx={{ border: '1px solid', borderColor: 'divider' }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, width: 80 }}>Nota</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: 700, width: 80 }} align='center'>
                  Peso
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {evaluaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align='center' sx={{ color: 'text.secondary', py: 3 }}>
                    Este curso no tiene evaluaciones publicadas.
                  </TableCell>
                </TableRow>
              ) : (
                evaluaciones.map(ev => (
                  <TableRow key={ev.examen_id}>
                    <TableCell>Nota {ev.numero}</TableCell>
                    <TableCell>{ev.descripcion}</TableCell>
                    <TableCell align='center'>{ev.peso}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Box display='flex' justifyContent='space-between' alignItems='center' mt={3} gap={2} flexWrap='wrap'>
            <Typography variant='body2' sx={{ fontWeight: 700 }}>
              Promedio: {detalle.promedio.toFixed(2)}
            </Typography>
            <Box display='flex' gap={1.5}>
              {onDownload && (
                <Button
                  variant='outlined'
                  size='small'
                  onClick={onDownload}
                  disabled={downloading}
                  startIcon={downloading ? <CircularProgress size={14} /> : <i className='tabler-download' />}
                >
                  Descargar resumen
                </Button>
              )}
              <Button variant='contained' color='error' size='small' onClick={onClose}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </>
      )}
    </AppModal>
  )
}
