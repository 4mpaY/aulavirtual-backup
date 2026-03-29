'use client'

import React, { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Tooltip,
    IconButton,
    Chip,
    TextField,
    InputAdornment
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

import { useSession } from 'next-auth/react'

import { useCursos } from '@/features/admin/cursos/hooks/useCursos'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import CourseThumbnail from '@/utils/components/CourseThumbnail'

const ProfesorCursosPage = () => {
    const { data: session } = useSession()
    const router = useRouter()
    const [globalFilter, setGlobalFilter] = useState('')

    // Usamos el hook de cursos pero filtrando por el ID del profesor actual
    const { data: cursosData, isLoading } = useCursos({
        profesor_id: session?.user?.id as string,
        limit: '100' // Para el listado de profesor traemos todos (o paginamos si es necesario)
    })

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper<any>()

        return [
            columnHelper.accessor('miniatura', {
                header: 'Curso',
                cell: ({ row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <CourseThumbnail
                            src={row.original.miniatura}
                            title={row.original.titulo}
                            variant='simple'
                            sx={{ width: 45, height: 45, borderRadius: '8px' }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                                {row.original.titulo}
                            </Typography>
                            <Typography variant='caption'>{row.original.slug}</Typography>
                        </Box>
                    </Box>
                )
            }),
            columnHelper.accessor('estado', {
                header: 'Estado',
                cell: ({ row }) => {
                    const estado = row.original.estado
                    let color: any = 'default'

                    if (estado === 'PUBLICADO') color = 'success'
                    if (estado === 'BORRADOR') color = 'warning'

                    return (
                        <Chip
                            label={estado}
                            color={color}
                            size='small'
                            variant='tonal'
                            sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                    )
                }
            }),
            columnHelper.accessor('_count.modulos', {
                header: 'Contenido',
                cell: ({ row }) => {
                    const modulos = row.original._count?.modulos || 0
                    const lecciones = row.original._count?.lecciones || 0

                    return (
                        <Typography variant='caption' color='text.secondary'>
                            {modulos} módulo{modulos !== 1 ? 's' : ''} · {lecciones} lección{lecciones !== 1 ? 'es' : ''}
                        </Typography>
                    )
                }
            }),
            columnHelper.accessor('_count.inscripciones', {
                header: 'Estudiantes',
                cell: ({ row }) => (
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {row.original._count?.inscripciones || 0}
                    </Typography>
                )
            }),
            columnHelper.display({
                id: 'acciones',
                header: () => <div className='w-full text-right'>Acciones</div>,
                cell: ({ row }) => (
                    <div className='flex items-center justify-end w-full gap-1'>
                        <Tooltip title='Ver en Reproductor'>
                            <IconButton
                                href={`/estudiante/aprender/${row.original.slug}`}
                                component='a'
                                target='_blank'
                            >
                                <i className='tabler-player-play text-[22px] text-primary' />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Gestionar contenido'>
                            <IconButton
                                onClick={() => router.push(`/profesor/mis-cursos/${row.original.id}`)}
                            >
                                <i className='tabler-edit text-[22px] text-textSecondary' />
                            </IconButton>
                        </Tooltip>
                    </div>
                )
            })
        ]
    }, [router])

    const table = useReactTable({
        data: cursosData?.cursos || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter
    })

    return (
        <Box>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant='h4' sx={{ mb: 1, fontWeight: 700 }}>
                        Mis Cursos
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        Gestiona el contenido y revisa el progreso de tus estudiantes.
                    </Typography>
                </Box>
                <Button
                    variant='contained'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => router.push('/profesor/mis-cursos/nuevo')}
                    sx={{ borderRadius: '8px' }}
                >
                    Crear Nuevo Curso
                </Button>
            </Box>

            <Card sx={{ borderRadius: '12px', boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 0 }}>
                    <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <TextField
                            size='small'
                            value={globalFilter ?? ''}
                            onChange={e => setGlobalFilter(e.target.value)}
                            placeholder='Buscar cursos...'
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='tabler-search text-textSecondary' />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ maxWidth: 350 }}
                        />
                    </Box>
                    <Box sx={{ overflowX: 'auto' }}>
                        <table className='w-full border-collapse'>
                            <thead className='bg-grey-50 border-b border-divider'>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id} className='px-6 py-4 text-left text-xs font-bold text-textSecondary uppercase tracking-wider'>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={columns.length} className='px-6 py-10 text-center'>
                                            Cargando tus cursos...
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className='px-6 py-10 text-center'>
                                            Aún no has creado ningún curso. ¡Comienza hoy mismo!
                                        </td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id} className='border-b border-divider hover:bg-grey-50 transition-colors'>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id} className='px-6 py-4'>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Box>
                    <TablePaginationComponent
                        table={table as any}
                    />
                </CardContent>
            </Card>
        </Box>
    )
}

export default ProfesorCursosPage
