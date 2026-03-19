'use client'


import { Box, Button, Grid, styled, Typography, InputAdornment } from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { crearCategoriaSchema, type CrearCategoriaDto } from '@/schemas/categoria.schema'
import { useCreateCategoria } from '../hooks/useCategorias'

type CreateCategoriaModalProps = {
  open: boolean
  handleClose: () => void
  onSuccess?: () => void
}

const FormWrapper = styled(Box)(() => ({
  padding: '16px 0'
}))

export const CreateCategoriaModal = ({ open, handleClose, onSuccess }: CreateCategoriaModalProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const createCategoriaMutation = useCreateCategoria()

  const initialValues: CrearCategoriaDto = {
    nombre: '',
    descripcion: ''
  }

  const handleSubmit = async (values: CrearCategoriaDto, { setSubmitting, resetForm }: FormikHelpers<CrearCategoriaDto>) => {
    try {
      await createCategoriaMutation.mutateAsync(values)

      enqueueSnackbar('Categoría creada exitosamente', { variant: 'success' })
      resetForm()
      handleClose()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error?.message || error?.error || 'Error al crear categoría'

      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
          Nueva Categoría
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Crea una nueva categoría padre para organizar los cursos.
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(crearCategoriaSchema)}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <FormWrapper>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='overline' color='text.disabled' sx={{ mb: 1, display: 'block' }}>
                    Información General
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    label='Nombre de la Categoría'
                    name='nombre'
                    placeholder='Ej: Desarrollo Web'
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nombre && Boolean(errors.nombre)}
                    helperText={touched.nombre && errors.nombre}
                    disabled={isSubmitting}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className='tabler-category text-xl text-textSecondary' />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomTextField
                    fullWidth
                    multiline
                    rows={3}
                    label='Descripción (Opcional)'
                    name='descripcion'
                    placeholder='Describe brevemente de qué trata esta categoría...'
                    value={values.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.descripcion && Boolean(errors.descripcion)}
                    helperText={touched.descripcion && errors.descripcion}
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
                  startIcon={<i className='tabler-plus' />}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Categoría'}
                </Button>
              </Box>
            </FormWrapper>
          </form>
        )}
      </Formik>
    </AppModal>
  )
}

