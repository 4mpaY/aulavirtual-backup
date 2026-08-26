'use client'

import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Tooltip,
  Stack
} from '@mui/material'

import { useAdminDashboard } from '../hooks/useAdminDashboard'
import HydratedDate from '@/utils/components/HydratedDate'

const ESTADO_COLOR_MAP: Record<string, 'warning' | 'info' | 'success' | 'secondary' | 'error'> = {
  PENDIENTE: 'warning',
  PROCESANDO: 'info',
  COMPLETADO: 'success',
  CANCELADO: 'secondary',
  REEMBOLSADO: 'error'
}

const formatMoneda = (value: number) => `S/ ${Number(value).toFixed(2)}`

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  color: string
  subtitle?: string
  trend?: number
}

const StatCard = ({ title, value, icon, color, subtitle, trend }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
      <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: `${color}.main`, color: 'white', flexShrink: 0 }}>
        <i className={`${icon} text-2xl`} />
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant='caption' color='text.secondary'>
          {title}
        </Typography>
        <Typography variant='h5' sx={{ fontWeight: 600, lineHeight: 1.4 }} noWrap>
          {value}
        </Typography>
        {subtitle && (
          <Stack direction='row' alignItems='center' gap={1}>
            {typeof trend === 'number' && (
              <Chip
                size='small'
                variant='tonal'
                color={trend >= 0 ? 'success' : 'error'}
                icon={<i className={trend >= 0 ? 'tabler-trending-up' : 'tabler-trending-down'} />}
                label={`${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`}
                sx={{ height: 20, '& .MuiChip-label': { px: 1.5, fontSize: '0.7rem' } }}
              />
            )}
            <Typography variant='caption' color='text.secondary'>
              {subtitle}
            </Typography>
          </Stack>
        )}
      </Box>
    </CardContent>
  </Card>
)

interface DashboardViewProps {
  initialData?: any
}

export function DashboardView({ initialData }: DashboardViewProps) {
  const { data, isLoading } = useAdminDashboard(initialData)

  if (isLoading) return <LinearProgress />
  if (!data) return <Typography>Error cargando datos</Typography>

  const { 
    resumen = {} as any, 
    ventasPorMes = [], 
    pedidosRecientes = [], 
    cursosPopulares = [], 
    inscripcionesRecientes = [] 
  } = data || {}

  let maxVenta = 1;
  let maxInscripciones = 1;

  try {
    maxVenta = Math.max(...ventasPorMes.map((v: any) => v.total), 1)
    maxInscripciones = Math.max(...cursosPopulares.map((c: any) => c._count.inscripciones), 1)
  } catch (e: any) {
    console.error('Error in DashboardView render calculations:', e);
    
return <Typography color="error">Error en cálculos: {e.message}</Typography>;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Ingresos del Mes'
          value={formatMoneda(resumen.ingresosMesActual)}
          icon='tabler-currency-dollar'
          color='success'
          subtitle='vs. mes anterior'
          trend={resumen.crecimientoIngresos}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Ingresos Totales'
          value={formatMoneda(resumen.ingresos)}
          icon='tabler-cash'
          color='primary'
          subtitle={`Ticket prom. ${formatMoneda(resumen.ticketPromedio)}`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Estudiantes'
          value={resumen.estudiantes}
          icon='tabler-users'
          color='info'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title='Profesores'
          value={resumen.profesores}
          icon='tabler-user-share'
          color='secondary'
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title='Cursos'
          value={resumen.cursos}
          icon='tabler-book'
          color='warning'
          subtitle={`${resumen.cursosPublicados} publicados`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title='Pedidos Pendientes'
          value={resumen.pedidosPendientes}
          icon='tabler-clock-hour-4'
          color='warning'
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title='Certificados Emitidos'
          value={resumen.certificadosEmitidos}
          icon='tabler-certificate'
          color='success'
        />
      </Grid>

      <Grid item xs={12} md={8}>
        <Card sx={{ height: '100%' }}>
          <Box p={5}>
            <Typography variant='h6' fontWeight={600}>
              Ventas de los Últimos 6 Meses
            </Typography>
            <Box
              mt={6}
              display='flex'
              alignItems='flex-end'
              justifyContent='space-between'
              gap={3}
              sx={{ height: 180 }}
            >
              {ventasPorMes.map((v: any) => (
                <Box
                  key={v.mes}
                  flex={1}
                  display='flex'
                  flexDirection='column'
                  alignItems='center'
                  justifyContent='flex-end'
                  sx={{ height: '100%' }}
                >
                  <Tooltip title={formatMoneda(v.total)} arrow placement='top'>
                    <Box
                      sx={{
                        width: '60%',
                        maxWidth: 40,
                        height: `${Math.max((v.total / maxVenta) * 100, 3)}%`,
                        bgcolor: 'primary.main',
                        borderRadius: '6px 6px 0 0',
                        transition: 'opacity 0.2s',
                        cursor: 'default',
                        '&:hover': { opacity: 0.8 }
                      }}
                    />
                  </Tooltip>
                  <Typography variant='caption' color='text.secondary' mt={2} sx={{ textTransform: 'capitalize' }}>
                    {v.mes}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
          <Box p={5}>
            <Typography variant='h6' fontWeight={600} gutterBottom>
              Cursos más Vendidos
            </Typography>
            <Box mt={4} display='flex' flexDirection='column' gap={4}>
              {cursosPopulares.map((c: any) => (
                <Box key={c.id} display='flex' alignItems='center' gap={3}>
                  <Avatar variant='rounded' src={c.miniatura || ''} sx={{ width: 40, height: 40 }} />
                  <Box flex={1} sx={{ minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>
                      {c.titulo}
                    </Typography>
                    <Box display='flex' alignItems='center' gap={2}>
                      <LinearProgress
                        variant='determinate'
                        value={(c._count.inscripciones / maxInscripciones) * 100}
                        sx={{ flex: 1, height: 6, borderRadius: 3 }}
                      />
                      <Typography variant='caption' color='text.secondary' sx={{ flexShrink: 0 }}>
                        {c._count.inscripciones}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <Box p={5} display='flex' justifyContent='space-between' alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
              Pedidos Recientes
            </Typography>
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
                    <TableCell>
                      <Typography color='primary' variant='body2'>
                        #{String(p.numero_pedido).padStart(6, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {p.usuario.nombre} {p.usuario.apellido}
                    </TableCell>
                    <TableCell>
                      {p.moneda} {Number(p.total).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.estado}
                        size='small'
                        variant='tonal'
                        color={ESTADO_COLOR_MAP[p.estado] || 'secondary'}
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
            <Typography variant='h6' fontWeight={600} gutterBottom>
              Últimas Inscripciones
            </Typography>
            <Box mt={4} display='flex' flexDirection='column' gap={4}>
              {inscripcionesRecientes.map((ins: any) => (
                <Box key={ins.id} display='flex' alignItems='center' gap={3}>
                  <Avatar src={ins.usuario.avatar || ''} sx={{ width: 36, height: 36 }}>
                    {ins.usuario.nombre[0]}
                  </Avatar>
                  <Box flex={1} sx={{ minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>
                      {ins.usuario.nombre}
                    </Typography>
                    <Typography variant='caption' color='text.secondary' noWrap display='block'>
                      {ins.curso.titulo}
                    </Typography>
                  </Box>
                  <Typography variant='caption' color='text.disabled' sx={{ flexShrink: 0 }}>
                    <HydratedDate date={ins.inscrito_en} />
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  )
}
