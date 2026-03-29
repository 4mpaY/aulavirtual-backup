'use client'

import React, { useState, Children, cloneElement } from 'react'

import {
  Grid,
  Typography,
  Box,
  Button,
  Card,
  IconButton,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Avatar,
  Tooltip
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
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import CustomTextField from '@core/components/mui/TextField'
import { useEditCurso } from '../../hooks/useCursos'

// Componente para Ítems arrastrables
const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative' as const
  }

  return (
    <div ref={setNodeRef} style={style}>
      {Children.map(children, (child: any) =>
        cloneElement(child, { dragHandleProps: { ...attributes, ...listeners } })
      )}
    </div>
  )
}

export function TabDetallesPremium({ curso, onSuccess }: any) {
  const { enqueueSnackbar } = useSnackbar()
  const editMutation = useEditCurso()

  // Inicializar estados con IDs estables para DND
  const [objetivos, setObjetivos] = useState<any[]>(
    (curso.objetivos || []).map((text: string, i: number) => ({ id: `obj-${Math.random()}-${i}`, text }))
  )

  const [metodologia, setMetodologia] = useState<any[]>(
    (curso.metodologia || []).map((m: any, i: number) => ({ ...m, id: `met-${Math.random()}-${i}` }))
  )

  const [beneficios, setBeneficios] = useState<any[]>(
    (curso.beneficios || []).map((b: any, i: number) => ({ ...b, id: `ben-${Math.random()}-${i}` }))
  )

  const [incluye, setIncluye] = useState<any[]>(
    (curso.incluye || []).map((item: any, i: number) => ({ ...item, id: `inc-${Math.random()}-${i}` }))
  )

  const [newObjetivo, setNewObjetivo] = useState('')

  // Sensores para DND
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleSave = async () => {
    try {
      // Limpiar IDs temporales antes de guardar
      const cleanObjetivos = objetivos.map((o: any) => o.text)

      const cleanMetodologia = metodologia.map((m: any) => {
        const newItem = { ...m }

        delete newItem.id

        return newItem
      })

      const cleanBeneficios = beneficios.map((b: any) => {
        const newItem = { ...b }

        delete newItem.id

        return newItem
      })

      const cleanIncluye = incluye.map((i: any) => {
        const newItem = { ...i }

        delete newItem.id

        return newItem
      })

      await editMutation.mutateAsync({
        id: curso.id,
        data: {
          objetivos: cleanObjetivos,
          metodologia: cleanMetodologia,
          beneficios: cleanBeneficios,
          incluye: cleanIncluye
        }
      })

      enqueueSnackbar('Detalles premium actualizados', { variant: 'success' })
      onSuccess()
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Error al guardar', { variant: 'error' })
    }
  }

  // Gestionar Objetivos
  const addObjetivo = () => {
    if (!newObjetivo.trim()) return
    setObjetivos(prev => [...prev, { id: `obj-${Math.random()}`, text: newObjetivo.trim() }])
    setNewObjetivo('')
  }

  const removeObjetivo = (id: string) => {
    setObjetivos(prev => prev.filter(o => o.id !== id))
  }

  const handleObjetivosDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = objetivos.findIndex(o => o.id === active.id)
    const newIndex = objetivos.findIndex(o => o.id === over.id)

    setObjetivos(prev => arrayMove(prev, oldIndex, newIndex))
  }

  const handleMetodologiaDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = metodologia.findIndex(m => m.id === active.id)
    const newIndex = metodologia.findIndex(m => m.id === over.id)

    setMetodologia(prev => arrayMove(prev, oldIndex, newIndex))
  }

  const handleBeneficiosDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = beneficios.findIndex(b => b.id === active.id)
    const newIndex = beneficios.findIndex(b => b.id === over.id)

    setBeneficios(prev => arrayMove(prev, oldIndex, newIndex))
  }

  const handleIncluyeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = incluye.findIndex(i => i.id === active.id)
    const newIndex = incluye.findIndex(i => i.id === over.id)

    setIncluye(prev => arrayMove(prev, oldIndex, newIndex))
  }

  return (
    <Grid container spacing={6}>
      {/* Objetivos */}
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className='tabler-target' /> ¿Qué logrará el alumno? (Objetivos)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <CustomTextField
            fullWidth
            placeholder='Añadir un objetivo...'
            value={newObjetivo}
            onChange={e => setNewObjetivo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addObjetivo()}
          />
          <Tooltip title="Añadir nuevo objetivo">
            <Button variant='tonal' onClick={addObjetivo} startIcon={<i className='tabler-plus' />}>
              Añadir
            </Button>
          </Tooltip>
        </Box>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleObjetivosDragEnd}>
          <SortableContext items={objetivos.map(o => o.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={2}>
              {objetivos.map((obj) => (
                <SortableItem key={obj.id} id={obj.id}>
                  <ObjectiveCard text={obj.text} onRemove={() => removeObjetivo(obj.id)} />
                </SortableItem>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </Grid>

      {/* Metodología */}
      <Grid item xs={12}><Divider /></Grid>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className='tabler-certificate' /> Metodología de Aprendizaje
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Define los pilares de tu enseñanza. Aparecerán como tarjetas en la página de detalle.
        </Typography>

        <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
          <Tooltip title="Añadir una nueva tarjeta de metodología">
            <Button
              variant='outlined'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setMetodologia(prev => [...prev, { id: `met-${Math.random()}`, title: '', desc: '', icon: 'star' }])}
            >
              Añadir Pilar Metodológico
            </Button>
          </Tooltip>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 3,
            borderRadius: '12px',
            bgcolor: 'info.lighterOpacity',
            border: '1px dashed',
            borderColor: 'info.main',
            flex: 1
          }}>
            <i className='tabler-info-circle' style={{ fontSize: '1.5rem', color: 'var(--mui-palette-info-main)' }} />
            <Typography variant='body2' sx={{ color: 'info.main', fontWeight: 500 }}>
              Personaliza tus iconos en: <a href="https://tabler-icons.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 800, textDecoration: 'underline' }}>tabler-icons.io</a>
            </Typography>
          </Box>
        </Stack>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleMetodologiaDragEnd}>
          <SortableContext items={metodologia.map(m => m.id)} strategy={rectSortingStrategy}>
            <Grid container spacing={3}>
              {metodologia.map((m, i) => (
                <Grid item xs={12} md={4} key={m.id}>
                  <SortableItem id={m.id}>
                    <MetodologiaCard
                      item={m}
                      index={i}
                      onChange={(val: any) => {
                        const newM = [...metodologia]

                        newM[i] = { ...val, id: m.id }

                        setMetodologia(newM)
                      }}
                      onRemove={() => setMetodologia(prev => prev.filter(item => item.id !== m.id))}
                    />
                  </SortableItem>
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </Grid>

      {/* Beneficios / Highlights */}
      <Grid item xs={12}><Divider /></Grid>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className='tabler-gift' /> Beneficios Destacados (Highlights)
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Tarjetas superiores que resaltan características como &quot;Acceso 24/7&quot;, etc.
        </Typography>

        <Tooltip title="Añadir un nuevo beneficio destacado">
          <Button
            variant='outlined'
            startIcon={<i className='tabler-plus' />}
            onClick={() => setBeneficios(prev => [...prev, { id: `ben-${Math.random()}`, title: '', desc: '', icon: 'tabler-bolt' }])}
            sx={{ mb: 3 }}
          >
            Añadir Highlight
          </Button>
        </Tooltip>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleBeneficiosDragEnd}>
          <SortableContext items={beneficios.map(b => b.id)} strategy={rectSortingStrategy}>
            <Grid container spacing={3}>
              {beneficios.map((b, i) => (
                <Grid item xs={12} sm={6} md={3} key={b.id}>
                  <SortableItem id={b.id}>
                    <BeneficioCard
                      item={b}
                      index={i}
                      onChange={(val: any) => {
                        const newB = [...beneficios]

                        newB[i] = { ...val, id: b.id }

                        setBeneficios(newB)
                      }}
                      onRemove={() => setBeneficios(prev => prev.filter(item => item.id !== b.id))}
                    />
                  </SortableItem>
                </Grid>
              ))}
            </Grid>
          </SortableContext>
        </DndContext>
      </Grid>

      {/* El programa incluye (Sidebar) */}
      <Grid item xs={12}><Divider /></Grid>
      <Grid item xs={12}>
        <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className='tabler-checklist' /> El programa incluye (Sidebar)
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Lista de verificación que aparece en el lateral del curso.
        </Typography>

        <Tooltip title="Añadir nuevo ítem a la lista de servicios">
          <Button
            variant='outlined'
            startIcon={<i className='tabler-plus' />}
            onClick={() => setIncluye(prev => [...prev, { id: `inc-${Math.random()}`, text: '', active: true }])}
            sx={{ mb: 3 }}
          >
            Añadir Ítem de Lista
          </Button>
        </Tooltip>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleIncluyeDragEnd}>
          <SortableContext items={incluye.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <Stack spacing={2}>
              {incluye.map((item, i) => (
                <SortableItem key={item.id} id={item.id}>
                  <IncluyeItem
                    item={item}
                    index={i}
                    onChange={(val: any) => {
                      const newI = [...incluye]

                      newI[i] = { ...val, id: item.id }

                      setIncluye(newI)
                    }}
                    onRemove={() => setIncluye(prev => prev.filter(i_item => i_item.id !== item.id))}
                  />
                </SortableItem>
              ))}
            </Stack>
          </SortableContext>
        </DndContext>
      </Grid>

      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button
            variant='contained'
            size='large'
            onClick={handleSave}
            disabled={editMutation.isPending}
            startIcon={<i className='tabler-device-floppy' />}
          >
            {editMutation.isPending ? 'Guardando...' : 'Guardar Todos los Detalles Premium'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

// --- Componentes Internos para Tarjetas ---

const ObjectiveCard = ({ text, onRemove, dragHandleProps }: any) => (
  <Card variant='outlined' sx={{ px: 3, py: 2, bgcolor: 'action.hover' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        <Tooltip title="Arrastrar para reordenar objetivo">
          <Box {...dragHandleProps} sx={{ display: 'flex', cursor: 'grab' }}>
            <i className='tabler-grip-vertical text-xl text-textDisabled' />
          </Box>
        </Tooltip>
        <Typography variant='body2'>{text}</Typography>
      </Box>
      <Tooltip title="Eliminar objetivo">
        <IconButton size='small' color='error' onClick={onRemove}>
          <i className='tabler-trash' />
        </IconButton>
      </Tooltip>
    </Box>
  </Card>
)

const MetodologiaCard = ({ item, onChange, onRemove, dragHandleProps }: any) => (
  <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
    <Tooltip title="Eliminar pilar metodológico">
      <IconButton
        size='small'
        color='error'
        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 20 }}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
      >
        <i className='tabler-x' />
      </IconButton>
    </Tooltip>
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Arrastrar para reordenar">
          <Box {...dragHandleProps} sx={{ display: 'flex', cursor: 'grab' }}>
            <i className='tabler-grip-vertical text-xl text-textDisabled' />
          </Box>
        </Tooltip>
        <Avatar sx={{ bgcolor: 'primary.lighterOpacity', color: 'primary.main', width: 32, height: 32 }}>
          <i className={item.icon?.startsWith('tabler-') ? item.icon : `tabler-${item.icon}`} style={{ fontSize: '1rem' }} />
        </Avatar>
        <CustomTextField
          label='Icono'
          fullWidth
          size='small'
          value={item.icon?.replace('tabler-', '')}
          onChange={e => onChange({ ...item, icon: e.target.value.replace('tabler-', '') })}
        />
      </Box>
      <CustomTextField
        label='Título'
        fullWidth
        size='small'
        value={item.title}
        onChange={e => onChange({ ...item, title: e.target.value })}
      />
      <CustomTextField
        label='Descripción'
        fullWidth
        multiline
        rows={2}
        size='small'
        value={item.desc}
        onChange={e => onChange({ ...item, desc: e.target.value })}
      />
    </Stack>
  </Card>
)

const BeneficioCard = ({ item, onChange, onRemove, dragHandleProps }: any) => (
  <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
    <Tooltip title="Eliminar beneficio">
      <IconButton
        size='small'
        color='error'
        sx={{ position: 'absolute', top: 4, right: 4, zIndex: 20 }}
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
      >
        <i className='tabler-x' />
      </IconButton>
    </Tooltip>
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title="Arrastrar para reordenar">
          <Box {...dragHandleProps} sx={{ display: 'flex', cursor: 'grab' }}>
            <i className='tabler-grip-vertical text-xl text-textDisabled' />
          </Box>
        </Tooltip>
        <Avatar sx={{ bgcolor: 'primary.lighterOpacity', color: 'primary.main', width: 32, height: 32 }}>
          <i className={item.icon?.startsWith('tabler-') ? item.icon : `tabler-${item.icon}`} style={{ fontSize: '1rem' }} />
        </Avatar>
        <CustomTextField
          label='Icono'
          fullWidth
          size='small'
          value={item.icon?.replace('tabler-', '')}
          onChange={e => onChange({ ...item, icon: e.target.value.replace('tabler-', '') })}
        />
      </Box>
      <CustomTextField
        label='Título'
        size='small'
        value={item.title}
        onChange={e => onChange({ ...item, title: e.target.value })}
      />
      <CustomTextField
        label='Descripción'
        multiline
        rows={2}
        size='small'
        value={item.desc}
        onChange={e => onChange({ ...item, desc: e.target.value })}
      />
    </Stack>
  </Card>
)

const IncluyeItem = ({ item, onChange, onRemove, dragHandleProps }: any) => (
  <Card variant='outlined' sx={{ px: 3, py: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title="Arrastrar para reordenar">
        <Box {...dragHandleProps} sx={{ display: 'flex', cursor: 'grab' }}>
          <i className='tabler-grip-vertical text-xl text-textDisabled' />
        </Box>
      </Tooltip>
      <Tooltip title={item.active ? "Cambiar a NO incluido" : "Cambiar a INCLUIDO"}>
        <FormControlLabel
          control={<Switch checked={item.active} onChange={e => onChange({ ...item, active: e.target.checked })} />}
          label={
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: item.active ? 'success.main' : 'error.main',
                minWidth: 80
              }}
            >
              {item.active ? 'Incluido' : 'No incluido'}
            </Typography>
          }
          sx={{ mr: 4 }}
        />
      </Tooltip>
      <CustomTextField
        fullWidth
        size='small'
        placeholder='Ej: Certificado oficial'
        value={item.text}
        onChange={e => onChange({ ...item, text: e.target.value })}
      />
      <Tooltip title="Eliminar ítem">
        <IconButton color='error' onClick={onRemove}>
          <i className='tabler-trash' />
        </IconButton>
      </Tooltip>
    </Box>
  </Card>
)
