'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, Card, CardHeader, CircularProgress, Divider, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { useSnackbar } from 'notistack'

import MediaLibrary from '../../cursos/components/MediaLibrary'
import { usePlantillaCertificado, usePlantillasCertificadoMutation } from '../hooks/usePlantillasCertificado'
import { CATALOGO_CAMPOS } from '../entity/catalogoCampos'
import type { CampoPagina, CampoPlantillaPersonalizada } from '../entity/PlantillaCertificado'
import CampoChip from './CampoChip'
import PanelEstiloCampo from './PanelEstiloCampo'

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

interface Props {
  plantillaId: string
}

export default function PlantillaCertificadoEditor({ plantillaId }: Props) {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { data: plantilla, isLoading } = usePlantillaCertificado(plantillaId)
  const { actualizar } = usePlantillasCertificadoMutation()

  const [nombre, setNombre] = useState('')
  const [caraFrenteUrl, setCaraFrenteUrl] = useState('')
  const [caraReversoUrl, setCaraReversoUrl] = useState<string | null>(null)
  const [campos, setCampos] = useState<CampoPlantillaPersonalizada[]>([])
  const [cara, setCara] = useState<CampoPagina>('frente')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mediaTarget, setMediaTarget] = useState<'frente' | 'reverso' | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!plantilla) return
    setNombre(plantilla.nombre)
    setCaraFrenteUrl(plantilla.cara_frente_url)
    setCaraReversoUrl(plantilla.cara_reverso_url)
    setCampos(plantilla.campos || [])
  }, [plantilla])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const camposCara = useMemo(() => campos.filter(c => c.pagina === cara), [campos, cara])
  const keysUsadosEnCara = useMemo(() => new Set(camposCara.map(c => c.key)), [camposCara])
  const selected = campos.find(c => c.id === selectedId) || null

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    const rect = canvasRef.current?.getBoundingClientRect()

    if (!rect || (delta.x === 0 && delta.y === 0)) return

    setCampos(prev =>
      prev.map(c => {
        if (c.id !== active.id) return c

        // Los campos de imagen/QR tienen un ancho fijo (widthPct) y se anclan por su centro
        // horizontal (siempre) y verticalmente según vAlign: si se limitara solo el punto de
        // posición, se podrían arrastrar hasta quedar recortados por el borde del lienzo
        // (que tiene overflow:hidden). Se reserva ese tamaño al calcular los límites.
        const esImagen = c.tipo === 'imagen' || c.tipo === 'qr'
        const tam = c.widthPct ?? 15
        const vAlign = c.vAlign ?? 'top'
        const minX = esImagen ? tam / 2 : 0
        const maxX = esImagen ? 100 - tam / 2 : 97
        const minY = !esImagen ? 0 : vAlign === 'middle' ? tam / 2 : vAlign === 'bottom' ? tam : 0
        const maxY = !esImagen ? 96 : vAlign === 'middle' ? 100 - tam / 2 : vAlign === 'bottom' ? 100 : 100 - tam

        return {
          ...c,
          xPct: clamp(c.xPct + (delta.x / rect.width) * 100, minX, maxX),
          yPct: clamp(c.yPct + (delta.y / rect.height) * 100, minY, maxY)
        }
      })
    )
  }

  const handleAddCampo = (item: (typeof CATALOGO_CAMPOS)[number]) => {
    const nuevo: CampoPlantillaPersonalizada = {
      id: crypto.randomUUID(),
      tipo: item.tipo,
      pagina: cara,
      key: item.key,
      xPct: 50,
      yPct: 40,
      ...(item.tipo === 'texto'
        ? { fontSize: 14, color: '#000000', align: 'center' as const }
        : { widthPct: item.key === 'qr' ? 12 : 18, vAlign: 'middle' as const })
    }

    setCampos(prev => [...prev, nuevo])
    setSelectedId(nuevo.id)
  }

  const handleAddTextoLibre = () => {
    const nuevo: CampoPlantillaPersonalizada = {
      id: crypto.randomUUID(),
      tipo: 'texto_libre',
      pagina: cara,
      key: null,
      texto: 'Texto',
      xPct: 50,
      yPct: 40,
      fontSize: 14,
      color: '#000000',
      align: 'center'
    }

    setCampos(prev => [...prev, nuevo])
    setSelectedId(nuevo.id)
  }

  const updateCampo = (id: string, patch: Partial<CampoPlantillaPersonalizada>) =>
    setCampos(prev => prev.map(c => (c.id === id ? { ...c, ...patch } : c)))

  const removeCampo = (id: string) => {
    setCampos(prev => prev.filter(c => c.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const handleSave = async () => {
    if (!nombre.trim()) {
      enqueueSnackbar('Ingresa un nombre para la plantilla', { variant: 'warning' })

      return
    }

    if (!caraFrenteUrl) {
      enqueueSnackbar('Sube la imagen de la cara 1 (frente) antes de guardar', { variant: 'warning' })

      return
    }

    try {
      await actualizar.mutateAsync({
        id: plantillaId,
        data: { nombre: nombre.trim(), cara_frente_url: caraFrenteUrl, cara_reverso_url: caraReversoUrl, campos }
      })
      enqueueSnackbar('Plantilla guardada', { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al guardar la plantilla', { variant: 'error' })
    }
  }

  if (isLoading || !plantilla) {
    return (
      <Card>
        <Box p={8} display='flex' justifyContent='center'>
          <CircularProgress />
        </Box>
      </Card>
    )
  }

  const caraUrl = cara === 'frente' ? caraFrenteUrl : caraReversoUrl

  return (
    <Card>
      <CardHeader
        title={
          <TextField
            variant='standard'
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder='Nombre de la plantilla'
            sx={{ minWidth: 280 }}
          />
        }
        action={
          <Stack direction='row' spacing={2}>
            <Button variant='tonal' color='secondary' onClick={() => router.push('/admin/plantillas-certificado')}>
              Volver
            </Button>
            <Button variant='contained' onClick={handleSave} disabled={actualizar.isPending}>
              Guardar
            </Button>
          </Stack>
        }
      />
      <Divider />

      <Box display='grid' gridTemplateColumns={{ xs: '1fr', lg: '260px 1fr 300px' }} minHeight={600}>
        {/* Catálogo de campos */}
        <Box p={3} sx={{ borderRight: { lg: '1px solid' }, borderColor: 'divider' }}>
          <Typography variant='overline' color='text.secondary' fontWeight={600}>
            Campos dinámicos
          </Typography>
          <Stack spacing={1} mt={2}>
            {CATALOGO_CAMPOS.map(item => (
              <Button
                key={item.key}
                size='small'
                variant='outlined'
                color={keysUsadosEnCara.has(item.key) ? 'secondary' : 'primary'}
                startIcon={<i className={item.icon} />}
                onClick={() => handleAddCampo(item)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              size='small'
              variant='outlined'
              color='primary'
              startIcon={<i className='tabler-text-size' />}
              onClick={handleAddTextoLibre}
              sx={{ justifyContent: 'flex-start' }}
            >
              + Texto libre
            </Button>
          </Stack>
        </Box>

        {/* Canvas */}
        <Box p={3}>
          <Tabs value={cara} onChange={(_, v) => setCara(v as CampoPagina)} sx={{ mb: 2 }}>
            <Tab value='frente' label='Cara 1 (Frente)' />
            <Tab value='reverso' label='Cara 2 (Reverso)' />
          </Tabs>

          <Stack direction='row' spacing={2} mb={2} flexWrap='wrap'>
            <Button size='small' variant='tonal' startIcon={<i className='tabler-upload' />} onClick={() => setMediaTarget('frente')}>
              {caraFrenteUrl ? 'Cambiar cara 1' : 'Subir cara 1'}
            </Button>
            <Button size='small' variant='tonal' startIcon={<i className='tabler-upload' />} onClick={() => setMediaTarget('reverso')}>
              {caraReversoUrl ? 'Cambiar cara 2' : 'Agregar cara 2 (opcional)'}
            </Button>
            {caraReversoUrl && (
              <Button size='small' color='error' variant='text' onClick={() => setCaraReversoUrl(null)}>
                Quitar cara 2
              </Button>
            )}
          </Stack>

          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <Box
              ref={canvasRef}
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '297/210',
                containerType: 'inline-size',
                bgcolor: 'action.hover',
                backgroundImage: caraUrl ? `url(${caraUrl})` : undefined,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {!caraUrl && (
                <Box height='100%' display='flex' alignItems='center' justifyContent='center' flexDirection='column' gap={1}>
                  <i className='tabler-photo-off' style={{ fontSize: 32, opacity: 0.4 }} />
                  <Typography color='text.secondary' variant='body2'>
                    {cara === 'frente' ? 'Sube la imagen de la cara 1' : 'Sube la imagen de la cara 2 (opcional)'}
                  </Typography>
                </Box>
              )}

              {camposCara.map(campo => (
                <CampoChip key={campo.id} campo={campo} selected={campo.id === selectedId} onSelect={() => setSelectedId(campo.id)} />
              ))}
            </Box>
          </DndContext>

          <Typography variant='caption' color='text.secondary' display='block' mt={2}>
            Sube imágenes en proporción horizontal 297:210 (A4 apaisado) para que no se deformen al generar el PDF.
          </Typography>
        </Box>

        {/* Panel de estilo */}
        <Box p={3} sx={{ borderLeft: { lg: '1px solid' }, borderColor: 'divider' }}>
          {!selected ? (
            <Typography color='text.secondary' variant='body2'>
              Selecciona un campo del lienzo para editar su estilo, o agrega uno nuevo desde el catálogo.
            </Typography>
          ) : (
            <PanelEstiloCampo
              key={selected.id}
              campo={selected}
              onChange={patch => updateCampo(selected.id, patch)}
              onRemove={() => removeCampo(selected.id)}
            />
          )}
        </Box>
      </Box>

      <MediaLibrary
        open={mediaTarget !== null}
        onClose={() => setMediaTarget(null)}
        acceptType='IMAGEN'
        onSelect={url => {
          if (mediaTarget === 'frente') setCaraFrenteUrl(url)
          if (mediaTarget === 'reverso') setCaraReversoUrl(url)
          setMediaTarget(null)
        }}
      />
    </Card>
  )
}
