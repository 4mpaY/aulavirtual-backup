'use client'

import { useMemo, useState } from 'react'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  MenuItem,
  TablePagination,
  Tooltip,
  Typography,
  Chip,
  Switch
} from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table'

import { getSession } from 'next-auth/react'

import { toast } from 'react-toastify'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import { AxiosCertificado } from '../http/axiosCertificado'
import type { Certificado } from '../entity/Certificado'
import { CreateCertificadoModal } from './CreateCertificadoModal'
import { ImportCertificadosModal } from './ImportCertificadosModal'
import CustomTextField from '@core/components/mui/TextField'
import { DebouncedInput } from '@/utils/components/others/DebouncedInput'
import HydratedDate from '@/utils/components/HydratedDate'
import TablePaginationComponent from '@/utils/components/others/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'


import { useCertificados } from '../hooks/useCertificados'

const columnHelper = createColumnHelper<Certificado>()

interface CertificadosTableProps {
  initialData?: any | null
}

export function CertificadosTable({ initialData }: CertificadosTableProps) {
  const [params, setParams] = useState({ page: 1, limit: 10, codigo: '', nombre: '', emision: 'todos' })
  const [modalOpen, setModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [isGeneratingZip, setIsGeneratingZip] = useState(false)

  const { data, isLoading, refetch } = useCertificados(params, initialData || undefined)

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

      const datosManuales = (certificado as any).datos?.usuario
      const nombre = certificado.usuario?.nombre || datosManuales?.nombre || 'usuario'
      const codigo = certificado.codigo_verificacion || 'manual'

      a.href = url
      a.download = `certificado-${nombre.toLowerCase()}-${codigo}.pdf`
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

  const handleDownloadZip = async () => {
    if (certificados.length === 0) return toast.warning('No hay certificados para generar')
    
    setIsGeneratingZip(true)
    const toastId = toast.loading(`Generando ZIP para ${certificados.length} certificados...`)

    try {
      const getAuthToken = async () => {
        const s = await getSession()

        
return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const zip = new JSZip()

      for (let i = 0; i < certificados.length; i++) {
        const cert = certificados[i]

        try {
          const blob = await axiosCertificado.downloadPdf(cert.id, { frontPageOnly: true })
          const datosManuales = (cert as any).datos?.usuario
          const nombre = cert.usuario?.nombre || datosManuales?.nombre || 'usuario'
          const apellido = cert.usuario?.apellido || datosManuales?.apellido || ''
          const codigo = cert.codigo_verificacion || 'manual'
          const filename = `certificado-${nombre.trim()}-${apellido.trim()}-${codigo}.pdf`.toLowerCase().replace(/\s+/g, '-')

          zip.file(filename, blob)
        } catch (e) {
          console.error('Error downloading pdf for', cert, e)
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })

      saveAs(zipBlob, `certificados-${Date.now()}.zip`)

      toast.update(toastId, { render: 'ZIP generado exitosamente', type: 'success', isLoading: false, autoClose: 3000 })
    } catch (error) {
      console.error(error)
      toast.update(toastId, { render: 'Error al generar el ZIP', type: 'error', isLoading: false, autoClose: 3000 })
    } finally {
      setIsGeneratingZip(false)
    }
  }

  const handlePreview = async (certificado: Certificado) => {
    try {
      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })
      const blob = await axiosCertificado.downloadPdf(certificado.id, { preview: true })
      const url = window.URL.createObjectURL(blob)

      window.open(url, '_blank')
    } catch (err: any) {
      console.error('Error previewing certificate:', err)
      toast.error('Error al visualizar el certificado')
    }
  }

  const handleDelete = async (certificado: Certificado) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el certificado con código ${certificado.codigo_verificacion}?`)) {
      return
    }

    try {
      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosCertificado = new AxiosCertificado({ getAuthToken })

      await axiosCertificado.delete(certificado.id)
      
      toast.success('Certificado eliminado correctamente')
      refetch() // Fetch latest data from server
    } catch (err: any) {
      console.error('Error deleting certificate:', err)
      toast.error('Error al eliminar el certificado')
    }
  }

  const handleToggleHomologacion = async (certificado: Certificado) => {
    try {
      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }
      
      const currentHomologacion = (certificado as any).datos?.homologacion || false
      const newHomologacion = !currentHomologacion

      const axiosCertificado = new AxiosCertificado({ getAuthToken })

      await axiosCertificado.toggleHomologacion(certificado.id, newHomologacion)
      
      toast.success(newHomologacion ? 'Homologación activada' : 'Homologación desactivada')
      refetch()
    } catch (err: any) {
      console.error('Error toggling homologation:', err)
      toast.error('Error al actualizar la homologación')
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
        cell: ({ row }) => {
          const usuario = row.original.usuario
          const datosManuales = (row.original as any).datos?.usuario

          const nombre = usuario?.nombre || datosManuales?.nombre || 'Desconocido'
          const apellido = usuario?.apellido || datosManuales?.apellido || ''
          const correo = usuario?.correo || ''
          const avatar = usuario?.avatar || undefined

          return (
            <Box className='flex items-center gap-3'>
              <Avatar
                src={avatar}
                imgProps={{ referrerPolicy: 'no-referrer' }}
              />
              <Box className='flex flex-col'>
                <Typography color='text.primary' sx={{ fontWeight: 500 }}>
                  {nombre} {apellido}
                </Typography>
                {correo && (
                  <Typography variant='caption' color='text.secondary'>
                    {correo}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        }
      }),
      columnHelper.accessor('curso', {
        header: 'Curso',
        cell: ({ row }) => {
          const cursoTitulo = row.original.curso?.titulo || (row.original as any).datos?.curso?.titulo || 'Desconocido'

          
return <Typography color='text.primary'>{cursoTitulo}</Typography>
        }
      }),
      columnHelper.accessor('codigo_verificacion', {
        header: 'Código',
        cell: ({ row }) => {
          const isManual = (row.original as any).datos?.emision_manual === true

          if (isManual) {
            return (
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.disabled' }}>
                -
              </Typography>
            )
          }

          
return (
            <Typography variant='body2' sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {row.original.codigo_verificacion}
            </Typography>
          )
        }
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
        id: 'tipo_emision',
        header: 'Emisión',
        cell: ({ row }) => {
          const isManual = (row.original as any).datos?.emision_manual === true

          
return (
            <Chip 
              label={isManual ? 'Manual' : 'Automático'} 
              size="small" 
              color={isManual ? 'warning' : 'success'} 
              sx={{ fontWeight: 500 }}
            />
          )
        }
      }),
      columnHelper.display({
        id: 'acciones',
        header: () => <Box className='w-full text-right'>Acciones</Box>,
        cell: ({ row }) => {
          const homologado = (row.original as any).datos?.homologacion || false

          return (
            <Box className='flex items-center justify-end w-full gap-1'>
              <Tooltip title={homologado ? 'Desactivar homologación' : 'Activar homologación'}>
                <Switch
                  size="small"
                  checked={homologado}
                  onChange={() => handleToggleHomologacion(row.original)}
                  color="success"
                />
              </Tooltip>
              <Tooltip title='Vista previa'>
                <IconButton onClick={() => handlePreview(row.original)} color='secondary' size='small'>
                  <i className='tabler-eye text-[22px]' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Descargar PDF'>
                <IconButton onClick={() => handleDownload(row.original)} color='primary' size='small'>
                  <i className='tabler-download text-[22px]' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Eliminar'>
                <IconButton onClick={() => handleDelete(row.original)} color='error' size='small'>
                  <i className='tabler-trash text-[22px]' />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params.page, params.limit]
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
          <Box className='flex flex-col sm:flex-row items-center gap-4 is-full sm:is-auto'>
            <DebouncedInput
              value={params.codigo}
              onChange={value => {
                setParams(prev => ({ ...prev, codigo: String(value), page: 1 }))
              }}
              placeholder='Filtrar por código'
              className='is-full sm:is-auto'
            />
            <DebouncedInput
              value={params.nombre}
              onChange={value => {
                setParams(prev => ({ ...prev, nombre: String(value), page: 1 }))
              }}
              placeholder='Filtrar por estudiante'
              className='is-full sm:is-auto'
            />
            <CustomTextField
              select
              value={params.emision}
              onChange={e => setParams(prev => ({ ...prev, emision: String(e.target.value), page: 1 }))}
              sx={{ width: 140 }}
              SelectProps={{ MenuProps: { disableScrollLock: true } }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="automatico">Automáticos</MenuItem>
              <MenuItem value="manual">Manuales</MenuItem>
            </CustomTextField>
            <Button
              variant='outlined'
              startIcon={<i className='tabler-upload text-[16px]' />}
              onClick={() => setImportModalOpen(true)}
            >
              Importar Excel
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              startIcon={isGeneratingZip ? <i className='tabler-loader animate-spin text-[16px]' /> : <i className='tabler-file-zip text-[16px]' />}
              onClick={handleDownloadZip}
              disabled={isGeneratingZip || certificados.length === 0}
            >
              {isGeneratingZip ? 'Generando...' : 'Generar ZIP'}
            </Button>
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus text-[16px]' />}
              onClick={() => setModalOpen(true)}
            >
              Crear
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
      <CreateCertificadoModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={() => {
          setParams(prev => ({ ...prev, page: 1 }))
          refetch()
        }}
      />
      <ImportCertificadosModal 
        open={importModalOpen} 
        onClose={() => setImportModalOpen(false)} 
        onSuccess={() => {
          setParams(prev => ({ ...prev, page: 1 }))
          refetch()
        }}
      />
    </>
  )
}
