'use client'

import { type FC, useState, useCallback } from 'react'

import {
    Box,
    Button,
    Grid,
    styled,
    Typography,
    CircularProgress,
    InputAdornment,
    Divider,
    IconButton,
    Chip,
    Switch
} from '@mui/material'
import { Formik, type FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { actualizarCategoriaSchema, type ActualizarCategoriaDto } from '@/schemas/categoria.schema'
import {
    useCategoria,
    useEditCategoria,
    useCreateSubcategoria,
    useDeleteCategoria,
    useReordenarCategorias,
    useToggleCategoriaStatus
} from '../hooks/useCategorias'
import type { CategoriaHijo } from '../entity/Categoria'

type EditCategoriaModalProps = {
    open: boolean
    handleClose: () => void
    categoriaId: string | null
    onSuccess?: () => void
}

const FormWrapper = styled(Box)(() => ({
    padding: '16px 0'
}))

const EditCategoriaModal: FC<EditCategoriaModalProps> = ({ open, handleClose, categoriaId, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar()
    const { data: categoria, isLoading, refetch } = useCategoria(categoriaId || '')
    const editCategoriaMutation = useEditCategoria()
    const createSubcategoriaMutation = useCreateSubcategoria()
    const deleteCategoriaMutation = useDeleteCategoria()
    const reordenarMutation = useReordenarCategorias()
    const toggleStatusMutation = useToggleCategoriaStatus()

    const [nuevoHijoNombre, setNuevoHijoNombre] = useState('')
    const [localHijos, setLocalHijos] = useState<CategoriaHijo[] | null>(null)
    const [ordenModificado, setOrdenModificado] = useState(false)

    // Hijos a mostrar: locales (si se reordenaron) o los del servidor
    const hijosActuales = localHijos ?? categoria?.hijos ?? []

    const resetLocalState = useCallback(() => {
        setLocalHijos(null)
        setOrdenModificado(false)
        setNuevoHijoNombre('')
    }, [])

    const handleCloseModal = () => {
        resetLocalState()
        handleClose()
    }

    // --- Guardar datos del padre ---
    const handleSubmitPadre = async (values: ActualizarCategoriaDto, { setSubmitting }: FormikHelpers<ActualizarCategoriaDto>) => {
        if (!categoriaId) return

        try {
            await editCategoriaMutation.mutateAsync({ id: categoriaId, data: values })
            enqueueSnackbar('Categoría actualizada exitosamente', { variant: 'success' })
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error?.message || error?.error || 'Error al actualizar'

            enqueueSnackbar(errorMessage, { variant: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    // --- Crear subcategoría ---
    const handleCrearHijo = async () => {
        if (!categoriaId || !nuevoHijoNombre.trim()) return

        try {
            await createSubcategoriaMutation.mutateAsync({
                padreId: categoriaId,
                data: { nombre: nuevoHijoNombre.trim() }
            })
            enqueueSnackbar('Subcategoría creada', { variant: 'success' })
            setNuevoHijoNombre('')
            resetLocalState()
            refetch()
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error?.message || error?.error || 'Error al crear subcategoría'

            enqueueSnackbar(errorMessage, { variant: 'error' })
        }
    }

    // --- Eliminar subcategoría ---
    const handleEliminarHijo = async (hijoId: string) => {
        try {
            await deleteCategoriaMutation.mutateAsync(hijoId)
            enqueueSnackbar('Subcategoría eliminada', { variant: 'success' })
            resetLocalState()
            refetch()
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error?.message || error?.error || 'Error al eliminar'

            enqueueSnackbar(errorMessage, { variant: 'error' })
        }
    }

    // --- Toggle estado subcategoría ---
    const handleToggleHijo = async (hijoId: string, currentStatus: boolean) => {
        try {
            await toggleStatusMutation.mutateAsync({ id: hijoId, esta_activo: !currentStatus })
            enqueueSnackbar(`Subcategoría ${!currentStatus ? 'activada' : 'desactivada'}`, { variant: 'success' })
            refetch()
            onSuccess?.()
        } catch (error: any) {
            enqueueSnackbar('Error al cambiar estado', { variant: 'error' })
        }
    }

    // --- Reordenar: mover hacia arriba ---
    const moverArriba = (index: number) => {
        if (index === 0) return

        const arr = [...hijosActuales]

            ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
        setLocalHijos(arr)
        setOrdenModificado(true)
    }

    // --- Reordenar: mover hacia abajo ---
    const moverAbajo = (index: number) => {
        if (index >= hijosActuales.length - 1) return

        const arr = [...hijosActuales]

            ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
        setLocalHijos(arr)
        setOrdenModificado(true)
    }

    // --- Guardar orden ---
    const handleGuardarOrden = async () => {
        if (!categoriaId || !localHijos) return

        try {
            const items = localHijos.map((h, i) => ({ id: h.id, orden: i }))

            await reordenarMutation.mutateAsync({ padreId: categoriaId, items })
            enqueueSnackbar('Orden actualizado', { variant: 'success' })
            resetLocalState()
            refetch()
            onSuccess?.()
        } catch (error: any) {
            enqueueSnackbar('Error al reordenar', { variant: 'error' })
        }
    }

    if (isLoading) {
        return (
            <AppModal open={open} handleClose={handleCloseModal}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 200, gap: 2 }}>
                    <CircularProgress />
                    <Typography>Cargando categoría...</Typography>
                </Box>
            </AppModal>
        )
    }

    if (!categoria) return null

    const initialValues: ActualizarCategoriaDto = {
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
        esta_activo: categoria.esta_activo
    }

    return (
        <AppModal open={open} handleClose={handleCloseModal}>
            {/* ==================== ENCABEZADO ==================== */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant='h4' sx={{ mb: 1, fontWeight: 600 }}>
                    Editar Categoría
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                    Actualiza la información y gestiona las subcategorías.
                </Typography>
            </Box>

            {/* ==================== SECCIÓN 1: DATOS DEL PADRE ==================== */}
            <Formik
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(actualizarCategoriaSchema)}
                onSubmit={handleSubmitPadre}
                enableReinitialize
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <FormWrapper>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant='overline' color='text.disabled' sx={{ display: 'block' }}>
                                        Información de la Categoría
                                    </Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <CustomTextField
                                        fullWidth
                                        label='Nombre de la Categoría'
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
                                        rows={2}
                                        label='Descripción'
                                        name='descripcion'
                                        placeholder='Describe brevemente esta categoría...'
                                        value={values.descripcion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.descripcion && Boolean(errors.descripcion)}
                                        helperText={touched.descripcion && errors.descripcion}
                                        disabled={isSubmitting}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start' sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                    <i className='tabler-file-description text-xl text-textSecondary' />
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            variant='contained'
                                            type='submit'
                                            disabled={isSubmitting}
                                            size='small'
                                            startIcon={<i className='tabler-check' />}
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </FormWrapper>
                    </form>
                )}
            </Formik>

            {/* ==================== DIVISOR ==================== */}
            <Divider sx={{ my: 2 }} />

            {/* ==================== SECCIÓN 2: SUBCATEGORÍAS ==================== */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant='overline' color='text.disabled'>
                        Subcategorías ({hijosActuales.length})
                    </Typography>
                    {ordenModificado && (
                        <Button
                            variant='contained'
                            color='success'
                            size='small'
                            onClick={handleGuardarOrden}
                            disabled={reordenarMutation.isPending}
                            startIcon={<i className='tabler-device-floppy' />}
                        >
                            Guardar Orden
                        </Button>
                    )}
                </Box>

                {/* Input para añadir subcategoría */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <CustomTextField
                        fullWidth
                        size='small'
                        placeholder='Nombre de la subcategoría...'
                        value={nuevoHijoNombre}
                        onChange={(e: any) => setNuevoHijoNombre(e.target.value)}
                        onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleCrearHijo()
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='tabler-tag text-lg text-textSecondary' />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        variant='contained'
                        size='small'
                        onClick={handleCrearHijo}
                        disabled={!nuevoHijoNombre.trim() || createSubcategoriaMutation.isPending}
                        sx={{ minWidth: 100 }}
                    >
                        <i className='tabler-plus mr-1' /> Añadir
                    </Button>
                </Box>

                {/* Lista de subcategorías */}
                {hijosActuales.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3, px: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                        <i className='tabler-folder-open text-3xl text-textDisabled' />
                        <Typography variant='body2' color='text.disabled' sx={{ mt: 1 }}>
                            Sin subcategorías. Usa el campo de arriba para crear la primera.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {hijosActuales.map((hijo, index) => (
                            <Box
                                key={hijo.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1.5,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 1,
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                {/* Posición */}
                                <Typography variant='caption' color='text.disabled' sx={{ minWidth: 20, textAlign: 'center' }}>
                                    {index + 1}
                                </Typography>

                                {/* Nombre */}
                                <Typography variant='body2' sx={{ flex: 1, fontWeight: 500 }}>
                                    {hijo.nombre}
                                </Typography>

                                {/* Estado */}
                                <Chip
                                    label={hijo.esta_activo ? 'Activo' : 'Inactivo'}
                                    color={hijo.esta_activo ? 'success' : 'default'}
                                    size='small'
                                    variant='tonal'
                                />

                                {/* Toggle estado */}
                                <Switch
                                    size='small'
                                    checked={hijo.esta_activo}
                                    onChange={() => handleToggleHijo(hijo.id, hijo.esta_activo)}
                                />

                                {/* Botones de orden */}
                                <IconButton
                                    size='small'
                                    onClick={() => moverArriba(index)}
                                    disabled={index === 0}
                                    title='Mover arriba'
                                >
                                    <i className='tabler-arrow-up text-lg' />
                                </IconButton>
                                <IconButton
                                    size='small'
                                    onClick={() => moverAbajo(index)}
                                    disabled={index === hijosActuales.length - 1}
                                    title='Mover abajo'
                                >
                                    <i className='tabler-arrow-down text-lg' />
                                </IconButton>

                                {/* Eliminar */}
                                <IconButton
                                    size='small'
                                    color='error'
                                    onClick={() => handleEliminarHijo(hijo.id)}
                                    title='Eliminar subcategoría'
                                >
                                    <i className='tabler-trash text-lg' />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>

            {/* ==================== FOOTER ==================== */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    variant='tonal'
                    color='secondary'
                    onClick={handleCloseModal}
                    sx={{ px: 4 }}
                >
                    Cerrar
                </Button>
            </Box>
        </AppModal>
    )
}

export default EditCategoriaModal
