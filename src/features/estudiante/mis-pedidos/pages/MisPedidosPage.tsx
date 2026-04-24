'use client'

import { useMemo, useState, useRef } from 'react'

import {
  Card,
  CardHeader,
  Chip,
  Typography,
  Box,
  TablePagination,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import classnames from 'classnames'

import type { ColumnDef } from '@tanstack/react-table'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@core/components/mui/TextField'
import type { ThemeColor } from '@/@core/types'

import type { PedidoEstudiante } from '../entity/PedidoEstudiante'
import { useMisPedidos } from '../hooks/useMisPedidos'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import HydratedDate from '@/utils/components/HydratedDate'

type StatusType = {
  [key: string]: ThemeColor
}

const statusObj: StatusType = {
  PENDIENTE: 'warning',
  PROCESANDO: 'info',
  COMPLETADO: 'success',
  CANCELADO: 'secondary',
  REEMBOLSADO: 'error'
}

const columnHelper = createColumnHelper<PedidoEstudiante>()

interface MisPedidosPageProps {
  initialData?: PedidoEstudiante[]
}

export function MisPedidosPage({ initialData }: MisPedidosPageProps) {
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS')
  const { data, isLoading } = useMisPedidos(estadoFiltro !== 'TODOS' ? { estado: estadoFiltro } : undefined, initialData)
  const pedidos = data?.pedidos || []
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadPedidoId, setUploadPedidoId] = useState<string | null>(null)
  const [voucherFile, setVoucherFile] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleVoucherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return
    setVoucherFile(file)
    setVoucherPreview(URL.createObjectURL(file))
  }

  const handleUploadVoucher = async () => {
    if (!uploadPedidoId || !voucherFile) return

    try {
      setUploading(true)
      const session = await getSession()
      const token = (session?.user as any)?.accessToken
      const formData = new FormData()

      formData.append('voucher', voucherFile)

      const res = await fetch(`/api/pedidos/${uploadPedidoId}/voucher`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      const resData = await res.json()

      if (!res.ok) throw new Error(resData.message || 'Error al subir el comprobante')

      enqueueSnackbar('Comprobante enviado. El administrador verificará tu pago.', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['mis-pedidos'] })
      setUploadPedidoId(null)
      setVoucherFile(null)
      setVoucherPreview(null)
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Error al subir el comprobante', { variant: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const columns = useMemo<ColumnDef<PedidoEstudiante, any>[]>(
    () => [
      columnHelper.accessor('numero_pedido', {
        header: '# Pedido',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            #{String(row.original.numero_pedido).padStart(6, '0')}
          </Typography>
        )
      }),
      columnHelper.accessor('detalles', {
        header: 'Curso(s)',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            {row.original.detalles.map((detalle, index) => (
              <Typography key={index} variant='body2' color='text.primary'>
                {detalle.curso.titulo}
              </Typography>
            ))}
          </div>
        )
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {row.original.moneda} {Number(row.original.total).toFixed(2)}
          </Typography>
        )
      }),
      columnHelper.accessor('cupon', {
        header: 'Cupón Aplicado',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.cupon?.codigo ? (
              <Chip
                label={row.original.cupon.codigo}
                size='small'
                variant='outlined'
                color='primary'
                sx={{ fontWeight: 600 }}
              />
            ) : (
              '-'
            )}
          </Typography>
        )
      }),
      columnHelper.accessor('metodo_pago', {
        header: 'Método',
        cell: ({ row }) => (
          <Typography variant='body2' className='capitalize'>
             {row.original.metodo_pago ? row.original.metodo_pago.toLowerCase().replace('_', ' ') : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.estado}
            color={statusObj[row.original.estado]}
            size='small'
            className='font-medium'
          />
        )
      }),
      columnHelper.accessor('creado_en', {
        header: 'Fecha de Compra',
        cell: ({ row }) => (
          <Typography variant='body2'>
            <HydratedDate
              date={row.original.creado_en}
              format="date"
              options={{
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }}
            />
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'comprobante',
        header: 'Comprobante',
        cell: ({ row }) => {
          const p = row.original as any

          if (p.estado !== 'PENDIENTE' || !p.metodo_pago_manual_id) return null

          if (p.comprobante_url) {
            return (
              <Stack spacing={0.5}>
                <Chip label='En revisión' size='small' color='info' variant='tonal' />
                <Typography
                  variant='caption'
                  color='primary'
                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => window.open(p.comprobante_url, '_blank')}
                >
                  Ver voucher
                </Typography>
              </Stack>
            )
          }

          return (
            <Button
              size='small'
              variant='outlined'
              color='warning'
              startIcon={<i className='tabler-upload' style={{ fontSize: 14 }} />}
              onClick={() => setUploadPedidoId(p.id)}
              sx={{ fontSize: 11, px: 1 }}
            >
              Subir voucher
            </Button>
          )
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader title='Mis Pedidos' />
        <Box p={6}>Cargando historial de pedidos...</Box>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader title='Historial de Pedidos' />
      
      <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <div className='flex items-center gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>

          <CustomTextField
            select
            label='Filtrar por Estado'
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
            className='is-[200px]'
          >
            <MenuItem value='TODOS'>Todos</MenuItem>
            <MenuItem value='COMPLETADO'>Completados / Pagados</MenuItem>
            <MenuItem value='PENDIENTE'>Pendientes</MenuItem>
            <MenuItem value='CANCELADO'>Cancelados</MenuItem>
            <MenuItem value='REEMBOLSADO'>Reembolsados</MenuItem>
          </CustomTextField>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <i className='tabler-chevron-up text-xl ml-1' />,
                          desc: <i className='tabler-chevron-down text-xl ml-1' />
                        }[header.column.getIsSorted() as 'asc' | 'desc']}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-6'>
                  Aún no has realizado ninguna compra con nosotros.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={pedidos.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />

      {/* Modal para subir voucher tardío */}
      <Dialog open={!!uploadPedidoId} onClose={() => { setUploadPedidoId(null); setVoucherFile(null); setVoucherPreview(null) }} maxWidth='xs' fullWidth>
        <DialogTitle>Subir comprobante de pago</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity='info'>
              Sube una imagen clara de tu Yape o transferencia bancaria. El administrador verificará y activará tu acceso.
            </Alert>

            <input
              ref={fileInputRef}
              type='file'
              accept='image/jpeg,image/png,image/webp'
              style={{ display: 'none' }}
              onChange={handleVoucherFileChange}
            />

            {voucherPreview ? (
              <Stack spacing={1}>
                <Box component='img' src={voucherPreview} alt='Voucher' sx={{ maxWidth: '100%', maxHeight: 200, borderRadius: 2, border: '2px solid', borderColor: 'success.main' }} />
                <Button size='small' variant='text' onClick={() => { setVoucherFile(null); setVoucherPreview(null) }}>Cambiar imagen</Button>
              </Stack>
            ) : (
              <Box
                sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className='tabler-upload' style={{ fontSize: 32 }} />
                <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>Haz clic para seleccionar la imagen</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadPedidoId(null); setVoucherFile(null); setVoucherPreview(null) }} disabled={uploading}>Cancelar</Button>
          <Button variant='contained' onClick={handleUploadVoucher} disabled={!voucherFile || uploading} startIcon={uploading ? <CircularProgress size={16} /> : null}>
            {uploading ? 'Enviando...' : 'Enviar comprobante'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}
