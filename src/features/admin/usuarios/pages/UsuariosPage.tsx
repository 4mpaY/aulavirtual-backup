'use client'

import { useMemo, useState } from 'react'

// MUI Imports
import {
  Button,
  Card,
  CardHeader,
  Chip,
  IconButton,
  MenuItem,
  TablePagination,
  Typography,
  Box,
  Avatar
} from '@mui/material'

// Table & Utils Imports
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import classnames from 'classnames'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Rol } from '@prisma/client'

// Core & Custom Components
import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import type { ThemeColor } from '@/@core/types'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import { fuzzyFilter } from '@/utils/components/others/FuzzyFilter'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'

// Feature Imports
import type { Usuario } from '../entity/Usuario'
import { useUsuarios } from '../hooks/useUsuarios'
import { UsuariosActions } from '../components/UsuariosActions'

type UsuarioStatusType = {
  [key: string]: ThemeColor
}

const usuarioStatusObj: UsuarioStatusType = {
  activo: 'success',
  inactivo: 'secondary'
}

const rolStatusObj: UsuarioStatusType = {
  ADMIN: 'error',
  PROFESOR: 'warning',
  ESTUDIANTE: 'info'
}

const rolLabels: { [key in Rol]: string } = {
  ADMIN: 'Administrador',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Estudiante'
}

const columnHelper = createColumnHelper<Usuario>()

interface UsuariosPageProps {
  initialDataUsuarios?: Usuario[]
}

export function UsuariosPage({ initialDataUsuarios }: UsuariosPageProps) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false)
  const [openViewModal, setOpenViewModal] = useState<boolean>(false)
  const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null)

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [rolFilter, setRolFilter] = useState<string>('all')

  const { data: usuarios = [], isLoading, refetch: refetchUsuarios } = useUsuarios(initialDataUsuarios)

  const filteredData = useMemo(() => {
    if (rolFilter === 'all') return usuarios

    return usuarios.filter(u => u.rol === rolFilter)
  }, [usuarios, rolFilter])

  const handleDeleteClick = (usuario: Usuario) => {
    setUsuarioToEdit(usuario)
    setOpenDeleteModal(true)
  }

  const handleEditClick = (usuario: Usuario) => {
    setUsuarioToEdit(usuario)
    setOpenUpdateModal(true)
  }

  const handleViewClick = (usuario: Usuario) => {
    setUsuarioToEdit(usuario)
    setOpenViewModal(true)
  }

  const columns = useMemo<ColumnDef<Usuario, any>[]>(
    () => [
      columnHelper.display({
        id: 'numero',
        header: '#',
        cell: ({ row }) => (
          <Typography color='text.secondary' variant='body2'>
            {row.index + 1}
          </Typography>
        )
      }),
      columnHelper.accessor('nombre', {
        header: 'Usuario',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <Avatar
              src={row.original.avatar || undefined}
              alt={`${row.original.nombre} ${row.original.apellido}`}
              sx={{
                width: 40,
                height: 40,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              imgProps={{ referrerPolicy: 'no-referrer' }}
              onClick={() => handleViewClick(row.original)}
            >
              {row.original.nombre.charAt(0).toUpperCase()}
            </Avatar>
            <div
              className='flex flex-col cursor-pointer hover:opacity-75 transition-opacity'
              onClick={() => handleViewClick(row.original)}
            >
              <Typography color='text.primary' className='font-medium'>
                {row.original.nombre} {row.original.apellido}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {row.original.correo}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('numero_documento', {
        header: 'DNI',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.numero_documento}</Typography>
      }),
      columnHelper.accessor('celular', {
        header: 'Celular',
        cell: ({ row }) => (
          <Typography color='text.primary'>{row.original.celular || '-'}</Typography>
        )
      }),
      columnHelper.accessor('rol', {
        header: 'Rol',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            className='capitalize'
            label={rolLabels[row.original.rol]}
            color={rolStatusObj[row.original.rol]}
            size='small'
          />
        )
      }),
      columnHelper.accessor('esta_activo', {
        header: 'Estado',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            className='capitalize'
            label={row.original.esta_activo ? 'Activo' : 'Inactivo'}
            color={usuarioStatusObj[row.original.esta_activo ? 'activo' : 'inactivo']}
            size='small'
          />
        )
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <div className='w-full text-right'>Acciones</div>,
        cell: ({ row }) => (
          <div className='flex items-center justify-end w-full gap-1'>
            <IconButton onClick={() => handleViewClick(row.original)} title='Ver Detalles'>
              <i className='tabler-eye text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton onClick={() => handleEditClick(row.original)} title='Editar'>
              <i className='tabler-edit text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(row.original)} title='Eliminar'>
              <Icon icon='material-symbols:delete' />
            </IconButton>
          </div>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader title='Usuarios' />
        <Box p={4}>Cargando...</Box>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader title='Gestión de Usuarios' className='pbe-4' />
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
            <CustomTextField
              select
              value={rolFilter}
              onChange={e => setRolFilter(e.target.value)}
              className='is-full sm:is-[200px]'
            >
              <MenuItem value='all'>Todos los roles</MenuItem>
              <MenuItem value={Rol.ADMIN}>Administrador</MenuItem>
              <MenuItem value={Rol.PROFESOR}>Profesor</MenuItem>
              <MenuItem value={Rol.ESTUDIANTE}>Estudiante</MenuItem>
            </CustomTextField>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Buscar usuario'
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setOpenCreateModal(true)}
              className='is-full sm:is-auto'
            >
              Añadir Usuario
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
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {
                              {
                                asc: <i className='tabler-chevron-up text-xl' />,
                                desc: <i className='tabler-chevron-down text-xl' />
                              }[header.column.getIsSorted() as 'asc' | 'desc']
                            }
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No hay datos disponibles
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <UsuariosActions
        usuarioClicked={usuarioToEdit}
        addUsuario={{
          isOpen: openCreateModal,
          closeHandler: () => setOpenCreateModal(false)
        }}
        editUsuario={{
          isOpen: openUpdateModal,
          closeHandler: () => {
            setOpenUpdateModal(false)
            setUsuarioToEdit(null)
          }
        }}
        deleteUsuario={{
          isOpen: openDeleteModal,
          closeHandler: () => {
            setOpenDeleteModal(false)
            setUsuarioToEdit(null)
          }
        }}
        viewUsuario={{
          isOpen: openViewModal,
          closeHandler: () => {
            setOpenViewModal(false)
            setUsuarioToEdit(null)
          }
        }}
        onSuccess={() => refetchUsuarios()}
      />
    </>
  )
}
