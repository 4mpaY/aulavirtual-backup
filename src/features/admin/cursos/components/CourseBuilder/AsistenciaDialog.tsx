import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Switch,
  Divider,
  IconButton
} from '@mui/material'
import { useSnackbar } from 'notistack'

import { useAsistenciasLeccion, useUpdateAsistenciasLeccion } from '../../hooks/useCursos'
import type { CursoLeccionResumen } from '../../entity/Curso'

interface AsistenciaDialogProps {
  open: boolean
  onClose: () => void
  cursoId: string
  leccion: CursoLeccionResumen | null
}

export function AsistenciaDialog({ open, onClose, cursoId, leccion }: AsistenciaDialogProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [asistencias, setAsistencias] = useState<Record<string, boolean>>({})

  const { data: alumnos, isLoading, isError } = useAsistenciasLeccion(
    cursoId,
    leccion?.id || ''
  )
  const updateMutation = useUpdateAsistenciasLeccion()

  useEffect(() => {
    if (alumnos) {
      const initialAsistencias: Record<string, boolean> = {}
      alumnos.forEach((al: any) => {
        initialAsistencias[al.usuarioId] = al.asistio
      })
      setAsistencias(initialAsistencias)
    }
  }, [alumnos])

  const handleToggle = (usuarioId: string) => {
    setAsistencias(prev => ({
      ...prev,
      [usuarioId]: !prev[usuarioId]
    }))
  }

  const handleSave = async () => {
    if (!leccion) return
    try {
      const dataToSave = Object.entries(asistencias).map(([usuarioId, asistio]) => ({
        usuario_id: usuarioId,
        asistio
      }))

      await updateMutation.mutateAsync({
        cursoId,
        leccionId: leccion.id,
        data: dataToSave
      })

      enqueueSnackbar('Control de asistencia guardado correctamente', { variant: 'success' })
      onClose()
    } catch (error: any) {
      enqueueSnackbar(error?.message || 'Error al guardar asistencias', { variant: 'error' })
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Control de Asistencia</Typography>
        <IconButton onClick={onClose} size="small">
          <i className="tabler-x" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ mb: 4 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            Lección
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="text.primary">
            {leccion?.titulo}
          </Typography>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Error al cargar la lista de alumnos.</Typography>
        ) : alumnos?.length === 0 ? (
          <Typography color="text.secondary">No hay alumnos inscritos en este curso.</Typography>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={2} mb={2} mt={4}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 56 }} />
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Alumno
                </Typography>
              </Box>
              <Box sx={{ width: 64, textAlign: 'center' }}>
                <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                  Asistió
                </Typography>
              </Box>
            </Box>
            <Divider />
            <List disablePadding>
            {alumnos?.map((alumno: any, index: number) => (
              <React.Fragment key={alumno.usuarioId}>
                <ListItem sx={{ px: 2 }}>
                  <ListItemAvatar>
                    <Avatar src={alumno.avatar} alt={alumno.nombre}>
                      {alumno.nombre.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${alumno.nombre} ${alumno.apellido}`}
                    secondary={alumno.correo}
                  />
                  <Box sx={{ width: 64, display: 'flex', justifyContent: 'center' }}>
                    <Switch
                      checked={!!asistencias[alumno.usuarioId]}
                      onChange={() => handleToggle(alumno.usuarioId)}
                      color="primary"
                    />
                  </Box>
                </ListItem>
                {index < alumnos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={updateMutation.isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading || isError || updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
