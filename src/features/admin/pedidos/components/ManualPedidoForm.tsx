'use client'

import React, { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    Button,
    MenuItem,
    Autocomplete,
    Typography,
    CircularProgress
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSnackbar } from 'notistack'

import { MetodoPago } from '@prisma/client'

import CustomTextField from '@core/components/mui/TextField'
import { crearPedidoManualSchema, type CrearPedidoManualDto } from '@/schemas/pedido.schema'
import { useCreatePedidoManual } from '../hooks/usePedidos'
import { useUsuarios } from '@/features/admin/usuarios/hooks/useUsuarios'
import { useCursos } from '@/features/admin/cursos/hooks/useCursos'

export function ManualPedidoForm() {
    const router = useRouter()
    const { enqueueSnackbar } = useSnackbar()
    const [selectedCoursePrice, setSelectedCoursePrice] = useState<number>(0)

    const { data: usuariosData, isLoading: isLoadingUsuarios } = useUsuarios()
    const { data: cursosData, isLoading: isLoadingCursos } = useCursos()

    const usuarios = usuariosData || []
    const cursos = (cursosData?.cursos || []).filter(c => c.estado === 'PUBLICADO')

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<CrearPedidoManualDto>({
        resolver: zodResolver(crearPedidoManualSchema) as any,
        defaultValues: {
            usuario_id: '',
            curso_id: '',
            metodo_pago: MetodoPago.TRANSFERENCIA,
            precio: 0,
            mensaje: ''
        }
    })

    const { mutateAsync: createPedido } = useCreatePedidoManual()

    const onSubmit = async (data: CrearPedidoManualDto) => {
        try {
            await createPedido(data)
            enqueueSnackbar('Pedido manual creado exitosamente', { variant: 'success' })
            router.push('/admin/pedidos')
        } catch (error: any) {
            const errorMessage = error?.message || 'Error al crear el pedido manual'

            enqueueSnackbar(errorMessage, { variant: 'error' })
        }
    }

    return (
        <Card>
            <CardHeader title='Generar Nuevo Pedido Manual' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={6}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name='usuario_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Autocomplete
                                        fullWidth
                                        options={usuarios}
                                        getOptionLabel={(option) => `${option.nombre} ${option.apellido} (${option.correo})`}
                                        loading={isLoadingUsuarios}
                                        value={usuarios.find((u) => u.id === value) || null}
                                        onChange={(_, newValue) => onChange(newValue?.id || '')}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label='Seleccionar Estudiante'
                                                placeholder='Busca por nombre o correo'
                                                error={!!errors.usuario_id}
                                                helperText={errors.usuario_id?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {isLoadingUsuarios ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name='curso_id'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Autocomplete
                                        fullWidth
                                        options={cursos}
                                        getOptionLabel={(option) => option.titulo}
                                        loading={isLoadingCursos}
                                        value={cursos.find((c) => c.id === value) || null}
                                        onChange={(_, newValue) => {
                                            onChange(newValue?.id || '')

                                            if (newValue) {
                                                const price = Number(newValue.precio)

                                                setValue('precio', price)
                                                setSelectedCoursePrice(price)
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <CustomTextField
                                                {...params}
                                                label='Seleccionar Curso'
                                                placeholder='Busca un curso activo'
                                                error={!!errors.curso_id}
                                                helperText={errors.curso_id?.message}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {isLoadingCursos ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name='precio'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        type='number'
                                        label='Precio del Pedido'
                                        placeholder='0.00'
                                        error={!!errors.precio}
                                        helperText={errors.precio ? errors.precio.message : `Precio base del curso: ${selectedCoursePrice}`}
                                        InputProps={{
                                            startAdornment: <Typography sx={{ mr: 2, color: 'text.secondary' }}>PEN</Typography>
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name='metodo_pago'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        select
                                        fullWidth
                                        label='Método de Pago'
                                        error={!!errors.metodo_pago}
                                        helperText={errors.metodo_pago?.message}
                                    >
                                        <MenuItem value={MetodoPago.TRANSFERENCIA}>Transferencia Bancaria</MenuItem>
                                        <MenuItem value={MetodoPago.YAPE}>Yape</MenuItem>
                                        <MenuItem value={MetodoPago.PLIN}>Plin</MenuItem>
                                        <MenuItem value={MetodoPago.TARJETA_CREDITO}>Tarjeta de Crédito</MenuItem>
                                        <MenuItem value={MetodoPago.OTRO}>Otro</MenuItem>
                                    </CustomTextField>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Controller
                                name='mensaje'
                                control={control}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label='Nota/Mensaje (Opcional)'
                                        placeholder='Ej: Beca del 50%, Pago en efectivo...'
                                        error={!!errors.mensaje}
                                        helperText={errors.mensaje?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} className='flex gap-4'>
                            <Button
                                type='submit'
                                variant='contained'
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                Generar Pedido y Enrolar
                            </Button>
                            <Button
                                variant='outlined'
                                color='secondary'
                                onClick={() => router.push('/admin/pedidos')}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}
