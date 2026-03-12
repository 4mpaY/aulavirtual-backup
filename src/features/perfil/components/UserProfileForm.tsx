'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Stack,
  Divider,
  CircularProgress
} from '@mui/material'
import { toast } from 'react-toastify'
import axios from 'axios'

interface UserProfile {
  id: string
  nombre: string
  apellido: string
  correo: string
  numero_documento: string
  celular?: string | null
  biografia?: string | null
  avatar?: string | null
  rol: string
}

interface Props {
  user: UserProfile
}

export default function UserProfileForm({ user }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    celular: user.celular || '',
    numero_documento: user.numero_documento || '',
    biografia: user.biografia || '',
    contrasena: '',
    confirmarContrasena: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.contrasena && formData.contrasena !== formData.confirmarContrasena) {
      toast.error('Las contraseñas nuevas no coinciden')

      return
    }

    setLoading(true)

    try {
      const response = await axios.put('/api/perfil', formData)

      if (response.data.status) {
        toast.success('Perfil actualizado correctamente')
        router.refresh()

        // Limpiamos los campos de contraseña
        setFormData(prev => ({ ...prev, contrasena: '', confirmarContrasena: '' }))
      } else {
        toast.error(response.data.message || 'Error al actualizar el perfil')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error de servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 4, borderRadius: '24px', textAlign: 'center', boxShadow: '0 4px 25px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              src={user.avatar || undefined}
              sx={{ width: 120, height: 120, fontSize: '3rem', bgcolor: 'primary.main' }}
            >
              {user.nombre.charAt(0)}{user.apellido.charAt(0)}
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {user.nombre} {user.apellido}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {user.rol}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2} textAlign="left">
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>CORREO</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.correo}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 600 }}>DOCUMENTO</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>{user.numero_documento}</Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', boxShadow: '0 4px 25px rgba(0,0,0,0.05)' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
            Editar Perfil
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Documento de Identidad"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Acerca de mí"
                  name="biografia"
                  value={formData.biografia}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  placeholder="Cuéntanos un poco sobre ti..."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>Cambio de Contraseña</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Si no deseas cambiar tu contraseña actual, deja estos campos en blanco.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nueva Contraseña"
                  name="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar Nueva Contraseña"
                  name="confirmarContrasena"
                  type="password"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ py: 1.5, px: 4, borderRadius: '12px', fontWeight: 600 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}
