'use client'

import { useMemo, useRef, useState } from 'react'

import { usePathname } from 'next/navigation'

import {
  Box,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  Typography
} from '@mui/material'
import type { DatesSetArg, EventClickArg } from '@fullcalendar/core'

import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import esLocale from '@fullcalendar/core/locales/es'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'

import { EventoModal } from './EventoModal'

import { useCalendario } from '../hooks/useCalendario'


const FILTROS = [
  { tipo: 'CLASE_VIVO', label: 'Clase en vivo', color: '#1565C0', icon: 'tabler-video' },
  { tipo: 'EXAMEN', label: 'Examen', color: '#C62828', icon: 'tabler-file-text' },
  { tipo: 'CURSO_INICIO', label: 'Inicio de curso', color: '#2E7D32', icon: 'tabler-book-open' },
  { tipo: 'CURSO_FIN', label: 'Fin de curso', color: '#E65100', icon: 'tabler-flag' }
]

const VISTAS = [
  { key: 'dayGridMonth', label: 'Mes' },
  { key: 'timeGridWeek', label: 'Semana' },
  { key: 'timeGridDay', label: 'Día' },
  { key: 'listMonth', label: 'Lista' }
]

const FC_STYLES = {
  // Oculta la toolbar nativa
  '.fc-toolbar': { display: 'none !important' },

  // Fuente global
  '.fc': { fontFamily: 'inherit !important' },

  // Cabecera de días
  '.fc-col-header-cell': {
    bgcolor: 'transparent',
    borderBottom: '1px solid',
    borderColor: 'divider',
    py: 1
  },
  '.fc-col-header-cell-cushion': {
    fontWeight: '700 !important',
    fontSize: '12px !important',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'text.secondary',
    textDecoration: 'none !important'
  },

  // Números de día
  '.fc-daygrid-day-number': {
    fontWeight: '600 !important',
    fontSize: '13px !important',
    color: 'text.secondary',
    textDecoration: 'none !important',
    padding: '6px 8px !important'
  },

  // Hoy
  '.fc-day-today': {
    bgcolor: 'primary.lightOpacity !important',
    '& .fc-daygrid-day-number': { color: 'primary.main !important', fontWeight: '800 !important' }
  },
  '.fc-day-today .fc-daygrid-day-number': {
    bgcolor: 'primary.main',
    color: '#fff !important',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700 !important'
  },

  // Eventos
  '.fc-event': {
    cursor: 'pointer',
    borderRadius: '6px !important',
    border: 'none !important',
    px: '4px',
    fontSize: '12px !important',
    fontWeight: '600 !important',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)'
  },
  '.fc-event:hover': { filter: 'brightness(0.92)', transform: 'translateY(-1px)', transition: 'all 0.15s' },
  '.fc-event-title': { fontWeight: '600 !important' },
  '.fc-daygrid-more-link': {
    color: 'primary.main !important',
    fontWeight: '600 !important',
    fontSize: '11px !important'
  },

  // Vista lista
  '.fc-list-event': { cursor: 'pointer' },
  '.fc-list-event:hover td': { bgcolor: 'action.hover !important' },
  '.fc-list-day-cushion': {
    bgcolor: 'action.hover !important',
    fontWeight: '700 !important'
  },
  '.fc-list-event-title a': {
    color: 'text.primary !important',
    textDecoration: 'none !important',
    fontWeight: '600 !important'
  },
  '.fc-list-empty': { bgcolor: 'transparent !important' },

  // Vista semana/día — línea de tiempo
  '.fc-timegrid-slot': { height: '48px !important' },
  '.fc-timegrid-slot-label': { fontSize: '11px !important', color: 'text.disabled !important', fontWeight: '600 !important' },
  '.fc-timegrid-now-indicator-line': { borderColor: 'error.main !important', borderWidth: '2px !important' },
  '.fc-timegrid-event': { borderRadius: '8px !important', border: 'none !important', boxShadow: '0 2px 8px rgba(0,0,0,0.18) !important' },

  // Bordes generales
  '.fc-scrollgrid': { border: 'none !important', borderRadius: '0 !important' },
  '.fc-scrollgrid td, .fc-scrollgrid th': { borderColor: 'divider !important' },
  'td.fc-day': { borderColor: 'divider !important' }
}

export function CalendarioView() {
  const pathname = usePathname()
  const calendarRef = useRef<FullCalendar>(null)

  const basePath = pathname.includes('/estudiante')
    ? '/estudiante/aprender'
    : pathname.includes('/profesor')
      ? '/profesor/mis-cursos'
      : '/cursos'

  const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('dayGridMonth')
  const [tituloMes, setTituloMes] = useState('')

  const [filtrosActivos, setFiltrosActivos] = useState<Set<string>>(
    new Set(FILTROS.map(f => f.tipo))
  )

  const [rango, setRango] = useState<{ desde: string; hasta: string }>(() => {
    const hoy = new Date()

    return {
      desde: new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1).toISOString(),
      hasta: new Date(hoy.getFullYear(), hoy.getMonth() + 4, 0).toISOString()
    }
  })

  const { data: eventos = [], isLoading } = useCalendario(rango.desde, rango.hasta)

  const eventosFiltrados = useMemo(
    () => eventos.filter(e => filtrosActivos.has(e.extendedProps?.tipo)),
    [eventos, filtrosActivos]
  )

  const proximosEventos = useMemo(() => {
    const ahora = new Date()

    return [...eventosFiltrados]
      .filter(e => new Date(e.start) >= ahora)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 6)
  }, [eventosFiltrados])

  const handleDatesSet = (arg: DatesSetArg) => {
    setRango({ desde: arg.startStr, hasta: arg.endStr })
    setTituloMes(arg.view.title)
  }

  const handleEventClick = (arg: EventClickArg) => {
    setEventoSeleccionado({
      title: arg.event.title,
      start: arg.event.startStr,
      end: arg.event.endStr || undefined,
      extendedProps: arg.event.extendedProps
    })
    setModalOpen(true)
  }

  const toggleFiltro = (tipo: string) => {
    setFiltrosActivos(prev => {
      const next = new Set(prev)

      if (next.has(tipo)) next.delete(tipo)
      else next.add(tipo)

      return next
    })
  }

  const cambiarVista = (v: string) => {
    calendarRef.current?.getApi().changeView(v)
    setVistaActiva(v)
  }

  return (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>

      {/* ── SIDEBAR ── */}
      <Card elevation={0} sx={{
        width: 260, flexShrink: 0, borderRadius: 3,
        border: '1px solid', borderColor: 'divider',
        overflow: 'hidden'
      }}>
        {/* Filtros header */}
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5 }}>
          <Typography variant='caption' sx={{ fontWeight: 800, letterSpacing: '0.1em', color: 'text.disabled', textTransform: 'uppercase', fontSize: 10 }}>
            Filtros
          </Typography>
        </Box>

        {/* Ver todo */}
        <Box sx={{ px: 2, pb: 0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filtrosActivos.size === FILTROS.length}
                indeterminate={filtrosActivos.size > 0 && filtrosActivos.size < FILTROS.length}
                onChange={() => setFiltrosActivos(
                  filtrosActivos.size === FILTROS.length ? new Set() : new Set(FILTROS.map(f => f.tipo))
                )}
                size='small' sx={{ p: 0.75 }}
              />
            }
            label={<Typography variant='body2' fontWeight={600} sx={{ fontSize: 13 }}>Ver todo</Typography>}
            sx={{ mx: 0, gap: 0.5 }}
          />
        </Box>

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Filtros individuales */}
        <Box sx={{ px: 2, pb: 2 }}>
          {FILTROS.map(f => (
            <FormControlLabel
              key={f.tipo}
              control={
                <Checkbox
                  checked={filtrosActivos.has(f.tipo)}
                  onChange={() => toggleFiltro(f.tipo)}
                  size='small'
                  sx={{ p: 0.75, color: f.color + '80', '&.Mui-checked': { color: f.color } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: f.color, flexShrink: 0 }} />
                  <Typography variant='body2' sx={{ fontSize: 13 }}>{f.label}</Typography>
                </Box>
              }
              sx={{ mx: 0, gap: 0.5, display: 'flex', mb: 0.25 }}
            />
          ))}
        </Box>

        <Divider />

        {/* Próximos eventos */}
        <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
          <Typography variant='caption' sx={{ fontWeight: 800, letterSpacing: '0.1em', color: 'text.disabled', textTransform: 'uppercase', fontSize: 10 }}>
            Próximos eventos
          </Typography>
        </Box>

        <Box sx={{ pb: 2 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress size={22} />
            </Box>
          ) : proximosEventos.length === 0 ? (
            <Box sx={{ px: 2.5, py: 2, textAlign: 'center' }}>
              <i className='tabler-calendar-off' style={{ fontSize: 28, opacity: 0.25 }} />
              <Typography variant='caption' color='text.disabled' display='block' sx={{ mt: 0.5 }}>
                Sin eventos próximos
              </Typography>
            </Box>
          ) : (
            proximosEventos.map(ev => {
              const cfg = FILTROS.find(f => f.tipo === ev.extendedProps?.tipo)

              return (
                <Box
                  key={ev.id}
                  onClick={() => { setEventoSeleccionado({ title: ev.title, start: ev.start, end: ev.end, extendedProps: ev.extendedProps }); setModalOpen(true) }}
                  sx={{
                    mx: 1.5, mb: 1, px: 1.5, py: 1.25,
                    borderRadius: 2, cursor: 'pointer',
                    borderLeft: `3px solid ${cfg?.color ?? '#999'}`,
                    bgcolor: (cfg?.color ?? '#999') + '12',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: (cfg?.color ?? '#999') + '22', transform: 'translateX(2px)' }
                  }}
                >
                  <Typography variant='caption' sx={{ color: cfg?.color, fontWeight: 700, display: 'block', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {cfg?.label}
                  </Typography>
                  <Typography variant='body2' fontWeight={600} noWrap sx={{ fontSize: 12.5, mt: 0.25 }}>
                    {ev.title}
                  </Typography>
                  <Typography variant='caption' color='text.secondary' sx={{ fontSize: 11 }}>
                    {new Date(ev.start).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              )
            })
          )}
        </Box>
      </Card>

      {/* ── CALENDARIO PRINCIPAL ── */}
      <Card elevation={0} sx={{
        flex: 1, borderRadius: 3, overflow: 'hidden',
        border: '1px solid', borderColor: 'divider'
      }}>
        {/* Toolbar */}
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 2,
          borderBottom: '1px solid', borderColor: 'divider'
        }}>
          {/* Navegación + título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size='small'
              onClick={() => calendarRef.current?.getApi().prev()}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <i className='tabler-chevron-left text-lg' />
            </IconButton>
            <IconButton
              size='small'
              onClick={() => calendarRef.current?.getApi().next()}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
            >
              <i className='tabler-chevron-right text-lg' />
            </IconButton>
            <Typography variant='h6' fontWeight={700} sx={{ ml: 1, textTransform: 'capitalize', fontSize: 16 }}>
              {tituloMes}
            </Typography>
          </Box>

          {/* Hoy + vistas */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label='Hoy'
              onClick={() => calendarRef.current?.getApi().today()}
              size='small'
              variant='outlined'
              sx={{ fontWeight: 700, borderRadius: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
            />
            <Box sx={{ display: 'flex', bgcolor: 'action.hover', borderRadius: 2.5, p: 0.5, gap: 0.25 }}>
              {VISTAS.map(v => (
                <Box
                  key={v.key}
                  onClick={() => cambiarVista(v.key)}
                  sx={{
                    px: 1.5, py: 0.5, borderRadius: 2, cursor: 'pointer',
                    fontSize: 13, fontWeight: 600,
                    bgcolor: vistaActiva === v.key ? 'background.paper' : 'transparent',
                    color: vistaActiva === v.key ? 'primary.main' : 'text.secondary',
                    boxShadow: vistaActiva === v.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s',
                    '&:hover': { color: 'text.primary' }
                  }}
                >
                  {v.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* FullCalendar */}
        <Box sx={{ px: 1, pb: 1, ...FC_STYLES }}>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          )}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            locale={esLocale}
            headerToolbar={false}
            height='auto'
            events={eventosFiltrados}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            eventDisplay='block'
            dayMaxEvents={3}
            moreLinkText={n => `+${n} más`}
            noEventsText='Sin eventos en este período'
            listDayFormat={{ weekday: 'long', day: 'numeric', month: 'long' }}
            listDaySideFormat={false}
            eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
          />
        </Box>
      </Card>

      <EventoModal open={modalOpen} handleClose={() => setModalOpen(false)} basePath={basePath} evento={eventoSeleccionado} />
    </Box>
  )
}
