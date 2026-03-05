'use client'

import React, { useMemo, useState } from 'react'

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
    Avatar,
    Tooltip
} from '@mui/material'
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

import tableStyles from '@core/styles/table.module.css'

import CustomTextField from '@/@core/components/mui/TextField'
import type { ThemeColor } from '@/@core/types'

import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import { fuzzyFilter } from '@/utils/components/others/FuzzyFilter'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'

import type { Curso } from '../entity/Curso'
import { useCursos } from '../hooks/useCursos'
import { CursosActions } from '../components/CursosActions'

type EstadoColorMap = {
    [key: string]: ThemeColor
}

const estadoObj: EstadoColorMap = {
    BORRADOR: 'warning',
    PUBLICADO: 'success',
    ARCHIVADO: 'secondary'
}

const estadoLabel: Record<string, string> = {
    BORRADOR: 'Borrador',
    PUBLICADO: 'Publicado',
    ARCHIVADO: 'Archivado'
}

const columnHelper = createColumnHelper<Curso>()

interface CursosPageProps {
    initialDataCursos: Curso[]
}

export function CursosPage({ initialDataCursos }: CursosPageProps) {
    const [cursoToDelete, setCursoToDelete] = useState<Curso | null>(null)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [estadoFilter, setEstadoFilter] = useState<string>('all')

    const { data, refetch } = useCursos()
    const cursos = data?.cursos ?? initialDataCursos

    const filteredData = useMemo(() => {
        if (estadoFilter === 'all') return cursos

        return cursos.filter(c => c.estado === estadoFilter)
    }, [cursos, estadoFilter])

    const handleDeleteClick = (curso: Curso) => {
        setCursoToDelete(curso)
        setOpenDeleteModal(true)
    }

    const columns = useMemo<ColumnDef<Curso, any>[]>(
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
            columnHelper.accessor('titulo', {
                header: 'Curso',
                cell: ({ row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 200 }}>
                        {row.original.miniatura ? (
                            <Avatar
                                variant='rounded'
                                src={row.original.miniatura}
                                sx={{ width: 56, height: 40 }}
                            />
                        ) : (
                            <Avatar
                                variant='rounded'
                                sx={{ width: 56, height: 40, bgcolor: 'action.hover' }}
                            >
                                <i className='tabler-photo text-xl text-textDisabled' />
                            </Avatar>
                        )}
                        <Box>
                            <Typography variant='body2' fontWeight={600}>
                                {row.original.titulo}
                            </Typography>
                            <Typography variant='caption' color='text.secondary' sx={{ fontFamily: 'monospace' }}>
                                {row.original.slug}
                            </Typography>
                        </Box>
                    </Box>
                )
            }),
            columnHelper.display({
                id: 'profesor',
                header: 'Profesor',
                cell: ({ row }) => {
                    const prof = row.original.profesor

                    return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar src={prof.avatar || ''} sx={{ width: 28, height: 28 }}>
                                {prof.nombre[0]}
                            </Avatar>
                            <Typography variant='body2'>
                                {prof.nombre} {prof.apellido}
                            </Typography>
                        </Box>
                    )
                }
            }),
            columnHelper.display({
                id: 'categoria',
                header: 'Categoría',
                cell: ({ row }) => (
                    row.original.categoria ? (
                        <Chip
                            label={row.original.categoria.nombre}
                            size='small'
                            variant='tonal'
                            color='info'
                        />
                    ) : (
                        <Typography variant='caption' color='text.disabled'>—</Typography>
                    )
                )
            }),
            columnHelper.accessor('estado', {
                header: 'Estado',
                cell: ({ row }) => (
                    <Chip
                        variant='tonal'
                        label={estadoLabel[row.original.estado] || row.original.estado}
                        color={estadoObj[row.original.estado] || 'default'}
                        size='small'
                    />
                )
            }),
            columnHelper.display({
                id: 'precio',
                header: 'Precio',
                cell: ({ row }) => (
                    row.original.es_gratis ? (
                        <Chip label='Gratis' size='small' variant='tonal' color='success' />
                    ) : (
                        <Typography variant='body2' fontWeight={500}>
                            {row.original.moneda === 'PEN' ? 'S/ ' : '$ '}
                            {Number(row.original.precio).toFixed(2)}
                        </Typography>
                    )
                )
            }),
            columnHelper.display({
                id: 'contenido',
                header: 'Contenido',
                cell: ({ row }) => {
                    const modulos = row.original._count.modulos
                    const lecciones = row.original._count.lecciones

                    return (
                        <Typography variant='caption' color='text.secondary'>
                            {modulos} módulo{modulos !== 1 ? 's' : ''} · {lecciones} lección{lecciones !== 1 ? 'es' : ''}
                        </Typography>
                    )
                }
            }),
            columnHelper.display({
                id: 'acciones',
                header: () => <div className='w-full text-right'>Acciones</div>,
                cell: ({ row }) => (
                    <div className='flex items-center justify-end w-full gap-1'>
                        <Tooltip title='Editar curso (Course Builder)'>
                            <IconButton
                                href={`/admin/cursos/${row.original.id}`}
                                component='a'
                            >
                                <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Eliminar'>
                            <IconButton onClick={() => handleDeleteClick(row.original)}>
                                <i className='tabler-trash text-[22px] text-textSecondary' />
                            </IconButton>
                        </Tooltip>
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



    return (
        <>
            <Card>
                <CardHeader title='Gestión de Cursos' className='pbe-4' />
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
                            value={estadoFilter}
                            onChange={e => setEstadoFilter(e.target.value)}
                            className='is-full sm:is-[200px]'
                        >
                            <MenuItem value='all'>Todos los estados</MenuItem>
                            <MenuItem value='BORRADOR'>Borrador</MenuItem>
                            <MenuItem value='PUBLICADO'>Publicado</MenuItem>
                            <MenuItem value='ARCHIVADO'>Archivado</MenuItem>
                        </CustomTextField>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder='Buscar curso'
                            className='is-full sm:is-auto'
                        />
                        <Button
                            variant='contained'
                            startIcon={<i className='tabler-plus' />}
                            href='/admin/cursos/nuevo'
                            component='a'
                            className='is-full sm:is-auto'
                        >
                            Nuevo Curso
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
                                        No hay cursos disponibles
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {table
                                    .getRowModel()
                                    .rows.slice(0, table.getState().pagination.pageSize)
                                    .map(row => (
                                        <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
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

            <CursosActions
                cursoClicked={cursoToDelete}
                deleteCurso={{
                    isOpen: openDeleteModal,
                    closeHandler: () => {
                        setOpenDeleteModal(false)
                        setCursoToDelete(null)
                    }
                }}
                onSuccess={() => refetch()}
            />
        </>
    )
}
