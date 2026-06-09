'use client'

import { useMemo, useCallback, useState } from 'react'

import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  Chip,
  Box,
  MenuItem,
  TablePagination,
  Button,
  Tooltip
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel
} from '@tanstack/react-table'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import HydratedDate from '@/utils/components/HydratedDate'
import { useSuscripcionesAdmin, useCancelarSuscripcionAdmin, useSyncSuscripciones } from '../hooks/useSuscripcionesAdmin'
import type { SuscripcionAdmin, EstadoSuscripcion } from '../entity/Suscripcion'
import { INTERVALO_LABELS } from '@/features/admin/planes-suscripcion/entity/PlanSuscripcion'

const columnHelper = createColumnHelper<SuscripcionAdmin>()

const ESTADO_CONFIG: Record<EstadoSuscripcion, { label: string; color: 'success' | 'error' | 'warning' | 'secondary' | 'info' }> = {
  ACTIVA:    { label: 'Activa', color: 'success' },
  EN_PRUEBA: { label: 'En Prueba', color: 'info' },
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  VENCIDA:   { label: 'Vencida', color: 'error' },
  CANCELADA: { label: 'Cancelada', color: 'secondary' }
}

export function SuscripcionesAdminPage() {
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const { data, isLoading } = useSuscripcionesAdmin(estadoFiltro ? { estado: estadoFiltro } : {})
  const cancelar = useCancelarSuscripcionAdmin()
  const sync = useSyncSuscripciones()

  const suscripciones = data?.suscripciones ?? []

  const handleCancelar = useCallback(async (sub: SuscripcionAdmin) => {
    const result = await Swal.fire({
      title: '¿Cancelar suscripción?',
      text: `Cancelar la suscripción de ${sub.usuario.nombre} ${sub.usuario.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    })

    if (result.isConfirmed) {
      try {
        await cancelar.mutateAsync(sub.id)
        toast.success('Suscripción cancelada')
      } catch (err: any) {
        toast.error(err?.message || 'Error al cancelar')
      }
    }
  }, [cancelar])

  const columns = useMemo(() => [
    columnHelper.accessor('usuario', {
      header: 'Estudiante',
      cell: ({ row }) => (
        <Box>
          <Typography variant='body2' fontWeight={600}>
            {row.original.usuario.nombre} {row.original.usuario.apellido}
          </Typography>
          <Typography variant='caption' color='text.secondary'>{row.original.usuario.correo}</Typography>
        </Box>
      )
    }),
    columnHelper.accessor('plan', {
      header: 'Plan',
      cell: ({ row }) => (
        <Box>
          <Typography variant='body2' fontWeight={600}>{row.original.plan.nombre}</Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.original.plan.moneda === 'PEN' ? 'S/' : '$'} {Number(row.original.plan.precio).toFixed(2)} / {INTERVALO_LABELS[row.original.plan.intervalo as keyof typeof INTERVALO_LABELS]}
          </Typography>
        </Box>
      )
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: ({ row }) => {
        const cfg = ESTADO_CONFIG[row.original.estado] ?? { label: row.original.estado, color: 'secondary' as const }

        return <Chip label={cfg.label} color={cfg.color} size='small' />
      }
    }),
    columnHelper.accessor('fecha_proximo_cobro', {
      header: 'Próximo Cobro',
      cell: ({ row }) => {
        const { estado, fecha_proximo_cobro } = row.original
        const mostrar = ['ACTIVA', 'EN_PRUEBA'].includes(estado) && fecha_proximo_cobro

        return (
          <Typography variant='body2' color='text.secondary'>
            {mostrar ? <HydratedDate date={fecha_proximo_cobro!} format='date' /> : '—'}
          </Typography>
        )
      }
    }),
    columnHelper.accessor('_count', {
      header: 'Pagos',
      cell: ({ row }) => (
        <Typography variant='body2'>{row.original._count.pagos}</Typography>
      )
    }),
    columnHelper.accessor('creado_en', {
      header: 'Desde',
      cell: ({ row }) => (
        <Typography variant='body2' color='text.secondary'>
          <HydratedDate date={row.original.creado_en} format='date' />
        </Typography>
      )
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        row.original.estado === 'ACTIVA' || row.original.estado === 'EN_PRUEBA' ? (
          <IconButton onClick={() => handleCancelar(row.original)} size='small' color='error' title='Cancelar'>
            <i className='tabler-x' />
          </IconButton>
        ) : null
      )
    })
  ], [handleCancelar])

  const table = useReactTable({
    data: suscripciones,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } }
  })

  if (isLoading) return <Card><Box p={6}>Cargando suscripciones...</Box></Card>

  if (isError) {
    const msg = (error as any)?.message || JSON.stringify(error) || 'Error desconocido'

    return (
      <Card>
        <Box p={6}>
          <Typography color='error' fontWeight={600} mb={1}>Error al cargar suscripciones</Typography>
          <Typography variant='body2' color='text.secondary' sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{msg}</Typography>
        </Box>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Suscripciones'
        className='pbe-4'
        action={
          <Tooltip title='Consulta Culqi y registra pagos nuevos'>
            <Button
              variant='outlined'
              size='small'
              startIcon={<i className='tabler-refresh' />}
              onClick={() =>
                sync.mutateAsync()
                  .then(r => toast.success(`Sincronizado: ${r.pagosNuevos} pagos nuevos, ${r.estadosActualizados} estados actualizados`))
                  .catch(e => toast.error(e?.message || 'Error al sincronizar'))
              }
              disabled={sync.isPending}
            >
              {sync.isPending ? 'Sincronizando...' : 'Sincronizar con Culqi'}
            </Button>
          </Tooltip>
        }
      />
      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className='is-[70px]'
        >
          <MenuItem value='20'>20</MenuItem>
          <MenuItem value='50'>50</MenuItem>
        </CustomTextField>
        <CustomTextField
          select
          value={estadoFiltro}
          onChange={e => setEstadoFiltro(e.target.value)}
          className='is-[160px]'
          label='Estado'
        >
          <MenuItem value=''>Todos</MenuItem>
          <MenuItem value='ACTIVA'>Activa</MenuItem>
          <MenuItem value='VENCIDA'>Vencida</MenuItem>
          <MenuItem value='CANCELADA'>Cancelada</MenuItem>
          <MenuItem value='EN_PRUEBA'>En Prueba</MenuItem>
        </CustomTextField>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id}>
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
            {suscripciones.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay suscripciones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={suscripciones.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        rowsPerPageOptions={[20, 50]}
        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  )
}
