import { useState } from 'react'

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material'

import AppModal from '@/utils/components/AppModal'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'

import * as XLSX from 'xlsx'

import { useCursoAlumnos } from '../hooks/useCursoAlumnos'

interface CourseStudentsModalProps {
  open: boolean
  handleClose: () => void
  cursoId: string | null
  cursoTitulo: string | null
}

const estadoLabel: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  ACTIVO: 'Activo',
  COMPLETADO: 'Completado',
  CANCELADO: 'Cancelado'
}

const estadoColor: Record<string, any> = {
  PENDIENTE: 'warning',
  ACTIVO: 'success',
  COMPLETADO: 'info',
  CANCELADO: 'error'
}

export default function CourseStudentsModal({
  open,
  handleClose,
  cursoId,
  cursoTitulo
}: CourseStudentsModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = useCursoAlumnos({
    cursoId: open ? cursoId : null,
    search: searchTerm
  })

  const handleCloseModal = () => {
    setSearchTerm('')
    handleClose()
  }

  const exportToExcel = () => {
    if (!data?.alumnos || data.alumnos.length === 0) return

    const exportData = data.alumnos.map((a: any) => {
      const baseObj: any = {
        'Nombres': a.nombre,
        'Apellidos': a.apellido,
        'Documento': a.numero_documento || 'No especificado',
        'Correo': a.correo,
        'Fecha Inscripción': new Date(a.inscrito_en).toLocaleDateString(),
        'Estado': estadoLabel[a.estado_inscripcion] || a.estado_inscripcion,
        'Evaluaciones': `${a.evaluaciones_realizadas}/${a.total_examenes}`,
      }

      // Separar "N1: 20.0, N2: 15.0" en columnas individuales "N1" y "N2"
      if (a.notas && a.notas !== 'Sin exámenes') {
        const notasArray = a.notas.split(', ')
        notasArray.forEach((notaItem: string) => {
          const [key, val] = notaItem.split(': ')
          if (key && val) {
            baseObj[`Nota ${key}`] = Number(val) // Convertimos a número para que Excel lo trate como número
          }
        })
      }

      baseObj['Promedio Final'] = Number(a.promedio)
      baseObj['Certificado'] = a.tiene_certificado ? 'Sí' : 'No'

      return baseObj
    })

    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Alumnos')
    XLSX.writeFile(workbook, `Alumnos_${cursoTitulo?.replace(/[^a-zA-Z0-9]/g, '_') || 'Curso'}.xlsx`)
  }

  return (
    <AppModal open={open} handleClose={handleCloseModal}>
      <Box sx={{ mb: 6 }}>
        <Typography variant='h5' fontWeight={700} gutterBottom>
          Alumnos Inscritos
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          Curso: {cursoTitulo}
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <DebouncedInput
          value={searchTerm}
          onChange={val => setSearchTerm(String(val))}
          placeholder='Buscar por nombre o documento...'
          style={{ width: '100%', maxWidth: '400px' }}
        />
        <Chip
          icon={<i className='tabler-file-spreadsheet text-xl' />}
          label='Exportar Excel'
          onClick={exportToExcel}
          color='success'
          variant='outlined'
          sx={{ cursor: 'pointer', fontWeight: 600, px: 1, py: 2.5 }}
          disabled={!data?.alumnos || data.alumnos.length === 0}
        />
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant='outlined'>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Progreso & Notas</TableCell>
                <TableCell>Certificado</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.alumnos || data.alumnos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align='center' sx={{ py: 4 }}>
                    <Typography variant='body2' color='text.secondary'>
                      {searchTerm ? 'No se encontraron alumnos con ese término de búsqueda.' : 'No hay alumnos inscritos en este curso.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.alumnos.map((alumno: any) => (
                  <TableRow key={alumno.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={alumno.avatar || ''} sx={{ width: 32, height: 32 }}>
                          {alumno.nombre[0]}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' fontWeight={600}>
                            {alumno.nombre} {alumno.apellido}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {alumno.correo}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2'>
                        {alumno.numero_documento || '-'}
                      </Typography>
                      <Typography variant='caption' color='text.secondary' display='block'>
                        {new Date(alumno.inscrito_en).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' fontWeight={600}>
                        {alumno.evaluaciones_realizadas}/{alumno.total_examenes} Evals. <Typography component="span" variant="body2" color="primary.main" fontWeight={700} ml={1}>Prom: {alumno.promedio}</Typography>
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {alumno.notas}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alumno.tiene_certificado ? 'Sí' : 'No'}
                        color={alumno.tiene_certificado ? 'success' : 'default'}
                        size='small'
                        variant={alumno.tiene_certificado ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estadoLabel[alumno.estado_inscripcion] || alumno.estado_inscripcion}
                        color={estadoColor[alumno.estado_inscripcion] || 'default'}
                        size='small'
                        variant='tonal'
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </AppModal>
  )
}
