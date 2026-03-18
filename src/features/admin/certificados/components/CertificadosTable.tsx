'use client'

import { useMemo, useState } from 'react'

import {
  Card,
  CardHeader,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  TablePagination,
  MenuItem
} from '@mui/material'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import axios from 'axios'
import { toast } from 'react-toastify'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'

import type { Certificado } from '../entity/Certificado'
import { useCertificados } from '../hooks/useCertificados'

const columnHelper = createColumnHelper<Certificado>()

export const CertificadosTable = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [buscar, setBuscar] = useState('')

  const { data, isLoading } = useCertificados({ page, limit, buscar })

  const certificados = data?.certificados || []
  const total = data?.paginacion?.total || 0

  const handleDescargar = async (certificado: Certificado) => {
    try {
      toast.info('Generando PDF...')

      const res = await axios.get(`/api/estudiante/certificado/${certificado.id}/pdf`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')

      link.href = url
      link.setAttribute('download', `certificado-${certificado.codigo_verificacion}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Certificado descargado')
    } catch (err: any) {
      // Si falla por 403, es probable que la API necesite ser actualizada para permitir ADMINs
      toast.error('Error al descargar: Es posible que necesites permisos adicionales.')
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'numero',
        header: '#',
        cell: ({ row }) => (
          <Typography color='text.secondary' variant='body2'>
            {(page - 1) * limit + row.index + 1}
          </Typography>
        )
      }),
      columnHelper.accessor('usuario', {
        header: 'Estudiante',
        cell: ({ row }) => (
          <Box className='flex items-center gap-3'>
            <Avatar
              src={row.original.usuario.avatar || undefined}
              imgProps={{ referrerPolicy: 'no-referrer' }}
            />
            <Box className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.usuario.nombre} {row.original.usuario.apellido}
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {row.original.usuario.correo}
              </Typography>
            </Box>
          </Box>
        )
      }),
      columnHelper.accessor('curso', {
        header: 'Curso',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.curso.titulo}</Typography>
      }),
      columnHelper.accessor('codigo_verificacion', {
        header: 'Código',
        cell: ({ row }) => (
          <Typography variant='body2' sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {row.original.codigo_verificacion}
          </Typography>
        )
      }),
      columnHelper.accessor('emitido_en', {
        header: 'Fecha Emisión',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {new Date(row.original.emitido_en).toLocaleDateString()}
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <Box className='w-full text-right'>Acciones</Box>,
        cell: ({ row }) => (
          <Box className='flex items-center justify-end w-full gap-1'>
            <Tooltip title='Descargar PDF'>
              <IconButton onClick={() => handleDescargar(row.original)} color='primary' size='small'>
                <i className='tabler-download text-[22px]' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      })
    ],
    [page, limit]
  )

  const table = useReactTable({
    data: certificados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.paginacion?.totalPages || 0
  })

  if (isLoading) {
    return <Box p={6}>Cargando certificados...</Box>
  }

  return (
    <Card>
      <CardHeader title='Certificados Emitidos' />
      <Box className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={limit}
          onChange={e => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}
          className='is-[70px]'
        >
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='25'>25</MenuItem>
          <MenuItem value='50'>50</MenuItem>
        </CustomTextField>
        <DebouncedInput
          value={buscar}
          onChange={value => {
            setBuscar(String(value))
            setPage(1)
          }}
          placeholder='Buscar por estudiante, curso o código'
          className='is-full sm:is-auto'
        />
      </Box>

      <Box className='overflow-x-auto'>
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
          {certificados.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  No se encontraron certificados
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </Box>
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={total}
        rowsPerPage={limit}
        page={page - 1}
        onPageChange={(_, newPage: number) => setPage(newPage + 1)}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setLimit(Number(e.target.value))
          setPage(1)
        }}
      />
    </Card>
  )
}
