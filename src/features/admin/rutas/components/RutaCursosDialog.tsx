'use client'

import React, { useState, useEffect } from 'react'

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
  Avatar,
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

        <Avatar 
          src={curso.miniatura || ''} 
          variant='rounded' 
          sx={{ mr: 3, width: 44, height: 32, border: '1px solid var(--mui-palette-divider)' }} 
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

export const RutaCursosDialog: React.FC<RutaCursosDialogProps> = ({ open, onClose, rutaId }) => {
  const { data: ruta, isLoading: isLoadingRuta } = useRuta(rutaId)
  const { data: cursosData } = useCursos({ limit: '100' })
  const manageCursos = useManageRutaCursos()

  const { enqueueSnackbar } = useSnackbar()
  const [selectedCursos, setSelectedCursos] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  
  // States for Editing Section
  const [editSectionId, setEditSectionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

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
      setSections((ruta.secciones as any[]) || [])
    } else {
      setSelectedCursos([])
      setSections([])
    }
  }, [ruta])

  const handleAddSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      titulo: 'Nueva Sección',
      orden: sections.length + 1
    }

    setSections([...sections, newSection])
  }

  const handleEditSection = (seccion: any) => {
    setEditSectionId(seccion.id)
    setEditTitle(seccion.titulo)
  }

  const handleSaveSectionEdit = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, titulo: editTitle } : s))
    setEditSectionId(null)
  }

  const handleRemoveSection = (id: string) => {
    if (window.confirm('¿Eliminar sección? Los cursos en esta sección quedarán sin asignar.')) {
      setSections(sections.filter(s => s.id !== id))
      setSelectedCursos(selectedCursos.map(c => c.seccion_id === id ? { ...c, seccion_id: null } : c))
    }
  }

  const handleAddCurso = (curso: Curso | null, seccionId: string | null = null) => {
    if (!curso) return

    if (selectedCursos.some(c => c.id === curso.id)) {
      enqueueSnackbar('Este curso ya está en la ruta', { variant: 'warning' })

      return
    }

    setSelectedCursos([...selectedCursos, { 
      id: curso.id, 
      titulo: curso.titulo, 
      miniatura: curso.miniatura, 
      seccion_id: seccionId 
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
        cursos: selectedCursos.map(c => ({ id: c.id, seccion_id: c.seccion_id })),
        secciones: sections
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
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant='tonal' 
            startIcon={<i className='tabler-plus' />}
            onClick={handleAddSection}
          >
            Añadir Sección
          </Button>
        </Box>
        
        <Box sx={{ p: 6, pt: 0 }}>
             {sections.sort((a, b) => a.orden - b.orden).map((seccion) => {
               const cursosInSection = selectedCursos.filter(c => c.seccion_id === seccion.id)
               const isEditing = editSectionId === seccion.id

               return (
                 <Paper key={seccion.id} sx={{ mb: 6, p: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                   <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                     {isEditing ? (
                       <Box sx={{ width: '100%', mr: 4 }}>
                         <TextField 
                           fullWidth 
                           size='small' 
                           label='Título' 
                           value={editTitle} 
                           onChange={e => setEditTitle(e.target.value)} 
                           sx={{ mb: 2 }} 
                         />
                         <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                           <Button size='small' variant='contained' onClick={() => handleSaveSectionEdit(seccion.id)}>Guardar</Button>
                           <Button size='small' variant='outlined' color='secondary' onClick={() => setEditSectionId(null)}>Cancelar</Button>
                         </Box>
                       </Box>
                     ) : (
                       <Box>
                         <Typography variant='h6' sx={{ fontWeight: 800, color: 'primary.main' }}>
                           {seccion.titulo}
                         </Typography>
                       </Box>
                     )}
                     
                     {!isEditing && (
                       <Box sx={{ display: 'flex', gap: 1 }}>
                         <IconButton size='small' onClick={() => handleEditSection(seccion)}>
                           <i className='tabler-edit text-sm' />
                         </IconButton>
                         <IconButton size='small' color='error' onClick={() => handleRemoveSection(seccion.id)}>
                           <i className='tabler-trash text-sm' />
                         </IconButton>
                       </Box>
                     )}
                   </Box>

                    {/* Search for this section */}
                    <Box sx={{ mb: 4 }}>
                      <Autocomplete
                        key={cursosInSection.length}
                        options={cursosData?.cursos || []}
                        getOptionLabel={(option) => option.titulo}
                        onChange={(_, val) => handleAddCurso(val, seccion.id)}
                        value={null}
                        renderInput={(params) => (
                          <TextField {...params} label={`Añadir curso a "${seccion.titulo}"...`} variant='outlined' fullWidth size='small' />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Avatar src={option.miniatura || ''} variant='rounded' sx={{ width: 36, height: 24 }} />
                              <Typography variant='body2'>{option.titulo}</Typography>
                            </Box>
                          </li>
                        )}
                      />
                    </Box>

                    {/* Sortable list for this section */}
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={cursosInSection.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <List sx={{ p: 0 }}>
                          {cursosInSection.map((curso, index) => (
                            <SortableCourseItem 
                              key={curso.id} 
                              curso={curso} 
                              index={index} 
                              total={cursosInSection.length}
                              onRemove={handleRemoveCurso}
                            />
                          ))}
                        </List>
                      </SortableContext>
                    </DndContext>

                    {cursosInSection.length === 0 && (
                      <Box sx={{ py: 4, textAlign: 'center', bgcolor: 'action.disabledBackground', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
                        <Typography variant='caption' color='text.disabled'>Aún no hay cursos en esta sección.</Typography>
                      </Box>
                    )}
                 </Paper>
               )
             })}

             {/* Unassigned Courses (if any exist from old version or mistake) */}
             {selectedCursos.filter(c => !c.seccion_id).length > 0 && (
               <Paper sx={{ mb: 6, p: 4, borderRadius: 2, border: '1px solid', borderColor: 'error.light', bgcolor: 'error.shades.50' }}>
                  <Typography variant='subtitle2' color='error' sx={{ mb: 3, fontWeight: 800 }}>
                    Cursos sin sección asignada:
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {selectedCursos.filter(c => !c.seccion_id).map((curso, index, arr) => (
                      <SortableCourseItem 
                        key={curso.id} 
                        curso={curso} 
                        index={index} 
                        total={arr.length}
                        onRemove={handleRemoveCurso}
                      />
                    ))}
                  </List>
               </Paper>
             )}
          </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 6 }}>
        <Button onClick={onClose} color='secondary'>Cancelar</Button>
        <Button variant='contained' onClick={handleSave} disabled={manageCursos.isPending || isLoadingRuta} startIcon={<i className='tabler-device-floppy' />}>
          Guardar Secuencia
        </Button>
      </DialogActions>
    </Dialog>
  )
}
