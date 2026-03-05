'use client'

import { type FC, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
    Box,
    Button,
    Grid,
    Typography,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    Switch,
    FormControlLabel,
    MenuItem,
    Card,
    CardContent,
    Stack,
    CircularProgress
} from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'

import { crearCursoSchema, type CrearCursoDto } from '@/schemas/curso.schema'

import { useCreateCurso } from '../hooks/useCursos'
import { useCategorias } from '@/features/admin/categorias/hooks/useCategorias'

interface CourseCreatePageProps {
    profesores: { id: string; nombre: string; apellido: string }[]
}

const steps = ['Información Básica', 'Configuración', 'Media']

export const CourseCreatePage: FC<CourseCreatePageProps> = ({ profesores }) => {
    const { enqueueSnackbar } = useSnackbar()
    const router = useRouter()
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

    const handleSubmit = async (values: CrearCursoDto, { setSubmitting }: FormikHelpers<CrearCursoDto>) => {
        try {
            const payload: any = { ...values }

            if (!payload.categoria_id) delete payload.categoria_id
            if (!payload.descripcion) delete payload.descripcion
            if (!payload.duracion) delete payload.duracion
            if (!payload.miniatura) delete payload.miniatura
            if (!payload.video_presentacion) delete payload.video_presentacion

            const result = await createCursoMutation.mutateAsync(payload)

            enqueueSnackbar('Curso creado exitosamente', { variant: 'success' })

            // Redirigir al curso builder del nuevo curso
            if (result?.id) {
                router.push(`/admin/cursos/${result.id}`)
            } else {
                router.push('/admin/cursos')
            }
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al crear curso', { variant: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant='h4' fontWeight={600}>
                        Nuevo Curso
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Sigue los pasos para configurar tu nuevo programa educativo
                    </Typography>
                </Box>
                <Button
                    variant='outlined'
                    onClick={() => router.push('/admin/cursos')}
                    startIcon={<i className='tabler-arrow-left' />}
                >
                    Cancelar y Volver
                </Button>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6 }}>
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
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit: handleFormikSubmit, isSubmitting, setFieldValue }) => (
                    <form onSubmit={handleFormikSubmit}>
                        <Card>
                            <CardContent sx={{ p: 6 }}>
                                {/* ============ PASO 1: Información Básica ============ */}
                                {activeStep === 0 && (
                                    <Grid container spacing={5}>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label='Título del Curso *'
                                                name='titulo'
                                                placeholder='Ej: Especialización en Gestión Ambiental'
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
                                                rows={4}
                                                label='Descripción'
                                                name='descripcion'
                                                placeholder='Describe los objetivos y alcance del curso...'
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
                                                label='Profesor Asignado *'
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
                                            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                                                <Typography variant='body1' fontWeight={500} color='text.secondary'>
                                                    Modalidad de impartición:
                                                </Typography>
                                                <Stack direction='row' spacing={2}>
                                                    <Button
                                                        variant={values.tipo_emision === 'ASINCRONO' ? 'contained' : 'outlined'}
                                                        onClick={() => setFieldValue('tipo_emision', 'ASINCRONO')}
                                                        startIcon={<i className='tabler-player-play' />}
                                                    >
                                                        Asíncrono
                                                    </Button>
                                                    <Button
                                                        variant={values.tipo_emision === 'SINCRONO' ? 'contained' : 'outlined'}
                                                        onClick={() => setFieldValue('tipo_emision', 'SINCRONO')}
                                                        startIcon={<i className='tabler-live-photo' />}
                                                    >
                                                        Síncrono (En Vivo)
                                                    </Button>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}

                                {/* ============ PASO 2: Configuración y Precio ============ */}
                                {activeStep === 1 && (
                                    <Grid container spacing={5}>
                                        <Grid item xs={12}>
                                            <Box sx={{ p: 4, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
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
                                                        <Typography variant='h6' fontWeight={600}>
                                                            Marcar este curso como gratuito
                                                        </Typography>
                                                    }
                                                />
                                                <Typography variant='body2' color='text.secondary' sx={{ ml: 10 }}>
                                                    Los alumnos podrán inscribirse sin realizar ningún pago.
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {!values.es_gratis && (
                                            <>
                                                <Grid item xs={12} sm={8}>
                                                    <CustomTextField
                                                        fullWidth
                                                        type='number'
                                                        label='Precio del Curso'
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
                                                                    <i className='tabler-coin-bitcoin text-xl text-textSecondary' />
                                                                </InputAdornment>
                                                            )
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <CustomTextField
                                                        select
                                                        fullWidth
                                                        label='Moneda'
                                                        name='moneda'
                                                        value={values.moneda}
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                    >
                                                        <MenuItem value='PEN'>Sol Peruano (S/)</MenuItem>
                                                        <MenuItem value='USD'>Dólar (US$)</MenuItem>
                                                    </CustomTextField>
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label='Duración Sugerida'
                                                name='duracion'
                                                placeholder='Ej: 40 horas académicas / 8 semanas'
                                                value={values.duracion || ''}
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
                                    <Grid container spacing={5}>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label='URL de la Imagen de Portada (Miniatura)'
                                                name='miniatura'
                                                placeholder='https://tusitio.com/imagen.jpg'
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
                                                <Box sx={{ mt: 3, position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                                                    <Box
                                                        component='img'
                                                        src={values.miniatura}
                                                        alt='Vista previa miniatura'
                                                        sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                                                        onError={(e: any) => { e.target.style.display = 'none' }}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <CustomTextField
                                                fullWidth
                                                label='Enlace de Video Introductorio (Vimeo/YouTube)'
                                                name='video_presentacion'
                                                placeholder='https://vimeo.com/712...'
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
                                            <Box sx={{ p: 4, borderRadius: 2, bgcolor: 'primary.lightOpacity', border: '1px dashed', borderColor: 'primary.main', display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <i className='tabler-info-circle text-3xl text-primary' />
                                                <Typography variant='body2' color='primary.dark'>
                                                    Al crear el curso, este quedará en estado <strong>Borrador</strong>. Podrás añadir módulos, lecciones y materiales en la siguiente pantalla antes de publicarlo.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                )}

                                {/* ============ BOTONES DE NAVEGACIÓN ============ */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
                                    <Box>
                                        {activeStep > 0 && (
                                            <Button
                                                variant='tonal'
                                                color='secondary'
                                                onClick={handleBack}
                                                disabled={isSubmitting}
                                                startIcon={<i className='tabler-arrow-left' />}
                                            >
                                                Paso Anterior
                                            </Button>
                                        )}
                                    </Box>

                                    <Stack direction='row' spacing={2}>
                                        {activeStep < steps.length - 1 ? (
                                            <Button
                                                variant='contained'
                                                onClick={handleNext}
                                                disabled={activeStep === 0 && (!values.titulo.trim() || !values.profesor_id)}
                                                endIcon={<i className='tabler-arrow-right' />}
                                            >
                                                Siguiente Paso
                                            </Button>
                                        ) : (
                                            <Button
                                                variant='contained'
                                                color='success'
                                                type='submit'
                                                disabled={isSubmitting || !values.titulo.trim() || !values.profesor_id}
                                                startIcon={isSubmitting ? <Box sx={{ width: 20, height: 20, mr: 1 }}><CircularProgress size={20} color='inherit' /></Box> : <i className='tabler-check' />}
                                            >
                                                {isSubmitting ? 'Creando...' : 'Finalizar y Crear Curso'}
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </form>
                )}
            </Formik>
        </Box>
    )
}


