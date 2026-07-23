'use client'

import { useState } from 'react'

import {
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    Switch,
    Typography
} from '@mui/material'

import { useSnackbar } from 'notistack'

import { useCambiarEstadoCurso, useEditCurso } from '../../hooks/useCursos'

import type { Curso } from '../../entity/Curso'
import CustomTextField from '@core/components/mui/TextField'
import { sanitizeDatetimeInput, toLocalDateInputValue } from '@/utils/functions/sanitizeDatetime'
import MediaLibrary from '../MediaLibrary'
import CourseThumbnail from '@/utils/components/CourseThumbnail'
import { IconButton } from '@mui/material'
import { usePlantillasCertificado } from '../../../plantillas-certificado/hooks/usePlantillasCertificado'
import { PLANTILLAS_CERTIFICADO_FIJAS } from '../../../plantillas-certificado/entity/plantillasFijas'
import { useFirmantes } from '../../../firmantes/hooks/useFirmantes'

interface TabConfiguracionProps {
    curso: Curso
    onSuccess: () => void
}

export function TabConfiguracion({ curso, onSuccess }: TabConfiguracionProps) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()
    const estadoMutation = useCambiarEstadoCurso()

    const [esGratis, setEsGratis] = useState(curso.es_gratis)
    const [esPrivado, setEsPrivado] = useState(curso.es_privado ?? false)
    const [completarAutomatico, setCompletarAutomatico] = useState(curso.completar_automatico ?? false)
    const [precio, setPrecio] = useState(curso.precio)
    const [precioFalso, setPrecioFalso] = useState(curso.precio_falso)
    const [precioUsd, setPrecioUsd] = useState<number | ''>(curso.precio_usd ?? '')
    const [precioFalsoUsd, setPrecioFalsoUsd] = useState<number | ''>(curso.precio_falso_usd ?? '')
    const [moneda, setMoneda] = useState(curso.moneda)
    const [precioCertificado, setPrecioCertificado] = useState<number | ''>(curso.precio_certificado ?? '')
    const [vigenciaMeses, setVigenciaMeses] = useState<number | ''>((curso as any).vigencia_meses ?? '')
    const [certificadoPlantilla, setCertificadoPlantilla] = useState(curso.certificado_plantilla ?? '')
    const [firmante1Id, setFirmante1Id] = useState(curso.firmante_1_id ?? '')
    const [firmante2Id, setFirmante2Id] = useState(curso.firmante_2_id ?? '')

    const { data: plantillasPersonalizadas = [] } = usePlantillasCertificado()
    const { data: firmantes = [] } = useFirmantes()
    const firmantesActivos = firmantes.filter(f => f.activo)

    const opcionesPlantillaCertificado = [
        ...PLANTILLAS_CERTIFICADO_FIJAS,
        ...plantillasPersonalizadas
            .filter(p => p.activo && p.cara_frente_url)
            .map(p => ({ id: p.id, nombre: p.nombre, descripcion: 'Diseño personalizado' }))
    ]

    const handleSaveCertificadoPlantilla = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { certificado_plantilla: certificadoPlantilla || null }
            })
            enqueueSnackbar('Diseño de certificado actualizado', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar el diseño de certificado', { variant: 'error' })
        }
    }

    const handleSaveFirmantes = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { firmante_1_id: firmante1Id || null, firmante_2_id: firmante2Id || null }
            })
            enqueueSnackbar('Firmantes del curso actualizados', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar los firmantes', { variant: 'error' })
        }
    }
    const [numeroAsesor, setNumeroAsesor] = useState<string>((curso as any).numero_asesor || '')



    const handleSavePrice = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: {
                    es_gratis: esGratis,
                    precio: esGratis ? 0 : precio,
                    precio_falso: esGratis ? 0 : precioFalso,
                    precio_usd: esGratis ? null : (precioUsd === '' ? null : Number(precioUsd)),
                    precio_falso_usd: esGratis ? null : (precioFalsoUsd === '' ? null : Number(precioFalsoUsd)),
                    moneda,
                    precio_certificado: esGratis
                        ? (precioCertificado === '' ? null : Number(precioCertificado))
                        : null
                }
            })
            enqueueSnackbar('Configuración actualizada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    const handleSavePrivado = async (valor: boolean) => {
        try {
            await editMutation.mutateAsync({ id: curso.id, data: { es_privado: valor } })
            setEsPrivado(valor)
            enqueueSnackbar(valor ? 'Curso marcado como privado' : 'Curso marcado como público', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    const handleSaveCompletarAutomatico = async (valor: boolean) => {
        try {
            await editMutation.mutateAsync({ id: curso.id, data: { completar_automatico: valor } })
            setCompletarAutomatico(valor)
            enqueueSnackbar(valor ? 'Completado automático habilitado' : 'Completado automático deshabilitado', { variant: 'success' })
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
                                else setPrecioCertificado('')
                            }}
                        />
                    }
                    label='Este curso es gratis'
                />
                {esGratis && (
                    <Box sx={{ mt: 2 }}>
                        <CustomTextField
                            type='number'
                            label='Precio del certificado'
                            value={precioCertificado}
                            onChange={e => setPrecioCertificado(e.target.value === '' ? '' : Number(e.target.value))}
                            sx={{ width: 260 }}
                            inputProps={{ min: 0, step: 0.01 }}
                            helperText='Déjalo vacío si el certificado también es gratuito'
                        />
                    </Box>
                )}
                {!esGratis && (
                    <>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <CustomTextField
                                type='number'
                                label='Precio (Soles)'
                                value={precio}
                                onChange={e => setPrecio(Number(e.target.value))}
                                sx={{ width: 200 }}
                            />
                            <CustomTextField
                                type='number'
                                label='Precio Falso Soles (Opcional)'
                                value={precioFalso}
                                onChange={e => setPrecioFalso(Number(e.target.value))}
                                sx={{ width: 220 }}
                            />
                            <CustomTextField
                                select
                                label='Moneda de la orden'
                                value={moneda}
                                onChange={e => setMoneda(e.target.value)}
                                sx={{ width: 160 }}
                            >
                                <MenuItem value='PEN'>PEN (S/)</MenuItem>
                                <MenuItem value='USD'>USD ($)</MenuItem>
                            </CustomTextField>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <CustomTextField
                                type='number'
                                label='Precio (Dólares)'
                                value={precioUsd}
                                onChange={e => setPrecioUsd(e.target.value === '' ? '' : Number(e.target.value))}
                                sx={{ width: 200 }}
                                helperText='Se muestra cuando el visitante activa el toggle Dólares'
                            />
                            <CustomTextField
                                type='number'
                                label='Precio Falso Dólares (Opcional)'
                                value={precioFalsoUsd}
                                onChange={e => setPrecioFalsoUsd(e.target.value === '' ? '' : Number(e.target.value))}
                                sx={{ width: 220 }}
                            />
                        </Box>
                    </>
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
                <Box sx={{ mt: 3 }}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>Vigencia de Acceso</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                        <CustomTextField
                            type='number'
                            label='Vigencia (meses)'
                            value={vigenciaMeses}
                            onChange={e => setVigenciaMeses(e.target.value === '' ? '' : Number(e.target.value))}
                            sx={{ width: 200 }}
                            inputProps={{ min: 1 }}
                            helperText='Dejar vacío para sin caducidad'
                        />
                        <Button
                            variant='outlined'
                            onClick={async () => {
                                try {
                                    await editMutation.mutateAsync({ id: curso.id, data: { vigencia_meses: vigenciaMeses === '' ? null : Number(vigenciaMeses) } })
                                    enqueueSnackbar('Vigencia actualizada', { variant: 'success' })
                                    onSuccess()
                                } catch (error: any) {
                                    enqueueSnackbar(error?.message || 'Error al actualizar vigencia', { variant: 'error' })
                                }
                            }}
                            disabled={editMutation.isPending}
                        >
                            Guardar Vigencia
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 3 }}>
                    <Typography variant='subtitle2' sx={{ mb: 1 }}>Contacto del Asesor</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mt: 1 }}>
                        <CustomTextField
                            label='Número de WhatsApp'
                            value={numeroAsesor}
                            onChange={e => setNumeroAsesor(e.target.value)}
                            sx={{ width: 300 }}
                        />
                        <Button
                            variant='outlined'
                            onClick={async () => {
                                try {
                                    await editMutation.mutateAsync({ id: curso.id, data: { numero_asesor: numeroAsesor || null } as any })
                                    enqueueSnackbar('Número de asesor actualizado', { variant: 'success' })
                                    onSuccess()
                                } catch (error: any) {
                                    enqueueSnackbar(error?.message || 'Error al actualizar número', { variant: 'error' })
                                }
                            }}
                            disabled={editMutation.isPending}
                        >
                            Guardar Asesor
                        </Button>
                    </Box>
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 0.5 }}>
                        Número para contactar sobre dudas de los certificados o en general (incluir código de país, ej. +51 987 654 321)
                    </Typography>
                </Box>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Diseño de Certificado */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 1 }}>Diseño de Certificado</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Elige un diseño de certificado específico para este curso. Si dejas &quot;Usar el diseño general&quot;,
                    se usará la plantilla configurada globalmente en Configuración &gt; Certificación.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CustomTextField
                        select
                        label='Plantilla de certificado'
                        value={certificadoPlantilla}
                        onChange={e => setCertificadoPlantilla(e.target.value)}
                        sx={{ width: 320 }}
                    >
                        <MenuItem value=''>Usar el diseño general</MenuItem>
                        {opcionesPlantillaCertificado.map(p => (
                            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                        ))}
                    </CustomTextField>
                    <Button
                        variant='contained'
                        onClick={handleSaveCertificadoPlantilla}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        Guardar Diseño
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Firmante 1 / Firmante 2 (solo aplica a plantillas personalizadas) */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 1 }}>Firmante 1 / Firmante 2</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Solo aplica si este curso usa una plantilla de certificado personalizada con campos de
                    Firmante 1/2. Si dejas &quot;Usar el firmante por defecto&quot;, se usará el firmante global
                    configurado en Configuración &gt; Certificación.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <CustomTextField
                        select
                        label='Firmante 1'
                        value={firmante1Id}
                        onChange={e => setFirmante1Id(e.target.value)}
                        sx={{ width: 260 }}
                    >
                        <MenuItem value=''>Usar el firmante por defecto</MenuItem>
                        {firmantesActivos.map(f => (
                            <MenuItem key={f.id} value={f.id}>{f.nombre}{f.cargo ? ` (${f.cargo})` : ''}</MenuItem>
                        ))}
                    </CustomTextField>
                    <CustomTextField
                        select
                        label='Firmante 2'
                        value={firmante2Id}
                        onChange={e => setFirmante2Id(e.target.value)}
                        sx={{ width: 260 }}
                    >
                        <MenuItem value=''>Usar el firmante por defecto</MenuItem>
                        {firmantesActivos.map(f => (
                            <MenuItem key={f.id} value={f.id}>{f.nombre}{f.cargo ? ` (${f.cargo})` : ''}</MenuItem>
                        ))}
                    </CustomTextField>
                    <Button
                        variant='contained'
                        onClick={handleSaveFirmantes}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        Guardar Firmantes
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Visibilidad */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 1 }}>Visibilidad</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Un curso privado no aparece en el catálogo público. Solo el administrador puede asignarlo manualmente a un pedido.
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={esPrivado}
                            onChange={e => handleSavePrivado(e.target.checked)}
                            disabled={editMutation.isPending}
                        />
                    }
                    label={esPrivado ? 'Curso privado (no visible en catálogo)' : 'Curso público (visible en catálogo)'}
                />
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Finalización */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 1 }}>Finalización</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Permite al alumno completar todas las lecciones con un clic para acceder al certificado inmediatamente, sin necesidad de marcarlas una por una.
                </Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={completarAutomatico}
                            onChange={e => handleSaveCompletarAutomatico(e.target.checked)}
                            disabled={editMutation.isPending}
                        />
                    }
                    label={completarAutomatico ? 'Completado automático habilitado' : 'Completado automático deshabilitado'}
                />
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

            <Grid item xs={12}><Divider /></Grid>



            {/* MediaLibrary modals */}
            <MediaLibrary open={openBgMedia} onClose={() => setOpenBgMedia(false)} onSelect={(url) => setLandingBgImage(url)} />
            <MediaLibrary open={openFlyerMedia} onClose={() => setOpenFlyerMedia(false)} onSelect={(url) => setLandingFlyerImage(url)} />

        </Grid>
    )
}
