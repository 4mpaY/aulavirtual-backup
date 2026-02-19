'use client'

import {
    Box,
    Button,
    Grid,
    styled,
    Typography,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    Switch,
    FormControlLabel,
    MenuItem
} from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'
import { type FC, useState } from 'react'
import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { crearCursoSchema, type CrearCursoDto } from '@/schemas/curso.schema'
import { useCreateCurso } from '../hooks/useCursos'
import { useCategorias } from '@/features/admin/categorias/hooks/useCategorias'

type CreateCursoWizardProps = {
    open: boolean
    handleClose: () => void
    profesores: { id: string; nombre: string; apellido: string }[]
    onSuccess?: () => void
}

const FormWrapper = styled(Box)(() => ({
    padding: '16px 0'
}))

const steps = ['Información Básica', 'Configuración', 'Media']

const CreateCursoWizard: FC<CreateCursoWizardProps> = ({ open, handleClose, profesores, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar()
    const createCursoMutation = useCreateCurso()
    const { data: categorias = [] } = useCategorias()
    const [activeStep, setActiveStep] = useState(0)

    const initialValues: CrearCursoDto = {
        titulo: '',
        descripcion: '',
        categoria_id: null,
        profesor_id: profesores.length > 0 ? profesores[0].id : '',
        tipo_emision: 'ASINCRONO',
        es_gratis: false,
        precio: 0,
        moneda: 'PEN',
        duracion: '',
        miniatura: null,
        video_presentacion: null
    }

    const handleNext = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    const handleBack = () => setActiveStep(prev => Math.max(prev - 1, 0))

    const handleSubmit = async (values: CrearCursoDto, { setSubmitting, resetForm }: FormikHelpers<CrearCursoDto>) => {
        try {
            // Limpiar campos vacíos
            const payload: any = { ...values }

            if (!payload.categoria_id) delete payload.categoria_id
            if (!payload.descripcion) delete payload.descripcion
            if (!payload.duracion) delete payload.duracion
            if (!payload.miniatura) delete payload.miniatura
            if (!payload.video_presentacion) delete payload.video_presentacion

            await createCursoMutation.mutateAsync(payload)

            enqueueSnackbar('Curso creado exitosamente en estado Borrador', { variant: 'success' })
            resetForm()
            setActiveStep(0)
            handleClose()
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error?.message || error?.error || 'Error al crear curso'
            enqueueSnackbar(errorMessage, { variant: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    const handleCloseModal = () => {
        setActiveStep(0)
        handleClose()
    }

    return (
        <AppModal open={open} handleClose={handleCloseModal}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
                    Nuevo Curso
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    Completa la información para crear un nuevo curso.
                </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map(label => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Formik
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(crearCursoSchema)}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <FormWrapper>
                            {/* ============ PASO 1: Información Básica ============ */}
                            {activeStep === 0 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            label='Título del Curso *'
                                            name='titulo'
                                            placeholder='Ej: Desarrollo Web con React'
                                            value={values.titulo}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.titulo && Boolean(errors.titulo)}
                                            helperText={touched.titulo && errors.titulo}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <i className='tabler-book text-xl text-textSecondary' />
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
                                            label='Descripción'
                                            name='descripcion'
                                            placeholder='Describe de qué trata este curso...'
                                            value={values.descripcion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.descripcion && Boolean(errors.descripcion)}
                                            helperText={touched.descripcion && errors.descripcion}
                                            disabled={isSubmitting}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            select
                                            fullWidth
                                            label='Categoría'
                                            name='categoria_id'
                                            value={values.categoria_id || ''}
                                            onChange={handleChange}
                                            disabled={isSubmitting}
                                        >
                                            <MenuItem value=''>Sin categoría</MenuItem>
                                            {categorias.map(cat => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.nombre}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <CustomTextField
                                            select
                                            fullWidth
                                            label='Profesor *'
                                            name='profesor_id'
                                            value={values.profesor_id}
                                            onChange={handleChange}
                                            error={touched.profesor_id && Boolean(errors.profesor_id)}
                                            helperText={touched.profesor_id && errors.profesor_id}
                                            disabled={isSubmitting}
                                        >
                                            {profesores.map(prof => (
                                                <MenuItem key={prof.id} value={prof.id}>
                                                    {prof.nombre} {prof.apellido}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant='body2' color='text.secondary'>
                                                Tipo de emisión:
                                            </Typography>
                                            <Button
                                                variant={values.tipo_emision === 'ASINCRONO' ? 'contained' : 'outlined'}
                                                size='small'
                                                onClick={() => setFieldValue('tipo_emision', 'ASINCRONO')}
                                                startIcon={<i className='tabler-player-play' />}
                                            >
                                                Asíncrono
                                            </Button>
                                            <Button
                                                variant={values.tipo_emision === 'SINCRONO' ? 'contained' : 'outlined'}
                                                size='small'
                                                onClick={() => setFieldValue('tipo_emision', 'SINCRONO')}
                                                startIcon={<i className='tabler-live-photo' />}
                                            >
                                                Síncrono (En Vivo)
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}

                            {/* ============ PASO 2: Configuración y Precio ============ */}
                            {activeStep === 1 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={values.es_gratis}
                                                    onChange={e => {
                                                        setFieldValue('es_gratis', e.target.checked)

                                                        if (e.target.checked) setFieldValue('precio', 0)
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography variant='body1' fontWeight={500}>
                                                    Este curso es gratis
                                                </Typography>
                                            }
                                        />
                                    </Grid>

                                    {!values.es_gratis && (
                                        <>
                                            <Grid item xs={8}>
                                                <CustomTextField
                                                    fullWidth
                                                    type='number'
                                                    label='Precio'
                                                    name='precio'
                                                    value={values.precio}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={touched.precio && Boolean(errors.precio)}
                                                    helperText={touched.precio && errors.precio}
                                                    disabled={isSubmitting}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position='start'>
                                                                <i className='tabler-currency-dollar text-xl text-textSecondary' />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <CustomTextField
                                                    select
                                                    fullWidth
                                                    label='Moneda'
                                                    name='moneda'
                                                    value={values.moneda}
                                                    onChange={handleChange}
                                                    disabled={isSubmitting}
                                                >
                                                    <MenuItem value='PEN'>PEN (S/)</MenuItem>
                                                    <MenuItem value='USD'>USD ($)</MenuItem>
                                                </CustomTextField>
                                            </Grid>
                                        </>
                                    )}

                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            label='Duración Estimada'
                                            name='duracion'
                                            placeholder='Ej: 12 horas, 8 semanas'
                                            value={values.duracion}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <i className='tabler-clock text-xl text-textSecondary' />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            )}

                            {/* ============ PASO 3: Media ============ */}
                            {activeStep === 2 && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            label='URL de Miniatura'
                                            name='miniatura'
                                            placeholder='https://ejemplo.com/imagen.jpg'
                                            value={values.miniatura || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.miniatura && Boolean(errors.miniatura)}
                                            helperText={touched.miniatura && errors.miniatura}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <i className='tabler-photo text-xl text-textSecondary' />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        {values.miniatura && (
                                            <Box sx={{ mt: 2, borderRadius: 1, overflow: 'hidden', maxHeight: 150, display: 'flex', justifyContent: 'center' }}>
                                                <img
                                                    src={values.miniatura}
                                                    alt='Preview miniatura'
                                                    style={{ maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                                                />
                                            </Box>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <CustomTextField
                                            fullWidth
                                            label='URL de Video de Presentación (Vimeo)'
                                            name='video_presentacion'
                                            placeholder='https://vimeo.com/123456789'
                                            value={values.video_presentacion || ''}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.video_presentacion && Boolean(errors.video_presentacion)}
                                            helperText={touched.video_presentacion && errors.video_presentacion}
                                            disabled={isSubmitting}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <i className='tabler-brand-vimeo text-xl text-textSecondary' />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ p: 2, borderRadius: 1, border: '1px dashed', borderColor: 'divider', textAlign: 'center' }}>
                                            <i className='tabler-info-circle text-2xl text-textDisabled' />
                                            <Typography variant='body2' color='text.disabled' sx={{ mt: 1 }}>
                                                La miniatura y el video son opcionales. Puedes configurarlos después en la edición del curso.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            )}

                            {/* ============ BOTONES DE NAVEGACIÓN ============ */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                                <Box>
                                    {activeStep > 0 && (
                                        <Button
                                            variant='tonal'
                                            color='secondary'
                                            onClick={handleBack}
                                            disabled={isSubmitting}
                                            startIcon={<i className='tabler-arrow-left' />}
                                        >
                                            Anterior
                                        </Button>
                                    )}
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant='tonal'
                                        color='secondary'
                                        onClick={handleCloseModal}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>

                                    {activeStep < steps.length - 1 ? (
                                        <Button
                                            variant='contained'
                                            onClick={handleNext}
                                            disabled={activeStep === 0 && (!values.titulo.trim() || !values.profesor_id)}
                                            endIcon={<i className='tabler-arrow-right' />}
                                        >
                                            Siguiente
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='contained'
                                            type='submit'
                                            disabled={isSubmitting || !values.titulo.trim() || !values.profesor_id}
                                            startIcon={<i className='tabler-plus' />}
                                        >
                                            {isSubmitting ? 'Creando...' : 'Crear Curso'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </FormWrapper>
                    </form>
                )}
            </Formik>
        </AppModal>
    )
}

export default CreateCursoWizard
