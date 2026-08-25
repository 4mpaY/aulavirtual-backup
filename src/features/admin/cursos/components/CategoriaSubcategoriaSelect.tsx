'use client'

import { useMemo } from 'react'

import { Grid, MenuItem } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import type { Categoria } from '@/features/admin/categorias/entity/Categoria'

type CategoriaSubcategoriaSelectProps = {
  categorias: Categoria[]
  categoriaPadreId: string
  subcategoriaId: string
  onCategoriaPadreChange: (padreId: string) => void
  onSubcategoriaChange: (subId: string) => void
  disabled?: boolean
  gridSize?: number
}

export function CategoriaSubcategoriaSelect({
  categorias,
  categoriaPadreId,
  subcategoriaId,
  onCategoriaPadreChange,
  onSubcategoriaChange,
  disabled = false,
  gridSize = 6
}: CategoriaSubcategoriaSelectProps) {
  const subcategorias = useMemo(() => {
    const padre = categorias.find(c => c.id === categoriaPadreId)

    return (padre?.hijos ?? []).filter(h => h.esta_activo !== false)
  }, [categorias, categoriaPadreId])

  const subcategoriaHelper = !categoriaPadreId
    ? 'Selecciona una categoría primero'
    : subcategorias.length === 0
      ? 'Esta categoría no tiene subcategorías'
      : undefined

  return (
    <>
      <Grid item xs={12} sm={gridSize}>
        <CustomTextField
          select
          fullWidth
          label='Categoría'
          value={categoriaPadreId}
          onChange={e => onCategoriaPadreChange(e.target.value)}
          disabled={disabled}
        >
          <MenuItem value=''>Sin categoría</MenuItem>
          {categorias.map(cat => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.nombre}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>

      <Grid item xs={12} sm={gridSize}>
        <CustomTextField
          select
          fullWidth
          label='Subcategoría'
          value={subcategoriaId}
          onChange={e => onSubcategoriaChange(e.target.value)}
          disabled={disabled || !categoriaPadreId || subcategorias.length === 0}
          helperText={subcategoriaHelper}
        >
          <MenuItem value=''>Sin subcategoría</MenuItem>
          {subcategorias.map(sub => (
            <MenuItem key={sub.id} value={sub.id}>
              {sub.nombre}
            </MenuItem>
          ))}
        </CustomTextField>
      </Grid>
    </>
  )
}
