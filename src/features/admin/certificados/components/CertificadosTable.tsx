'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Tooltip,
  Typography
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import { getSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import Swal from 'sweetalert2'

import { AxiosCertificado } from '../http/axiosCertificado'
import type { Certificado } from '../entity/Certificado'
import { CreateCertificadoModal } from './CreateCertificadoModal'
import ImportarCertificadosModal from './ImportarCertificadosModal'
import CustomTextField from '@core/components/mui/TextField'
import HydratedDate from '@/utils/components/HydratedDate'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'


import { useCertificados, useDeleteCertificado } from '../hooks/useCertificados'

const columnHelper = createColumnHelper<Certificado>()

interface CertificadosTableProps {
  initialData?: any | null
}

export function CertificadosTable({ initialData }: CertificadosTableProps) {
  const [params, setParams] = useState({ page: 1, limit: 10, fechaInicio: '', fechaFin: '' })
  const [modalOpen, setModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [activeCertForHistory, setActiveCertForHistory] = useState<Certificado | null>(null)

  const { data, isLoading } = useCertificados(params, initialData || undefined)
  const deleteMutation = useDeleteCertificado()

  const certificados = data?.certificados || []
  const total = data?.paginacion?.total || 0

  const handleDownload = useCallback(async (certificado: Certificado, forceDynamic = false) => {
    try {
      toast.info('Generando PDF...')

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const blob = await axiosCertificado.downloadPdf(certificado.id, false, forceDynamic)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `certificado-${certificado.codigo_verificacion}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Certificado descargado')
    } catch (err: any) {
      console.error('Error downloading certificate:', err)
      toast.error('Error al descargar el certificado')
    }
  }, [])

  const handleDeleteCertificado = useCallback(async (certificado: Certificado) => {
    const hasHistory = !!certificado.datos?.archivo_pdf

    if (hasHistory) {
      const result = await Swal.fire({
        title: '¿Qué deseas eliminar?',
        text: 'Este certificado tiene un PDF importado.',
        icon: 'warning',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#d33',
        denyButtonColor: '#f59e0b',
        confirmButtonText: 'Borrar AMBOS',
        denyButtonText: 'Borrar SOLO importado',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        // Borrar todos
        try {
          await deleteMutation.mutateAsync({ id: certificado.id, type: 'all' })
          toast.success('Certificado eliminado por completo')
        } catch (error: any) {
          toast.error(error.message || 'Error al eliminar')
        }
      } else if (result.isDenied) {
        // Borrar solo importado
        try {
          await deleteMutation.mutateAsync({ id: certificado.id, type: 'imported' })
          toast.success('Certificado importado eliminado')
        } catch (error: any) {
          toast.error(error.message || 'Error al eliminar')
        }
      }
    } else {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el certificado definitivamente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        try {
          await deleteMutation.mutateAsync({ id: certificado.id, type: 'all' })
          toast.success('Certificado eliminado')
        } catch (error: any) {
          toast.error(error.message || 'Error al eliminar')
        }
      }
    }
  }, [deleteMutation])

  const handlePreview = useCallback(async (certificado: Certificado) => {
    try {
      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const blob = await axiosCertificado.downloadPdf(certificado.id, true)
      const url = window.URL.createObjectURL(blob)

      window.open(url, '_blank')
    } catch (err: any) {
      console.error('Error previewing certificate:', err)
      toast.error('Error al visualizar el certificado')
    }
  }, [])

  const handleDownloadAllZip = async () => {
    try {
      toast.info('Generando archivo ZIP...')

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const blob = await axiosCertificado.downloadZip(params.fechaInicio, params.fechaFin)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `certificados.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('ZIP descargado correctamente')
    } catch (err: any) {
      console.error('Error downloading zip:', err)
      toast.error(err?.error || 'Error al descargar ZIP')
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
        header: () => <Box className='w-full text-left'>Acciones</Box>,
        cell: ({ row }) => {
          const hasHistory = !!row.original.datos?.archivo_pdf

          return (
            <Box className='flex items-center justify-start gap-0 w-full'>
              <Tooltip title='Vista previa'>
                <IconButton onClick={() => handlePreview(row.original)} color='secondary' size='small'>
                  <i className='tabler-eye text-[22px]' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Descargar Certificado Base'>
                <IconButton onClick={() => handleDownload(row.original, true)} color='primary' size='small'>
                  <i className='tabler-download text-[22px]' />
                </IconButton>
              </Tooltip>
              {hasHistory && (
                <Tooltip title='Descargar Certificado Importado'>
                  <IconButton
                    onClick={() => handleDownload(row.original, false)}
                    color='success'
                    size='small'
                  >
                    <i className='tabler-file text-[22px]' />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title='Eliminar'>
                <IconButton onClick={() => handleDeleteCertificado(row.original)} color='error' size='small'>
                  <i className='tabler-trash text-[22px]' />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      })
    ],
    [params.page, params.limit, handlePreview, handleDownload, handleDeleteCertificado]
  )

  const table = useReactTable({
    data: certificados,
    columns,
    state: {
      pagination: {
        pageIndex: params.page - 1,
        pageSize: params.limit
      }
    },
    onPaginationChange: updater => {
      const nextPagination =
        typeof updater === 'function'
          ? updater({
            pageIndex: params.page - 1,
            pageSize: params.limit
          })
          : updater

      setParams(prev => ({
        ...prev,
        page: nextPagination.pageIndex + 1,
        limit: nextPagination.pageSize
      }))
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: total
  })

  return (
    <>
      <Card>
        <CardHeader
          title='Certificados Emitidos'
        />
        <Box className='flex justify-between flex-col items-start lg:flex-row lg:items-center p-6 border-bs gap-4'>
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
          <Box className='flex flex-col sm:flex-row items-end gap-4 is-full sm:is-auto'>
            <CustomTextField
              type='date'
              label='Fecha inicio'
              InputLabelProps={{ shrink: true }}
              value={params.fechaInicio}
              onChange={e => {
                setParams(prev => ({ ...prev, fechaInicio: e.target.value, page: 1 }))
              }}
              sx={{ width: 160 }}
              className='is-full sm:is-auto'
            />
            <CustomTextField
              type='date'
              label='Fecha fin'
              InputLabelProps={{ shrink: true }}
              value={params.fechaFin}
              onChange={e => {
                setParams(prev => ({ ...prev, fechaFin: e.target.value, page: 1 }))
              }}
              sx={{ width: 160 }}
              className='is-full sm:is-auto'
            />
            <Button
              variant='contained'
              color='success'
              startIcon={<i className='tabler-download text-[16px]' />}
              onClick={handleDownloadAllZip}
            >
              Descargar
            </Button>
            <Button
              variant='tonal'
              color='primary'
              startIcon={<i className='tabler-upload text-[16px]' />}
              onClick={() => setImportModalOpen(true)}
            >
              Importar
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus text-[16px]' />}
              onClick={() => setModalOpen(true)}
            >
              Crear Certificado
            </Button>
          </Box>
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

      <CreateCertificadoModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <ImportarCertificadosModal open={importModalOpen} handleClose={() => setImportModalOpen(false)} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null)
          setActiveCertForHistory(null)
        }}
      >
        {activeCertForHistory && (
          <MenuItem
            onClick={() => {
              handleDownload(activeCertForHistory, true)
              setAnchorEl(null)
              setActiveCertForHistory(null)
            }}
          >
            Versión Original (Sistema)
          </MenuItem>
        )}
        {activeCertForHistory?.datos &&
          (activeCertForHistory.datos as any).pdf_history?.map((hist: any, idx: number) => {
            const fecha = new Date(hist.fecha).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })


            return (
              <MenuItem
                key={idx}
                onClick={() => {
                  const a = document.createElement('a')

                  a.href = hist.url
                  a.download = `certificado-${activeCertForHistory.codigo_verificacion}-v${idx + 1}.pdf`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  setAnchorEl(null)
                  setActiveCertForHistory(null)
                }}
              >
                Versión Manual {idx + 1} ({fecha})
              </MenuItem>
            )
          })}
      </Menu>
    </>
  )
}
