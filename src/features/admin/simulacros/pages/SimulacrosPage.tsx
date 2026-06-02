'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Button, Card, CardHeader, Chip, IconButton, MenuItem,
  TablePagination, Typography, Box, Tooltip
} from '@mui/material'
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import classnames from 'classnames'
import { Icon } from '@iconify/react'
import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import type { ThemeColor } from '@/@core/types'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import { fuzzyFilter } from '@/utils/components/others/FuzzyFilter'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import type { Simulacro } from '../entity/Simulacro'
import { useSimulacros } from '../hooks/useSimulacros'
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
  const router = useRouter()
  const [toDelete, setToDelete] = useState<Simulacro | null>(null)
  const [openDelete, setOpenDelete] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('all')
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

  const { data, isLoading } = useSimulacros()
  const simulacros: Simulacro[] = data?.simulacros ?? initialData

  const filtered = useMemo(() => {
    if (estadoFilter === 'all') return simulacros
    return simulacros.filter(s => s.estado === estadoFilter)
  }, [simulacros, estadoFilter])

  const columns = useMemo<ColumnDef<Simulacro, any>[]>(() => [
    columnHelper.accessor('miniatura', {
      header: '',
      cell: ({ row }) => (
        <Box sx={{ width: 56, height: 40, borderRadius: 1, overflow: 'hidden', bgcolor: 'action.hover', flexShrink: 0 }}>
          {row.original.miniatura
            ? <img src={row.original.miniatura} alt='' style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon icon='mdi:clipboard-list' fontSize={20} />
              </Box>}
        </Box>
      ),
    }),
    columnHelper.accessor('titulo', {
      header: 'Título',
      cell: ({ row }) => (
        <Box>
          <Typography variant='body2' fontWeight={600}>{row.original.titulo}</Typography>
          {row.original.area_tematica && (
            <Typography variant='caption' color='text.secondary'>{row.original.area_tematica}</Typography>
          )}
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
    columnHelper.accessor('precio', {
      header: 'Precio',
      cell: ({ row }) => (
        <Typography variant='body2'>
          {row.original.es_gratis ? 'Gratis' : `${row.original.moneda} ${Number(row.original.precio).toFixed(2)}`}
        </Typography>
      ),
    }),
    columnHelper.accessor('estado', {
      header: 'Estado',
      cell: ({ getValue }) => (
        <Chip label={estadoLabel[getValue()]} color={estadoColor[getValue()] ?? 'default'} size='small' variant='tonal' />
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title='Editar'>
            <IconButton size='small' onClick={() => router.push(`/admin/simulacros/${row.original.id}`)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <IconButton size='small' color='error' onClick={() => { setToDelete(row.original); setOpenDelete(true) }}>
              <Icon icon='mdi:delete-outline' />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }),
  ], [router])

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
            <Button variant='contained' startIcon={<Icon icon='mdi:plus' />}
              onClick={() => router.push('/admin/simulacros/nuevo')}>
              Nuevo Simulacro
            </Button>
          }
        />

        <Box sx={{ px: 4, pb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <DebouncedInput value={globalFilter} onChange={v => setGlobalFilter(String(v))}
            placeholder='Buscar simulacro...' className='max-sm:is-full' />
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
                    <th key={h.id} className={classnames({ 'cursor-pointer': h.column.getCanSort() })}
                      onClick={h.column.getToggleSortingHandler()}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading
                ? <tr><td colSpan={7}><Typography sx={{ p: 4, textAlign: 'center' }}>Cargando...</Typography></td></tr>
                : table.getRowModel().rows.length === 0
                  ? <tr><td colSpan={7}><Typography sx={{ p: 4, textAlign: 'center' }}>No hay simulacros</Typography></td></tr>
                  : table.getRowModel().rows.map(row => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    ))}
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
