'use client'

import { useMemo, useState, useCallback } from 'react'

import {
  Button, Card, CardHeader, Chip, IconButton, MenuItem,
  Typography, Box, Tooltip
} from '@mui/material'
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { useSnackbar } from 'notistack'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import type { ThemeColor } from '@/@core/types'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import { fuzzyFilter } from '@/utils/components/others/FuzzyFilter'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import type { Simulacro, EstadoSimulacro } from '../entity/Simulacro'
import { useSimulacros, useCambiarEstadoSimulacro } from '../hooks/useSimulacros'
import DeleteSimulacroModal from '../components/DeleteSimulacroModal'

const estadoColor: Record<string, ThemeColor> = {
  BORRADOR: 'warning', PUBLICADO: 'success', ARCHIVADO: 'secondary'
}

const estadoLabel: Record<string, string> = {
  BORRADOR: 'Borrador', PUBLICADO: 'Publicado', ARCHIVADO: 'Archivado'
}

const nivelLabel: Record<string, string> = {
  BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado'
}

const columnHelper = createColumnHelper<Simulacro>()

interface Props { initialData: Simulacro[] }

export function SimulacrosPage({ initialData }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [toDelete, setToDelete] = useState<Simulacro | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data, isLoading } = useSimulacros()
  const cambiarEstadoMutation = useCambiarEstadoSimulacro()

  const simulacros: Simulacro[] = data?.simulacros ?? initialData

  const filtered = useMemo(() => {
    if (estadoFilter === 'all') {
      return simulacros
    }

    return simulacros.filter(s => s.estado === estadoFilter)
  }, [simulacros, estadoFilter])

  const handleDeleteClick = (s: Simulacro) => { setToDelete(s); setOpenDelete(true) }

  const handleCambiarEstado = useCallback(async (id: string, estado: EstadoSimulacro) => {
    try {
      await cambiarEstadoMutation.mutateAsync({ id, dto: { estado } })
      enqueueSnackbar(`Estado cambiado a ${estadoLabel[estado]}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al cambiar estado', { variant: 'error' })
    }
  }, [cambiarEstadoMutation, enqueueSnackbar])

  const columns = useMemo<ColumnDef<Simulacro, any>[]>(() => [
    columnHelper.display({
      id: 'numero',
      header: '#',
      cell: ({ row }) => (
        <Typography color='text.secondary' variant='body2'>
          {pagination.pageIndex * pagination.pageSize + row.index + 1}
        </Typography>
      ),
    }),
    columnHelper.accessor('titulo', {
      header: 'Simulacro',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 300 }}>
          <Box sx={{ width: 44, height: 32, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {row.original.miniatura
              ? <img src={row.original.miniatura} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <i className='tabler-clipboard-list' style={{ fontSize: 16, opacity: 0.4 }} />}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant='body2' fontWeight={600} noWrap>{row.original.titulo}</Typography>
            {row.original.area_tematica && (
              <Typography variant='caption' color='text.secondary' noWrap display='block'>
                {row.original.area_tematica}
              </Typography>
            )}
          </Box>
        </Box>
      ),
    }),
    columnHelper.accessor('nivel', {
      header: 'Nivel',
      cell: ({ getValue }) => <Typography variant='body2'>{nivelLabel[getValue()] ?? getValue()}</Typography>,
    }),
    columnHelper.accessor('numero_preguntas', {
      header: 'Preguntas',
      cell: ({ getValue }) => <Typography variant='body2'>{getValue()}</Typography>,
    }),
    columnHelper.accessor('duracion', {
      header: 'Duración',
      cell: ({ getValue }) => <Typography variant='body2'>{getValue() ? `${getValue()} min` : '—'}</Typography>,
    }),
    columnHelper.display({
      id: 'precio',
      header: 'Precio',
      cell: ({ row }) => (
        row.original.es_gratis
          ? <Chip label='Gratis' size='small' variant='tonal' color='success' />
          : <Typography variant='body2' fontWeight={600}>{row.original.moneda} {Number(row.original.precio).toFixed(2)}</Typography>
      ),
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: ({ getValue }) => (
        <Chip label={estadoLabel[getValue()] ?? getValue()} color={estadoColor[getValue()] ?? 'default'} size='small' variant='tonal' />
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: () => <div className='w-full text-right'>Acciones</div>,
      cell: ({ row }) => (
        <div className='flex items-center justify-end w-full gap-1'>
          {/* Publicar / Despublicar rápido */}
          {row.original.estado === 'BORRADOR' && (
            <Tooltip title='Publicar'>
              <IconButton onClick={() => handleCambiarEstado(row.original.id, 'PUBLICADO')}>
                <i className='tabler-eye text-[20px] text-success' />
              </IconButton>
            </Tooltip>
          )}
          {row.original.estado === 'PUBLICADO' && (
            <Tooltip title='Archivar'>
              <IconButton onClick={() => handleCambiarEstado(row.original.id, 'ARCHIVADO')}>
                <i className='tabler-archive text-[20px] text-textSecondary' />
              </IconButton>
            </Tooltip>
          )}
          {row.original.estado === 'ARCHIVADO' && (
            <Tooltip title='Restaurar a Borrador'>
              <IconButton onClick={() => handleCambiarEstado(row.original.id, 'BORRADOR')}>
                <i className='tabler-restore text-[20px] text-warning' />
              </IconButton>
            </Tooltip>
          )}
          {/* Editar */}
          <Tooltip title='Editar'>
            <IconButton href={`/admin/simulacros/${row.original.id}`} component='a'>
              <i className='tabler-edit text-[20px] text-textSecondary' />
            </IconButton>
          </Tooltip>
          {/* Eliminar */}
          <Tooltip title='Eliminar'>
            <IconButton onClick={() => handleDeleteClick(row.original)}>
              <i className='tabler-trash text-[20px] text-error' />
            </IconButton>
          </Tooltip>
        </div>
      ),
    }),
  ], [pagination.pageIndex, pagination.pageSize, handleCambiarEstado])

  const table = useReactTable({
    data: filtered,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <Card>
        <CardHeader
          title='Simulacros'
          action={
            <Button variant='contained' startIcon={<i className='tabler-plus' />}
              href='/admin/simulacros/nuevo' component='a'>
              Nuevo Simulacro
            </Button>
          }
        />

        <Box sx={{ px: 4, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <DebouncedInput
            value={globalFilter}
            onChange={v => setGlobalFilter(String(v))}
            placeholder='Buscar simulacro...'
            className='max-sm:is-full'
          />
          <CustomTextField select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value='all'>Todos los estados</MenuItem>
            <MenuItem value='BORRADOR'>Borrador</MenuItem>
            <MenuItem value='PUBLICADO'>Publicado</MenuItem>
            <MenuItem value='ARCHIVADO'>Archivado</MenuItem>
          </CustomTextField>
        </Box>

        <div className='overflow-x-auto'>
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
              {isLoading ? (
                <tr><td colSpan={9}><Typography sx={{ p: 4, textAlign: 'center' }}>Cargando...</Typography></td></tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={9}><Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No hay simulacros registrados</Typography></td></tr>
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

        <TablePaginationComponent table={table} />
      </Card>

      <DeleteSimulacroModal
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        simulacro={toDelete}
        onSuccess={() => setToDelete(null)}
      />
    </>
  )
}
