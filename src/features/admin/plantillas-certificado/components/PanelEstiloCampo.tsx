'use client'

import { Box, Button, Divider, FormControlLabel, ListSubheader, MenuItem, Stack, Switch, TextField, Typography } from '@mui/material'

import type {
  CampoAlign,
  CampoFontFamily,
  CampoPlantillaPersonalizada,
  CampoVAlign,
  CampoVarianteTablaModulos
} from '../entity/PlantillaCertificado'
import { labelDeCampo } from './CampoChip'

interface Props {
  campo: CampoPlantillaPersonalizada
  onChange: (patch: Partial<CampoPlantillaPersonalizada>) => void
  onRemove: () => void
}

interface ColorFieldProps {
  label: string
  value: string | undefined
  fallback: string
  onChange: (color: string) => void
}

interface FontFamilySelectProps {
  value: CampoFontFamily | undefined
  onChange: (fontFamily: CampoFontFamily) => void
}

function FontFamilySelect({ value, onChange }: FontFamilySelectProps) {
  return (
    <TextField
      fullWidth
      select
      size='small'
      label='Tipografía'
      value={value ?? 'helvetica'}
      onChange={e => onChange(e.target.value as CampoFontFamily)}
    >
      <ListSubheader>Profesionales</ListSubheader>
      <MenuItem value='helvetica'>Helvetica (sans-serif)</MenuItem>
      <MenuItem value='times'>Times (serif clásica)</MenuItem>
      <MenuItem value='montserrat'>Montserrat (sans moderna)</MenuItem>
      <MenuItem value='playfair'>Playfair Display (serif elegante)</MenuItem>
      <MenuItem value='courier'>Courier (monoespaciada)</MenuItem>

      <ListSubheader>Amigables</ListSubheader>
      <MenuItem value='poppins'>Poppins (redondeada)</MenuItem>
      <MenuItem value='nunito'>Nunito (suave)</MenuItem>
      <MenuItem value='dancingscript'>Dancing Script (manuscrita)</MenuItem>
    </TextField>
  )
}

function ColorField({ label, value, fallback, onChange }: ColorFieldProps) {
  return (
    <Box>
      <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>{label}</Typography>
      <Stack direction='row' spacing={1.5} alignItems='center'>
        <TextField
          fullWidth
          size='small'
          value={value ?? fallback}
          onChange={e => onChange(e.target.value)}
          inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
        />
        <Box
          sx={{
            width: 36,
            height: 36,
            flexShrink: 0,
            borderRadius: 1,
            bgcolor: value ?? fallback,
            border: '2px solid',
            borderColor: 'divider',
            cursor: 'pointer'
          }}
          component='label'
        >
          <input
            type='color'
            value={/^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : fallback}
            onChange={e => onChange(e.target.value)}
            style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default function PanelEstiloCampo({ campo, onChange, onRemove }: Props) {
  const esTexto = campo.tipo === 'texto' || campo.tipo === 'texto_libre'
  const esQr = campo.tipo === 'qr' || campo.key === 'qr'
  const esTablaModulos = campo.tipo === 'tabla_modulos'

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

          <FontFamilySelect value={campo.fontFamily} onChange={fontFamily => onChange({ fontFamily })} />

          <ColorField
            label='Color'
            value={campo.color}
            fallback='#000000'
            onChange={color => onChange({ color })}
          />

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
            helperText='El texto salta de línea si supera este ancho. Por defecto ya tiene un margen automático de 92%'
          />
        </>
      )}

      {!esTexto && !esTablaModulos && (
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

          {esQr && (
            <ColorField
              label='Color del QR'
              value={campo.color}
              fallback='#000000'
              onChange={color => onChange({ color })}
            />
          )}
        </>
      )}

      {esTablaModulos && (
        <>
          <TextField
            fullWidth
            select
            size='small'
            label='Estilo de diseño'
            value={campo.variante ?? 'lista'}
            onChange={e => onChange({ variante: e.target.value as CampoVarianteTablaModulos })}
            helperText='Cómo se muestran los módulos, lecciones y el promedio de cada módulo'
          >
            <MenuItem value='lista'>Lista simple</MenuItem>
            <MenuItem value='compacta'>Compacta (promedio junto al título)</MenuItem>
            <MenuItem value='tarjetas'>Tarjetas</MenuItem>
            <MenuItem value='tabla'>Tabla con columnas</MenuItem>
          </TextField>

          <TextField
            fullWidth
            size='small'
            type='number'
            label='Tamaño de fuente máximo (pt)'
            value={campo.fontSize ?? 10}
            onChange={e => onChange({ fontSize: Number(e.target.value) || 10 })}
            helperText='La fuente se reduce automáticamente si el contenido no cabe en el cuadro'
          />

          <FontFamilySelect value={campo.fontFamily} onChange={fontFamily => onChange({ fontFamily })} />

          <ColorField
            label='Color del texto'
            value={campo.color}
            fallback='#000000'
            onChange={color => onChange({ color })}
          />

          <Stack direction='row' spacing={2}>
            <TextField
              fullWidth
              size='small'
              type='number'
              label='Ancho del cuadro (%)'
              value={campo.widthPct ?? 90}
              onChange={e => onChange({ widthPct: Number(e.target.value) || 90 })}
            />
            <TextField
              fullWidth
              size='small'
              type='number'
              label='Alto del cuadro (%)'
              value={campo.heightPct ?? 90}
              onChange={e => onChange({ heightPct: Number(e.target.value) || 90 })}
            />
          </Stack>
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
