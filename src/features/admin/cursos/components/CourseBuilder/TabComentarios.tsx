'use client'

import React from 'react'

import {
    Box,
    Typography,
    CircularProgress,
    List,
    Paper,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Chip
} from '@mui/material'

import { useComentariosCurso } from '../../hooks/useCursos'

interface TabComentariosProps {
    cursoId: string
}

export function TabComentarios({ cursoId }: TabComentariosProps) {
    const { data, isLoading } = useComentariosCurso(cursoId)
    const comentarios = data?.comentarios || []

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress />
        </Box>
    )

    if (comentarios.length === 0) {
        return (
            <Box sx={{ p: 10, textAlign: 'center' }}>
                <i className='tabler-message-off text-6xl text-textSecondary' />
                <Typography variant='h5' sx={{ mt: 4 }}>No hay comentarios aún</Typography>
                <Typography color='text.secondary'>Los comentarios de los estudiantes aparecerán aquí.</Typography>
            </Box>
        )
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {comentarios.map((c: any) => (
                <React.Fragment key={c.id}>
                    <Paper variant='outlined' sx={{ mb: 3, p: 2 }}>
                        <ListItem alignItems='flex-start' disablePadding>
                            <ListItemAvatar>
                                <Avatar alt={c.usuario.nombre} src={c.usuario.avatar || ''} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant='subtitle1' fontWeight={600}>
                                            {c.usuario.nombre} {c.usuario.apellido}
                                            <Chip
                                                label={c.usuario.rol}
                                                size='small'
                                                variant='tonal'
                                                sx={{ ml: 2, height: 20 }}
                                                color={c.usuario.rol === 'ADMIN' ? 'error' : c.usuario.rol === 'PROFESOR' ? 'info' : 'primary'}
                                            />
                                        </Typography>
                                        <Typography variant='caption' color='text.secondary'>
                                            {new Date(c.creado_en).toLocaleString()}
                                        </Typography>
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant='body1' color='text.primary' sx={{ mb: 2 }}>
                                            {c.contenido}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                size='small'
                                                icon={<i className='tabler-video' />}
                                                label={`${c.leccion.modulo.titulo} > ${c.leccion.titulo}`}
                                                variant='outlined'
                                            />
                                        </Box>
                                    </Box>
                                }
                            />
                        </ListItem>

                        {c.respuestas && c.respuestas.length > 0 && (
                            <Box sx={{ ml: 12, mt: 2, borderLeft: '2px solid', borderColor: 'divider', pl: 4 }}>
                                {c.respuestas.map((r: any) => (
                                    <Box key={r.id} sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Avatar sx={{ width: 24, height: 24 }} alt={r.usuario.nombre} src={r.usuario.avatar || ''} />
                                            <Typography variant='subtitle2' fontWeight={600}>
                                                {r.usuario.nombre} {r.usuario.apellido}
                                            </Typography>
                                            <Typography variant='caption' color='text.secondary'>
                                                {new Date(r.creado_en).toLocaleString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant='body2'>{r.contenido}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Paper>
                </React.Fragment>
            ))}
        </List>
    )
}
