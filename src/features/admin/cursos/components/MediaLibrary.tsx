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
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material'

import { useSnackbar } from 'notistack'

import { useMedia, useUploadMedia, useDeleteMedia, useUploadPrivateVideo } from '../hooks/useMedia'
import CustomAlertDialog from '../../../../components/CustomAlertDialog'

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-matroska',
  'video/mkv'
]

const ALLOWED_VIDEO_EXT = ['.mp4', '.webm', '.ogg', '.mov', '.mkv']

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

const ALLOWED_OTHER_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ...ALLOWED_IMAGE_TYPES,
  'video/mp4',
  'video/webm',
  'video/x-matroska',
  'video/mkv'
]

const ALLOWED_OTHER_EXT = [
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  ...ALLOWED_IMAGE_EXT,
  '.mp4', '.webm', '.mkv'
]



interface MediaLibraryProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string, nombre?: string) => void
  title?: string
  acceptType?: 'IMAGEN' | 'VIDEO' | 'OTRO' | 'PDF'
}

const MediaLibrary = ({ open, onClose, onSelect, title = 'Biblioteca de Medios', acceptType = 'IMAGEN' }: MediaLibraryProps) => {
  const [search, setSearch] = useState('')
  const { data: media = [], isLoading } = useMedia()
  const uploadMutation = useUploadMedia()
  const uploadVideoMutation = useUploadPrivateVideo()
  const deleteMutation = useDeleteMedia()
  const { enqueueSnackbar } = useSnackbar()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    // Validación de formato del lado del cliente
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()

    if (acceptType === 'VIDEO') {
      const isValid = ALLOWED_VIDEO_TYPES.includes(file.type) || ALLOWED_VIDEO_EXT.includes(extension)

      if (!isValid) {
        enqueueSnackbar('Formato de video no permitido. Solo se aceptan (.mp4, .webm, .ogg, .mov, .mkv)', { variant: 'error' })

        return
      }
    } else if (acceptType === 'IMAGEN') {
      const isValid = ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_IMAGE_EXT.includes(extension)

      if (!isValid) {
        enqueueSnackbar('Formato de imagen no permitido. Solo se aceptan (.jpg, .jpeg, .png, .webp, .gif)', { variant: 'error' })

        return
      }
    } else {
      const isValid = ALLOWED_OTHER_TYPES.includes(file.type) || ALLOWED_OTHER_EXT.includes(extension)

      if (!isValid) {
        enqueueSnackbar('Formato de archivo no permitido. Solo se aceptan PDF, Word, Excel, imágenes y videos (.mp4, .webm, .mkv)', { variant: 'error' })

        return
      }
    }

    // Validación de tamaño máximo del lado del cliente
    const limit = acceptType === 'VIDEO' ? 3 * 1024 * 1024 * 1024 : 50 * 1024 * 1024

    if (file.size > limit) {
      enqueueSnackbar(
        `El archivo supera el tamaño máximo permitido (${acceptType === 'VIDEO' ? '3 GB' : '50 MB'})`,
        { variant: 'error' }
      )

      return
    }

    event.target.value = ''

    try {
      let result

      setUploadProgress(0)

      if (acceptType === 'VIDEO') {
        result = await uploadVideoMutation.mutateAsync({
          file,
          onProgress: (p) => setUploadProgress(p)
        })
      } else {
        result = await uploadMutation.mutateAsync({
          file,
          onProgress: (p) => setUploadProgress(p)
        })
      }

      setUploadProgress(null)
      onSelect(result.url, result.nombre)
      onClose()
    } catch (error) {
      setUploadProgress(null)
      console.error('Error al subir archivo', error)
      enqueueSnackbar('Error al subir el archivo', { variant: 'error' })
    }
  }

  const filteredMedia = media.filter(m => {
    if (!m.nombre.toLowerCase().includes(search.toLowerCase())) return false

    if (acceptType === 'PDF') return m.mimetype === 'application/pdf'

    return acceptType ? m.tipo === acceptType : true
  })

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
            placeholder={acceptType === 'IMAGEN' ? "Buscar imágenes..." : acceptType === 'PDF' ? "Buscar PDFs..." : "Buscar recursos..."}
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
            {uploadMutation.isPending ? 'Subiendo...' : (acceptType === 'IMAGEN' ? 'Subir Imagen' : acceptType === 'PDF' ? 'Subir PDF' : 'Subir Recurso')}
            <input
              type="file"
              hidden
              accept={acceptType === 'IMAGEN' ? 'image/*' : acceptType === 'VIDEO' ? 'video/*' : acceptType === 'PDF' ? '.pdf' : '.pdf,.doc,.docx,.xls,.xlsx,image/*'}
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
                      {acceptType === 'IMAGEN' ? 'Nueva Imagen' : acceptType === 'PDF' ? 'Nuevo PDF' : 'Nuevo Recurso'}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept={acceptType === 'IMAGEN' ? 'image/*' : acceptType === 'VIDEO' ? 'video/*' : acceptType === 'PDF' ? '.pdf' : '.pdf,.doc,.docx,.xls,.xlsx,image/*'}
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
                    {acceptType === 'IMAGEN' ? 'No se encontraron imágenes' : acceptType === 'PDF' ? 'No se encontraron PDFs' : 'No se encontraron recursos'}
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

      {/* Dialog de progreso de subida premium */}
      <Dialog
        open={uploadProgress !== null}
        disableEscapeKeyDown
        onClose={() => { }}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 4,
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box sx={{
            width: 70,
            height: 70,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.lightOpacity',
            color: 'primary.main',
            mb: 1
          }}>
            <i className="tabler-upload text-4xl animate-bounce" />
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {acceptType === 'VIDEO' ? 'Subiendo Video...' : 'Subiendo Archivo...'}
          </Typography>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadProgress ?? 0}
              sx={{
                height: 10,
                borderRadius: 5,
                [`& .MuiLinearProgress-bar`]: {
                  borderRadius: 5,
                  backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)',
                  backgroundSize: '1rem 1rem',
                  animation: 'progressBarStripes 1s linear infinite',
                  '@keyframes progressBarStripes': {
                    'from': { backgroundPosition: '1rem 0' },
                    'to': { backgroundPosition: '0 0' }
                  }
                }
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Este archivo es pesado y puede tardar unos minutos. Por favor, no cierres esta pestaña ni recargues la página.
          </Typography>
        </Box>
      </Dialog>
    </Dialog>
  )
}

export default MediaLibrary
