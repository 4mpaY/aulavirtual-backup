'use client'

import { useState } from 'react'
import type { ChangeEvent } from 'react'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    Box,
    Typography,
    CircularProgress,
    TextField,
    InputAdornment,
    IconButton
} from '@mui/material'

import { useMedia, useUploadMedia } from '../hooks/useMedia'

interface MediaLibraryProps {
    open: boolean
    onClose: () => void
    onSelect: (url: string, nombre?: string) => void
    title?: string
    acceptType?: 'IMAGEN' | 'VIDEO' | 'OTRO'
}

const MediaLibrary = ({ open, onClose, onSelect, title = 'Biblioteca de Medios', acceptType = 'IMAGEN' }: MediaLibraryProps) => {
    const [search, setSearch] = useState('')
    const { data: media = [], isLoading } = useMedia()
    const uploadMutation = useUploadMedia()

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) return

        try {
            const result = await uploadMutation.mutateAsync(file)

            onSelect(result.url, result.nombre)
            onClose()
        } catch (error) {
            console.error('Error al subir archivo', error)
        }
    }

    const filteredMedia = media.filter(m =>
        m.nombre.toLowerCase().includes(search.toLowerCase()) &&
        (acceptType ? m.tipo === acceptType : true)
    )

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: '20px', minHeight: '600px' } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 0 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{title}</Typography>
                <IconButton onClick={onClose} size="small">
                    <i className="tabler-x" />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar imágenes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <i className="tabler-search" />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={uploadMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-upload" />}
                        disabled={uploadMutation.isPending}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        {uploadMutation.isPending ? 'Subiendo...' : 'Subir Imagen'}
                        <input
                            type="file"
                            hidden
                            accept={acceptType === 'IMAGEN' ? 'image/*' : acceptType === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx,image/*'}
                            onChange={handleFileUpload}
                        />
                    </Button>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Tarjeta de Subida rápida (siempre visible al inicio si no hay búsqueda intensa o simplemente como opción) */}
                        {!search && (
                            <Grid item xs={6} sm={4} md={3}>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        minHeight: 165,
                                        borderRadius: 3,
                                        border: '2px dashed',
                                        borderColor: 'primary.main',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        bgcolor: 'primary.lightOpacity',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'primary.main', '& *': { color: 'common.white' } }
                                    }}
                                >
                                    <CardActionArea
                                        component="label"
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            p: 2
                                        }}
                                    >
                                        <i className="tabler-plus text-3xl text-primary" />
                                        <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 600 }}>Nueva Imagen</Typography>
                                        <input
                                            type="file"
                                            hidden
                                            accept={acceptType === 'IMAGEN' ? 'image/*' : acceptType === 'VIDEO' ? 'video/*' : '.pdf,.doc,.docx,.xls,.xlsx,image/*'}
                                            onChange={handleFileUpload}
                                        />
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )}

                        {filteredMedia.length === 0 && search ? (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'action.hover', borderRadius: 4 }}>
                                    <i className="tabler-photo-off text-5xl text-textDisabled" />
                                    <Typography sx={{ mt: 2 }} color="text.secondary">No se encontraron imágenes</Typography>
                                </Box>
                            </Grid>
                        ) : (
                            filteredMedia.map((item) => (
                                <Grid item xs={6} sm={4} md={3} key={item.id}>
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'scale(1.02)', borderColor: 'primary.main' }
                                        }}
                                    >
                                        <CardActionArea onClick={() => {
                                            onSelect(item.url, item.nombre)
                                            onClose()
                                        }}>
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image={item.url}
                                                alt={item.nombre}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <Box sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                                                <Typography
                                                    variant="caption"
                                                    noWrap
                                                    sx={{ display: 'block', fontWeight: 600 }}
                                                >
                                                    {item.nombre}
                                                </Typography>
                                            </Box>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit">Cancelar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default MediaLibrary
