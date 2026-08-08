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
  Tooltip,
  TablePagination,
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import Swal from 'sweetalert2'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'

import type { Escuela } from '../entity/Escuela'
import { useEscuelas, useDeleteEscuela } from '../hooks/useEscuelas'
import { EscuelaDialog } from '../components/EscuelaDialog'

const columnHelper = createColumnHelper<Escuela>()

interface EscuelasPageProps {
  initialData?: Escuela[]
}

const ESTADO_COLORS: Record<string, 'success' | 'warning' | 'info' | 'error' | 'default' | 'primary' | 'secondary'> = {
  DISPONIBLE: 'success',
  PROXIMAMENTE: 'warning',
  MEDIANTE_ALIANZAS: 'info',
  EN_DESARROLLO: 'secondary'
}

const ESTADO_LABELS: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  PROXIMAMENTE: 'Próximamente',
  MEDIANTE_ALIANZAS: 'Mediante alianzas',
  EN_DESARROLLO: 'En desarrollo'
}

export const EscuelasPage = ({ initialData }: EscuelasPageProps) => {
  const { data: escuelas = [], isLoading } = useEscuelas(initialData)
  const deleteEscuela = useDeleteEscuela()

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const handleEdit = useCallback((escuela: Escuela) => {
    setSelectedEscuela(escuela)
    setOpenDialog(true)
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
        await deleteEscuela.mutateAsync(id)
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Escuela eliminada correctamente',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        })
      } catch (err) {
        Swal.fire({ title: 'Error', text: 'Error al eliminar la escuela', icon: 'error' })
      }
    }
  }, [deleteEscuela])

  const columns = useMemo<ColumnDef<Escuela, any>[]>(
    () => [
      columnHelper.accessor('nombre', {
        header: 'Escuela',
        cell: ({ row }) => (
          <Box>
            <Typography variant='body2' fontWeight={600}>{row.original.nombre}</Typography>
            <Typography variant='caption' color='text.secondary'>{row.original.slug}</Typography>
          </Box>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={ESTADO_LABELS[row.original.estado] || row.original.estado}
            color={ESTADO_COLORS[row.original.estado] || 'default'}
            size='small'
          />
        )
      }),

      columnHelper.display({
        id: 'acciones',
        header: () => <div className='w-full text-right'>Acciones</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end w-full gap-1'>
            <Tooltip title='Editar Escuela'>
              <IconButton onClick={() => handleEdit(row.original)}>
                <i className='tabler-edit text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Eliminar Escuela'>
              <IconButton onClick={() => handleDelete(row.original.id)}>
                <i className='tabler-trash text-[22px] text-error' />
              </IconButton>
            </Tooltip>
          </div>
        )
      })
    ],
    [handleEdit, handleDelete]
  )

  const table = useReactTable({
    data: escuelas,
    columns,
    state: {
      globalFilter
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 4 }}>
          <Typography variant='h5'>Listado de Escuelas</Typography>
          <Button
            variant='contained'
            startIcon={<i className='tabler-plus' />}
            onClick={() => {
              setSelectedEscuela(null)
              setOpenDialog(true)
            }}
          >
            Nueva Escuela
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 4 }}>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Buscar escuela...'
            className='max-is-[250px]'
          />
        </Box>
        <div className={tableStyles.tableContainer}>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>Cargando escuelas...</td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className='text-center'>No se encontraron escuelas.</td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table as any} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>

      <EscuelaDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
          setSelectedEscuela(null)
        }}
        escuela={selectedEscuela}
      />
    </Box>
  )
}
