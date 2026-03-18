import { useState } from 'react'
import type { FC, SyntheticEvent } from 'react'

import {
  Box,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Button
} from '@mui/material'
import type { Rol } from '@prisma/client'

import AppModal from '@/utils/components/AppModal'

import { useUsuario } from '../hooks/useUsuarios'

interface UsuarioDetallesModalProps {
  open: boolean
  handleClose: () => void
  usuarioId: string | null
}

const rolLabels: { [key in Rol]: string } = {
  ADMIN: 'Administrador',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Estudiante'
}

const UsuarioDetallesModal: FC<UsuarioDetallesModalProps> = ({ open, handleClose, usuarioId }) => {
  const [activeTab, setActiveTab] = useState(0)
  const { data: usuario, isLoading } = useUsuario(usuarioId || '')

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  if (isLoading) {
    return (
      <AppModal open={open} handleClose={handleClose}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 300, gap: 2 }}>
          <CircularProgress />
          <Typography>Cargando detalles...</Typography>
        </Box>
      </AppModal>
    )
  }

  if (!usuario) return null

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
        <Avatar
          src={usuario.avatar || undefined}
          sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}
          imgProps={{ referrerPolicy: 'no-referrer' }}
        >
          {usuario.nombre.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            {usuario.nombre} {usuario.apellido}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Chip label={rolLabels[usuario.rol]} size='small' color='primary' variant='tonal' />
            <Chip
              label={usuario.esta_activo ? 'Activo' : 'Inactivo'}
              size='small'
              color={usuario.esta_activo ? 'success' : 'secondary'}
              variant='tonal'
            />
          </Box>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tab label='Perfil' />
        <Tab label='Inscripciones' disabled={usuario.rol === 'ADMIN'} />
        <Tab label='Cursos Dictados' disabled={usuario.rol !== 'PROFESOR' && usuario.rol !== 'ADMIN'} />
      </Tabs>

      <Box sx={{ minHeight: 300 }}>
        {/* TAB: Perfil */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 600 }}>CORREO</Typography>
              <Typography variant='body1'>{usuario.correo}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 600 }}>DNI / DOCUMENTO</Typography>
              <Typography variant='body1'>{usuario.numero_documento}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 600 }}>CELULAR</Typography>
              <Typography variant='body1'>{usuario.celular || 'No registrado'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 600 }}>FECHA DE REGISTRO</Typography>
              <Typography variant='body1'>{new Date(usuario.creado_en).toLocaleDateString()}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 600 }}>BIOGRAFÍA</Typography>
              <Typography variant='body1' sx={{ mt: 1, fontStyle: usuario.biografia ? 'normal' : 'italic' }}>
                {usuario.biografia || 'Sin biografía redactada.'}
              </Typography>
            </Grid>
          </Grid>
        )}

        {/* TAB: Inscripciones */}
        {activeTab === 1 && (
          <Box>
            {usuario.inscripciones && usuario.inscripciones.length > 0 ? (
              <List sx={{ pt: 0 }}>
                {usuario.inscripciones.map((insc, index) => (
                  <Box key={insc.id}>
                    {index > 0 && <Divider variant='inset' component='li' />}
                    <ListItem alignItems='flex-start' sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                        <i className='tabler-book text-2xl text-primary' />
                      </ListItemIcon>
                      <ListItemText
                        primary={insc.curso.titulo}
                        secondary={
                          <>
                            <Typography component='span' variant='body2' color='text.primary'>
                              Estado: {insc.estado}
                            </Typography>
                            {` — Inscrito el ${new Date(insc.inscrito_en).toLocaleDateString()}`}
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <i className='tabler-mood-empty text-5xl text-textDisabled' />
                <Typography sx={{ mt: 2 }} color='text.secondary'>Este usuario no tiene inscripciones activas.</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* TAB: Cursos Dictados */}
        {activeTab === 2 && (
          <Box>
            {usuario.cursos_dictados && usuario.cursos_dictados.length > 0 ? (
              <List sx={{ pt: 0 }}>
                {usuario.cursos_dictados.map((curso, index) => (
                  <Box key={curso.id}>
                    {index > 0 && <Divider variant='inset' component='li' />}
                    <ListItem alignItems='flex-start' sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                        <i className='tabler-school text-2xl text-warning' />
                      </ListItemIcon>
                      <ListItemText
                        primary={curso.titulo}
                        secondary={
                          <>
                            <Typography component='span' variant='body2' color='text.primary'>
                              Estado: {curso.estado}
                            </Typography>
                            {` — Creado el ${new Date(curso.creado_en).toLocaleDateString()}`}
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <i className='tabler-mood-empty text-5xl text-textDisabled' />
                <Typography sx={{ mt: 2 }} color='text.secondary'>Este usuario no tiene cursos asignados como profesor.</Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='tonal' color='secondary' onClick={handleClose}>
          Cerrar
        </Button>
      </Box>
    </AppModal>
  )
}

export default UsuarioDetallesModal
