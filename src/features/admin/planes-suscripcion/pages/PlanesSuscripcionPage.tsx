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
import { usePlanesSuscripcion, usePlanSuscripcionMutation } from '../hooks/usePlanesSuscripcion'
import PlanSuscripcionForm from '../components/PlanSuscripcionForm'
import HydratedDate from '@/utils/components/HydratedDate'
import type { PlanSuscripcion } from '../entity/PlanSuscripcion'
import { INTERVALO_LABELS } from '../entity/PlanSuscripcion'
import { useCursosLista } from '@/features/admin/cursos/hooks/useCursos'
import type { CursoListaItem } from '@/features/admin/cursos/entity/Curso'

const columnHelper = createColumnHelper<PlanSuscripcion>()

interface PlanesSuscripcionPageProps {
  initialData?: PlanSuscripcion[]
  cursosInitialData?: CursoListaItem[]
}

export function PlanesSuscripcionPage({ initialData, cursosInitialData }: PlanesSuscripcionPageProps) {
  const [buscar, setBuscar] = useState('')
  const [openForm, setOpenForm] = useState(false)
  const [planToEdit, setPlanToEdit] = useState<PlanSuscripcion | null>(null)

  const { data: planes = [], isLoading } = usePlanesSuscripcion(buscar, initialData)
  const { data: cursosDisponibles = [] } = useCursosLista(cursosInitialData)
  const { deletePlan } = usePlanSuscripcionMutation()

  const handleEdit = (plan: PlanSuscripcion) => {
    setPlanToEdit(plan)
    setOpenForm(true)
  }

  const handleDelete = useCallback(async (plan: PlanSuscripcion) => {
    const suscriptores = plan._count?.suscripciones ?? 0

    if (suscriptores > 0) {
      toast.error(`No se puede eliminar: tiene ${suscriptores} suscripción(es) activa(s)`)

      return
    }

    const result = await Swal.fire({
      title: '¿Eliminar plan?',
      text: `Se eliminará "${plan.nombre}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await deletePlan.mutateAsync(plan.id)
        toast.success('Plan eliminado correctamente')
      } catch (error: any) {
        toast.error(error?.message || 'Error al eliminar el plan')
      }
    }
  }, [deletePlan])

  const columns = useMemo(() => [
    columnHelper.accessor('nombre', {
      header: 'Plan',
      cell: ({ row }) => (
        <Box>
          <Typography color='text.primary' fontWeight={600}>{row.original.nombre}</Typography>
          {row.original.descripcion && (
            <Typography variant='caption' color='text.secondary'>{row.original.descripcion}</Typography>
          )}
        </Box>
      )
    }),
    columnHelper.accessor('precio', {
      header: 'Precio',
      cell: ({ row }) => (
        <Typography color='text.primary'>
          {row.original.moneda === 'PEN' ? 'S/' : '$'} {Number(row.original.precio).toFixed(2)}
        </Typography>
      )
    }),
    columnHelper.accessor('intervalo', {
      header: 'Intervalo',
      cell: ({ row }) => (
        <Chip
          label={INTERVALO_LABELS[row.original.intervalo]}
          size='small'
          color='info'
          variant='tonal'
        />
      )
    }),
    columnHelper.display({
      id: 'cursos',
      header: 'Cursos',
      cell: ({ row }) => (
        <Typography color='text.secondary'>
          {row.original._count?.cursos ?? row.original.cursos?.length ?? 0} curso(s)
        </Typography>
      )
    }),
    columnHelper.display({
      id: 'suscriptores',
      header: 'Suscriptores',
      cell: ({ row }) => (
        <Typography color='text.secondary'>
          {row.original._count?.suscripciones ?? 0}
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
    columnHelper.accessor('creado_en', {
      header: 'Creado',
      cell: ({ row }) => (
        <Typography variant='body2' color='text.secondary'>
          <HydratedDate date={row.original.creado_en} format='date' />
        </Typography>
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
          <IconButton onClick={() => handleDelete(row.original)} size='small' color='error'>
            <i className='tabler-trash' />
          </IconButton>
        </Box>
      )
    })
  ], [handleDelete])

  const table = useReactTable({
    data: planes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } }
  })

  if (isLoading) return <Card><Box p={6}>Cargando planes...</Box></Card>

  return (
    <>
      <Card>
        <CardHeader title='Planes de Suscripción' className='pbe-4' />
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
              placeholder='Buscar plan'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => { setPlanToEdit(null); setOpenForm(true) }}
              className='is-full sm:is-auto'
            >
              Nuevo Plan
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
              {planes.length === 0 && (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay planes de suscripción
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          component={() => <TablePaginationComponent table={table as any} />}
          count={planes.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          rowsPerPageOptions={[10, 25, 50]}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <PlanSuscripcionForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        planToEdit={planToEdit}
        cursosDisponibles={cursosDisponibles}
      />
    </>
  )
}
