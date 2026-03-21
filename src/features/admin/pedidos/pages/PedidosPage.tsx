'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Card,
  CardHeader,
  Chip,
  Typography,
  Box,
  TablePagination,
  Button,
  MenuItem
} from '@mui/material'
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
import type { Pedido } from '../entity/Pedido'
import { usePedidos } from '../hooks/usePedidos'
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

const columnHelper = createColumnHelper<Pedido>()

interface PedidosPageProps {
  initialData?: Pedido[]
}

export function PedidosPage({ initialData }: PedidosPageProps) {
  const router = useRouter()
  const [estadoFiltro, setEstadoFiltro] = useState('COMPLETADO')
  const { data, isLoading } = usePedidos({ estado: estadoFiltro }, initialData)
  const pedidos = data?.pedidos || []

  const columns = useMemo<ColumnDef<Pedido, any>[]>(
    () => [
      columnHelper.accessor('numero_pedido', {
        header: '# Pedido',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            #{String(row.original.numero_pedido).padStart(6, '0')}
          </Typography>
        )
      }),
      columnHelper.accessor('usuario', {
        header: 'Estudiante',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.usuario.nombre} {row.original.usuario.apellido}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {row.original.usuario.correo}
            </Typography>
          </div>
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
        header: 'Descuento / Cupón',
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
            {row.original.metodo_pago?.toLowerCase().replace('_', ' ') || '-'}
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
        header: 'Fecha',
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
        <CardHeader title='Pedidos' />
        <Box p={6}>Cargando pedidos...</Box>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader
        title='Gestión de Pedidos'
        action={
          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
            onClick={() => router.push('/admin/pedidos/nuevo')}
          >
            Nuevo Pedido Manual
          </Button>
        }
      />
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
            label='Estado'
            value={estadoFiltro}
            onChange={e => setEstadoFiltro(e.target.value)}
            className='is-[180px]'
          >
            <MenuItem value='TODOS'>Todos los Pedidos</MenuItem>
            <MenuItem value='COMPLETADO'>Pagados (Completados)</MenuItem>
            <MenuItem value='PENDIENTE'>Pendientes</MenuItem>
            <MenuItem value='CANCELADO'>Cancelados</MenuItem>
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
                  No se encontraron pedidos
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
    </Card>
  )
}
