'use client'

import React, { useState } from 'react'

import {
    Box,
    Avatar,
    Typography,
    Stack,
    Button,
    Collapse,
    Divider
} from '@mui/material'

import CommentForm from './CommentForm'

export interface CommentUser {
    id: string
    nombre: string
    apellido: string
    avatar?: string | null
    rol: string
}

export interface CommentData {
    id: string
    contenido: string
    creado_en: string
    usuario_id: string
    usuario: CommentUser
    respuestas?: CommentData[]
}

interface CommentItemProps {
    comment: CommentData
    leccionId: string
    onReplySuccess: () => void
    isReply?: boolean // True si este comentario es respuesta de otro
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, leccionId, onReplySuccess, isReply = false }) => {
    const [isReplying, setIsReplying] = useState(false)

    // Formatear la fecha
    const formattedDate = new Date(comment.creado_en).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    const handleReplySuccess = () => {
        setIsReplying(false)
        onReplySuccess()
    }

    return (
        <Box sx={{ mb: isReply ? 2 : 3 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                    src={comment.usuario.avatar || undefined}
                    alt={comment.usuario.nombre}
                    sx={{ width: isReply ? 32 : 40, height: isReply ? 32 : 40, bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}
                >
                    {comment.usuario.nombre.charAt(0)}{comment.usuario.apellido?.charAt(0)}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                    {/* Header del comentario */}
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {comment.usuario.nombre} {comment.usuario.apellido}
                        </Typography>

                        {comment.usuario.rol === 'ADMIN' && (
                            <Typography
                                variant='caption'
                                sx={{ bgcolor: 'error.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.65rem', fontWeight: 'bold' }}
                            >
                                ADMIN
                            </Typography>
                        )}

                        {comment.usuario.rol === 'PROFESOR' && (
                            <Typography
                                variant='caption'
                                sx={{ bgcolor: 'primary.main', color: 'white', px: 0.8, py: 0.2, borderRadius: 1, fontSize: '0.65rem', fontWeight: 'bold' }}
                            >
                                PROFESOR
                            </Typography>
                        )}
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                            • {formattedDate}
                        </Typography>
                    </Stack>

                    {/* Cuerpo del comentario */}
                    <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', lineHeight: 1.5, mb: 1 }}>
                        {comment.contenido}
                    </Typography>

                    {/* Acciones */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        {!isReply && (
                            <Button
                                size="small"
                                variant="text"
                                color="inherit"
                                onClick={() => setIsReplying(!isReplying)}
                                startIcon={<i className={isReplying ? "tabler-x" : "tabler-message-circle"} style={{ fontSize: '1.2rem' }} />}
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    fontSize: '0.8rem',
                                    py: 0.2,
                                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                                }}
                            >
                                {isReplying ? 'Cancelar' : 'Responder'}
                            </Button>
                        )}
                    </Stack>

                    {/* Caja para responder */}
                    <Collapse in={isReplying} unmountOnExit>
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <CommentForm
                                leccionId={leccionId}
                                respuestaAId={comment.id}
                                onSuccess={handleReplySuccess}
                                autoFocus={true}
                                placeholder={`Respondiendo a ${comment.usuario.nombre}...`}
                            />
                        </Box>
                    </Collapse>

                    {comment.respuestas && comment.respuestas.length > 0 && (
                        <Box sx={{ mt: 2, borderLeft: '2px solid', borderColor: 'divider', ml: -1, pl: 3 }}>
                            {comment.respuestas.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    leccionId={leccionId}
                                    onReplySuccess={onReplySuccess}
                                    isReply={true}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Stack>
            {!isReply && <Divider sx={{ mt: 3, opacity: 0.6 }} />}
        </Box>
    )
}

export default CommentItem
