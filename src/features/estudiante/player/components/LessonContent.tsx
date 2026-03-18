'use client'

 
import { Box, Typography, Card, CardContent, Stack, IconButton, Tooltip } from '@mui/material'
 
interface Resource {
    id: string
    nombre: string
    url: string
}

interface LessonContentProps {
    id: string
    titulo: string
    descripcion?: string
    recursos?: Resource[]
}

const LessonContent = ({ 
    id, 
    titulo, 
    descripcion, 
    recursos = []
}: LessonContentProps) => {

    return (
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', mb: 2 }}>
                {titulo}
            </Typography>

            {descripcion && (
                <Card key={`lesson-desc-${id}`} variant="outlined" sx={{ mb: 4, borderRadius: '12px', borderStyle: 'dashed' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.6 }}>
                            {descripcion}
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {recursos && recursos.length > 0 && (
                <Box key={`lesson-resources-${id}`}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Recursos descargables</Typography>
                    <Stack spacing={2}>
                        {recursos.map((res, index) => (
                            <Card
                                key={`res-${res.id || index}`}
                                variant="outlined"
                                sx={{
                                    borderRadius: '10px',
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                                }}
                            >
                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    p: 1,
                                                    borderRadius: '8px',
                                                    display: 'flex'
                                                }}
                                            >
                                                <i className="tabler-file-download" style={{ fontSize: '1.5rem' }} />
                                            </Box>
                                            <Typography sx={{ fontWeight: 700 }}>{res.nombre}</Typography>
                                        </Stack>
                                        <Tooltip title="Descargar recurso">
                                            <IconButton
                                                component="a"
                                                href={res.url}
                                                download
                                                color="primary"
                                                sx={{ bgcolor: 'primary.50' }}
                                            >
                                                <i className="tabler-download" style={{ fontSize: '1.2rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
            )}

        </Box>
    )
}

export default LessonContent
