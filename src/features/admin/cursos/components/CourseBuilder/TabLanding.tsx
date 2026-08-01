'use client'

import { useState } from 'react'

import {
    Box,
    Button,
    FormControlLabel,
    Grid,
    Switch,
    Typography,
    IconButton
} from '@mui/material'
import { useSnackbar } from 'notistack'

import { useEditCurso } from '../../hooks/useCursos'
import type { Curso } from '../../entity/Curso'
import CustomTextField from '@core/components/mui/TextField'
import { sanitizeDatetimeInput, toLocalDatetimeLocalValue } from '@/utils/functions/sanitizeDatetime'
import MediaLibrary from '../MediaLibrary'
import CourseThumbnail from '@/utils/components/CourseThumbnail'

interface TabLandingProps {
    curso: Curso
    onSuccess: () => void
}

export function TabLanding({ curso, onSuccess }: TabLandingProps) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()

    // Landing Page State
    const [landingActive, setLandingActive] = useState((curso as any).landing_active ?? false)
    const [landingTimer, setLandingTimer] = useState<string>((curso as any).landing_timer ? toLocalDatetimeLocalValue((curso as any).landing_timer) : '')
    const [landingWspLink, setLandingWspLink] = useState<string>((curso as any).landing_wsp_link || '')
    const [landingBgImage, setLandingBgImage] = useState<string>((curso as any).landing_bg_image || '')
    const [landingFlyerImage, setLandingFlyerImage] = useState<string>((curso as any).landing_flyer_image || '')
    const [openBgMedia, setOpenBgMedia] = useState(false)
    const [openFlyerMedia, setOpenFlyerMedia] = useState(false)

    const defaultBeneficios = [
        { icon: 'tabler-video', title: 'Clase en vivo', desc: 'Clases 100% en vivo por Zoom.' },
        { icon: 'tabler-headset', title: 'Seguimiento personalizado', desc: 'Apoyo y soporte de la coordinadora.' },
        { icon: 'tabler-device-laptop', title: 'Plataforma virtual', desc: 'Acceso 24/7 durante el programa.' },
        { icon: 'tabler-certificate', title: 'Certificado Opcional', desc: 'Solicítalo al finalizar el curso.' }
    ]

    const initialBeneficios = Array.isArray(curso.beneficios) && curso.beneficios.length > 0
        ? curso.beneficios.map((b: any, index) => {
            if (typeof b === 'string') {
                return {
                    icon: defaultBeneficios[index]?.icon || 'tabler-check',
                    title: b,
                    desc: defaultBeneficios[index]?.desc || ''
                }
            }

            return {
                icon: b.icon || 'tabler-check',
                title: b.title || '',
                desc: b.desc || ''
            }
        })
        : defaultBeneficios

    while (initialBeneficios.length < 4) {
        const idx = initialBeneficios.length

        initialBeneficios.push(defaultBeneficios[idx] || { icon: 'tabler-check', title: '', desc: '' })
    }

    const [beneficios, setBeneficios] = useState<any[]>(initialBeneficios)

    const handleUpdateBeneficio = (index: number, field: string, value: string) => {
        const updated = [...beneficios]

        updated[index] = { ...updated[index], [field]: value }
        setBeneficios(updated)
    }

    const handleSaveLanding = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: {
                    landing_active: landingActive,
                    landing_timer: landingTimer ? sanitizeDatetimeInput(landingTimer) : null,
                    landing_wsp_link: landingWspLink || null,
                    landing_bg_image: landingBgImage || null,
                    landing_flyer_image: landingFlyerImage || null,
                    beneficios: beneficios
                } as any
            })
            enqueueSnackbar('Configuración de landing actualizada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar landing', { variant: 'error' })
        }
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 1 }}>Configuración de Landing Page</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                    Configura la página de aterrizaje previa al curso, ideal para generar expectativa (timer), inscripciones por WhatsApp y captar leads.
                </Typography>
                
                {/* Landing URL Copy Section */}
                <Box sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Typography variant='subtitle1' sx={{ mb: 1, fontWeight: 600 }}>URL de la Landing Page</Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                        Comparte este enlace para dirigir a los usuarios a la página de aterrizaje de este curso.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <CustomTextField
                            fullWidth
                            value={typeof window !== 'undefined' ? `${window.location.origin}/landing/${curso.slug}` : `/landing/${curso.slug}`}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        <Button 
                            variant='contained' 
                            onClick={() => {
                                navigator.clipboard.writeText(typeof window !== 'undefined' ? `${window.location.origin}/landing/${curso.slug}` : `/landing/${curso.slug}`);
                                enqueueSnackbar('URL copiada al portapapeles', { variant: 'success' });
                            }}
                            startIcon={<i className='tabler-copy' />}
                            sx={{ flexShrink: 0 }}
                        >
                            Copiar URL
                        </Button>
                    </Box>
                </Box>

                <FormControlLabel
                    control={
                        <Switch
                            checked={landingActive}
                            onChange={e => setLandingActive(e.target.checked)}
                            disabled={editMutation.isPending}
                        />
                    }
                    label={landingActive ? 'Landing Page Activada' : 'Landing Page Desactivada'}
                />
                
                {landingActive && (
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <CustomTextField
                                type='datetime-local'
                                label='Fecha y Hora del Contador (Timer)'
                                value={landingTimer}
                                onChange={e => setLandingTimer(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ width: 250 }}
                            />
                            <CustomTextField
                                type='url'
                                label='Link del Grupo de WhatsApp'
                                value={landingWspLink}
                                onChange={e => setLandingWspLink(e.target.value)}
                                placeholder='https://chat.whatsapp.com/...'
                                sx={{ flexGrow: 1 }}
                            />
                        </Box>
                        
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant='subtitle2' sx={{ mb: 1 }}>Imagen de Fondo (Background)</Typography>
                                {landingBgImage ? (
                                    <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', mb: 2, bgcolor: '#f4f4f4', border: '1px solid', borderColor: 'divider', aspectRatio: '16/9' }}>
                                        <CourseThumbnail src={landingBgImage} title='Vista previa' variant='simple' />
                                        <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
                                            <IconButton size='small' sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'error.main', color: 'common.white' } }} onClick={() => setLandingBgImage('')}>
                                                <i className='tabler-trash text-sm' />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        onClick={() => setOpenBgMedia(true)}
                                        sx={{
                                            width: '100%', height: 120, borderRadius: 2, border: '1px dashed', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: 'action.hover', mb: 2, '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lightOpacity' }
                                        }}
                                    >
                                        <i className='tabler-photo-plus text-2xl text-textDisabled' />
                                        <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>Click para seleccionar Fondo</Typography>
                                    </Box>
                                )}
                                <Button variant='outlined' size='small' fullWidth startIcon={<i className='tabler-photo' />} onClick={() => setOpenBgMedia(true)}>
                                    {landingBgImage ? 'Cambiar Fondo' : 'Seleccionar Fondo'}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant='subtitle2' sx={{ mb: 1 }}>Imagen del Flyer (Derecha)</Typography>
                                {landingFlyerImage ? (
                                    <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', mb: 2, bgcolor: '#f4f4f4', border: '1px solid', borderColor: 'divider', aspectRatio: '4/5' }}>
                                        <CourseThumbnail src={landingFlyerImage} title='Vista previa' variant='simple' />
                                        <Box sx={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
                                            <IconButton size='small' sx={{ bgcolor: 'background.paper', boxShadow: 1, '&:hover': { bgcolor: 'error.main', color: 'common.white' } }} onClick={() => setLandingFlyerImage('')}>
                                                <i className='tabler-trash text-sm' />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box
                                        onClick={() => setOpenFlyerMedia(true)}
                                        sx={{
                                            width: '100%', height: 120, borderRadius: 2, border: '1px dashed', borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', bgcolor: 'action.hover', mb: 2, '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lightOpacity' }
                                        }}
                                    >
                                        <i className='tabler-photo-plus text-2xl text-textDisabled' />
                                        <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>Click para seleccionar Flyer</Typography>
                                    </Box>
                                )}
                                <Button variant='outlined' size='small' fullWidth startIcon={<i className='tabler-photo' />} onClick={() => setOpenFlyerMedia(true)}>
                                    {landingFlyerImage ? 'Cambiar Flyer' : 'Seleccionar Flyer'}
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Detalles destacados */}
                        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4, mt: 4 }}>
                            <Typography variant='h6' sx={{ mb: 1, fontWeight: 600 }}>Tarjetas de Detalles Destacados (Beneficios)</Typography>
                            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                                Configura las 4 tarjetas de beneficios/características que se muestran en el banner oscuro debajo de la cabecera.
                            </Typography>
                            <Grid container spacing={4}>
                                {beneficios.map((item, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                                            <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>Tarjeta #{index + 1}</Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                <CustomTextField
                                                    label='Título'
                                                    value={item.title || ''}
                                                    onChange={e => handleUpdateBeneficio(index, 'title', e.target.value)}
                                                    fullWidth
                                                />
                                                <CustomTextField
                                                    label='Descripción'
                                                    value={item.desc || ''}
                                                    onChange={e => handleUpdateBeneficio(index, 'desc', e.target.value)}
                                                    fullWidth
                                                />
                                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                                    <CustomTextField
                                                        label='Icono (ej: tabler-video)'
                                                        value={item.icon || ''}
                                                        onChange={e => handleUpdateBeneficio(index, 'icon', e.target.value)}
                                                        fullWidth
                                                    />
                                                    <Box sx={{ 
                                                        width: 44, 
                                                        height: 44, 
                                                        borderRadius: 1, 
                                                        border: '1px solid', 
                                                        borderColor: 'divider', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        bgcolor: 'action.hover',
                                                        color: 'primary.main',
                                                        flexShrink: 0
                                                    }}>
                                                        <i className={`${item.icon || 'tabler-check'} text-2xl`} />
                                                    </Box>
                                                </Box>
                                                {/* Preselección de iconos comunes */}
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                    {[
                                                        { icon: 'tabler-video', label: 'Zoom' },
                                                        { icon: 'tabler-certificate', label: 'Diploma' },
                                                        { icon: 'tabler-device-laptop', label: 'Plataforma' },
                                                        { icon: 'tabler-headset', label: 'Soporte' },
                                                        { icon: 'tabler-file-text', label: 'Manuales' },
                                                        { icon: 'tabler-award', label: 'Destaque' }
                                                    ].map((sIcon) => (
                                                        <Button
                                                            key={sIcon.icon}
                                                            variant='outlined'
                                                            size='small'
                                                            sx={{ px: 1.5, py: 0.25, minWidth: 'auto', fontSize: '0.7rem', textTransform: 'none' }}
                                                            onClick={() => handleUpdateBeneficio(index, 'icon', sIcon.icon)}
                                                        >
                                                            {sIcon.label}
                                                        </Button>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Button
                                variant='contained'
                                onClick={handleSaveLanding}
                                disabled={editMutation.isPending}
                                startIcon={<i className='tabler-device-floppy' />}
                            >
                                Guardar Configuración de Landing
                            </Button>
                        </Box>
                    </Box>
                )}
            </Grid>

            {/* MediaLibrary modals */}
            <MediaLibrary open={openBgMedia} onClose={() => setOpenBgMedia(false)} onSelect={(url) => setLandingBgImage(url)} />
            <MediaLibrary open={openFlyerMedia} onClose={() => setOpenFlyerMedia(false)} onSelect={(url) => setLandingFlyerImage(url)} />
        </Grid>
    )
}
