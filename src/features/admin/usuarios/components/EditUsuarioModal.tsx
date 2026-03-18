'use client'

import { useState } from 'react'

import { Box, Button, Grid, MenuItem, styled, Typography, CircularProgress, InputAdornment, IconButton } from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'

import { Rol } from '@prisma/client'



import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { actualizarUsuarioSchema, type ActualizarUsuarioDto } from '@/schemas/usuario.schema'

import { useUsuario, useEditUsuario } from '../hooks/useUsuarios'

type EditUsuarioModalProps = {
  open: boolean
  handleClose: () => void
  usuarioId: string | null
  onSuccess?: () => void
}

const FormWrapper = styled(Box)(() => ({
  padding: '16px 0'
}))

const EditUsuarioModal = ({ open, handleClose, usuarioId, onSuccess }: EditUsuarioModalProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data: usuario, isLoading } = useUsuario(usuarioId || '')
  const editUsuarioMutation = useEditUsuario()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (values: ActualizarUsuarioDto, { setSubmitting }: FormikHelpers<ActualizarUsuarioDto>) => {
    if (!usuarioId) return

    try {
      // Si la contraseña está vacía, no la enviamos para evitar errores de validación o sobreescritura
      const dataToSend = { ...values }

      if (!dataToSend.contrasena) {
        delete dataToSend.contrasena
      }

      await editUsuarioMutation.mutateAsync({ id: usuarioId, data: dataToSend })

      enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' })
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Error al actualizar usuario'

      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AppModal open={open} handleClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200, gap: 2 }}>
          <CircularProgress />
          <Typography>Cargando usuario...</Typography>
        </Box>
      </AppModal>
    )
  }

  if (!usuario) {
    return null
  }

  const initialValues: ActualizarUsuarioDto = {
    correo: usuario.correo,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    numero_documento: usuario.numero_documento,
    celular: usuario.celular || '',
    biografia: usuario.biografia || '',
    rol: usuario.rol,
    esta_activo: usuario.esta_activo,
    contrasena: ''
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
          Editar Usuario
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Actualiza la información del perfil y los permisos del usuario.
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(actualizarUsuarioSchema)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <FormWrapper>
              <Grid container spacing={3}>
                {/* Sección: Información de Perfil */}
                <Grid item xs={12}>
                  <Typography variant='overline' color='text.disabled' sx={{ mb: 1, display: 'block' }}>
                    Información de Perfil
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Nombre'
                    name='nombre'
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nombre && Boolean(errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Apellido'
                    name='apellido'
                    value={values.apellido}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.apellido && Boolean(errors.apellido)}
                    helperText={touched.apellido && errors.apellido}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-user text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Correo Electrónico'
                    name='correo'
                    type='email'
                    value={values.correo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.correo && Boolean(errors.correo)}
                    helperText={touched.correo && errors.correo}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-mail text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='DNI / Documento'
                    name='numero_documento'
                    value={values.numero_documento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_documento && Boolean(errors.numero_documento)}
                    helperText={touched.numero_documento && errors.numero_documento}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-id text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Celular'
                    name='celular'
                    value={values.celular}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.celular && Boolean(errors.celular)}
                    helperText={touched.celular && errors.celular}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-phone text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Biografía'
                    name='biografia'
                    placeholder='Describe brevemente al usuario'
                    value={values.biografia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.biografia && Boolean(errors.biografia)}
                    helperText={touched.biografia && errors.biografia}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-file-description text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Sección: Seguridad y Permisos */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant='overline' color='text.disabled' sx={{ mb: 1, display: 'block' }}>
                    Seguridad y Permisos
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Rol de Usuario'
                    name='rol'
                    value={values.rol}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.rol && Boolean(errors.rol)}
                    helperText={touched.rol && errors.rol}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-shield-lock text-xl text-textSecondary mr-2' />
                        </InputAdornment>
                      )
                    }}
                  >
                    <MenuItem value={Rol.ESTUDIANTE}>Estudiante</MenuItem>
                    <MenuItem value={Rol.PROFESOR}>Profesor</MenuItem>
                    <MenuItem value={Rol.ADMIN}>Administrador</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Nueva Contraseña (Opcional)'
                    name='contrasena'
                    type={showPassword ? 'text' : 'password'}
                    value={values.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.contrasena && Boolean(errors.contrasena)}
                    helperText={touched.contrasena && errors.contrasena}
                    disabled={isSubmitting}
                    placeholder='Dejar en blanco para mantener la actual'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-lock text-xl text-textSecondary' />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <i className={showPassword ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 5 }}>
                <Button
                  variant='tonal'
                  color='secondary'
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{ px: 4 }}
                >
                  Cancelar
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={isSubmitting}
                  sx={{ px: 4 }}
                  startIcon={<i className='tabler-check' />}
                >
                  {isSubmitting ? 'Actualizando...' : 'Actualizar Usuario'}
                </Button>
              </Box>
            </FormWrapper>
          </form>
        )}
      </Formik>
    </AppModal>
  )
}

export default EditUsuarioModal
