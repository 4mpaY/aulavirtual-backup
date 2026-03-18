'use client'

import { type FC, useState } from 'react'

import { Box, Button, Checkbox, FormControlLabel, styled, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { Icon } from '@iconify/react'

import AppModal from '@/utils/components/AppModal'


import { useDeleteCurso } from '../hooks/useCursos'

type DeleteCursoModalProps = {
    open: boolean
    handleClose: () => void
    curso: {
        id: string
        titulo: string
        slug: string
        estado: string
    } | null
    onSuccess?: () => void
}

const ContentWrapper = styled(Box)(() => ({
    padding: '16px 0'
}))

const WarningBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.palette.mode === 'light' ? '#FFF4E5' : '#3E2723',
    border: `1px solid ${theme.palette.mode === 'light' ? '#FFB74D' : '#5D4037'}`,
    marginBottom: 24
}))

const InfoBox = styled(Box)(({ theme }) => ({
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.palette.mode === 'light' ? '#F5F5F5' : '#424242',
    marginBottom: 24
}))

const DeleteCursoModal: FC<DeleteCursoModalProps> = ({ open, handleClose, curso, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar()
    const [confirmed, setConfirmed] = useState(false)
    const deleteCursoMutation = useDeleteCurso()

    const handleDelete = async () => {
        if (!curso || !confirmed) return

        try {
            await deleteCursoMutation.mutateAsync(curso.id)

            enqueueSnackbar('Curso eliminado exitosamente', { variant: 'success' })
            setConfirmed(false)
            handleClose()
            onSuccess?.()
        } catch (error: any) {
            const errorMessage = error?.message || error?.error || 'Error al eliminar curso'

            enqueueSnackbar(errorMessage, { variant: 'error' })
        }
    }

    const handleCloseModal = () => {
        if (!deleteCursoMutation.isPending) {
            setConfirmed(false)
            handleClose()
        }
    }

    if (!curso) return null

    const noBorrador = curso.estado !== 'BORRADOR'

    return (
        <AppModal open={open} handleClose={handleCloseModal}>
            <Typography variant='h5' sx={{ mb: 2 }}>
                Eliminar Curso
            </Typography>

            <ContentWrapper>
                <WarningBox>
                    <Icon icon='mdi:alert-circle' fontSize={32} color='#F57C00' />
                    <Box>
                        <Typography variant='subtitle1' fontWeight={600}>
                            ¡Advertencia!
                        </Typography>
                        <Typography variant='body2'>
                            {noBorrador
                                ? 'Solo se pueden eliminar cursos en estado Borrador. Archiva el curso primero.'
                                : 'Esta acción eliminará el curso con todos sus módulos, lecciones y contenidos.'}
                        </Typography>
                    </Box>
                </WarningBox>

                <Typography variant='body1' sx={{ mb: 2 }}>
                    Estás a punto de eliminar el siguiente curso:
                </Typography>

                <InfoBox>
                    <Typography variant='body2' sx={{ mb: 1 }}>
                        <strong>Título:</strong> {curso.titulo}
                    </Typography>
                    <Typography variant='body2'>
                        <strong>Slug:</strong> {curso.slug}
                    </Typography>
                </InfoBox>

                {!noBorrador && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={confirmed}
                                onChange={e => setConfirmed(e.target.checked)}
                                disabled={deleteCursoMutation.isPending}
                                color='error'
                            />
                        }
                        label={
                            <Typography variant='body2'>
                                Confirmo que deseo eliminar este curso de forma permanente
                            </Typography>
                        }
                    />
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button variant='outlined' onClick={handleCloseModal} disabled={deleteCursoMutation.isPending}>
                        Cancelar
                    </Button>
                    <Button
                        variant='contained'
                        color='error'
                        onClick={handleDelete}
                        disabled={noBorrador || !confirmed || deleteCursoMutation.isPending}
                        startIcon={<Icon icon='mdi:delete' />}
                    >
                        {deleteCursoMutation.isPending ? 'Eliminando...' : 'Eliminar Curso'}
                    </Button>
                </Box>
            </ContentWrapper>
        </AppModal>
    )
}

export default DeleteCursoModal
