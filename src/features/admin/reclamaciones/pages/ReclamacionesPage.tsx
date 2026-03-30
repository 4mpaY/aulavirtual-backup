'use client'

import { useMemo, useState } from 'react'

import {
  Card,
  CardHeader,
  Chip,
  Typography,
  Box,
  TablePagination,
  MenuItem,
  IconButton
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
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'

import type { ThemeColor } from '@/@core/types'
import { EstadoReclamacion } from '../entity/Reclamacion'
import type { Reclamacion } from '../entity/Reclamacion'
import { useReclamaciones, useUpdateReclamacion } from '../hooks/useReclamaciones'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import HydratedDate from '@/utils/components/HydratedDate'

import ReclamacionDetailModal from '../components/ReclamacionDetailModal'

type StatusType = {
  [key: string]: ThemeColor
}

const statusObj: StatusType = {
  PENDIENTE: 'warning',
  ATENDIDO: 'success'
}

const columnHelper = createColumnHelper<Reclamacion>()

interface ReclamacionesPageProps {
  initialData?: Reclamacion[]
}

export function ReclamacionesPage({ initialData }: ReclamacionesPageProps) {
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS')
  const [buscar, setBuscar] = useState('')

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10
  })

  const [selectedReclamacion, setSelectedReclamacion] = useState<Reclamacion | null>(null)

  const { data, isLoading, refetch } = useReclamaciones({
    estado: estadoFiltro,
    buscar,
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize)
  })

  const { mutateAsync: updateReclamacion } = useUpdateReclamacion()

  const isDefaultQuery = estadoFiltro === 'TODOS' && !buscar && pagination.pageIndex === 0

  const reclamaciones = data?.reclamaciones ?? (isDefaultQuery && initialData ? initialData : [])
  const total = data?.paginacion?.total ?? (isDefaultQuery && initialData ? initialData.length : 0)

  const handleReplySubmit = async (id: string, respuesta_proveedor: string, estado: string) => {
    await updateReclamacion({
      id,
      data: { respuesta_proveedor, estado: estado as EstadoReclamacion }
    })
    refetch()
  }

  const columns = useMemo<ColumnDef<Reclamacion, any>[]>(
    () => [
      columnHelper.accessor('numero_correlativo', {
        header: 'Hoja N°',
        cell: ({ row }) => (
          <Typography color='text.primary' className='font-medium'>
            {String(row.original.numero_correlativo).padStart(6, '0')}
          </Typography>
        )
      }),
      columnHelper.accessor('nombre', {
        header: 'Consumidor',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography color='text.primary' className='font-medium'>
              {row.original.nombre}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {row.original.email}
            </Typography>
            <Typography variant='caption' color='text.disabled'>
              {row.original.tipo_documento} {row.original.numero_documento}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('tipo_reclamacion', {
        header: 'Tipo',
        cell: ({ row }) => (
          <Chip
            label={row.original.tipo_reclamacion}
            size='small'
            variant='tonal'
            color={row.original.tipo_reclamacion === 'RECLAMO' ? 'error' : 'info'}
          />
        )
      }),
      columnHelper.accessor('monto_reclamado', {
        header: 'Monto',
        cell: ({ row }) => (
          <Typography color='text.primary' variant='body2'>
            {row.original.moneda} {Number(row.original.monto_reclamado).toFixed(2)}
          </Typography>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.estado}
            color={statusObj[row.original.estado] || 'default'}
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
              format='date'
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
        id: 'acciones',
        header: () => <div className='w-full text-right'>Acciones</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end w-full'>
            <IconButton onClick={() => setSelectedReclamacion(row.original)} color='primary'>
              <i className='tabler-eye text-[22px]' />
            </IconButton>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: reclamaciones,
    columns,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    rowCount: total
  })

  if (isLoading && !data) {
    return (
      <Card>
        <CardHeader title='Reclamaciones / Libro de Reclamaciones' />
        <Box p={6}>Cargando datos...</Box>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader title='Gestión de Reclamaciones y Quejas' className='pbe-4' />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
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
          <div className='flex flex-wrap items-center gap-4 is-full sm:is-auto'>
            <CustomTextField
              select
              value={estadoFiltro}
              onChange={e => {
                setEstadoFiltro(e.target.value)
                table.setPageIndex(0)
              }}
              className='is-full sm:is-[180px]'
            >
              <MenuItem value='TODOS'>Todos los estados</MenuItem>
              <MenuItem value={EstadoReclamacion.ATENDIDO}>Atendidos</MenuItem>
              <MenuItem value={EstadoReclamacion.PENDIENTE}>Pendientes</MenuItem>
            </CustomTextField>

            <DebouncedInput
              value={buscar}
              onChange={val => {
                setBuscar(String(val))
                table.setPageIndex(0)
              }}
              placeholder='Buscar (N°, nombre, doc...)'
              className='is-full sm:is-[250px]'
            />
          </div>
        </div>

        <div className='overflow-x-auto relative'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/50 z-10 flex items-center justify-center'>
              <Typography variant='body2'>Actualizando...</Typography>
            </div>
          )}
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
                    No se encontraron reclamaciones
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
          count={total}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <ReclamacionDetailModal
        open={selectedReclamacion !== null}
        onClose={() => setSelectedReclamacion(null)}
        reclamacion={selectedReclamacion}
        onReply={handleReplySubmit}
      />
    </>
  )
}
