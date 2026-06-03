'use client'

import { useState, useMemo } from 'react'
import { Grid, Typography, Box, InputAdornment } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import MySimulacroCard from './MySimulacroCard'

interface Simulacro {
  id: string
  titulo: string
  slug: string
  miniatura?: string | null
  nivel: string
  duracion?: string | null
  numero_preguntas: number
  area_tematica?: string | null
  intentos: number
  mejor_puntaje?: number | null
}

export default function MySimulacrosList({ simulacros }: { simulacros: Simulacro[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => simulacros.filter(s => s.titulo.toLowerCase().includes(search.toLowerCase())),
    [simulacros, search]
  )

  return (
    <Box>
      {simulacros.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <CustomTextField
            fullWidth
            placeholder='Buscar simulacro...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='tabler-search' style={{ fontSize: '1.25rem' }} />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>
      )}

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
          <i className='tabler-clipboard-list' style={{ fontSize: '3rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }} />
          <Typography variant='h6' fontWeight={600}>
            {simulacros.length === 0 ? 'Aún no tienes simulacros adquiridos' : 'Sin resultados'}
          </Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            {simulacros.length === 0 ? 'Explora el catálogo y adquiere tu primer simulacro.' : 'Intenta con otro término de búsqueda.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map(s => (
            <Grid item xs={12} sm={6} md={4} key={s.id}>
              <MySimulacroCard {...s} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
