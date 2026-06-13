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

import { useSnackbar } from 'notistack'

import { useMedia, useUploadMedia, useDeleteMedia, useUploadPrivateVideo } from '../hooks/useMedia'
import CustomAlertDialog from '../../../../components/CustomAlertDialog'

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
  const uploadVideoMutation = useUploadPrivateVideo()
  const deleteMutation = useDeleteMedia()
  const { enqueueSnackbar } = useSnackbar()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    try {
      let result

      if (acceptType === 'VIDEO') {
        result = await uploadVideoMutation.mutateAsync(file)
      } else {
        result = await uploadMutation.mutateAsync(file)
      }

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
            placeholder={acceptType === 'IMAGEN' ? "Buscar imágenes..." : "Buscar recursos..."}
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
            startIcon={(uploadMutation.isPending || uploadVideoMutation.isPending) ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-upload" />}
            disabled={uploadMutation.isPending || uploadVideoMutation.isPending}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {(uploadMutation.isPending || uploadVideoMutation.isPending) ? 'Subiendo...' : (acceptType === 'IMAGEN' ? 'Subir Imagen' : acceptType === 'VIDEO' ? 'Subir Video' : 'Subir Recurso')}
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
                    <Typography variant="body2" color="primary" sx={{ mt: 1, fontWeight: 600 }}>
                      {acceptType === 'IMAGEN' ? 'Nueva Imagen' : acceptType === 'VIDEO' ? 'Nuevo Video' : 'Nuevo Recurso'}
                    </Typography>
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
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    {acceptType === 'IMAGEN' ? 'No se encontraron imágenes' : acceptType === 'VIDEO' ? 'No se encontraron videos' : 'No se encontraron recursos'}
                  </Typography>
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
                      if (deleteMutation.isPending) return
                      onSelect(item.url, item.nombre)
                      onClose()
                    }}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDeleteId(item.id)
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          bgcolor: 'rgba(255,255,255,0.8)',
                          '&:hover': { bgcolor: 'error.main', color: 'common.white' }
                        }}
                      >
                        <i className="tabler-trash" style={{ fontSize: '1.2rem' }} />
                      </IconButton>
                      {item.tipo === 'IMAGEN' ? (
                        <Box sx={{ position: 'relative', height: 120 }}>
                          <CardMedia
                            component="img"
                            height="120"
                            image={item.url}
                            alt={item.nombre}
                            sx={{ objectFit: 'cover' }}
                            onError={(e: any) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                          <Box sx={{
                            display: 'none',
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'action.hover',
                            color: 'text.secondary'
                          }}>
                            <i className="tabler-photo-off text-5xl" />
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{
                          height: 120,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'action.hover',
                          color: 'text.secondary'
                        }}>
                          {item.tipo === 'VIDEO' ? (
                            <i className="tabler-video text-5xl" />
                          ) : item.mimetype?.includes('pdf') ? (
                            <i className="tabler-file-type-pdf text-5xl text-error" />
                          ) : item.mimetype?.includes('word') || item.mimetype?.includes('doc') ? (
                            <i className="tabler-file-description text-5xl text-info" />
                          ) : item.mimetype?.includes('sheet') || item.mimetype?.includes('excel') || item.mimetype?.includes('xls') ? (
                            <i className="tabler-file-spreadsheet text-5xl text-success" />
                          ) : (
                            <i className="tabler-file text-5xl" />
                          )}
                        </Box>
                      )}
                      <Box sx={{ p: 1.5, bgcolor: 'background.paper', height: 60, display: 'flex', alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.2,
                            width: '100%'
                          }}
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

      <CustomAlertDialog
        open={!!deleteId}
        title="¿Eliminar Recurso?"
        description="Esta acción eliminará permanentemente el archivo del servidor y no aparecerá en ningún curso donde se esté usando. ¿Estás seguro?"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return

          try {
            await deleteMutation.mutateAsync(deleteId)
            enqueueSnackbar('Recurso eliminado correctamente', { variant: 'success' })
          } catch (error) {
            enqueueSnackbar('Error al eliminar recurso', { variant: 'error' })
          } finally {
            setDeleteId(null)
          }
        }}
        loading={deleteMutation.isPending}
      />
    </Dialog>
  )
}

export default MediaLibrary
