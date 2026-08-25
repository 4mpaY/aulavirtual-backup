'use client'

import React, { useMemo } from 'react'
import {
  Box,
  Card,
  CircularProgress,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress
} from '@mui/material'

import { useResumenAsistencias } from '../../hooks/useCursos'
import type { Curso } from '../../entity/Curso'

interface TabAsistenciasProps {
  cursoId: string
  curso: Curso
}

export function TabAsistencias({ cursoId, curso }: TabAsistenciasProps) {
  const { data: resumen, isLoading, isError } = useResumenAsistencias(cursoId)

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Typography color="error">Error al cargar el resumen de asistencias.</Typography>
      </Box>
    )
  }

  if (!resumen || resumen.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" py={8}>
        <i className="tabler-users" style={{ fontSize: '3rem', color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }} />
        <Typography color="text.secondary">No hay alumnos inscritos en este curso todavía.</Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Resumen de Asistencias
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aquí puedes ver el avance de asistencia de los estudiantes matriculados en <strong>{curso.titulo}</strong>.
          El porcentaje se calcula sobre el total de lecciones (clases) del curso.
        </Typography>
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell>Alumno</TableCell>
              <TableCell align="center">Asistencias</TableCell>
              <TableCell align="center">Faltas</TableCell>
              <TableCell align="center" sx={{ width: '30%' }}>Porcentaje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resumen.map((alumno: any) => (
              <TableRow key={alumno.usuarioId} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={alumno.avatar} alt={alumno.nombre} sx={{ width: 32, height: 32 }}>
                      {alumno.nombre.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {alumno.nombre} {alumno.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {alumno.correo}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="success.main" fontWeight={600}>
                    {alumno.clasesAsistidas}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" color="error.main" fontWeight={600}>
                    {alumno.clasesFaltadas}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box sx={{ flexGrow: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={alumno.porcentaje}
                        color={
                          alumno.porcentaje >= 70
                            ? 'success'
                            : alumno.porcentaje >= 40
                            ? 'warning'
                            : 'error'
                        }
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    <Typography variant="body2" fontWeight={600} sx={{ minWidth: 40 }}>
                      {alumno.porcentaje}%
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
