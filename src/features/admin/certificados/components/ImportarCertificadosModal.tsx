'use client'

import { useRef, useState } from 'react'

import {
  Alert, Box, Button, Chip, CircularProgress,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tooltip, Typography
} from '@mui/material'

import AppModal from '@/utils/components/AppModal'
import { useImportarCertificados } from '../hooks/useCertificados'

type Step = 'upload' | 'preview' | 'result'

interface FilaPreview {
  file: File
  nombre: string
  tamanio: string
  errores: string[]
}

interface ImportarCertificadosModalProps {
  open: boolean
  handleClose: () => void
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  
return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default function ImportarCertificadosModal({ open, handleClose }: ImportarCertificadosModalProps) {
  const [step, setStep] = useState<Step>('upload')
  const [archivos, setArchivos] = useState<FilaPreview[]>([])
  const [dragging, setDragging] = useState(false)
  const [resultado, setResultado] = useState<{ exitosos: number; errores: { file: string; message: string }[] } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: importar, isPending } = useImportarCertificados()

  const handleClose_ = () => {
    setStep('upload')
    setArchivos([])
    setResultado(null)
    handleClose()
  }

  const validarArchivos = (fileList: FileList) => {
    const list: FilaPreview[] = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const errores: string[] = []

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        errores.push('Solo se permiten archivos PDF')
      }

      list.push({
        file,
        nombre: file.name,
        tamanio: formatBytes(file.size),
        errores
      })
    }

    setArchivos(prev => [...prev, ...list])
    setStep('preview')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files

    if (files && files.length > 0) {
      validarArchivos(files)
    }
  }

  const handleImportar = async () => {
    const validos = archivos.filter(a => a.errores.length === 0)

    if (validos.length === 0) return

    const formData = new FormData()

    validos.forEach(a => {
      formData.append('files', a.file)
    })

    try {
      const res = await importar(formData)

      setResultado(res)
      setStep('result')
    } catch (err: any) {
      setResultado({
        exitosos: 0,
        errores: [{ file: 'Todos', message: err.message || 'Error de conexión al importar' }]
      })
      setStep('result')
    }
  }

  const validos = archivos.filter(a => a.errores.length === 0)
  const invalidos = archivos.filter(a => a.errores.length > 0)

  return (
    <AppModal open={open} handleClose={handleClose_} sx={{ maxWidth: 720 }}>
      {/* PASO 1: Upload */}
      {step === 'upload' && (
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' fontWeight={700}>Importar Certificados (PDF)</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Sube uno o más archivos PDF correspondientes a certificados existentes en la plataforma.
              El nombre del archivo debe corresponder al código de verificación del certificado (ej. <code>CURSO-20260717-DNI-01.pdf</code>).
            </Typography>
          </Box>

          {/* Zona drag & drop */}
          <Box
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed',
              borderColor: dragging ? 'primary.main' : 'divider',
              borderRadius: 3,
              p: 5,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: dragging ? 'primary.lighterOpacity' : 'action.hover',
              transition: 'all 0.2s',
              '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighterOpacity' }
            }}
          >
            <i className='tabler-file-type-pdf' style={{ fontSize: 48, color: '#EA4335', marginBottom: 8 }} />
            <Typography variant='subtitle1' fontWeight={600}>Arrastra tus archivos aquí</Typography>
            <Typography variant='body2' color='text.secondary'>o haz clic para seleccionar (múltiples .pdf)</Typography>
            <input
              ref={fileInputRef}
              type='file'
              accept='.pdf'
              multiple
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files && e.target.files.length > 0) validarArchivos(e.target.files) }}
            />
          </Box>

          <Alert severity='info' sx={{ borderRadius: 2 }}>
            <strong>Importante:</strong> El sistema procesará cada PDF y reemplazará el certificado existente con el mismo código de verificación. Las versiones anteriores serán archivadas automáticamente y accesibles solo desde el panel de administración.
          </Alert>
        </Stack>
      )}

      {/* PASO 2: Vista previa */}
      {step === 'preview' && (
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' fontWeight={700}>Vista Previa de Archivos</Typography>
            <Stack direction='row' spacing={1.5} sx={{ mt: 1 }}>
              <Chip label={`${validos.length} válidos`} color='success' size='small' variant='tonal' />
              {invalidos.length > 0 && (
                <Chip label={`${invalidos.length} con errores`} color='error' size='small' variant='tonal' />
              )}
            </Stack>
          </Box>

          <TableContainer sx={{ maxHeight: 340, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Nombre de Archivo</TableCell>
                  <TableCell>Tamaño</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {archivos.map((a, idx) => (
                  <TableRow
                    key={idx}
                    sx={{ bgcolor: a.errores.length > 0 ? 'error.lighterOpacity' : undefined }}
                  >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{a.nombre}</TableCell>
                    <TableCell>{a.tamanio}</TableCell>
                    <TableCell>
                      {a.errores.length === 0 ? (
                        <Chip label='Listo' color='success' size='small' variant='tonal' />
                      ) : (
                        <Tooltip title={a.errores.join(' · ')} arrow>
                          <Chip label='Error' color='error' size='small' variant='tonal' sx={{ cursor: 'help' }} />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction='row' justifyContent='space-between'>
            <Button variant='outlined' color='secondary' onClick={() => { setStep('upload'); setArchivos([]) }}
              startIcon={<i className='tabler-arrow-left' />}
            >
              Volver
            </Button>
            <Button
              variant='contained'
              disabled={validos.length === 0 || isPending}
              onClick={handleImportar}
              startIcon={isPending ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-upload' />}
            >
              {isPending ? 'Importando...' : `Importar ${validos.length} certificado(s)`}
            </Button>
          </Stack>
        </Stack>
      )}

      {/* PASO 3: Resultado */}
      {step === 'result' && resultado && (
        <Stack spacing={3}>
          <Typography variant='h5' fontWeight={700}>Resultado de la Importación</Typography>

          <Stack direction='row' spacing={2}>
            <Alert severity='success' sx={{ flex: 1, borderRadius: 2 }}>
              <strong>{resultado.exitosos}</strong> certificados importados con éxito.
            </Alert>
            {resultado.errores.length > 0 && (
              <Alert severity='error' sx={{ flex: 1, borderRadius: 2 }}>
                <strong>{resultado.errores.length}</strong> errores encontrados.
              </Alert>
            )}
          </Stack>

          {resultado.errores.length > 0 && (
            <TableContainer sx={{ maxHeight: 260, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Table size='small' stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Archivo</TableCell>
                    <TableCell>Motivo del error</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultado.errores.map((e, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{e.file}</TableCell>
                      <TableCell>{e.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Stack direction='row' justifyContent='flex-end'>
            <Button variant='contained' onClick={handleClose_}>
              Cerrar
            </Button>
          </Stack>
        </Stack>
      )}
    </AppModal>
  )
}
