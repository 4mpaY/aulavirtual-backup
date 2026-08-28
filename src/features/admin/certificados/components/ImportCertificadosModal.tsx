'use client'

import React, { useRef, useState } from 'react'

import {
  Alert, Box, Button, Chip, CircularProgress, Divider,
  Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, TextField, LinearProgress, IconButton
} from '@mui/material'
import * as XLSX from 'xlsx'

import { toast } from 'react-toastify'

import { getSession } from 'next-auth/react'

import { AxiosCertificado } from '../http/axiosCertificado'
import AppModal from '@/utils/components/AppModal'

type Step = 'upload' | 'preview' | 'result'

export function ImportCertificadosModal({ open, onClose, onSuccess }: any) {
  const [step, setStep] = useState<Step>('upload')
  const [data, setData] = useState<any[]>([])
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generadosCount, setGeneradosCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    if (loading) return
    setStep('upload')
    setData([])
    setProgress(0)
    setGeneradosCount(0)
    onClose()
  }

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{
      nombres: 'Juan Carlos',
      apellidos: 'Perez Gomez',
      numero_documento: '12345678',
      correo: 'juan@example.com',
      licencia: 'A-1',
      equipo_opera: 'Montacargas',
      empresa: 'Constructora S.A.',
      ciudad_pais: 'Lima - Perú',
      foto_auto: 'https://ejemplo.com/foto.jpg',
      nombre_curso: 'Curso de React',
      duracion: '40 horas',
      fecha_inicio: '01/01/2023',
      fecha_culminacion: '01/02/2023',
      fecha_emision: '05/02/2023'
    }])

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla')
    XLSX.writeFile(wb, 'plantilla_certificados.xlsx')
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = (evt) => {
      const bstr = evt.target?.result
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true, dateNF: 'dd/mm/yyyy' })
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      const parsedData = XLSX.utils.sheet_to_json(ws, { raw: false })
      
      const normalizedData = parsedData.map((row: any) => ({
        nombres: row.nombres || '',
        apellidos: row.apellidos || '',
        numero_documento: row.numero_documento || '',
        correo: row.correo || '',
        licencia: row.licencia || '',
        equipo_opera: row.equipo_opera || '',
        empresa: row.empresa || '',
        ciudad_pais: row.ciudad_pais || '',
        foto_auto: row.foto_auto || '',
        nombre_curso: row.nombre_curso || '',
        duracion: row.duracion || '',
        fecha_inicio: row.fecha_inicio || '',
        fecha_culminacion: row.fecha_culminacion || '',
        fecha_emision: row.fecha_emision || '',
        errores: [] // To track errors per row if needed
      }))

      setData(normalizedData)
      setStep('preview')
    }

    reader.readAsBinaryString(file)
  }

  const handleFile = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) return
    parseFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]

    if (file) handleFile(file)
  }

  const handleChange = (index: number, field: string, value: string) => {
    const newData = [...data]

    newData[index][field] = value
    setData(newData)
  }

  const handleDelete = (index: number) => {
    const newData = [...data]

    newData.splice(index, 1)
    setData(newData)
  }

  const handleAdd = () => {
    setData([...data, {
      nombres: '', apellidos: '', numero_documento: '', correo: '', licencia: '',
      equipo_opera: '', empresa: '', ciudad_pais: '', foto_auto: '',
      nombre_curso: '', duracion: '',
      fecha_inicio: '', fecha_culminacion: '', fecha_emision: ''
    }])
  }

  const handleGenerate = async () => {
    if (data.length === 0) return toast.warning('No hay datos para generar')
    
    // validación básica
    for (let i = 0; i < data.length; i++) {
       const row = data[i]

       if (!row.nombres || !row.apellidos || !row.nombre_curso) {
           return toast.error(`Fila ${i + 1}: Nombres, apellidos y curso son obligatorios.`)
       }
    }

    setLoading(true)
    setProgress(0)

    try {
      const getAuthToken = async () => {
        const s = await getSession()

        
return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })

      // 1. Create certificates in DB
      toast.info('Creando registros en la base de datos...')
      const res = await axiosCertificado.importarMasivo(data)
      const generados = res.generados || []

      if (generados.length === 0) {
        toast.warning('No se generaron certificados.')
        setLoading(false)
        
return
      }

      setGeneradosCount(generados.length)
      setStep('result')
      
      // Ya no generamos el zip aquí
      toast.success('Certificados subidos correctamente')
      
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error(error)
      toast.error('Error al generar los certificados')
      setStep('preview') // volver si hubo error critico
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppModal open={open} handleClose={handleClose} sx={{ '& .MuiDialog-paper': { maxWidth: 1200, width: '100%' } }}>
      {/* PASO 1: Upload */}
      {step === 'upload' && (
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' fontWeight={700}>Importar Certificados desde Excel</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              Sube un archivo .xlsx con los datos de los certificados. Se crearán usuarios y cursos fantasma si no existen.
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
            <i className='tabler-file-spreadsheet' style={{ fontSize: 48, color: '#25927F', marginBottom: 8 }} />
            <Typography variant='subtitle1' fontWeight={600}>Arrastra tu archivo aquí</Typography>
            <Typography variant='body2' color='text.secondary'>o haz clic para seleccionar (.xlsx, .xls)</Typography>
            <input
              ref={fileInputRef}
              type='file'
              accept='.xlsx,.xls'
              style={{ display: 'none' }}
              onChange={e => { if (e.target.files?.[0]) { handleFile(e.target.files[0]); e.target.value = '' } }}
            />
          </Box>

          <Divider>o</Divider>

          <Stack direction='row' spacing={2} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              startIcon={<i className='tabler-download' />}
              onClick={handleDownloadTemplate}
            >
              Descargar Plantilla
            </Button>
          </Stack>

          <Alert severity='info' sx={{ borderRadius: 2 }}>
            <strong>Columnas requeridas:</strong> nombres, apellidos, nombre_curso<br />
            <strong>Opcionales:</strong> duracion, fecha_inicio, fecha_culminacion, fecha_emision (Formato DD/MM/YYYY)
          </Alert>
        </Stack>
      )}

      {/* PASO 2: Vista previa */}
      {step === 'preview' && (
        <Stack spacing={3}>
          <Box>
            <Typography variant='h5' fontWeight={700}>Vista Previa</Typography>
            <Stack direction='row' spacing={1.5} sx={{ mt: 1 }}>
              <Chip label={`${data.length} registros`} color='info' size='small' variant='tonal' />
            </Stack>
          </Box>

          <TableContainer sx={{ maxHeight: 400, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombres</TableCell>
                  <TableCell>Apellidos</TableCell>
                  <TableCell>DNI</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Licencia</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Empresa</TableCell>
                  <TableCell>Ciudad/País</TableCell>
                  <TableCell>Foto Auto (URL)</TableCell>
                  <TableCell>Fecha Inicio</TableCell>
                  <TableCell>Fecha Fin</TableCell>
                  <TableCell>Fecha Emisión</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell><TextField size="small" value={row.nombres} onChange={e => handleChange(idx, 'nombres', e.target.value)} sx={{ minWidth: 160 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.apellidos} onChange={e => handleChange(idx, 'apellidos', e.target.value)} sx={{ minWidth: 160 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.numero_documento} onChange={e => handleChange(idx, 'numero_documento', e.target.value)} sx={{ minWidth: 100 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.correo} onChange={e => handleChange(idx, 'correo', e.target.value)} sx={{ minWidth: 160 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.nombre_curso} onChange={e => handleChange(idx, 'nombre_curso', e.target.value)} sx={{ minWidth: 220 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.duracion} onChange={e => handleChange(idx, 'duracion', e.target.value)} sx={{ minWidth: 100 }}/></TableCell>
                    <TableCell><TextField size="small" value={row.licencia} onChange={e => handleChange(idx, 'licencia', e.target.value)} sx={{ minWidth: 100 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.equipo_opera} onChange={e => handleChange(idx, 'equipo_opera', e.target.value)} sx={{ minWidth: 100 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.empresa} onChange={e => handleChange(idx, 'empresa', e.target.value)} sx={{ minWidth: 100 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.ciudad_pais} onChange={e => handleChange(idx, 'ciudad_pais', e.target.value)} sx={{ minWidth: 120 }} /></TableCell>
                    <TableCell><TextField size="small" value={row.foto_auto} onChange={e => handleChange(idx, 'foto_auto', e.target.value)} sx={{ minWidth: 150 }} /></TableCell>
                    <TableCell>
                      <TextField size="small" placeholder="DD/MM/YYYY" value={row.fecha_inicio} onChange={e => handleChange(idx, 'fecha_inicio', e.target.value)} sx={{ minWidth: 150 }} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" placeholder="DD/MM/YYYY" value={row.fecha_culminacion} onChange={e => handleChange(idx, 'fecha_culminacion', e.target.value)} sx={{ minWidth: 150 }} />
                    </TableCell>
                    <TableCell>
                      <TextField size="small" placeholder="DD/MM/YYYY" value={row.fecha_emision} onChange={e => handleChange(idx, 'fecha_emision', e.target.value)} sx={{ minWidth: 150 }} />
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(idx)} size="small">
                        <i className="tabler-trash" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction='row' justifyContent='space-between'>
            <Button variant='outlined' color='secondary' onClick={() => setStep('upload')}
              startIcon={<i className='tabler-arrow-left' />}
            >
              Volver
            </Button>
            <Stack direction="row" spacing={2}>
               <Button onClick={handleAdd} startIcon={<i className="tabler-plus" />}>
                 Añadir Fila
               </Button>
               <Button
                 variant='contained'
                 disabled={data.length === 0 || loading}
                 onClick={handleGenerate}
                 startIcon={<i className='tabler-upload' />}
               >
                 Subir datos
               </Button>
            </Stack>
          </Stack>
        </Stack>
      )}

      {/* PASO 3: Resultado / Progreso */}
      {step === 'result' && (
        <Stack spacing={3} sx={{ py: 4, textAlign: 'center', alignItems: 'center' }}>
           {loading ? (
             <>
               <CircularProgress size={64} thickness={4} color="primary" sx={{ mb: 2 }} />
               <Typography variant='h5' fontWeight={700}>Generando PDFs y Comprimiendo...</Typography>
               <Typography variant='body1' color='text.secondary'>
                 Por favor, no cierres esta ventana. {Math.round(progress)}% completado.
               </Typography>
               <Box sx={{ width: '80%', mt: 3 }}>
                 <LinearProgress variant="determinate" value={progress} />
               </Box>
             </>
           ) : (
             <>
               <i className='tabler-circle-check' style={{ fontSize: 72, color: '#28c76f' }} />
               <Typography variant='h4' fontWeight={700} sx={{ mt: 2 }}>¡Proceso Terminado!</Typography>
               <Typography variant='body1' color='text.secondary' sx={{ mb: 3 }}>
                 Se crearon {generadosCount} certificados exitosamente en la base de datos.
               </Typography>
               <Button variant="contained" onClick={handleClose} size="large">
                 Cerrar y ver tabla
               </Button>
             </>
           )}
        </Stack>
      )}
    </AppModal>
  )
}
