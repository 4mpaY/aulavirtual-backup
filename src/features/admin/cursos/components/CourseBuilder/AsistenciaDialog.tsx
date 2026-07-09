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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Lección: <strong>{leccion?.titulo}</strong>
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Error al cargar la lista de alumnos.</Typography>
        ) : alumnos?.length === 0 ? (
          <Typography color="text.secondary">No hay alumnos inscritos en este curso.</Typography>
        ) : (
          <List disablePadding>
            {alumnos?.map((alumno: any, index: number) => (
              <React.Fragment key={alumno.usuarioId}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={alumno.avatar} alt={alumno.nombre}>
                      {alumno.nombre.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${alumno.nombre} ${alumno.apellido}`}
                    secondary={alumno.correo}
                  />
                  <Switch
                    edge="end"
                    checked={!!asistencias[alumno.usuarioId]}
                    onChange={() => handleToggle(alumno.usuarioId)}
                    color="primary"
                  />
                </ListItem>
                {index < alumnos.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
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
