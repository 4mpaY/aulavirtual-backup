'use client'

import { useState } from 'react'

import {
    Grid,
    Typography,
    Box,
    Button,
    Card,
    IconButton,
    Divider,
    Stack,
    FormControlLabel,
    Switch,
    Avatar
} from '@mui/material'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'
import type { Curso } from '../../entity/Curso'
import { useEditCurso } from '../../hooks/useCursos'

interface TabDetallesPremiumProps {
    curso: Curso
    onSuccess: () => void
}

export function TabDetallesPremium({ curso, onSuccess }: TabDetallesPremiumProps) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()

    const [objetivos, setObjetivos] = useState<string[]>(curso.objetivos || [])
    const [metodologia, setMetodologia] = useState<any[]>(curso.metodologia || [])
    const [beneficios, setBeneficios] = useState<any[]>(curso.beneficios || [])
    const [incluye, setIncluye] = useState<any[]>(curso.incluye || [])

    const [newObjetivo, setNewObjetivo] = useState('')

    const handleSave = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { objetivos, metodologia, beneficios, incluye }
            })
            enqueueSnackbar('Detalles premium actualizados', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al guardar', { variant: 'error' })
        }
    }

    // Gestionar Objetivos
    const addObjetivo = () => {
        if (!newObjetivo.trim()) return
        setObjetivos(prev => [...prev, newObjetivo.trim()])
        setNewObjetivo('')
    }

    const removeObjetivo = (index: number) => {
        setObjetivos(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Grid container spacing={6}>
            {/* Objetivos */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-target' /> ¿Qué logrará el alumno? (Objetivos)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <CustomTextField
                        fullWidth
                        placeholder='Añadir un objetivo...'
                        value={newObjetivo}
                        onChange={e => setNewObjetivo(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addObjetivo()}
                    />
                    <Button variant='tonal' onClick={addObjetivo} startIcon={<i className='tabler-plus' />}>
                        Añadir
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {objetivos.map((obj, i) => (
                        <Card key={i} variant='outlined' sx={{ px: 3, py: 2, bgcolor: 'action.hover' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant='body2'>{obj}</Typography>
                                <IconButton size='small' color='error' onClick={() => removeObjetivo(i)}>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            </Grid>

            {/* Metodología */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-certificate' /> Metodología de Aprendizaje
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Define los pilares de tu enseñanza. Aparecerán como tarjetas en la página de detalle.
                </Typography>

                <Stack direction='row' alignItems='center' spacing={2} sx={{ mb: 3 }}>
                    <Button
                        variant='outlined'
                        startIcon={<i className='tabler-plus' />}
                        onClick={() => setMetodologia([...metodologia, { title: '', desc: '', icon: 'star' }])}
                    >
                        Añadir Pilar Metodológico
                    </Button>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5, 
                        p: 3, 
                        borderRadius: '12px', 
                        bgcolor: 'info.lighterOpacity', 
                        border: '1px dashed',
                        borderColor: 'info.main',
                        flex: 1
                    }}>
                        <i className='tabler-info-circle' style={{ fontSize: '1.5rem', color: 'var(--mui-palette-info-main)' }} />
                        <Typography variant='body2' sx={{ color: 'info.main', fontWeight: 500 }}>
                            Personaliza tus iconos buscando en: <a href="https://tabler-icons.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', fontWeight: 800, textDecoration: 'underline' }}>tabler-icons.io</a>. ¡Solo pega el nombre (ej. &quot;star&quot;)!
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    {metodologia.map((m, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
                                <IconButton
                                    size='small'
                                    color='error'
                                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                                    onClick={() => setMetodologia(prev => prev.filter((_, idx) => idx !== i))}
                                >
                                    <i className='tabler-x' />
                                </IconButton>
                                <Stack spacing={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.lighterOpacity', color: 'primary.main', width: 40, height: 40 }}>
                                            <i className={m.icon?.startsWith('tabler-') ? m.icon : `tabler-${m.icon}`} />
                                        </Avatar>
                                        <CustomTextField
                                            label='Icono (solo nombre)'
                                            fullWidth
                                            size='small'
                                            placeholder='Ej: star, award, book...'
                                            value={m.icon?.replace('tabler-', '')}
                                            onChange={e => {
                                                const newM = [...metodologia]

                                                const iconName = e.target.value.replace('tabler-', '')

                                                newM[i] = { ...newM[i], icon: iconName }
                                                setMetodologia(newM)
                                            }}
                                        />
                                    </Box>
                                    <CustomTextField
                                        label='Título'
                                        fullWidth
                                        size='small'
                                        value={m.title}
                                        onChange={e => {
                                            const newM = [...metodologia]

                                            newM[i] = { ...newM[i], title: e.target.value }
                                            setMetodologia(newM)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Descripción'
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size='small'
                                        value={m.desc}
                                        onChange={e => {
                                            const newM = [...metodologia]

                                            newM[i] = { ...newM[i], desc: e.target.value }
                                            setMetodologia(newM)
                                        }}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* Beneficios / Highlights */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-gift' /> Beneficios Destacados (Highlights)
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Tarjetas superiores que resaltan características como &quot;Acceso 24/7&quot;, &quot;Clases en vivo&quot;, etc.
                </Typography>

                <Button
                    variant='outlined'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => setBeneficios([...beneficios, { title: '', desc: '', icon: 'tabler-bolt' }])}
                    sx={{ mb: 3 }}
                >
                    Añadir Highlight
                </Button>

                <Grid container spacing={3}>
                    {beneficios.map((b, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
                                <IconButton
                                    size='small'
                                    color='error'
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))}
                                >
                                    <i className='tabler-x' />
                                </IconButton>
                                <Stack spacing={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.lighterOpacity', color: 'secondary.main', width: 40, height: 40 }}>
                                            <i className={b.icon?.startsWith('tabler-') ? b.icon : `tabler-${b.icon}`} />
                                        </Avatar>
                                        <CustomTextField
                                            label='Icono'
                                            fullWidth
                                            size='small'
                                            placeholder='Ej: bolt, cup, tool...'
                                            value={b.icon?.replace('tabler-', '')}
                                            onChange={e => {
                                                const newB = [...beneficios]

                                                const iconName = e.target.value.replace('tabler-', '')

                                                newB[i] = { ...newB[i], icon: iconName }
                                                setBeneficios(newB)
                                            }}
                                        />
                                    </Box>
                                    <CustomTextField
                                        label='Título'
                                        size='small'
                                        value={b.title}
                                        onChange={e => {
                                            const newB = [...beneficios]

                                            newB[i] = { ...newB[i], title: e.target.value }
                                            setBeneficios(newB)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Descripción'
                                        multiline
                                        rows={2}
                                        size='small'
                                        value={b.desc}
                                        onChange={e => {
                                            const newB = [...beneficios]

                                            newB[i] = { ...newB[i], desc: e.target.value }
                                            setBeneficios(newB)
                                        }}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* El programa incluye (Sidebar) */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-checklist' /> El programa incluye (Sidebar)
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Lista de verificación que aparece en el lateral del curso. Marca lo que está disponible.
                </Typography>

                <Button
                    variant='outlined'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => setIncluye([...incluye, { text: '', active: true }])}
                    sx={{ mb: 3 }}
                >
                    Añadir Ítem de Lista
                </Button>

                <Stack spacing={2}>
                    {incluye.map((item, i) => (
                        <Card key={i} variant='outlined' sx={{ px: 3, py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={item.active}
                                            onChange={e => {
                                                const newI = [...incluye]

                                                newI[i].active = e.target.checked
                                                setIncluye(newI)
                                            }}
                                        />
                                    }
                                    label=''
                                />
                                <CustomTextField
                                    fullWidth
                                    size='small'
                                    placeholder='Ej: Certificado oficial'
                                    value={item.text}
                                    onChange={e => {
                                        const newI = [...incluye]

                                        newI[i] = { ...newI[i], text: e.target.value }
                                        setIncluye(newI)
                                    }}
                                />
                                <IconButton color='error' onClick={() => setIncluye(incluye.filter((_, idx) => idx !== i))}>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            </Grid>

            {/* Guardar */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                        variant='contained'
                        size='large'
                        onClick={handleSave}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        {editMutation.isPending ? 'Guardando...' : 'Guardar Todos los Detalles Premium'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
