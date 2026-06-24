'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box, Button, Card, CardContent, CardHeader, Chip, Divider,
  FormControlLabel, Grid, IconButton, MenuItem, Switch, Tab, Tabs, TextField, Tooltip, Typography
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { Icon } from '@iconify/react'

import { useSimulacro, useCreateSimulacro, useEditSimulacro, useCambiarEstadoSimulacro } from '../hooks/useSimulacros'
import type { EstadoSimulacro, NivelSimulacro } from '../entity/Simulacro'
import PreguntasTab from '../components/PreguntasTab'
import PreviewSimulacroModal from '../components/PreviewSimulacroModal'
import MediaLibrary from '@/features/admin/cursos/components/MediaLibrary'

const estadoColor: Record<EstadoSimulacro, 'warning' | 'success' | 'secondary'> = {
  BORRADOR: 'warning', PUBLICADO: 'success', ARCHIVADO: 'secondary'
}

const siguienteEstado: Record<EstadoSimulacro, EstadoSimulacro | null> = {
  BORRADOR: 'PUBLICADO', PUBLICADO: 'ARCHIVADO', ARCHIVADO: null
}

const estadoLabel: Record<EstadoSimulacro, string> = {
  BORRADOR: 'Borrador', PUBLICADO: 'Publicado', ARCHIVADO: 'Archivado'
}

function SectionHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: string }) {
  return (
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon && <i className={icon} style={{ fontSize: '1.1rem', color: 'var(--mui-palette-text-secondary)' }} />}
        <Typography variant='subtitle1' fontWeight={700}>{title}</Typography>
      </Box>
      {subtitle && (
        <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mt: 1.5 }} />
    </Grid>
  )
}

interface Props {
  mode: 'create' | 'edit'
  simulacroId?: string
}

export function SimulacroFormPage({ mode, simulacroId }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const isEdit = mode === 'edit'
  const [activeTab, setActiveTab] = useState(0)
  const [mediaOpen, setMediaOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data: simulacro, isLoading } = useSimulacro(simulacroId ?? '')
  const createMutation = useCreateSimulacro()
  const editMutation = useEditSimulacro()
  const estadoMutation = useCambiarEstadoSimulacro()

  const [form, setForm] = useState({
    titulo: '', descripcion: '', miniatura: '', nivel: 'BASICO' as NivelSimulacro,
    duracion: 0, numero_preguntas: 0, area_tematica: '',
    es_gratis: false, precio: 0, moneda: 'PEN',
  })

  useEffect(() => {
    if (simulacro) {
      setForm({
        titulo: simulacro.titulo ?? '',
        descripcion: simulacro.descripcion ?? '',
        miniatura: simulacro.miniatura ?? '',
        nivel: simulacro.nivel,
        duracion: simulacro.duracion ? Number(simulacro.duracion) : 0,
        numero_preguntas: simulacro.numero_preguntas ?? 0,
        area_tematica: simulacro.area_tematica ?? '',
        es_gratis: simulacro.es_gratis,
        precio: Number(simulacro.precio) ?? 0,
        moneda: simulacro.moneda ?? 'PEN',
      })
    }
  }, [simulacro])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.titulo.trim()) {
      enqueueSnackbar('El título es requerido', { variant: 'error' })

      return
    }

    if (!form.es_gratis && Number(form.precio) <= 0) {
      enqueueSnackbar('El precio debe ser mayor a 0. Si es gratuito activa el interruptor correspondiente.', { variant: 'error' })

      return
    }

    try {
      const payload = {
        ...form,
        numero_preguntas: Number(form.numero_preguntas),
        precio: Number(form.precio),
        duracion: form.duracion > 0 ? form.duracion : null,
        descripcion: form.descripcion || null,
        miniatura: form.miniatura || null,
        area_tematica: form.area_tematica || null,
      }

      if (isEdit && simulacroId) {
        await editMutation.mutateAsync({ id: simulacroId, dto: payload as any })
        enqueueSnackbar('Simulacro actualizado', { variant: 'success' })
      } else {
        const created = await createMutation.mutateAsync(payload as any)

        enqueueSnackbar('Simulacro creado', { variant: 'success' })
        router.push(`/admin/simulacros/${created.id}`)
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar', { variant: 'error' })
    }
  }

  const handleCambiarEstado = async (nuevoEstado: EstadoSimulacro) => {
    if (!simulacroId) return

    try {
      await estadoMutation.mutateAsync({ id: simulacroId, dto: { estado: nuevoEstado } })
      enqueueSnackbar(`Estado cambiado a ${estadoLabel[nuevoEstado]}`, { variant: 'success' })
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al cambiar estado', { variant: 'error' })
    }
  }

  if (isEdit && isLoading) return <Typography sx={{ p: 4 }}>Cargando...</Typography>

  const currentEstado = simulacro?.estado as EstadoSimulacro | undefined
  const nextEstado = currentEstado ? siguienteEstado[currentEstado] : null

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant='h4' fontWeight={600}>{isEdit ? 'Editar Simulacro' : 'Nuevo Simulacro'}</Typography>
          {currentEstado && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip label={estadoLabel[currentEstado]} color={estadoColor[currentEstado]} size='small' variant='tonal' />
              <Typography variant='body2' color='text.secondary'>
                · {form.numero_preguntas} pregunta{form.numero_preguntas !== 1 ? 's' : ''} por intento
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Tooltip title='Volver a Simulacros'>
            <IconButton onClick={() => router.push('/admin/simulacros')} className='text-textPrimary' sx={{ border: '1px solid', borderColor: 'divider' }}>
              <i className='tabler-arrow-left text-[22px]' />
            </IconButton>
          </Tooltip>
          {isEdit && simulacroId && (
            <Tooltip title='Vista previa'>
              <IconButton onClick={() => setPreviewOpen(true)} className='text-textPrimary' sx={{ border: '1px solid', borderColor: 'divider' }}>
                <i className='tabler-eye text-[22px]' />
              </IconButton>
            </Tooltip>
          )}
          {isEdit && nextEstado && (
            <Button variant='outlined' onClick={() => handleCambiarEstado(nextEstado)}
              disabled={estadoMutation.isPending}>
              Pasar a {estadoLabel[nextEstado]}
            </Button>
          )}
          <Button variant='contained' onClick={handleSubmit}
            disabled={createMutation.isPending || editMutation.isPending}
            startIcon={<Icon icon='mdi:content-save' />}>
            {isEdit ? 'Guardar Cambios' : 'Crear Simulacro'}
          </Button>
        </Box>
      </Box>

      {/* Tabs — solo en modo edición */}
      {isEdit && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label='Información' icon={<i className='tabler-info-circle' />} iconPosition='start' />
            <Tab label='Preguntas' icon={<i className='tabler-clipboard-list' />} iconPosition='start' />
          </Tabs>
        </Box>
      )}

      {/* Tab: Preguntas */}
      {isEdit && activeTab === 1 && simulacroId && (
        <PreguntasTab simulacroId={simulacroId} numeroPreguntasSimulacro={form.numero_preguntas} />
      )}

      {/* Tab: Información (siempre visible en create, condicional en edit) */}
      {(!isEdit || activeTab === 0) && (
        <Grid container spacing={4}>
          {/* Columna principal */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 4 }}>
              <CardHeader title='Información General' />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <SectionHeader title='Datos del catálogo' subtitle='Lo que ve el estudiante en la lista de simulacros' icon='tabler-id-badge-2' />
                  <Grid item xs={12}>
                    <TextField fullWidth label='Título *' value={form.titulo} onChange={set('titulo')} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline minRows={4} label='Descripción' value={form.descripcion} onChange={set('descripcion')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label='Área Temática' placeholder='ej. Matemáticas, Historia, IA' value={form.area_tematica} onChange={set('area_tematica')} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth select label='Nivel' value={form.nivel}
                      onChange={e => setForm(p => ({ ...p, nivel: e.target.value as NivelSimulacro }))}>
                      <MenuItem value='BASICO'>Básico</MenuItem>
                      <MenuItem value='INTERMEDIO'>Intermedio</MenuItem>
                      <MenuItem value='AVANZADO'>Avanzado</MenuItem>
                    </TextField>
                  </Grid>

                  <SectionHeader title='Configuración del examen' subtitle='Define cómo se rinde el simulacro' icon='tabler-settings' />
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='number' label='Duración (minutos)' value={form.duracion || ''}
                      onChange={e => setForm(p => ({ ...p, duracion: Number(e.target.value) }))}
                      inputProps={{ min: 0, step: 1 }}
                      InputProps={{ endAdornment: <span style={{ color: 'rgba(0,0,0,0.4)', whiteSpace: 'nowrap', paddingRight: 8 }}>min</span> }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth type='number' label='Número de Preguntas por intento' value={form.numero_preguntas}
                      onChange={e => setForm(p => ({ ...p, numero_preguntas: Number(e.target.value) }))} inputProps={{ min: 0 }}
                      helperText='Cuántas preguntas se muestran al estudiante en cada intento, elegidas al azar del banco de preguntas. El banco se administra en la pestaña "Preguntas".'
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title='Precio' />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Switch checked={form.es_gratis} onChange={e => setForm(p => ({ ...p, es_gratis: e.target.checked }))} />}
                      label='Simulacro gratuito'
                    />
                    <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: -0.5, ml: 0.25 }}>
                      Si lo activas, cualquier estudiante autenticado podrá rendirlo sin pagar.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField fullWidth type='number' label='Precio' value={form.precio} disabled={form.es_gratis}
                      onChange={e => setForm(p => ({ ...p, precio: Number(e.target.value) }))} inputProps={{ min: 0, step: 0.01 }} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth select label='Moneda' value={form.moneda} disabled={form.es_gratis}
                      onChange={e => setForm(p => ({ ...p, moneda: e.target.value }))}>
                      <MenuItem value='PEN'>PEN (S/)</MenuItem>
                      <MenuItem value='USD'>USD ($)</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Columna lateral */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title='Miniatura' />
              <Divider />
              <CardContent>
                {form.miniatura ? (
                  <Box>
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', aspectRatio: '16/9', bgcolor: 'action.hover', mb: 1.5 }}>
                      <img src={form.miniatura} alt='preview' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button fullWidth size='small' variant='outlined' onClick={() => setMediaOpen(true)} startIcon={<Icon icon='mdi:image-edit' />}>
                        Cambiar
                      </Button>
                      <Button size='small' color='error' variant='outlined' onClick={() => setForm(p => ({ ...p, miniatura: '' }))} startIcon={<Icon icon='mdi:image-off' />}>
                        Quitar
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' } }}
                    onClick={() => setMediaOpen(true)}>
                    <Icon icon='mdi:image-plus' fontSize={36} style={{ color: 'var(--mui-palette-text-disabled)' }} />
                    <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>Seleccionar imagen</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <MediaLibrary
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => { setForm(p => ({ ...p, miniatura: url })); setMediaOpen(false) }}
        title='Seleccionar miniatura del simulacro'
        acceptType='IMAGEN'
      />

      {isEdit && simulacroId && (
        <PreviewSimulacroModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          simulacroId={simulacroId}
          titulo={form.titulo}
          duracion={form.duracion}
        />
      )}
    </Box>
  )
}
