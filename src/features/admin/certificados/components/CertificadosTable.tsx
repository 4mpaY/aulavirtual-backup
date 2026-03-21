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

import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@core/components/mui/TextField'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'

import type { Certificado } from '../entity/Certificado'
import { useCertificados } from '../hooks/useCertificados'
import { AxiosCertificado } from '../http/axiosCertificado'
import HydratedDate from '@/utils/components/HydratedDate'

const columnHelper = createColumnHelper<Certificado>()

interface CertificadosTableProps {
  initialData?: any | null
}

export function CertificadosTable({ initialData }: CertificadosTableProps) {
  const [params, setParams] = useState({ page: 1, limit: 10, buscar: '' })

  const { data, isLoading } = useCertificados(params, initialData || undefined)

  const certificados = data?.certificados || []
  const total = data?.paginacion?.total || 0

  const handleDownload = async (certificado: Certificado) => {
    try {
      toast.info('Generando PDF...')

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const blob = await axiosCertificado.downloadPdf(certificado.id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `certificado-${certificado.usuario.nombre.toLowerCase()}-${certificado.codigo_verificacion}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Certificado descargado')
    } catch (err: any) {
      console.error('Error downloading certificate:', err)
      toast.error('Error al descargar el certificado')
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'numero',
        header: '#',
        cell: ({ row }) => (
          <Typography color='text.secondary' variant='body2'>
            {(params.page - 1) * params.limit + row.index + 1}
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
              <Typography color='text.primary' sx={{ fontWeight: 500 }}>
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
            <HydratedDate date={row.original.emitido_en} format="date" />
          </Typography>
        )
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <Box className='w-full text-right'>Acciones</Box>,
        cell: ({ row }) => (
          <Box className='flex items-center justify-end w-full gap-1'>
            <Tooltip title='Descargar PDF'>
              <IconButton onClick={() => handleDownload(row.original)} color='primary' size='small'>
                <i className='tabler-download text-[22px]' />
              </IconButton>
            </Tooltip>
          </Box>
        )
      })
    ],
    [params.page, params.limit]
  )

  const table = useReactTable({
    data: certificados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.paginacion?.totalPages || 0
  })

  return (
    <Card>
      <CardHeader title='Certificados Emitidos' />
      <Box className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
        <CustomTextField
          select
          value={params.limit}
          onChange={e => {
            setParams(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))
          }}
          sx={{ width: 80 }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </CustomTextField>
        <DebouncedInput
          value={params.buscar}
          onChange={value => {
            setParams(prev => ({ ...prev, buscar: String(value), page: 1 }))
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
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-10'>
                  Cargando certificados...
                </td>
              </tr>
            ) : certificados.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-10'>
                  No se encontraron certificados
                </td>
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
      </Box>
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={total}
        rowsPerPage={params.limit}
        page={params.page - 1}
        onPageChange={(_, newPage: number) => setParams(prev => ({ ...prev, page: newPage + 1 }))}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setParams(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))
        }}
      />
    </Card>
  )
}
