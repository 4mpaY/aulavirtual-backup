'use client'

import { useMemo, useState, useCallback } from 'react'

import {
  Card,
  CardHeader,
  Button,
  IconButton,
  Typography,
  Chip,
  Box,
  MenuItem,
  TablePagination
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import { useCupones, useCuponMutation } from '../hooks/useCupones'
import CuponForm from '../components/CuponForm'
import HydratedDate from '@/utils/components/HydratedDate'
import type { Cupon } from '../entity/Cupon'

const columnHelper = createColumnHelper<Cupon>()

interface CuponesPageProps {
  initialData?: Cupon[]
}

export function CuponesPage({ initialData }: CuponesPageProps) {
  const [buscar, setBuscar] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [cuponToEdit, setCuponToEdit] = useState<Cupon | null>(null)
  
  const { data: cupones = [], isLoading } = useCupones(buscar, initialData)
  const { deleteCupon } = useCuponMutation()

  const handleEdit = (cupon: any) => {
    setCuponToEdit(cupon)
    setOpenForm(true)
  }

  const handleDelete = useCallback(async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await deleteCupon.mutateAsync(id)
        toast.success('Cupón eliminado correctamente')
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al eliminar el cupón')
      }
    }
  }, [deleteCupon])

  const columns = useMemo(() => [
    columnHelper.accessor('codigo', {
      header: 'Código',
      cell: ({ row }) => (
        <Typography color='text.primary' sx={{ fontWeight: 600 }}>
          {row.original.codigo}
        </Typography>
      )
    }),
    columnHelper.accessor('valor', {
      header: 'Valor',
      cell: ({ row }) => {
        const isPorcentaje = row.original.tipo === 'PORCENTAJE'
        const valor = Number(row.original.valor || 0)

        return (
          <Typography color='text.primary'>
            {isPorcentaje ? `${valor}%` : `S/ ${valor.toFixed(2)}`}
          </Typography>
        )
      }
    }),
    columnHelper.accessor('usos_actuales', {
      header: 'Usos',
      cell: ({ row }) => (
        <Typography color='text.secondary'>
          {row.original.usos_actuales} {row.original.limite_uso ? `/ ${row.original.limite_uso}` : ''}
        </Typography>
      )
    }),
    columnHelper.accessor('fecha_expiracion', {
      header: 'Expiración',
      cell: ({ row }) => (
        <Typography color='text.secondary'>
          {row.original.fecha_expiracion ? <HydratedDate date={row.original.fecha_expiracion} format="date" /> : 'Nunca'}
        </Typography>
      )
    }),
    columnHelper.accessor('esta_activo', {
      header: 'Estado',
      cell: ({ row }) => (
        <Chip
          label={row.original.esta_activo ? 'Activo' : 'Inactivo'}
          color={row.original.esta_activo ? 'success' : 'secondary'}
          size='small'
          variant='tonal'
        />
      )
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={() => handleEdit(row.original)} size='small' color='primary'>
            <i className='tabler-edit' />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.original.id)} size='small' color='error'>
            <i className='tabler-trash' />
          </IconButton>
        </Box>
      )
    })
  ], [handleDelete])

  const table = useReactTable({
    data: cupones,
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

  if (isLoading) return <Card><Box p={6}>Cargando cupones...</Box></Card>

  return (
    <>
      <Card>
        <CardHeader title='Gestión de Cupones' className='pbe-4' />
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
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={buscar}
              onChange={value => setBuscar(String(value))}
              placeholder='Buscar código'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => {
                setCuponToEdit(null)
                setOpenForm(true)
              }}
              className='is-full sm:is-auto'
            >
              Nuevo Cupón
            </Button>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
              {cupones.length === 0 && (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No se encontraron cupones
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table as any} />}
          count={cupones.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <CuponForm open={openForm} handleClose={() => setOpenForm(false)} cuponToEdit={cuponToEdit} />
    </>
  )
}
