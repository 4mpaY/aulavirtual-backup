'use client'

import { Box, Button, Divider, FormControlLabel, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material'

import type { CampoAlign, CampoPlantillaPersonalizada, CampoVAlign } from '../entity/PlantillaCertificado'
import { labelDeCampo } from './CampoChip'

interface Props {
  campo: CampoPlantillaPersonalizada
  onChange: (patch: Partial<CampoPlantillaPersonalizada>) => void
  onRemove: () => void
}

export default function PanelEstiloCampo({ campo, onChange, onRemove }: Props) {
  const esTexto = campo.tipo === 'texto' || campo.tipo === 'texto_libre'

  return (
    <Stack spacing={3}>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography variant='subtitle2'>{labelDeCampo(campo)}</Typography>
        <Button size='small' color='error' onClick={onRemove} startIcon={<i className='tabler-trash' />}>
          Quitar
        </Button>
      </Box>

      {campo.tipo === 'texto_libre' && (
        <TextField
          fullWidth
          size='small'
          label='Texto'
          value={campo.texto || ''}
          onChange={e => onChange({ texto: e.target.value })}
        />
      )}

      {esTexto && (
        <>
          <TextField
            fullWidth
            size='small'
            type='number'
            label='Tamaño de fuente (pt)'
            value={campo.fontSize ?? 14}
            onChange={e => onChange({ fontSize: Number(e.target.value) || 14 })}
          />

          <Box>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>Color</Typography>
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <TextField
                fullWidth
                size='small'
                value={campo.color ?? '#000000'}
                onChange={e => onChange({ color: e.target.value })}
                inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
              />
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  flexShrink: 0,
                  borderRadius: 1,
                  bgcolor: campo.color ?? '#000000',
                  border: '2px solid',
                  borderColor: 'divider',
                  cursor: 'pointer'
                }}
                component='label'
              >
                <input
                  type='color'
                  value={/^#[0-9A-Fa-f]{6}$/.test(campo.color || '') ? campo.color : '#000000'}
                  onChange={e => onChange({ color: e.target.value })}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                />
              </Box>
            </Stack>
          </Box>

          <Stack direction='row' spacing={3}>
            <FormControlLabel
              control={<Switch checked={!!campo.bold} onChange={e => onChange({ bold: e.target.checked })} />}
              label='Negrita'
            />
            <FormControlLabel
              control={<Switch checked={!!campo.italic} onChange={e => onChange({ italic: e.target.checked })} />}
              label='Cursiva'
            />
          </Stack>

          <TextField
            fullWidth
            select
            size='small'
            label='Alineación'
            value={campo.align ?? 'center'}
            onChange={e => onChange({ align: e.target.value as CampoAlign })}
          >
            <MenuItem value='left'>Izquierda</MenuItem>
            <MenuItem value='center'>Centro</MenuItem>
            <MenuItem value='right'>Derecha</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size='small'
            type='number'
            label='Ancho máximo (% de la página, opcional)'
            value={campo.maxWidthPct ?? ''}
            onChange={e => onChange({ maxWidthPct: e.target.value ? Number(e.target.value) : undefined })}
            helperText='El texto salta de línea si supera este ancho'
          />
        </>
      )}

      {!esTexto && (
        <>
          <TextField
            fullWidth
            size='small'
            type='number'
            label='Ancho (% de la página)'
            value={campo.widthPct ?? 15}
            onChange={e => onChange({ widthPct: Number(e.target.value) || 15 })}
            helperText='La imagen siempre queda centrada horizontalmente respecto a su posición'
          />

          <TextField
            fullWidth
            select
            size='small'
            label='Posición vertical'
            value={campo.vAlign ?? 'top'}
            onChange={e => onChange({ vAlign: e.target.value as CampoVAlign })}
          >
            <MenuItem value='top'>Arriba</MenuItem>
            <MenuItem value='middle'>Al medio</MenuItem>
            <MenuItem value='bottom'>Abajo</MenuItem>
          </TextField>
        </>
      )}

      <Divider />

      <Stack direction='row' spacing={2}>
        <TextField
          fullWidth
          size='small'
          type='number'
          label='Posición X (%)'
          value={Math.round(campo.xPct)}
          onChange={e => onChange({ xPct: Number(e.target.value) || 0 })}
        />
        <TextField
          fullWidth
          size='small'
          type='number'
          label='Posición Y (%)'
          value={Math.round(campo.yPct)}
          onChange={e => onChange({ yPct: Number(e.target.value) || 0 })}
        />
      </Stack>
    </Stack>
  )
}
