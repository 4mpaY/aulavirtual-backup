'use client'

import { Box, Button, Grid, MenuItem, styled, Typography, CircularProgress } from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'
import { type FC } from 'react'
import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { actualizarUsuarioSchema, type ActualizarUsuarioDto } from '@/schemas/usuario.schema'
import { Rol } from '@prisma/client'
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

const EditUsuarioModal: FC<EditUsuarioModalProps> = ({ open, handleClose, usuarioId, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data: usuario, isLoading } = useUsuario(usuarioId || '')
  const editUsuarioMutation = useEditUsuario()

  const handleSubmit = async (values: ActualizarUsuarioDto, { setSubmitting }: FormikHelpers<ActualizarUsuarioDto>) => {
    if (!usuarioId) return

    try {
      await editUsuarioMutation.mutateAsync({ id: usuarioId, data: values })

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
    esta_activo: usuario.esta_activo
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Editar Usuario
      </Typography>

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
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    fullWidth
                    label='Número de Documento (DNI)'
                    name='numero_documento'
                    value={values.numero_documento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.numero_documento && Boolean(errors.numero_documento)}
                    helperText={touched.numero_documento && errors.numero_documento}
                    disabled={isSubmitting}
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
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    select
                    fullWidth
                    label='Rol'
                    name='rol'
                    value={values.rol}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.rol && Boolean(errors.rol)}
                    helperText={touched.rol && errors.rol}
                    disabled={isSubmitting}
                  >
                    <MenuItem value={Rol.ESTUDIANTE}>Estudiante</MenuItem>
                    <MenuItem value={Rol.PROFESOR}>Profesor</MenuItem>
                    <MenuItem value={Rol.ADMIN}>Administrador</MenuItem>
                  </CustomTextField>
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={3}
                    label='Biografía'
                    name='biografia'
                    value={values.biografia}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.biografia && Boolean(errors.biografia)}
                    helperText={touched.biografia && errors.biografia}
                    disabled={isSubmitting}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                <Button variant='outlined' onClick={handleClose} disabled={isSubmitting}>
                  Cancelar
                </Button>
                <Button variant='contained' type='submit' disabled={isSubmitting}>
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
