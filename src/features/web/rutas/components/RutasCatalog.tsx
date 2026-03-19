'use client'

import { useState, useMemo } from 'react'

import { Grid, TextField, InputAdornment, Box, Typography, Container } from '@mui/material'

import RutaCard from '@/features/web/home/components/RutaCard'

interface RutasCatalogProps {
  initialRutas: any[]
}

export default function RutasCatalog({ initialRutas }: RutasCatalogProps) {
  const [search, setSearch] = useState('')

  const filteredRutas = useMemo(() => {
    return initialRutas.filter(ruta =>
      ruta.titulo.toLowerCase().includes(search.toLowerCase()) ||
      ruta.descripcion?.toLowerCase().includes(search.toLowerCase())
    )
  }, [search, initialRutas])

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar rutas de aprendizaje..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            maxWidth: 600,
            '& .MuiOutlinedInput-root': {
              borderRadius: '15px',
              bgcolor: 'background.paper',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <i className="tabler-search" style={{ fontSize: '1.2rem', color: 'var(--mui-palette-text-secondary)' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredRutas.length > 0 ? (
        <Grid container spacing={6}>
          {filteredRutas.map((ruta: any) => (
            <Grid item xs={12} sm={6} lg={4} key={ruta.id}>
              <RutaCard {...ruta} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h5" color="text.secondary">
            {search ? 'No se encontraron rutas que coincidan con tu búsqueda.' : 'Próximamente tendremos nuevas rutas para ti.'}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
