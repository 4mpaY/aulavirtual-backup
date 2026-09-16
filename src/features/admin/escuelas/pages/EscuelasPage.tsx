'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import {
  Button,
  Card,
  Chip,
  IconButton,
  Typography,
  Box,
  Tooltip,
  TablePagination
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
import classnames from 'classnames'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import ClientOnly from '@/utils/components/ClientOnly'

import CourseThumbnail from '@/utils/components/CourseThumbnail'

import type { Escuela } from '../entity/Escuela'
import { useEscuelas, useDeleteEscuela, useReorderEscuelas } from '../hooks/useEscuelas'
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

function SortableRow({
  id,
  children,
  isDragDisabled,
  isSelected
}: {
  id: string
  children: (dragHandleProps: { attributes: any; listeners: any }) => React.ReactNode
  isDragDisabled: boolean
  isSelected: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: isDragDisabled
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.6 : 1,
    position: isDragging ? 'relative' : undefined
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={classnames({ selected: isSelected })}
    >
      {children({ attributes, listeners })}
    </tr>
  )
}

const EscuelasPage = ({ initialData }: EscuelasPageProps) => {
  const { data: escuelas = [], isLoading } = useEscuelas(initialData)
  const deleteEscuela = useDeleteEscuela()
  const reorderEscuelas = useReorderEscuelas()

  const [openDialog, setOpenDialog] = useState(false)
  const [selectedEscuela, setSelectedEscuela] = useState<Escuela | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [orderedEscuelas, setOrderedEscuelas] = useState<Escuela[]>([])

  useEffect(() => {
    setOrderedEscuelas([...escuelas].sort((a, b) => (a.orden || 0) - (b.orden || 0)))
  }, [escuelas])

  const isDragDisabled = globalFilter.trim().length > 0

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = orderedEscuelas.findIndex(e => e.id === active.id)
    const newIndex = orderedEscuelas.findIndex(e => e.id === over.id)
    const reordered = arrayMove(orderedEscuelas, oldIndex, newIndex)
    const updatedReordered = reordered.map((esc, i) => ({ ...esc, orden: i + 1 }))

    setOrderedEscuelas(updatedReordered)

    const items = updatedReordered.map(esc => ({ id: esc.id, orden: esc.orden }))

    try {
      await reorderEscuelas.mutateAsync({ items })
    } catch (err) {
      console.error('Error al reordenar escuelas:', err)
      Swal.fire({ title: 'Error', text: 'No se pudo guardar el nuevo orden', icon: 'error' })
      setOrderedEscuelas([...escuelas])
    }
  }

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
      columnHelper.display({
        id: 'drag-handle',
        header: () => null,
        cell: () => null
      }),
      columnHelper.accessor('orden', {
        header: 'ORDEN',
        cell: ({ row }) => (
          <Typography color='text.secondary' variant='body2'>
            {row.original.orden}
          </Typography>
        )
      }),
      columnHelper.accessor('nombre', {
        header: 'ESCUELA',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 400 }}>
            <CourseThumbnail
              src={row.original.imagen}
              title={row.original.nombre}
              variant='simple'
              icon='tabler-school'
              sx={{ width: 44, height: 32, flexShrink: 0, borderRadius: '8px' }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant='body2'
                fontWeight={600}
                noWrap
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {row.original.nombre}
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.original.slug}
              </Typography>
            </Box>
          </Box>
        )
      }),
      columnHelper.accessor('estado', {
        header: 'ESTADO',
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
        header: () => <div className='w-full text-right'>ACCIONES</div>,
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
    data: orderedEscuelas,
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
    <ClientOnly>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Card sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant='h5'>Listado de Escuelas</Typography>
            <Typography variant='caption' color='text.secondary'>
              Arrastra las filas desde el ícono para reordenar las escuelas públicamente.
            </Typography>
          </Box>
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className={tableStyles.tableContainer}>
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    <th style={{ width: 40, padding: '0 8px' }} />
                    {hg.headers.filter(h => h.id !== 'drag-handle').map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      Cargando escuelas...
                    </td>
                  </tr>
                </tbody>
              ) : table.getRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No se encontraron escuelas.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <SortableContext
                    items={table.getRowModel().rows.map(r => r.original.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map(row => (
                      <SortableRow
                        key={row.original.id}
                        id={row.original.id}
                        isDragDisabled={isDragDisabled}
                        isSelected={row.getIsSelected()}
                      >
                        {(dragHandleProps) => (
                          <>
                            <td style={{ width: 40, padding: '0 8px', textAlign: 'center' }}>
                              {!isDragDisabled && (
                                <span
                                  {...dragHandleProps.attributes}
                                  {...dragHandleProps.listeners}
                                  style={{ cursor: 'grab', touchAction: 'none', display: 'inline-flex', alignItems: 'center' }}
                                >
                                  <i className='tabler-grip-vertical text-[20px] text-textDisabled' />
                                </span>
                              )}
                            </td>
                            {row.getVisibleCells().filter(c => c.column.id !== 'drag-handle').map(cell => (
                              <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            ))}
                          </>
                        )}
                      </SortableRow>
                    ))}
                  </SortableContext>
                </tbody>
              )}
            </table>
          </div>
        </DndContext>

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
    </ClientOnly>
  )
}

export default EscuelasPage
