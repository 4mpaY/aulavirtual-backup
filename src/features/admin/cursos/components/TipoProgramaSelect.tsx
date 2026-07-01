'use client'

import { Grid, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import type { TipoPrograma } from '@/utils/configs/tipoPrograma'
import { getTipoProgramaConfig } from '@/utils/configs/tipoPrograma'
import { TIPO_PROGRAMA_OPTIONS } from '@/utils/configs/tipoProgramaOptions'

type TipoProgramaSelectProps = {
  value: TipoPrograma
  onChange: (tipo: TipoPrograma) => void
  disabled?: boolean
  gridSize?: number
}

export function TipoProgramaSelect({
  value,
  onChange,
  disabled = false,
  gridSize = 6
}: TipoProgramaSelectProps) {
  const config = getTipoProgramaConfig(value)

  return (
    <Grid item xs={12} sm={gridSize}>
      <CustomTextField
        select
        fullWidth
        label='Tipo de programa *'
        value={value}
        onChange={e => onChange(e.target.value as TipoPrograma)}
        disabled={disabled}
        helperText={`Se publicará en la sección de ${config.labelPlural.toLowerCase()}.`}
      >
        {TIPO_PROGRAMA_OPTIONS.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </CustomTextField>
    </Grid>
  )
}
