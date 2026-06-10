'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  Button,
  Card,
  CardHeader,
  Chip,
  IconButton,
  Typography,
  Box,
  Avatar,
  Tooltip,
  TablePagination,
  MenuItem,
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import Swal from 'sweetalert2'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'

import type { Ebook } from '../entity/Ebook'
import { useAdminEbooks, useDeleteEbook, useUpdateEbook } from '../hooks/useEbooks'
import { EbookFormModal } from '../components/EbookFormModal'

const columnHelper = createColumnHelper<Ebook>()

const ESTADO_COLORS: Record<string, 'warning' | 'success' | 'default'> = {
  BORRADOR: 'warning',
  PUBLICADO: 'success',
  ARCHIVADO: 'default',
}

export const EbooksPage = () => {
  const { data: ebooks = [], isLoading } = useAdminEbooks()
  const deleteEbook = useDeleteEbook()
  const updateEbook = useUpdateEbook()

  const [openModal, setOpenModal] = useState(false)
  const [selected, setSelected] = useState<Ebook | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const handleEdit = useCallback((ebook: Ebook) => {
    setSelected(ebook)
    setOpenModal(true)
  }, [])

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await Swal.fire({
        title: '¿Eliminar ebook?',
        text: 'Esta acción no se puede revertir.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })

      if (result.isConfirmed) {
        try {
          await deleteEbook.mutateAsync(id)
          Swal.fire({ title: 'Eliminado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
        } catch {
          Swal.fire({ title: 'Error', text: 'No se pudo eliminar el ebook', icon: 'error' })
        }
      }
    },
    [deleteEbook],
  )

  const handleToggleEstado = useCallback(async (ebook: Ebook) => {
    const nuevoEstado = ebook.estado === 'PUBLICADO' ? 'BORRADOR' : 'PUBLICADO'

    try {
      await updateEbook.mutateAsync({ id: ebook.id, payload: { estado: nuevoEstado } })
      Swal.fire({ title: `Ebook ${nuevoEstado === 'PUBLICADO' ? 'publicado' : 'pasado a borrador'}`, icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2500 })
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo cambiar el estado', icon: 'error' })
    }
  }, [updateEbook])

  const columns = useMemo<ColumnDef<Ebook, any>[]>(
    () => [
      columnHelper.accessor('titulo', {
        header: 'Ebook',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              variant='rounded'
              src={row.original.miniatura ?? ''}
              sx={{ width: 44, height: 58, bgcolor: 'action.hover' }}
            >
              <i className='tabler-book text-xl' />
            </Avatar>
            <Box>
              <Typography variant='body2' fontWeight={600} noWrap sx={{ maxWidth: 220 }}>
                {row.original.titulo}
              </Typography>
              {row.original.autor && (
                <Typography variant='caption' color='text.secondary'>
                  {row.original.autor}
                </Typography>
              )}
            </Box>
          </Box>
        ),
      }),
      columnHelper.accessor('genero', {
        header: 'Género',
        cell: ({ row }) => (
          <Typography variant='body2' color='text.secondary'>
            {row.original.genero ?? '—'}
          </Typography>
        ),
      }),
      columnHelper.accessor('precio', {
        header: 'Precio',
        cell: ({ row }) =>
          row.original.es_gratis ? (
            <Chip label='Gratis' color='info' size='small' variant='tonal' />
          ) : (
            <Typography variant='body2'>
              {row.original.moneda} {Number(row.original.precio).toFixed(2)}
            </Typography>
          ),
      }),
      columnHelper.accessor('_count', {
        header: 'Accesos',
        cell: ({ row }) => (
          <Chip label={row.original._count?.accesos ?? 0} size='small' variant='tonal' color='primary' />
        ),
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            label={row.original.estado}
            color={ESTADO_COLORS[row.original.estado] ?? 'default'}
            size='small'
            variant='tonal'
          />
        ),
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <div className='w-full text-right'>Acciones</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end gap-1'>
            <Tooltip title={row.original.estado === 'PUBLICADO' ? 'Pasar a borrador' : 'Publicar'}>
              <IconButton size='small' onClick={() => handleToggleEstado(row.original)}>
                <i className={`tabler-${row.original.estado === 'PUBLICADO' ? 'eye-off' : 'eye'} text-[20px] text-textSecondary`} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Editar'>
              <IconButton size='small' onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit text-[20px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar'>
              <IconButton size='small' onClick={() => handleDelete(row.original.id)}>
                <i className='tabler-trash text-[20px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        ),
      }),
    ],
    [handleDelete, handleEdit, handleToggleEstado],
  )

  const table = useReactTable({
    data: ebooks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <>
      <Card>
        <CardHeader title='Gestión de Ebooks' className='pbe-4' />
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
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Buscar ebook'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => {
                setSelected(null)
                setOpenModal(true)
              }}
              className='is-full sm:is-auto'
            >
              Nuevo Ebook
            </Button>
          </div>
        </div>

        <div className='overflow-x-auto relative min-h-[200px]'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/50 z-10 flex items-center justify-center'>
              <Typography variant='body2'>Cargando ebooks...</Typography>
            </div>
          )}
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No hay ebooks registrados
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
          count={ebooks.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <EbookFormModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        ebook={selected}
      />
    </>
  )
}
