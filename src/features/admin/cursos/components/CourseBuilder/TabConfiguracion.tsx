'use client'

import React, { useState } from 'react'

import {
    Grid,
    Typography,
    Box,
    Button,
    Divider,
    FormControlLabel,
    Switch,
    MenuItem,
    Chip
} from '@mui/material'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'
import type { Curso } from '../../entity/Curso'
import { useEditCurso, useCambiarEstadoCurso } from '../../hooks/useCursos'

interface TabConfiguracionProps {
    curso: Curso
    onSuccess: () => void
}

export function TabConfiguracion({ curso, onSuccess }: TabConfiguracionProps) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()
    const estadoMutation = useCambiarEstadoCurso()

    const [esGratis, setEsGratis] = useState(curso.es_gratis)
    const [precio, setPrecio] = useState(curso.precio)
    const [moneda, setMoneda] = useState(curso.moneda)

    const handleSavePrice = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { es_gratis: esGratis, precio: esGratis ? 0 : precio, moneda }
            })
            enqueueSnackbar('Configuración actualizada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    const handleChangeEstado = async (nuevoEstado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO') => {
        try {
            await estadoMutation.mutateAsync({ id: curso.id, data: { estado: nuevoEstado } })
            enqueueSnackbar(`Curso ${nuevoEstado === 'PUBLICADO' ? 'publicado' : nuevoEstado === 'ARCHIVADO' ? 'archivado' : 'volvió a borrador'}`, { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || error?.error || 'Error al cambiar estado', { variant: 'error' })
        }
    }

    return (
        <Grid container spacing={4}>
            {/* Precio */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2 }}>Precio</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={esGratis}
                            onChange={e => {
                                setEsGratis(e.target.checked)

                                if (e.target.checked) setPrecio(0)
                            }}
                        />
                    }
                    label='Este curso es gratis'
                />
                {!esGratis && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <CustomTextField
                            type='number'
                            label='Precio'
                            value={precio}
                            onChange={e => setPrecio(Number(e.target.value))}
                            sx={{ width: 200 }}
                        />
                        <CustomTextField
                            select
                            label='Moneda'
                            value={moneda}
                            onChange={e => setMoneda(e.target.value)}
                            sx={{ width: 120 }}
                        >
                            <MenuItem value='PEN'>PEN (S/)</MenuItem>
                            <MenuItem value='USD'>USD ($)</MenuItem>
                        </CustomTextField>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant='contained'
                        onClick={handleSavePrice}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        Guardar Precio
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Estado */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2 }}>Estado del Curso</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Estado actual: <Chip
                        size='small'
                        variant='tonal'
                        label={curso.estado === 'BORRADOR' ? 'Borrador' : curso.estado === 'PUBLICADO' ? 'Publicado' : 'Archivado'}
                        color={curso.estado === 'BORRADOR' ? 'warning' : curso.estado === 'PUBLICADO' ? 'success' : 'secondary'}
                    />
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {curso.estado !== 'PUBLICADO' && (
                        <Button
                            variant='contained'
                            color='success'
                            onClick={() => handleChangeEstado('PUBLICADO')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-world' />}
                        >
                            Publicar Curso
                        </Button>
                    )}
                    {curso.estado === 'PUBLICADO' && (
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => handleChangeEstado('ARCHIVADO')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-archive' />}
                        >
                            Archivar
                        </Button>
                    )}
                    {curso.estado !== 'BORRADOR' && (
                        <Button
                            variant='outlined'
                            onClick={() => handleChangeEstado('BORRADOR')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-pencil' />}
                        >
                            Volver a Borrador
                        </Button>
                    )}
                </Box>
                {curso.estado !== 'PUBLICADO' && (
                    <Typography variant='caption' color='text.disabled' sx={{ mt: 2, display: 'block' }}>
                        Para publicar se requiere al menos 1 módulo con 1 lección publicada.
                    </Typography>
                )}
            </Grid>
        </Grid>
    )
}
