'use client'

import { useMemo, useState } from 'react'

import { useSession } from 'next-auth/react'
import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { useSnackbar } from 'notistack'

import { useDetalleNotasCurso, useMisNotas } from '../hooks/useMisNotas'
import { DetalleNotaModal } from './DetalleNotaModal'
import type { HistorialNotaItem } from '../entity/Notas'
import { AxiosMisNotas } from '../http/axiosMisNotas'

export default function MisNotasPage() {
  const { data: session } = useSession()
  const { enqueueSnackbar } = useSnackbar()

  const [anio, setAnio] = useState<string>('')
  const [categoriaId, setCategoriaId] = useState<string>('')
  const [cursoDetalleId, setCursoDetalleId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const filters = useMemo(
    () => ({
      ...(anio ? { anio } : {}),
      ...(categoriaId ? { categoria_id: categoriaId } : {})
    }),
    [anio, categoriaId]
  )

  const { data, isLoading, isError } = useMisNotas(filters)
  const { data: detalle, isLoading: loadingDetalle } = useDetalleNotasCurso(cursoDetalleId)

  const filtros = data?.filtros ?? { anios: [], categorias: [] }
  const registros = data?.registros ?? []

  const categoriaLabel =
    categoriaId && filtros.categorias.find(c => c.id === categoriaId)?.nombre
      ? filtros.categorias.find(c => c.id === categoriaId)!.nombre
      : 'Todas las áreas'

  const handleDownloadHistorial = async () => {
    if (registros.length === 0) {
      enqueueSnackbar('No hay registros para descargar', { variant: 'info' })

      return
    }

    const titulo = [anio && `Año ${anio}`, categoriaId && categoriaLabel].filter(Boolean).join(' · ')
    const { downloadHistorialNotasPdf } = await import('../utils/generarPdfNotas')

    await downloadHistorialNotasPdf(registros, titulo || undefined)
  }

  const handleDownloadCurso = async (row: HistorialNotaItem) => {
    setDownloadingId(row.curso_id)

    try {
      const token = session?.user?.accessToken ?? null
      const client = new AxiosMisNotas({ getAuthToken: () => token })
      const det = await client.getDetalleCurso(row.curso_id)
      const nombre = session?.user?.name ?? undefined

      const { downloadResumenNotasCurso } = await import('../utils/generarPdfNotas')

      await downloadResumenNotasCurso(det, nombre)
    } catch {
      enqueueSnackbar('No se pudo descargar el resumen', { variant: 'error' })
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDownloadFromModal = async () => {
    if (!detalle) return

    const { downloadResumenNotasCurso } = await import('../utils/generarPdfNotas')

    await downloadResumenNotasCurso(detalle, session?.user?.name ?? undefined)
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant='h5' sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', mb: 0.5 }}>
          Mis Notas
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Consulta tu historial académico y descarga el detalle de calificaciones por curso.
        </Typography>
      </Box>

      <Card sx={{ overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 3, py: 1.75 }}>
          <Typography sx={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: 14 }}>HISTORIAL DE NOTAS</Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#fafafa', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 220px' },
              gap: 2,
              alignItems: 'end'
            }}
          >
            <FormControl fullWidth size='small' sx={{ bgcolor: '#fff' }}>
              <InputLabel>Área / Categoría</InputLabel>
              <Select
                label='Área / Categoría'
                value={categoriaId}
                onChange={e => setCategoriaId(e.target.value)}
              >
                <MenuItem value=''>Todas</MenuItem>
                {filtros.categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size='small' sx={{ bgcolor: '#fff' }}>
              <InputLabel>Año académico</InputLabel>
              <Select label='Año académico' value={anio} onChange={e => setAnio(e.target.value)}>
                <MenuItem value=''>Todos</MenuItem>
                {filtros.anios.map(y => (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display='flex' justifyContent='center' mt={2.5}>
            <Button
              variant='outlined'
              onClick={handleDownloadHistorial}
              disabled={registros.length === 0}
              sx={{
                borderColor: '#16a34a',
                color: '#16a34a',
                fontWeight: 700,
                px: 4,
                '&:hover': { borderColor: '#15803d', bgcolor: 'rgba(22,163,74,0.06)' }
              }}
            >
              Descargar
            </Button>
          </Box>
        </Box>

        {isLoading ? (
          <Box display='flex' justifyContent='center' py={8}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box py={6} textAlign='center'>
            <Typography color='error'>No se pudo cargar tu historial de notas.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                  {['Periodo', 'Curso', 'Grupo', 'Sección', 'Promedio', 'Fecha', 'Modalidad', 'Docente', 'Opciones'].map(
                    h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap' }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {registros.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align='center' sx={{ py: 6, color: 'text.secondary' }}>
                      No hay registros de notas para los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  registros.map(row => (
                    <TableRow key={row.inscripcion_id} hover>
                      <TableCell sx={{ fontSize: 13 }}>{row.periodo}</TableCell>
                      <TableCell sx={{ fontSize: 13, minWidth: 220 }}>
                        <Typography component='span' sx={{ fontWeight: 700 }}>
                          {row.curso}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.grupo}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.seccion}</TableCell>
                      <TableCell sx={{ fontSize: 13, fontWeight: 700 }}>{row.promedio.toFixed(2)}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.fecha}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{row.modalidad}</TableCell>
                      <TableCell sx={{ fontSize: 13, minWidth: 160 }}>{row.docente}</TableCell>
                      <TableCell>
                        <Box display='flex' gap={0.5}>
                          <Tooltip title='Ver detalle de notas'>
                            <IconButton
                              size='small'
                              onClick={() => setCursoDetalleId(row.curso_id)}
                              sx={{ bgcolor: '#2563eb', color: '#fff', borderRadius: 1, width: 32, height: 32, '&:hover': { bgcolor: '#1d4ed8' } }}
                            >
                              <i className='tabler-list-details' style={{ fontSize: 16 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Descargar resumen PDF'>
                            <IconButton
                              size='small'
                              onClick={() => handleDownloadCurso(row)}
                              disabled={downloadingId === row.curso_id}
                              sx={{ bgcolor: '#dc2626', color: '#fff', borderRadius: 1, width: 32, height: 32, '&:hover': { bgcolor: '#b91c1c' } }}
                            >
                              {downloadingId === row.curso_id ? (
                                <CircularProgress size={14} color='inherit' />
                              ) : (
                                <i className='tabler-file-type-pdf' style={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <DetalleNotaModal
        open={!!cursoDetalleId}
        onClose={() => setCursoDetalleId(null)}
        detalle={detalle}
        isLoading={loadingDetalle}
        onDownload={handleDownloadFromModal}
      />
    </Box>
  )
}
