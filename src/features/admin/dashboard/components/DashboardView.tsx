'use client'



import { Grid, Card, CardContent, Typography, Box, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, LinearProgress } from '@mui/material'

import { useAdminDashboard } from '../hooks/useAdminDashboard'

const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: `${color}.main`, color: 'white' }}>
        <i className={`${icon} text-2xl`} />
      </Avatar>
      <Box>
        <Typography variant='caption' color='text.secondary'>{title}</Typography>
        <Typography variant='h5' sx={{ fontWeight: 600 }}>{value}</Typography>
      </Box>
    </CardContent>
  </Card>
)

export function DashboardView() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) return <LinearProgress />
  if (!data) return <Typography>Error cargando datos</Typography>

  const { resumen, pedidosRecientes, cursosPopulares, inscripcionesRecientes } = data

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title='Ventas Totales' 
          value={`S/ ${Number(resumen.ingresos).toFixed(2)}`} 
          icon='tabler-currency-dollar' 
          color='success' 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title='Estudiantes' 
          value={resumen.estudiantes} 
          icon='tabler-users' 
          color='primary' 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title='Profesores' 
          value={resumen.profesores} 
          icon='tabler-user-share' 
          color='info' 
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard 
          title='Cursos' 
          value={resumen.cursos} 
          icon='tabler-book' 
          color='warning' 
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <Box p={5} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' fontWeight={600}>Pedidos Recientes</Typography>
          </Box>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell># Pedido</TableCell>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedidosRecientes.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell><Typography color='primary' variant='body2'>#{String(p.numero_pedido).padStart(6, '0')}</Typography></TableCell>
                    <TableCell>{p.usuario.nombre} {p.usuario.apellido}</TableCell>
                    <TableCell>{p.moneda} {Number(p.total).toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={p.estado} 
                        size='small' 
                        variant='tonal' 
                        color={p.estado === 'COMPLETADO' ? 'success' : 'warning'} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <Box p={5}>
            <Typography variant='h6' fontWeight={600} gutterBottom>Cursos más Vendidos</Typography>
            <Box mt={4} display='flex' flexDirection='column' gap={4}>
              {cursosPopulares.map((c: any) => (
                <Box key={c.id} display='flex' alignItems='center' gap={3}>
                  <Avatar variant='rounded' src={c.miniatura || ''} sx={{ width: 40, height: 40 }} />
                  <Box flex={1} sx={{ minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>{c.titulo}</Typography>
                    <Typography variant='caption' color='text.secondary'>{c._count.inscripciones} inscripciones</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <Box p={5}>
            <Typography variant='h6' fontWeight={600} gutterBottom>Últimas Inscripciones</Typography>
            <Box mt={2} display='flex' gap={4} overflow='auto' pb={2}>
              {inscripcionesRecientes.map((ins: any) => (
                <Card key={ins.id} variant='outlined' sx={{ minWidth: 200, flexShrink: 0, p: 3, bgcolor: 'action.hover' }}>
                  <Box display='flex' alignItems='center' gap={2} mb={2}>
                    <Avatar src={ins.usuario.avatar || ''} sx={{ width: 32, height: 32 }}>{ins.usuario.nombre[0]}</Avatar>
                    <Typography variant='body2' fontWeight={600}>{ins.usuario.nombre}</Typography>
                  </Box>
                  <Typography variant='caption' color='text.secondary' display='block' sx={{ minHeight: 40 }}>
                    Se inscribió en: <strong>{ins.curso.titulo}</strong>
                  </Typography>
                  <Typography variant='caption' sx={{ fontSize: '10px' }} color='text.disabled'>
                    {new Date(ins.inscrito_en).toLocaleString()}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
