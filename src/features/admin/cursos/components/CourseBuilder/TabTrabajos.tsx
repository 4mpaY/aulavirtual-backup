'use client'

import { useState, useMemo } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  Grid,
  Card,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar
} from '@mui/material'
import { useSnackbar } from 'notistack'
import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'
import AppModal from '@/utils/components/AppModal'

interface TabTrabajosProps {
  cursoId: string
}

export function TabTrabajos({ cursoId }: TabTrabajosProps) {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  // 1. Obtener la información del curso mediante react-query
  // (para extraer las lecciones que tienen trabajo habilitado)
  const { data: curso, isLoading: isCursoLoading } = useQuery<any>({
    queryKey: ['cursos', cursoId],
    queryFn: async () => {
      const res = await axios.get(`/api/cursos/${cursoId}`)

      
return res.data.result
    }
  })

  // Obtener la lista de lecciones con trabajos
  const leccionesConTrabajo = useMemo(() => {
    const list: any[] = []

    curso?.modulos?.forEach((mod: any) => {
      mod.lecciones?.forEach((lec: any) => {
        if (lec.trabajo) {
          list.push({
            ...lec,
            moduloTitulo: mod.titulo
          })
        }
      })
    })
    
return list
  }, [curso])

  // Estado para la lección seleccionada actualmente
  const [selectedLecId, setSelectedLecId] = useState<string | null>(null)

  // Auto-seleccionar la primera lección si hay trabajos disponibles
  useMemo(() => {
    if (leccionesConTrabajo.length > 0 && !selectedLecId) {
      setSelectedLecId(leccionesConTrabajo[0].id)
    }
  }, [leccionesConTrabajo, selectedLecId])

  // Encontrar datos de la lección seleccionada
  const selectedLesson = useMemo(() => {
    return leccionesConTrabajo.find(l => l.id === selectedLecId) || null
  }, [leccionesConTrabajo, selectedLecId])

  // 2. Obtener entregas de la lección seleccionada
  const {
    data: entregasData,
    isLoading: isEntregasLoading,
    refetch: refetchEntregas
  } = useQuery<any>({
    queryKey: ['cursos', cursoId, 'lecciones', selectedLecId, 'trabajo-entregas'],
    queryFn: async () => {
      const res = await axios.get(`/api/cursos/${cursoId}/lecciones/${selectedLecId}/trabajo/entregas`)

      
return res.data.result
    },
    enabled: !!selectedLecId
  })

  // Estado para el modal de calificación
  const [gradingItem, setGradingItem] = useState<{
    open: boolean
    entregaId?: string
    trabajoId?: string
    studentName: string
    fileName: string
    fileUrl: string
    comentarioEstudiante?: string
    nota: string
    comentarioDocente: string
  } | null>(null)

  // Mutación para calificar la entrega
  const gradeMutation = useMutation<any, any, { entregaId: string; nota: number; comentario_docente: string }>({
    mutationFn: async ({ entregaId, nota, comentario_docente }) => {
      const res = await axios.patch(`/api/admin/entregas-trabajo/${entregaId}`, {
        nota,
        comentario_docente
      })

      
return res.data.result
    },
    onSuccess: () => {
      enqueueSnackbar('Trabajo calificado con éxito', { variant: 'success' })
      refetchEntregas()
      setGradingItem(null)

      // Invalidar query para recargar cache de ser necesario
      queryClient.invalidateQueries({ queryKey: ['cursos', cursoId] })
    },
    onError: (err: any) => {
      enqueueSnackbar(err?.response?.data?.message || 'Error al guardar calificación', { variant: 'error' })
    }
  })

  const handleOpenGradeModal = (item: any) => {
    setGradingItem({
      open: true,
      entregaId: item.entrega?.id,
      trabajoId: entregasData?.trabajo?.id,
      studentName: `${item.estudiante.nombre} ${item.estudiante.apellido}`,
      fileName: item.entrega?.archivo_nombre || '',
      fileUrl: item.entrega?.archivo_url || '',
      comentarioEstudiante: item.entrega?.comentario_estudiante || '',
      nota: item.entrega?.nota !== null && item.entrega?.nota !== undefined ? String(item.entrega.nota) : '',
      comentarioDocente: item.entrega?.comentario_docente || ''
    })
  }

  const handleSaveGrade = () => {
    if (!gradingItem) return

    const notaNum = Number(gradingItem.nota)

    if (isNaN(notaNum) || gradingItem.nota.trim() === '' || notaNum < 0 || notaNum > 20) {
      enqueueSnackbar('La nota debe ser un número entre 0 y 20', { variant: 'warning' })
      
return
    }

    if (!gradingItem.entregaId) {
      enqueueSnackbar('Error: No se encontró la entrega para calificar', { variant: 'error' })
      
return
    }

    gradeMutation.mutate({
      entregaId: gradingItem.entregaId,
      nota: notaNum,
      comentario_docente: gradingItem.comentarioDocente
    })
  }

  if (isCursoLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Si no hay lecciones con trabajos, mostrar estado vacío
  if (leccionesConTrabajo.length === 0) {
    return (
      <Paper
        sx={{
          p: 8,
          textAlign: 'center',
          bgcolor: 'action.hover',
          border: '1.5px dashed',
          borderColor: 'divider',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <i className='tabler-file-off' style={{ fontSize: '3.5rem', opacity: 0.35, color: '#6b7280' }} />
          <Typography variant='h6' sx={{ fontWeight: 800, color: 'text.primary' }}>
            No hay trabajos asignados
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ maxW: 420, mx: 'auto', lineHeight: 1.6 }}>
            Para ver o calificar entregas, primero debes habilitar la opción de <strong>trabajos prácticos</strong> en alguna lección. Hazlo editando las lecciones en la pestaña de <strong>Contenido</strong>.
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Box>
      <Grid container spacing={5}>
        {/* === Sidebar: Lista de Lecciones con Trabajos === */}
        <Grid item xs={12} md={4}>
          <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
            Lecciones con Trabajos ({leccionesConTrabajo.length})
          </Typography>
          <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <List disablePadding>
              {leccionesConTrabajo.map((lec, index) => {
                const isSelected = lec.id === selectedLecId

                
return (
                  <ListItem key={lec.id} disablePadding divider={index < leccionesConTrabajo.length - 1}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => setSelectedLecId(lec.id)}
                      sx={{
                        py: 2.5,
                        px: 3.5,
                        gap: 1.5,
                        borderLeft: isSelected ? '4px solid #025E44' : '4px solid transparent',
                        '&.Mui-selected': {
                          bgcolor: 'rgba(2,94,68,0.05)',
                          '&:hover': { bgcolor: 'rgba(2,94,68,0.08)' }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 'auto', color: isSelected ? 'primary.main' : 'text.disabled' }}>
                        <i className='tabler-file-text text-xl' />
                      </ListItemIcon>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant='body2' fontWeight={isSelected ? 700 : 500} color={isSelected ? 'primary.main' : 'text.primary'} noWrap>
                          {lec.titulo}
                        </Typography>
                        <Typography variant='caption' color='text.secondary' noWrap display='block'>
                          {lec.moduloTitulo}
                        </Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Card>
        </Grid>

        {/* === Main: Alumnos inscritos y sus Entregas === */}
        <Grid item xs={12} md={8}>
          {selectedLesson && (
            <Stack spacing={4}>
              {/* Información del trabajo actual */}
              <Box sx={{ p: 4, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant='h6' sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  {selectedLesson.trabajo.titulo}
                </Typography>
                {selectedLesson.trabajo.descripcion && (
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                    {selectedLesson.trabajo.descripcion}
                  </Typography>
                )}
                <Stack direction='row' spacing={3} flexWrap='wrap' useFlexGap>
                  {selectedLesson.trabajo.archivo_url && (
                    <Button
                      variant='tonal'
                      size='small'
                      startIcon={<i className='tabler-download' />}
                      href={selectedLesson.trabajo.archivo_url}
                      target='_blank'
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Descargar Guía ({selectedLesson.trabajo.archivo_nombre})
                    </Button>
                  )}
                  {(selectedLesson.trabajo.fecha_inicio || selectedLesson.trabajo.fecha_fin) && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <i className='tabler-calendar' style={{ fontSize: '1rem' }} />
                      <Typography variant='caption' fontWeight={600}>
                        {selectedLesson.trabajo.fecha_inicio ? `Desde: ${new Date(selectedLesson.trabajo.fecha_inicio).toLocaleDateString('es-PE')}` : ''}
                        {selectedLesson.trabajo.fecha_inicio && selectedLesson.trabajo.fecha_fin ? '  |  ' : ''}
                        {selectedLesson.trabajo.fecha_fin ? `Vence: ${new Date(selectedLesson.trabajo.fecha_fin).toLocaleDateString('es-PE')}` : ''}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Tabla de Entregas */}
              <Box>
                <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'text.secondary' }}>
                  Lista de Entregas y Alumnos
                </Typography>

                {isEntregasLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table size='small'>
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                          <TableCell sx={{ py: 2 }}>Estudiante</TableCell>
                          <TableCell sx={{ py: 2 }}>Estado</TableCell>
                          <TableCell sx={{ py: 2 }}>Archivo Entregado</TableCell>
                          <TableCell sx={{ py: 2 }} align='center'>Nota</TableCell>
                          <TableCell sx={{ py: 2 }} align='right'>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {entregasData?.entregas?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align='center' sx={{ py: 6, color: 'text.secondary' }}>
                              No hay estudiantes inscritos activos en este curso.
                            </TableCell>
                          </TableRow>
                        ) : (
                          entregasData?.entregas?.map((row: any) => {
                            const hasSubmitted = !!row.entrega
                            const isGraded = hasSubmitted && row.entrega.nota !== null

                            const statusChip = (() => {
                              if (!hasSubmitted) return <Chip size='small' label='Pendiente' variant='outlined' color='secondary' />
                              if (isGraded) return <Chip size='small' label='Calificado' variant='tonal' color='success' />
                              
return <Chip size='small' label='Entregado' variant='tonal' color='warning' />
                            })()

                            return (
                              <TableRow key={row.estudiante.id} hover>
                                <TableCell sx={{ py: 2 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar src={row.estudiante.avatar || undefined} sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                                      {row.estudiante.nombre[0]}
                                    </Avatar>
                                    <Box>
                                      <Typography variant='body2' fontWeight={600}>
                                        {row.estudiante.nombre} {row.estudiante.apellido}
                                      </Typography>
                                      <Typography variant='caption' color='text.secondary'>
                                        {row.estudiante.correo}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>{statusChip}</TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  {hasSubmitted ? (
                                    <Button
                                      size='small'
                                      variant='text'
                                      startIcon={<i className='tabler-file-download text-sm' />}
                                      href={row.entrega.archivo_url}
                                      target='_blank'
                                      sx={{ textTransform: 'none', px: 1, py: 0.2 }}
                                    >
                                      {row.entrega.archivo_nombre}
                                    </Button>
                                  ) : (
                                    <Typography variant='caption' color='text.disabled'>—</Typography>
                                  )}
                                </TableCell>
                                <TableCell sx={{ py: 2 }} align='center'>
                                  {isGraded ? (
                                    <Typography variant='body2' fontWeight={800} color={row.entrega.nota >= 11 ? 'success.main' : 'error.main'}>
                                      {row.entrega.nota.toFixed(1)} / 20
                                    </Typography>
                                  ) : (
                                    <Typography variant='caption' color='text.disabled'>—</Typography>
                                  )}
                                </TableCell>
                                <TableCell sx={{ py: 2 }} align='right'>
                                  <Button
                                    size='small'
                                    variant={hasSubmitted ? 'tonal' : 'outlined'}
                                    disabled={!hasSubmitted}
                                    onClick={() => handleOpenGradeModal(row)}
                                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                                  >
                                    {isGraded ? 'Editar Nota' : 'Calificar'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Stack>
          )}
        </Grid>
      </Grid>

      {/* Modal para calificar y dejar retroalimentación */}
      {gradingItem && gradingItem.open && (
        <AppModal
          open={gradingItem.open}
          handleClose={() => setGradingItem(null)}
          sx={{ maxWidth: 500, p: 6 }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800, mb: 2 }}>
            Calificar Entrega
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            Estudiante: <strong>{gradingItem.studentName}</strong>
          </Typography>

          <Stack spacing={4}>
            {/* Visualización del archivo entregado */}
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
              <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 1, fontWeight: 600 }}>
                Archivo Entregado:
              </Typography>
              <Button
                size='small'
                variant='outlined'
                startIcon={<i className='tabler-external-link' />}
                href={gradingItem.fileUrl}
                target='_blank'
                fullWidth
                sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: 1.5 }}
              >
                {gradingItem.fileName}
              </Button>

              {gradingItem.comentarioEstudiante && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='caption' color='text.secondary' display='block' sx={{ mb: 0.5, fontWeight: 600 }}>
                    Mensaje del Estudiante:
                  </Typography>
                  <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
                    &ldquo;{gradingItem.comentarioEstudiante}&rdquo;
                  </Typography>
                </>
              )}
            </Box>

            {/* Input de nota */}
            <CustomTextField
              fullWidth
              label='Calificación (Escala 0 - 20) *'
              type='number'
              placeholder='Ej: 16.5'
              value={gradingItem.nota}
              onChange={e => setGradingItem(prev => prev ? { ...prev, nota: e.target.value } : null)}
              InputProps={{
                inputProps: { min: 0, max: 20, step: 0.1 }
              }}
            />

            {/* Retroalimentación */}
            <CustomTextField
              fullWidth
              multiline
              rows={4}
              label='Comentarios de retroalimentación'
              placeholder='Escribe los comentarios, observaciones o correcciones para el estudiante...'
              value={gradingItem.comentarioDocente}
              onChange={e => setGradingItem(prev => prev ? { ...prev, comentarioDocente: e.target.value } : null)}
            />

            {/* Acciones */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
              <Button onClick={() => setGradingItem(null)} disabled={gradeMutation.isPending}>
                Cancelar
              </Button>
              <Button
                variant='contained'
                onClick={handleSaveGrade}
                disabled={gradeMutation.isPending || gradingItem.nota.trim() === ''}
              >
                {gradeMutation.isPending ? 'Guardando...' : 'Guardar Calificación'}
              </Button>
            </Box>
          </Stack>
        </AppModal>
      )}
    </Box>
  )
}
