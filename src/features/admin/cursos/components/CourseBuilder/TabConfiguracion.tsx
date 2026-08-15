'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

import Link from 'next/link'

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    MenuItem,
    Stack,
    Switch,
    Typography
} from '@mui/material'

import { useSnackbar } from 'notistack'

import { useCambiarEstadoCurso, useEditCurso } from '../../hooks/useCursos'

import type { Curso } from '../../entity/Curso'
import CustomTextField from '@core/components/mui/TextField'
import { usePlantillasCertificado } from '../../../plantillas-certificado/hooks/usePlantillasCertificado'
import { PLANTILLAS_CERTIFICADO_FIJAS } from '../../../plantillas-certificado/entity/plantillasFijas'
import { useFirmantes } from '../../../firmantes/hooks/useFirmantes'

function SectionLabel({ children }: { children: string }) {
    return (
        <Typography
            variant='overline'
            sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1.2, display: 'block', mb: 1 }}
        >
            {children}
        </Typography>
    )
}

interface SettingsAccordionProps {
    icon: string
    title: string
    subtitle?: ReactNode
    chip?: { label: string; color?: 'default' | 'success' | 'warning' }
    switchProps?: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }
    children: ReactNode
}

function SettingsAccordion({ icon, title, subtitle, chip, switchProps, children }: SettingsAccordionProps) {
    return (
        <Accordion
            variant='outlined'
            sx={{ borderRadius: '8px !important', '&:before': { display: 'none' }, mb: 1 }}
        >
            <AccordionSummary
                expandIcon={<i className='tabler-chevron-down' style={{ fontSize: 18 }} />}
                sx={{ px: 3, py: 1.5, minHeight: 64 }}
            >
                <Stack direction='row' alignItems='center' spacing={2} sx={{ flex: 1, mr: 2 }}>
                    <Box
                        sx={{
                            width: 40, height: 40, borderRadius: 2,
                            bgcolor: 'action.selected',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <i className={icon} style={{ fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant='subtitle1' fontWeight={600} lineHeight={1.2}>{title}</Typography>
                        {subtitle && <Typography variant='caption' color='text.secondary'>{subtitle}</Typography>}
                    </Box>
                    {chip && (
                        <Chip
                            label={chip.label}
                            color={chip.color || 'default'}
                            size='small'
                            sx={{ fontWeight: 600 }}
                        />
                    )}
                    {switchProps && (
                        <Switch
                            checked={switchProps.checked}
                            size='small'
                            disabled={switchProps.disabled}
                            onClick={e => e.stopPropagation()}
                            onChange={e => switchProps.onChange(e.target.checked)}
                        />
                    )}
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    )
}

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
    const [moneda, setMoneda] = useState(curso.moneda)
    const [precioCertificado, setPrecioCertificado] = useState<number | ''>(curso.precio_certificado ?? '')
    const [vigenciaMeses, setVigenciaMeses] = useState<number | ''>((curso as any).vigencia_meses ?? '')
    const [certificadoPlantilla, setCertificadoPlantilla] = useState(curso.certificado_plantilla ?? '')
    const [modoCertificado, setModoCertificado] = useState<'AUTOMATICO' | 'MANUAL'>(curso.modo_certificado ?? 'AUTOMATICO')
    const [certificacionHabilitada, setCertificacionHabilitada] = useState(curso.certificacion_habilitada ?? true)
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

    const handleSaveModoCertificado = async (esManual: boolean) => {
        const nuevoModo = esManual ? 'MANUAL' : 'AUTOMATICO'

        try {
            await editMutation.mutateAsync({ id: curso.id, data: { modo_certificado: nuevoModo } })
            setModoCertificado(nuevoModo)
            enqueueSnackbar(
                esManual
                    ? 'El certificado ahora requiere subida manual del PDF'
                    : 'El certificado ahora se habilita automáticamente al finalizar el curso',
                { variant: 'success' }
            )
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar el modo de certificado', { variant: 'error' })
        }
    }

    const handleSaveCertificacionHabilitada = async (valor: boolean) => {
        try {
            await editMutation.mutateAsync({ id: curso.id, data: { certificacion_habilitada: valor } })
            setCertificacionHabilitada(valor)
            enqueueSnackbar(
                valor
                    ? 'Certificación habilitada: los alumnos que cumplan los requisitos ya pueden certificarse'
                    : 'Certificación deshabilitada: ningún alumno podrá obtener el certificado hasta que la vuelvas a habilitar',
                { variant: 'success' }
            )
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar la habilitación de certificación', { variant: 'error' })
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

    const plantillaSeleccionada = opcionesPlantillaCertificado.find(p => p.id === certificadoPlantilla)

    return (
        <Grid container spacing={4}>
            {/* Estado del Curso */}
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

            {/* Precio y Acceso */}
            <Grid item xs={12}>
                <SectionLabel>Precio y Acceso</SectionLabel>
            </Grid>
            <Grid item xs={12}>
                <SettingsAccordion
                    icon='tabler-cash-banknote'
                    title='Precio y Acceso'
                    subtitle={esGratis ? 'Gratis' : `${moneda} ${precio}`}
                >
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
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <CustomTextField
                            type='number'
                            label='Precio'
                            value={precio}
                            onChange={e => setPrecio(Number(e.target.value))}
                            sx={{ width: 200 }}
                        />
                        <CustomTextField
                            type='number'
                            label='Precio Falso (Opcional)'
                            value={precioFalso}
                            onChange={e => setPrecioFalso(Number(e.target.value))}
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
                </SettingsAccordion>
            </Grid>

            {/* Certificado */}
            <Grid item xs={12}>
                <SectionLabel>Certificado</SectionLabel>
            </Grid>
            <Grid item xs={12}>
                <SettingsAccordion
                    icon='tabler-certificate'
                    title='Diseño de Certificado'
                    subtitle={plantillaSeleccionada ? plantillaSeleccionada.nombre : 'Diseño general'}
                >
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

                <Divider sx={{ my: 3 }} />

                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 1 }}>
                    <Typography variant='subtitle2'>Firmantes</Typography>
                    <Button
                        variant='outlined'
                        size='small'
                        href='/admin/firmantes'
                        component={Link}
                        endIcon={<i className='tabler-arrow-right' style={{ fontSize: 16 }} />}
                    >
                        Gestionar firmantes
                    </Button>
                </Stack>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Solo aplica si este curso usa una plantilla de certificado personalizada con campos de
                    Firmante 1/2. Si dejas &quot;Usar el firmante por defecto&quot;, se usará el firmante global
                    configurado en Configuración &gt; Certificación.
                </Typography>
                {firmantesActivos.length === 0 && (
                    <Alert severity='info' sx={{ mb: 2 }}>
                        Aún no hay firmantes registrados. Crea uno en &quot;Gestionar firmantes&quot; para poder
                        seleccionarlo aquí.
                    </Alert>
                )}
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
                </SettingsAccordion>
            </Grid>

            <Grid item xs={12}>
                <SettingsAccordion
                    icon='tabler-rubber-stamp'
                    title='Modo de Emisión'
                    chip={{
                        label: modoCertificado === 'MANUAL' ? 'Manual' : 'Automático',
                        color: modoCertificado === 'MANUAL' ? 'warning' : 'success'
                    }}
                    switchProps={{
                        checked: modoCertificado === 'MANUAL',
                        onChange: checked => handleSaveModoCertificado(checked),
                        disabled: editMutation.isPending
                    }}
                >
                <Typography variant='body2' color='text.secondary'>
                    Define si el certificado de este curso se habilita para descarga automáticamente al finalizar,
                    o si requiere que un administrador suba el PDF firmado manualmente (por ejemplo, cuando una
                    entidad externa debe firmarlo).
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                    {modoCertificado === 'MANUAL'
                        ? 'Requiere firma externa (el admin debe subir el PDF firmado manualmente antes de que el alumno pueda descargarlo)'
                        : 'El alumno puede descargar su certificado automáticamente al finalizar el curso'}
                </Typography>
                </SettingsAccordion>
            </Grid>

            <Grid item xs={12}>
                <SettingsAccordion
                    icon='tabler-toggle-right'
                    title='Habilitación de Certificado'
                    chip={{
                        label: certificacionHabilitada ? 'Habilitada' : 'Deshabilitada',
                        color: certificacionHabilitada ? 'success' : 'warning'
                    }}
                    switchProps={{
                        checked: certificacionHabilitada,
                        onChange: checked => handleSaveCertificacionHabilitada(checked),
                        disabled: editMutation.isPending
                    }}
                >
                <Typography variant='body2' color='text.secondary'>
                    Controla si los alumnos pueden obtener el certificado de este curso, sin importar si ya
                    cumplieron el progreso y las evaluaciones requeridas. Es independiente del &quot;Modo de
                    Emisión&quot; (que solo define cómo se entrega el PDF): úsala para cursos síncronos donde
                    no quieres que se certifiquen hasta que las clases en vivo realmente hayan terminado, o para
                    retener la certificación de cualquier curso hasta el momento que decidas.
                </Typography>
                <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 1 }}>
                    {certificacionHabilitada
                        ? 'Los alumnos que completen el curso pueden obtener su certificado normalmente.'
                        : 'Ningún alumno podrá obtener el certificado, aunque haya completado el curso, hasta que la habilites.'}
                </Typography>
                </SettingsAccordion>
            </Grid>

            {/* Comportamiento del Curso */}
            <Grid item xs={12}>
                <SectionLabel>Comportamiento del Curso</SectionLabel>
            </Grid>
            <Grid item xs={12}>
                <SettingsAccordion
                    icon='tabler-eye'
                    title='Visibilidad'
                    chip={{
                        label: esPrivado ? 'Privado' : 'Público',
                        color: esPrivado ? 'warning' : 'success'
                    }}
                    switchProps={{
                        checked: esPrivado,
                        onChange: checked => handleSavePrivado(checked),
                        disabled: editMutation.isPending
                    }}
                >
                <Typography variant='body2' color='text.secondary'>
                    Un curso privado no aparece en el catálogo público. Solo el administrador puede asignarlo manualmente a un pedido.
                </Typography>
                </SettingsAccordion>
            </Grid>

            {curso.tipo_emision === 'ASINCRONO' && (
                <Grid item xs={12}>
                    <SettingsAccordion
                        icon='tabler-checklist'
                        title='Finalización Automática'
                        chip={{
                            label: completarAutomatico ? 'Habilitado' : 'Deshabilitado',
                            color: completarAutomatico ? 'success' : 'default'
                        }}
                        switchProps={{
                            checked: completarAutomatico,
                            onChange: checked => handleSaveCompletarAutomatico(checked),
                            disabled: editMutation.isPending
                        }}
                    >
                    <Typography variant='body2' color='text.secondary'>
                        Permite al alumno completar todas las lecciones con un clic para acceder al certificado inmediatamente, sin necesidad de marcarlas una por una.
                    </Typography>
                    </SettingsAccordion>
                </Grid>
            )}
            {curso.tipo_emision !== 'ASINCRONO' && (
                <Grid item xs={12}>
                    <Alert severity='info'>
                        La finalización automática (completar todas las lecciones con un clic) solo está disponible
                        para cursos asincrónicos, ya que en cursos síncronos o mixtos las lecciones representan
                        sesiones en vivo que aún no han ocurrido.
                    </Alert>
                </Grid>
            )}
        </Grid>
    )
}
