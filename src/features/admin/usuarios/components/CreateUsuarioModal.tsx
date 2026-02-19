'use client'

import { Box, Button, Grid, MenuItem, styled, Typography } from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'
import { type FC } from 'react'
import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { crearUsuarioSchema, type CrearUsuarioDto } from '@/schemas/usuario.schema'
import { Rol } from '@prisma/client'
import { useCreateUsuario } from '../hooks/useUsuarios'

type CreateUsuarioModalProps = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
}

const FormWrapper = styled(Box)(() => ({
  padding: '16px 0'
}))

const CreateUsuarioModal: FC<CreateUsuarioModalProps> = ({ open, handleClose, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar()
  const createUsuarioMutation = useCreateUsuario()

  const initialValues: CrearUsuarioDto = {
    correo: '',
    contrasena: '',
    nombre: '',
    apellido: '',
    numero_documento: '',
    celular: '',
    biografia: '',
    rol: Rol.ESTUDIANTE,
    esta_activo: true
  }

  const handleSubmit = async (values: CrearUsuarioDto, { setSubmitting, resetForm }: FormikHelpers<CrearUsuarioDto>) => {
    try {
      await createUsuarioMutation.mutateAsync(values)

      enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' })
      resetForm()
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Error al crear usuario'
      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Crear Usuario
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(crearUsuarioSchema)}
        onSubmit={handleSubmit}
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
                    label='Contraseña'
                    name='contrasena'
                    type='password'
                    value={values.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.contrasena && Boolean(errors.contrasena)}
                    helperText={touched.contrasena && errors.contrasena}
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
                  {isSubmitting ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </Box>
            </FormWrapper>
          </form>
        )}
      </Formik>
    </AppModal>
  )
}

export default CreateUsuarioModal
