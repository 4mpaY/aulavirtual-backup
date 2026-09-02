'use client'

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Divider,
  Autocomplete,
  TextField,
  Tooltip,
  Paper
} from '@mui/material'

import { useSnackbar } from 'notistack'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import { useManageRutaCursos, useRuta } from '../hooks/useRutas'
import { useCursos } from '@/features/admin/cursos/hooks/useCursos'
import type { Curso } from '@/features/admin/cursos/entity/Curso'
import CourseThumbnail from '@/utils/components/CourseThumbnail'

interface SortableCourseItemProps {
  curso: any
  index: number
  total: number
  onRemove: (id: string) => void
}

const SortableCourseItem = ({ curso, index, onRemove }: SortableCourseItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: curso.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? 'var(--mui-palette-action-hover)' : 'transparent',
    borderRadius: '8px',
    marginBottom: '8px',
    border: isDragging ? '1px dashed var(--mui-palette-primary-main)' : '1px solid transparent'
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ListItem sx={{ px: 2, py: 3 }}>
        <Box 
          {...attributes} 
          {...listeners} 
          sx={{ mr: 3, display: 'flex', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
        >
          <i className='tabler-grip-vertical text-xl text-textDisabled' />
        </Box>
        
        <Box sx={{ mr: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 }}>
          <Typography variant='h6' color='primary' sx={{ fontWeight: 'bold' }}>{index + 1}</Typography>
        </Box>

        <CourseThumbnail
          src={curso.miniatura}
          title={curso.titulo}
          variant='simple'
          sx={{ mr: 3, width: 44, height: 32, border: '1px solid var(--mui-palette-divider)', borderRadius: '4px' }}
        />
        
        <ListItemText 
          primary={curso.titulo} 
          secondary={index === 0 ? 'Inicio del tramo' : 'Siguiente paso'}
          primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
          sx={{ flex: '1 1 auto' }}
        />

        <ListItemSecondaryAction>
          <Tooltip title="Eliminar del tramo">
            <IconButton size='small' color='error' onClick={() => onRemove(curso.id)}>
              <i className='tabler-x' />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </div>
  )
}

interface RutaCursosDialogProps {
  open: boolean
  onClose: () => void
  rutaId: string | null
}

export const RutaCursosDialog = ({ open, onClose, rutaId }: RutaCursosDialogProps) => {
  const { data: ruta, isLoading: isLoadingRuta } = useRuta(rutaId)
  const { data: cursosData } = useCursos({ limit: '100' })
  const manageCursos = useManageRutaCursos()

  const { enqueueSnackbar } = useSnackbar()
  const [selectedCursos, setSelectedCursos] = useState<any[]>([])
  
  // Sensors for DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    if (ruta) {
      setSelectedCursos(ruta.cursos || [])
    } else {
      setSelectedCursos([])
    }
  }, [ruta])


  const handleAddCurso = (curso: Curso | null) => {
    if (!curso) return

    if (selectedCursos.some(c => c.id === curso.id)) {
      enqueueSnackbar('Este curso ya está en la ruta', { variant: 'warning' })

      return
    }

    setSelectedCursos([...selectedCursos, { 
      id: curso.id, 
      titulo: curso.titulo, 
      miniatura: curso.miniatura, 
      seccion_id: null 
    }])
  }

  const handleRemoveCurso = (id: string) => {
    setSelectedCursos(selectedCursos.filter(c => c.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSelectedCursos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = async () => {
    if (!rutaId) return

    try {
      await manageCursos.mutateAsync({
        id: rutaId,
        cursos: selectedCursos.map(c => ({ id: c.id, seccion_id: null })),
        secciones: []
      })

      enqueueSnackbar('Secuencia actualizada correctamente', { variant: 'success' })

      onClose()
    } catch (err) {
      enqueueSnackbar('Error al salvar la secuencia', { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h5'>Gestionar Secuencia</Typography>
          <Typography variant='caption' color='text.secondary'>{ruta?.titulo}</Typography>
        </Box>
        <IconButton onClick={onClose} size='small'><i className='tabler-x' /></IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 0, bgcolor: 'action.hover' }}>
        <Box sx={{ p: 6 }}>
          <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ mb: 4 }}>
              <Autocomplete
                key={selectedCursos.length}
                options={cursosData?.cursos || []}
                getOptionLabel={(option) => option.titulo}
                onChange={(_, val) => handleAddCurso(val)}
                value={null}
                renderInput={(params) => (
                  <TextField {...params} label={`Añadir curso a la secuencia...`} variant='outlined' fullWidth size='small' />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Box
                        sx={{
                            width: 80,
                            height: 50,
                            borderRadius: '10px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                      >
                        <CourseThumbnail
                            src={option.miniatura}
                            title={option.titulo}
                            variant='simple'
                        />
                      </Box>
                      <Typography variant='body2'>{option.titulo}</Typography>
                    </Box>
                  </li>
                )}
              />
            </Box>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedCursos.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <List sx={{ p: 0 }}>
                  {selectedCursos.map((curso, index) => (
                    <SortableCourseItem 
                      key={curso.id} 
                      curso={curso} 
                      index={index} 
                      total={selectedCursos.length}
                      onRemove={handleRemoveCurso}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>

            {selectedCursos.length === 0 && (
              <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'action.disabledBackground', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                <Typography variant='caption' color='text.disabled'>Aún no hay cursos en esta secuencia.</Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 6, pt: '24px !important' }}>
        <Button onClick={onClose} color='secondary'>Cancelar</Button>
        <Button variant='contained' onClick={handleSave} disabled={manageCursos.isPending || isLoadingRuta} startIcon={<i className='tabler-device-floppy' />}>
          Guardar Secuencia
        </Button>
      </DialogActions>
    </Dialog>
  )
}
