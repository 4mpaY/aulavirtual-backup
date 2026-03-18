'use client'

import React, { useCallback, useMemo, useState } from 'react'

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
  TablePagination
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import Swal from 'sweetalert2'

import tableStyles from '@core/styles/table.module.css'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'

import type { Ruta } from '../entity/Ruta'
import { useRutas, useDeleteRuta } from '../hooks/useRutas'
import { RutaDialog } from '../components/RutaDialog'
import { RutaCursosDialog } from '../components/RutaCursosDialog'

const columnHelper = createColumnHelper<Ruta>()

export function RutasPage() {
  const { data: rutas = [], isLoading } = useRutas()
  const deleteRuta = useDeleteRuta()

  const [openRutaDialog, setOpenRutaDialog] = useState(false)
  const [openCursosDialog, setOpenCursosDialog] = useState(false)
  const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null)
  
  const [globalFilter, setGlobalFilter] = useState('')

  const handleEdit = useCallback((ruta: Ruta) => {
    setSelectedRuta(ruta)
    setOpenRutaDialog(true)
  }, [])

  const handleManageCursos = useCallback((ruta: Ruta) => {
    setSelectedRuta(ruta)
    setOpenCursosDialog(true)
  }, [])

  const handleDelete = useCallback(async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await deleteRuta.mutateAsync(id)

        Swal.fire({
          title: '¡Eliminado!',
          text: 'Ruta eliminada correctamente',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Error al eliminar la ruta', icon: 'error' })
      }
    }
  }, [deleteRuta])

  const columns = useMemo<ColumnDef<Ruta, any>[]>(
    () => [
      columnHelper.accessor('titulo', {
        header: 'Ruta de Aprendizaje',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              variant='rounded'
              src={row.original.miniatura || ''}
              sx={{ width: 48, height: 36, bgcolor: 'action.hover' }}
            >
              <i className='tabler-route text-lg' />
            </Avatar>
            <Box>
              <Typography variant='body2' fontWeight={600}>{row.original.titulo}</Typography>
              <Typography variant='caption' color='text.secondary'>{row.original.slug}</Typography>
            </Box>
          </Box>
        )
      }),
      columnHelper.accessor('total_cursos', {
        header: 'Cursos',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={`${row.original.total_cursos || 0} Cursos`}
            color='primary'
            size='small'
          />
        )
      }),
      columnHelper.accessor('esta_activo', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.esta_activo ? 'Activo' : 'Borrador'}
            color={row.original.esta_activo ? 'success' : 'warning'}
            size='small'
          />
        )
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <div className='w-full text-right'>Acciones</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end w-full gap-1'>
            <Tooltip title='Gestionar Cursos'>
              <IconButton onClick={() => handleManageCursos(row.original)}>
                <i className='tabler-list-numbers text-[22px] text-primary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Editar Ruta'>
              <IconButton onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar'>
              <IconButton onClick={() => handleDelete(row.original.id)}>
                <i className='tabler-trash text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          </div>
        )
      })
    ],
    [handleManageCursos, handleEdit, handleDelete]
  )

  const table = useReactTable({
    data: rutas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter
  })

  return (
    <>
      <Card>
        <CardHeader title='Gestión de Rutas de Aprendizaje' className='pbe-4' />
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Buscar ruta...'
            className='is-full sm:is-auto'
          />
          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
            onClick={() => {
              setSelectedRuta(null)
              setOpenRutaDialog(true)
            }}
          >
            Nueva Ruta
          </Button>
        </div>

        <div className='overflow-x-auto relative min-h-[200px]'>
          {isLoading && (
            <div className='absolute inset-0 bg-white/50 z-10 flex items-center justify-center'>
              <Typography variant='body2'>Cargando rutas...</Typography>
            </div>
          )}
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rutas.length === 0 ? (
                <tr>
                  <td colSpan={4} className='text-center'>No hay rutas definidas</td>
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
          count={rutas.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <RutaDialog
        open={openRutaDialog}
        onClose={() => setOpenRutaDialog(false)}
        ruta={selectedRuta}
      />

      <RutaCursosDialog
        open={openCursosDialog}
        onClose={() => setOpenCursosDialog(false)}
        rutaId={selectedRuta?.id || null}
      />
    </>
  )
}
