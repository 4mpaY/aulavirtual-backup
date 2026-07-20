'use client'

import { useState } from 'react'
import type { SyntheticEvent } from 'react'

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Divider,
  MenuItem,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Link,
  CardHeader,
  FormControlLabel,
  Alert
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { getSession } from 'next-auth/react'
import { Rol } from '@prisma/client'

import { AxiosConfiguracion } from '../http/axiosConfiguracion'
import type { Configuracion } from '../entity/Configuracion'
import MediaLibrary from '../../cursos/components/MediaLibrary'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { usePlantillasCertificado } from '../../plantillas-certificado/hooks/usePlantillasCertificado'
import { PLANTILLAS_CERTIFICADO_FIJAS } from '../../plantillas-certificado/entity/plantillasFijas'
import { useFirmantes } from '../../firmantes/hooks/useFirmantes'

interface ConfiguracionViewProps {
  initialData?: Configuracion[]
}


interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      variant='overline'
      sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 1.2, display: 'block', mb: 2 }}
    >
      {children}
    </Typography>
  )
}

function CertificadosSettings({ config, onInputChange }: { config: any; onInputChange: (clave: string, valor: string) => void }) {
  const { data: usuariosData, isLoading } = useUsuarios({ limit: '1000' })
  const candidatos = (usuariosData?.usuarios || []).filter(u => u.rol === Rol.ADMIN || u.rol === Rol.PROFESOR)
  const plantillaActiva = config.CERTIFICADO_PLANTILLA || 'clasico'

  const { data: plantillasPersonalizadas = [] } = usePlantillasCertificado()
  const { data: firmantes = [] } = useFirmantes()
  const firmantesActivos = firmantes.filter(f => f.activo)

  const opcionesPlantilla = [
    ...PLANTILLAS_CERTIFICADO_FIJAS,
    ...plantillasPersonalizadas
      .filter(p => p.activo && p.cara_frente_url)
      .map(p => ({
        id: p.id,
        nombre: p.nombre,
        descripcion: 'Diseño personalizado (subido por ti)',
        thumbnail: p.cara_frente_url
      }))
  ]

  return (
    <Stack spacing={4}>

      {/* ── SELECTOR DE PLANTILLA ─────────────────────────────── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
          <SectionLabel>Plantilla de Certificado</SectionLabel>
          <Button
            variant='outlined'
            size='small'
            href='/admin/plantillas-certificado'
            component={Link}
            endIcon={<i className='tabler-arrow-right' style={{ fontSize: 16 }} />}
          >
            Gestionar plantillas personalizadas
          </Button>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Selecciona el diseño que se usará para todos los certificados generados en la plataforma.
          Los colores y el logo se aplican automáticamente según el branding configurado. También puedes
          subir tu propio diseño (cara 1 y cara 2) desde &quot;Gestionar plantillas personalizadas&quot;.
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {opcionesPlantilla.map((p) => {
            const isSelected = plantillaActiva === p.id


            return (
              <Box
                key={p.id}
                onClick={() => onInputChange('CERTIFICADO_PLANTILLA', p.id)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  overflow: 'hidden',
                  transition: 'all 0.18s',
                  boxShadow: isSelected ? 4 : 0,
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute', top: 6, right: 6, zIndex: 1,
                      bgcolor: 'primary.main', borderRadius: '50%',
                      width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <i className='tabler-check' style={{ fontSize: 13, color: '#fff' }} />
                  </Box>
                )}
                <Box
                  component='img'
                  src={p.thumbnail}
                  alt={p.nombre}
                  sx={{ width: '100%', aspectRatio: '297/210', objectFit: 'cover', display: 'block' }}
                />
                <Box sx={{ p: 1.5, bgcolor: isSelected ? 'primary.main' : 'background.paper' }}>
                  <Typography
                    variant='body2'
                    fontWeight={700}
                    sx={{ color: isSelected ? '#fff' : 'text.primary', mb: 0.3 }}
                  >
                    {p.nombre}
                  </Typography>
                  <Typography
                    variant='caption'
                    sx={{ color: isSelected ? 'rgba(255,255,255,0.8)' : 'text.secondary', lineHeight: 1.3, display: 'block' }}
                  >
                    {p.descripcion}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>

      <Divider />
      <Box>
        <SectionLabel>Información de la Institución</SectionLabel>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Estos datos se imprimirán en la cabecera del certificado. Si se dejan en blanco, se usarán los datos generales de branding.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Nombre de la Institución'
              value={config.CERTIFICADO_INSTITUTION_NAME || ''}
              onChange={(e) => onInputChange('CERTIFICADO_INSTITUTION_NAME', e.target.value)}
              placeholder='Ej: Instituto Tecnológico ARM'
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Eslogan o Lema'
              value={config.CERTIFICADO_SLOGAN || ''}
              onChange={(e) => onInputChange('CERTIFICADO_SLOGAN', e.target.value)}
              placeholder='Ej: Capacitación de Élite'
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box>
        <SectionLabel>Configuración de Firmas</SectionLabel>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Selecciona al usuario que actuará como <strong>Gerente General</strong> en los certificados. Asegúrate de que tenga su <strong>Cargo</strong> y <strong>Firma</strong> configurados en su perfil.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label='Designar Principal Firmante'
              value={config.CERTIFICADO_GERENTE_GENERAL_ID || ''}
              onChange={(e) => onInputChange('CERTIFICADO_GERENTE_GENERAL_ID', e.target.value)}
              disabled={isLoading}
              helperText='Este usuario aparecerá como el principal firmante en todos los certificados.'
            >
              <MenuItem value=''>
                <em>Ninguno seleccionado</em>
              </MenuItem>
              {candidatos.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} ({u.rol})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper variant='outlined' sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.CERTIFICADO_MOSTRAR_FIRMA_DOCENTE !== 'false'}
                    onChange={(e) => onInputChange('CERTIFICADO_MOSTRAR_FIRMA_DOCENTE', e.target.checked ? 'true' : 'false')}
                    color='primary'
                  />
                }
                label={
                  <Box>
                    <Typography variant='body2' fontWeight={600}>Mostrar firma del docente</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Si está activo, la firma del docente del curso aparecerá como firmante secundario en el certificado.
                    </Typography>
                  </Box>
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {config.CERTIFICADO_GERENTE_GENERAL_ID && candidatos.find(u => u.id === config.CERTIFICADO_GERENTE_GENERAL_ID) && (
        <Paper variant='outlined' sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
          <Typography variant='subtitle2' gutterBottom>Vista Previa — Gerente General</Typography>
          {(() => {
            const gerente = candidatos.find(u => u.id === config.CERTIFICADO_GERENTE_GENERAL_ID)

            return (
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  {gerente?.firma ? (
                    <Box sx={{ width: 120, height: 60, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', p: 0.5 }}>
                      <img src={gerente.firma} alt='Firma' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                  ) : (
                    <Typography variant='caption' color='error'>Sin firma configurada</Typography>
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant='body2' fontWeight={600}>{gerente?.nombre} {gerente?.apellido}</Typography>
                  <Typography variant='caption' display='block'>
                    {gerente?.cargo || <span style={{ color: 'red' }}>Sin cargo configurado</span>}
                  </Typography>
                </Grid>
              </Grid>
            )
          })()}
        </Paper>
      )}

      <Divider />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
          <SectionLabel>Firmante 1 / Firmante 2 (plantilla personalizada)</SectionLabel>
          <Button
            variant='outlined'
            size='small'
            href='/admin/firmantes'
            component={Link}
            endIcon={<i className='tabler-arrow-right' style={{ fontSize: 16 }} />}
          >
            Gestionar firmantes
          </Button>
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Catálogo independiente de firmantes (nombre, cargo, firma y sello) que solo aplica a las plantillas
          de certificado <strong>personalizadas</strong>. Los valores de aquí son el firmante por defecto; cada
          curso puede elegir su propio Firmante 1 / Firmante 2 desde su configuración, sin afectar a este valor global.
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label='Firmante 1 por defecto'
              value={config.CERTIFICADO_FIRMANTE_1_ID || ''}
              onChange={(e) => onInputChange('CERTIFICADO_FIRMANTE_1_ID', e.target.value)}
            >
              <MenuItem value=''>
                <em>Ninguno seleccionado</em>
              </MenuItem>
              {firmantesActivos.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nombre}{f.cargo ? ` (${f.cargo})` : ''}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label='Firmante 2 por defecto'
              value={config.CERTIFICADO_FIRMANTE_2_ID || ''}
              onChange={(e) => onInputChange('CERTIFICADO_FIRMANTE_2_ID', e.target.value)}
            >
              <MenuItem value=''>
                <em>Ninguno seleccionado</em>
              </MenuItem>
              {firmantesActivos.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.nombre}{f.cargo ? ` (${f.cargo})` : ''}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  )
}

interface GatewayAccordionProps {
  icon: string
  title: string
  subtitle: string
  enabledKey: string
  config: any
  onInputChange: (clave: string, valor: string) => void
  children: React.ReactNode
}

function GatewayAccordion({ icon, title, subtitle, enabledKey, config, onInputChange, children }: GatewayAccordionProps) {
  const enabled = config[enabledKey] === 'true'

  return (
    <Accordion
      variant='outlined'
      sx={{ borderRadius: '8px !important', '&:before': { display: 'none' }, mb: 1 }}
    >
      <AccordionSummary
        expandIcon={<i className='tabler-chevron-down' style={{ fontSize: 18 }} />}
        sx={{ px: 3, py: 1.5, minHeight: 64 }}
      >
        <Stack direction='row' alignItems='center' spacing={2} sx={{ flex: 1, mr: 2 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              bgcolor: 'action.selected',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <i className={icon} style={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle1' fontWeight={600} lineHeight={1.2}>{title}</Typography>
            <Typography variant='caption' color='text.secondary'>{subtitle}</Typography>
          </Box>
          <Chip
            label={enabled ? 'Activo' : 'Inactivo'}
            color={enabled ? 'success' : 'default'}
            size='small'
            sx={{ fontWeight: 600 }}
          />
          <Switch
            checked={enabled}
            size='small'
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onInputChange(enabledKey, e.target.checked ? 'true' : 'false')}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 3, pb: 3, pt: 1 }}>
        <Divider sx={{ mb: 3 }} />
        {children}
      </AccordionDetails>
    </Accordion>
  )
}

interface LegalSeccion {
  titulo: string
  contenido: string
}

interface LegalPageEditorProps {
  prefix: string
  label: string
  config: any
  onInputChange: (clave: string, valor: string) => void
}

function LegalPageEditor({ prefix, label, config, onInputChange }: LegalPageEditorProps) {
  const seccionesKey = `${prefix}_SECCIONES`

  const secciones: LegalSeccion[] = (() => {
    try {
      const arr = JSON.parse(config[seccionesKey] || '[]')

      if (Array.isArray(arr)) return arr
    } catch { /* ignore */ }

    return []
  })()

  const updateSeccion = (index: number, partial: Partial<LegalSeccion>) => {
    const updated = [...secciones]

    updated[index] = { ...updated[index], ...partial }
    onInputChange(seccionesKey, JSON.stringify(updated))
  }

  const addSeccion = () => {
    onInputChange(seccionesKey, JSON.stringify([...secciones, { titulo: '', contenido: '' }]))
  }

  const removeSeccion = (index: number) => {
    onInputChange(seccionesKey, JSON.stringify(secciones.filter((_, i) => i !== index)))
  }

  return (
    <Box>
      <Typography variant='h6' gutterBottom>{label}</Typography>
      <Stack spacing={3} sx={{ mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Título de la página'
              value={config[`${prefix}_TITULO`] || ''}
              onChange={(e) => onInputChange(`${prefix}_TITULO`, e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Subtítulo (ej. fecha de actualización)'
              value={config[`${prefix}_SUBTITULO`] || ''}
              onChange={(e) => onInputChange(`${prefix}_SUBTITULO`, e.target.value)}
            />
          </Grid>
        </Grid>
        <TextField
          fullWidth
          multiline
          rows={3}
          label='Párrafo introductorio'
          value={config[`${prefix}_INTRO`] || ''}
          onChange={(e) => onInputChange(`${prefix}_INTRO`, e.target.value)}
        />
      </Stack>

      <Typography variant='subtitle2' sx={{ mb: 1.5 }}>Secciones</Typography>
      <Stack spacing={2} sx={{ mb: 2 }}>
        {secciones.map((s, i) => (
          <Paper key={i} variant='outlined' sx={{ p: 2 }}>
            <Stack direction='row' spacing={2} alignItems='flex-start'>
              <Stack spacing={1.5} sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  size='small'
                  label={`Título de la sección ${i + 1}`}
                  value={s.titulo}
                  onChange={(e) => updateSeccion(i, { titulo: e.target.value })}
                />
                <TextField
                  fullWidth
                  size='small'
                  multiline
                  rows={4}
                  label='Contenido'
                  value={s.contenido}
                  onChange={(e) => updateSeccion(i, { contenido: e.target.value })}
                  helperText='Deja una línea en blanco para separar párrafos. Si escribes "Libro de Reclamaciones", se enlaza automáticamente a esa página.'
                />
              </Stack>
              <IconButton size='small' color='error' onClick={() => removeSeccion(i)}>
                <i className='tabler-trash' style={{ fontSize: '1rem' }} />
              </IconButton>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Button variant='outlined' size='small' startIcon={<i className='tabler-plus' />} onClick={addSeccion}>
        Añadir sección
      </Button>
    </Box>
  )
}

export function ConfiguracionView({ initialData }: ConfiguracionViewProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [tabValue, setTabValue] = useState(0)
  const [saving, setSaving] = useState(false)
  const [openMedia, setOpenMedia] = useState(false)
  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({})
  const [openLogoMedia, setOpenLogoMedia] = useState(false)
  const [openFaviconMedia, setOpenFaviconMedia] = useState(false)
  const [openHeroImageMedia, setOpenHeroImageMedia] = useState(false)
  const [pendingLogoLabel, setPendingLogoLabel] = useState('')
  const [openConvenioMedia, setOpenConvenioMedia] = useState(false)
  const [pendingConvenioLabel, setPendingConvenioLabel] = useState('')

  const initialMapped = (initialData || []).reduce((acc: { [key: string]: string }, curr: Configuracion) => {
    acc[curr.clave] = curr.valor

    return acc
  }, {})

  const heroImagesInitial: string[] = (() => {
    try {
      const arr = JSON.parse(initialMapped.HOME_HERO_IMAGES || '[]')

      if (Array.isArray(arr) && arr.length > 0) return arr
    } catch { /* ignore */ }

    return initialMapped.HOME_HERO_IMAGE ? [initialMapped.HOME_HERO_IMAGE] : []
  })()

  const [config, setConfig] = useState<{ [key: string]: string }>({
    HOME_HERO_TITLE: '',
    HOME_HERO_DESCRIPTION: '',
    WHATSAPP_NUMERO: '',
    WHATSAPP_NUMERO_EMPRESAS: '',
    HOME_LOGOS: '[]',
    HOME_HERO_IMAGE: '',
    HOME_CURSOS_TITLE: 'Cursos destacados',
    HOME_CURSOS_SUBTITLE: 'Descubre nuestros cursos más recientes',
    HOME_CONVENIOS_HABILITADO: 'true',
    HOME_CONVENIOS_TITLE: 'Nuestros convenios',
    HOME_CONVENIOS_DESCRIPTION: '',
    HOME_CONVENIOS_LOGOS: '[]',
    HOME_POR_QUE_ELEGIRNOS_HABILITADO: 'true',
    HOME_POR_QUE_ELEGIRNOS: '[]',
    HOME_DOCENTES_TITLE: 'Nuestros Profesores',
    HOME_DOCENTES_SUBTITLE: 'Aprende de profesionales con amplia experiencia en el sector industrial y académico.',
    NOSOTROS_HERO_TITLE: 'Somos calidad y responsabilidad a tu servicio',
    NOSOTROS_HERO_DESCRIPTION: '',
    NOSOTROS_STATS: '[]',
    NOSOTROS_MISION_TEXTO: '',
    NOSOTROS_VISION_TEXTO: '',
    NOSOTROS_VALORES: '[]',
    LEGAL_TERMINOS_TITULO: 'Términos y Condiciones',
    LEGAL_TERMINOS_SUBTITULO: '',
    LEGAL_TERMINOS_INTRO: '',
    LEGAL_TERMINOS_SECCIONES: '[]',
    LEGAL_DEVOLUCIONES_TITULO: 'Política de Cambios y Devoluciones',
    LEGAL_DEVOLUCIONES_SUBTITULO: '',
    LEGAL_DEVOLUCIONES_INTRO: '',
    LEGAL_DEVOLUCIONES_SECCIONES: '[]',
    LEGAL_PRIVACIDAD_TITULO: 'Política de Privacidad',
    LEGAL_PRIVACIDAD_SUBTITULO: '',
    LEGAL_PRIVACIDAD_INTRO: '',
    LEGAL_PRIVACIDAD_SECCIONES: '[]',
    LEGAL_RECLAMOS_INTRO: '',
    LEGAL_RECLAMOS_PROVEEDOR: '',
    LEGAL_RECLAMOS_RUC: '',
    LEGAL_RECLAMOS_DOMICILIO: '',
    TEMPLATE_NAME: 'Aula Virtual',
    TEMPLATE_SLOGAN: '',
    CERTIFICADO_INSTITUTION_NAME: '',
    CERTIFICADO_SLOGAN: '',
    CERTIFICADO_INSTITUTION_URL: '',
    TEMPLATE_LOGO: '',
    SITE_FAVICON: '',
    SETTINGS_COOKIE_NAME: 'arm',
    PRIMARY_COLOR_MAIN: '#131FF2',
    PRIMARY_COLOR_LIGHT: '#242CBF',
    PRIMARY_COLOR_DARK: '#9196F2',
    PAYPAL_ENABLED: 'true',
    PAYPAL_CLIENT_ID: '',
    PAYPAL_API_URL: 'https://api-m.sandbox.paypal.com',
    PAYPAL_PUBLIC_CLIENT_ID: '',
    PAYPAL_EXCHANGE_RATE: '3.80',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    IZIPAY_ENABLED: 'true',
    CULQI_ENABLED: 'true',
    CULQI_PUBLIC_KEY: '',
    CULQI_RSA_ID: '',
    CULQI_RSA_PUBLIC_KEY: '',
    CERTIFICADO_GERENTE_GENERAL_ID: '',
    CERTIFICADO_PLANTILLA: 'clasico',
    PAGO_MANUAL_ENABLED: 'false',
    PAGO_MANUAL_WHATSAPP_NUMERO: '',
    PAGO_MANUAL_WHATSAPP_MENSAJE: '',
    MP_ENABLED: 'true',
    MP_PUBLIC_KEY: '',
    PEDIDOS_SOLICITAR_COMPROBANTE: 'true',
    COMENTARIOS_REQUIERE_APROBACION: 'false',
    chat_entre_alumnos: 'false',
    ...initialMapped,
    HOME_HERO_IMAGES: JSON.stringify(heroImagesInitial),
  })

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (clave: string, valor: string) => {
    setConfig(prev => ({ ...prev, [clave]: valor }))
  }

  const logosArray: { label: string; url: string }[] = (() => {
    try { return JSON.parse(config.HOME_LOGOS || '[]') } catch { return [] }
  })()

  const handleRemoveLogo = (index: number) => {
    const updated = logosArray.filter((_, i) => i !== index)

    handleInputChange('HOME_LOGOS', JSON.stringify(updated))
  }

  const heroImagesArray: string[] = (() => {
    try { return JSON.parse(config.HOME_HERO_IMAGES || '[]') } catch { return [] }
  })()

  const handleRemoveHeroImage = (index: number) => {
    const updated = heroImagesArray.filter((_, i) => i !== index)

    handleInputChange('HOME_HERO_IMAGES', JSON.stringify(updated))
  }

  const handleMoveHeroImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction

    if (newIndex < 0 || newIndex >= heroImagesArray.length) return

    const updated = [...heroImagesArray]

      ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]

    handleInputChange('HOME_HERO_IMAGES', JSON.stringify(updated))
  }

  const conveniosArray: { label: string; url: string }[] = (() => {
    try { return JSON.parse(config.HOME_CONVENIOS_LOGOS || '[]') } catch { return [] }
  })()

  const handleRemoveConvenio = (index: number) => {
    const updated = conveniosArray.filter((_, i) => i !== index)

    handleInputChange('HOME_CONVENIOS_LOGOS', JSON.stringify(updated))
  }

  const porQueElegirnosArray: { icono: string; titulo: string; descripcion: string }[] = (() => {
    try { return JSON.parse(config.HOME_POR_QUE_ELEGIRNOS || '[]') } catch { return [] }
  })()

  const [pendingWhyIcon, setPendingWhyIcon] = useState('Award')
  const [pendingWhyTitle, setPendingWhyTitle] = useState('')
  const [pendingWhyDesc, setPendingWhyDesc] = useState('')

  const handleAddWhyItem = () => {
    if (!pendingWhyTitle.trim()) return
    const updated = [...porQueElegirnosArray, { icono: pendingWhyIcon, titulo: pendingWhyTitle.trim(), descripcion: pendingWhyDesc.trim() }]

    handleInputChange('HOME_POR_QUE_ELEGIRNOS', JSON.stringify(updated))
    setPendingWhyTitle('')
    setPendingWhyDesc('')
  }

  const handleRemoveWhyItem = (index: number) => {
    const updated = porQueElegirnosArray.filter((_, i) => i !== index)

    handleInputChange('HOME_POR_QUE_ELEGIRNOS', JSON.stringify(updated))
  }

  const DEFAULT_NOSOTROS_STATS = [
    { value: '+1,200', label: 'Estudiantes formados' },
    { value: '+80', label: 'Cursos disponibles' },
    { value: '+30', label: 'Docentes expertos' },
    { value: '98%', label: 'Tasa de satisfacción' },
  ]

  const nosotrosStatsArray: { value: string; label: string }[] = (() => {
    try {
      const arr = JSON.parse(config.NOSOTROS_STATS || '[]')

      if (Array.isArray(arr) && arr.length > 0) return arr
    } catch { /* ignore */ }

    return DEFAULT_NOSOTROS_STATS
  })()

  const handleUpdateStat = (index: number, partial: Partial<{ value: string; label: string }>) => {
    const updated = [...nosotrosStatsArray]

    updated[index] = { ...updated[index], ...partial }
    handleInputChange('NOSOTROS_STATS', JSON.stringify(updated))
  }

  const DEFAULT_NOSOTROS_VALORES = [
    { titulo: 'Compromiso', descripcion: 'Nos dedicamos plenamente a la formación de cada estudiante, acompañándolos en cada etapa de su aprendizaje.' },
    { titulo: 'Innovación', descripcion: 'Buscamos constantemente nuevas formas de enseñar y de acercar el conocimiento de manera más efectiva.' },
    { titulo: 'Trabajo en Equipo', descripcion: 'Creemos en la colaboración como motor del aprendizaje y el crecimiento colectivo.' },
    { titulo: 'Mejora Continua', descripcion: 'Actualizamos nuestros contenidos y metodologías para mantenernos a la vanguardia del sector.' },
    { titulo: 'Integridad', descripcion: 'Actuamos con transparencia y honestidad, generando confianza en cada relación con nuestros estudiantes y empresas.' },
  ]

  const nosotrosValoresArray: { titulo: string; descripcion: string }[] = (() => {
    try {
      const arr = JSON.parse(config.NOSOTROS_VALORES || '[]')

      if (Array.isArray(arr) && arr.length > 0) return arr
    } catch { /* ignore */ }

    return DEFAULT_NOSOTROS_VALORES
  })()

  const handleUpdateValor = (index: number, partial: Partial<{ titulo: string; descripcion: string }>) => {
    const updated = [...nosotrosValoresArray]

    updated[index] = { ...updated[index], ...partial }
    handleInputChange('NOSOTROS_VALORES', JSON.stringify(updated))
  }

  const toggleSecret = (key: string) => {
    setShowSecret(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const payload = Object.entries(config).map(([clave, valor]) => {
        const item = initialData?.find(d => d.clave === clave)

        return { clave, valor, descripcion: item?.descripcion || '' }
      })

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosConfig = new AxiosConfiguracion({ getAuthToken })

      await axiosConfig.save(payload)
      enqueueSnackbar('Configuración actualizada. Si cambiaste el favicon, recarga la pestaña del navegador (Ctrl+F5).', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Error al guardar la configuración', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const SecretField = ({ label, configKey, helperText }: { label: string; configKey: string; helperText?: string }) => (
    <TextField
      label={label}
      fullWidth
      type={showSecret[configKey] ? 'text' : 'password'}
      value={config[configKey] || ''}
      onChange={(e) => handleInputChange(configKey, e.target.value)}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton onClick={() => toggleSecret(configKey)} edge='end' size='small'>
              <i className={showSecret[configKey] ? 'tabler-eye-off' : 'tabler-eye'} style={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )

  const tabs = [
    {
      label: 'Web',
      content: (
        <Stack spacing={4}>
          {/* Hero */}
          {/* <Box>
            <Typography variant='h6' gutterBottom>Hero de la Página Principal</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Separa el título en dos líneas usando un salto de línea — la segunda línea se resaltará en color.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Título del Hero'
                placeholder={'Aprende sin límites,\ncrece sin fronteras'}
                value={config.HOME_HERO_TITLE}
                onChange={(e) => handleInputChange('HOME_HERO_TITLE', e.target.value)}
                helperText='Usa Enter para separar líneas. La segunda línea aparece en color.'
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Descripción del Hero'
                placeholder='Accede a cursos especializados, rutas de aprendizaje y certificaciones...'
                value={config.HOME_HERO_DESCRIPTION}
                onChange={(e) => handleInputChange('HOME_HERO_DESCRIPTION', e.target.value)}
              />
            </Stack>
          </Box> */}

          {/* Cursos Destacados */}
          <Box>
            <Typography variant='h6' gutterBottom>Sección &quot;Cursos Destacados&quot;</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Título y descripción que aparecen sobre la grilla de cursos destacados en la página principal.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label='Título de la sección'
                placeholder='Cursos destacados'
                value={config.HOME_CURSOS_TITLE}
                onChange={(e) => handleInputChange('HOME_CURSOS_TITLE', e.target.value)}
                helperText='La última palabra se resalta automáticamente con el color primario.'
              />
              <TextField
                fullWidth
                label='Descripción'
                placeholder='Descubre nuestros cursos más recientes'
                value={config.HOME_CURSOS_SUBTITLE}
                onChange={(e) => handleInputChange('HOME_CURSOS_SUBTITLE', e.target.value)}
              />
            </Stack>
          </Box>

          <Divider />

          {/* Logos */}
          <Box>
            <Typography variant='h6' gutterBottom>Logos de Empresas Clientes</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Estos logos aparecerán en el carrusel de la página principal. Si no hay logos, se mostrarán los predeterminados.
            </Typography>

            {/* Lista de logos actuales */}
            {logosArray.length > 0 && (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {logosArray.map((logo, i) => (
                  <Paper key={i} variant='outlined' sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 64, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
                      <img src={logo.url} alt={logo.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </Box>
                    <Typography variant='body2' sx={{ flex: 1 }}>{logo.label}</Typography>
                    <IconButton size='small' color='error' onClick={() => handleRemoveLogo(i)}>
                      <i className='tabler-trash' style={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}

            {/* Formulario añadir logo */}
            <Paper variant='outlined' sx={{ p: 2 }}>
              <Typography variant='subtitle2' gutterBottom>Añadir Logo</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='flex-start'>
                <TextField
                  size='small'
                  label='Nombre del logo'
                  placeholder='Ej: TechCorp'
                  value={pendingLogoLabel}
                  onChange={(e) => setPendingLogoLabel(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<i className='tabler-photo' />}
                  onClick={() => setOpenLogoMedia(true)}
                  disabled={!pendingLogoLabel.trim()}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Seleccionar imagen
                </Button>
              </Stack>
              {!pendingLogoLabel.trim() && (
                <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
                  Escribe el nombre del logo antes de seleccionar la imagen.
                </Typography>
              )}
            </Paper>
          </Box>

          <MediaLibrary
            open={openLogoMedia}
            onClose={() => setOpenLogoMedia(false)}
            onSelect={(url) => {
              const nuevo = { label: pendingLogoLabel.trim() || 'Logo', url }
              const actualizado = [...logosArray, nuevo]

              handleInputChange('HOME_LOGOS', JSON.stringify(actualizado))
              setPendingLogoLabel('')
              setOpenLogoMedia(false)
            }}
            title='Seleccionar Logo de Empresa'
            acceptType='IMAGEN'
          />

          <Divider />

          {/* Nuestros Convenios */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
              <Typography variant='h6'>Sección &quot;Nuestros Convenios&quot;</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.HOME_CONVENIOS_HABILITADO !== 'false'}
                    onChange={(e) => handleInputChange('HOME_CONVENIOS_HABILITADO', e.target.checked ? 'true' : 'false')}
                  />
                }
                label='Mostrar sección'
              />
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Logos de entidades o empresas aliadas. Si no agregas ningún logo, la sección no se muestra en la página principal.
            </Typography>
            <Stack spacing={3} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label='Título de la sección'
                value={config.HOME_CONVENIOS_TITLE}
                onChange={(e) => handleInputChange('HOME_CONVENIOS_TITLE', e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Descripción'
                value={config.HOME_CONVENIOS_DESCRIPTION}
                onChange={(e) => handleInputChange('HOME_CONVENIOS_DESCRIPTION', e.target.value)}
              />
            </Stack>

            {conveniosArray.length > 0 && (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {conveniosArray.map((logo, i) => (
                  <Paper key={i} variant='outlined' sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 64, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
                      <img src={logo.url} alt={logo.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </Box>
                    <Typography variant='body2' sx={{ flex: 1 }}>{logo.label}</Typography>
                    <IconButton size='small' color='error' onClick={() => handleRemoveConvenio(i)}>
                      <i className='tabler-trash' style={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}

            <Paper variant='outlined' sx={{ p: 2 }}>
              <Typography variant='subtitle2' gutterBottom>Añadir Convenio</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='flex-start'>
                <TextField
                  size='small'
                  label='Nombre de la entidad'
                  placeholder='Ej: Colegio de Ingenieros del Perú'
                  value={pendingConvenioLabel}
                  onChange={(e) => setPendingConvenioLabel(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<i className='tabler-photo' />}
                  onClick={() => setOpenConvenioMedia(true)}
                  disabled={!pendingConvenioLabel.trim()}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Seleccionar imagen
                </Button>
              </Stack>
              {!pendingConvenioLabel.trim() && (
                <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
                  Escribe el nombre de la entidad antes de seleccionar la imagen.
                </Typography>
              )}
            </Paper>
          </Box>

          <MediaLibrary
            open={openConvenioMedia}
            onClose={() => setOpenConvenioMedia(false)}
            onSelect={(url) => {
              const nuevo = { label: pendingConvenioLabel.trim() || 'Convenio', url }
              const actualizado = [...conveniosArray, nuevo]

              handleInputChange('HOME_CONVENIOS_LOGOS', JSON.stringify(actualizado))
              setPendingConvenioLabel('')
              setOpenConvenioMedia(false)
            }}
            title='Seleccionar Logo de Convenio'
            acceptType='IMAGEN'
          />

          <Divider />

          {/* ¿Por qué elegirnos? */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
              <Typography variant='h6'>Sección &quot;¿Por qué elegirnos?&quot;</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.HOME_POR_QUE_ELEGIRNOS_HABILITADO !== 'false'}
                    onChange={(e) => handleInputChange('HOME_POR_QUE_ELEGIRNOS_HABILITADO', e.target.checked ? 'true' : 'false')}
                  />
                }
                label='Mostrar sección'
              />
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Tarjetas con ícono, título y descripción. Si no agregas ninguna, se muestran tarjetas predeterminadas.
            </Typography>

            {porQueElegirnosArray.length > 0 && (
              <Stack spacing={1} sx={{ mb: 3 }}>
                {porQueElegirnosArray.map((item, i) => (
                  <Paper key={i} variant='outlined' sx={{ p: 1.5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ width: 40, height: 40, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 1 }}>
                      <i className='tabler-star' style={{ fontSize: '1.1rem' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='body2' fontWeight={600}>{item.titulo} <Typography component='span' variant='caption' color='text.secondary'>({item.icono})</Typography></Typography>
                      <Typography variant='caption' color='text.secondary'>{item.descripcion}</Typography>
                    </Box>
                    <IconButton size='small' color='error' onClick={() => handleRemoveWhyItem(i)}>
                      <i className='tabler-trash' style={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}

            <Paper variant='outlined' sx={{ p: 2 }}>
              <Typography variant='subtitle2' gutterBottom>Añadir Tarjeta</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    select
                    fullWidth
                    size='small'
                    label='Ícono'
                    value={pendingWhyIcon}
                    onChange={(e) => setPendingWhyIcon(e.target.value)}
                  >
                    {['Presentation', 'GraduationCap', 'Monitor', 'ClipboardList', 'FileCheck', 'BookOpen', 'Award', 'Users', 'Star', 'ShieldCheck', 'Clock', 'Video'].map(name => (
                      <MenuItem key={name} value={name}>{name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    size='small'
                    label='Título'
                    value={pendingWhyTitle}
                    onChange={(e) => setPendingWhyTitle(e.target.value)}
                    placeholder='Ej: Clases en vivo'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size='small'
                    multiline
                    rows={2}
                    label='Descripción'
                    value={pendingWhyDesc}
                    onChange={(e) => setPendingWhyDesc(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant='outlined' size='small' onClick={handleAddWhyItem} disabled={!pendingWhyTitle.trim()}>
                    Añadir tarjeta
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          <Divider />

          {/* Nuestros Docentes */}
          <Box>
            <Typography variant='h6' gutterBottom>Sección &quot;Nuestros Docentes&quot;</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              El contenido (fotos, nombre, cargo) se toma automáticamente de los usuarios con rol Profesor. Aquí solo se edita el encabezado.
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Título de la sección'
                  value={config.HOME_DOCENTES_TITLE}
                  onChange={(e) => handleInputChange('HOME_DOCENTES_TITLE', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Subtítulo'
                  value={config.HOME_DOCENTES_SUBTITLE}
                  onChange={(e) => handleInputChange('HOME_DOCENTES_SUBTITLE', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          {/* Visibilidad de páginas */}
          <Box>
            <Typography variant='h6' gutterBottom>Visibilidad de Páginas</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Activa o desactiva las páginas del sitio web público. Los cambios pueden tardar unos minutos en aplicarse.
            </Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={<Switch checked={config.WEB_EMPRESAS_HABILITADO === 'true'} onChange={(e) => handleInputChange('WEB_EMPRESAS_HABILITADO', e.target.checked ? 'true' : 'false')} />}
                  label='Mostrar página de Empresas'
                />
              </Stack>
            </Paper>
          </Box>

          <Divider />

          {/* Facturación */}
          <Box>
            <Typography variant='h6' gutterBottom>Facturación y Comprobantes</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Controla si los alumnos pueden solicitar comprobantes de pago (Boleta/Factura) durante el checkout.
            </Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.PEDIDOS_SOLICITAR_COMPROBANTE === 'true'}
                    onChange={(e) => handleInputChange('PEDIDOS_SOLICITAR_COMPROBANTE', e.target.checked ? 'true' : 'false')}
                  />
                }
                label='Habilitar solicitud de comprobantes en el Checkout'
              />
            </Paper>
          </Box>

          {/* Comentarios */}
          <Box>
            <Typography variant='h6' gutterBottom>Moderación de Comentarios</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Controla si los comentarios de los estudiantes requieren aprobación antes de ser visibles públicamente. Los comentarios de admin y profesor siempre se publican de inmediato.
            </Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.COMENTARIOS_REQUIERE_APROBACION === 'true'}
                    onChange={(e) => handleInputChange('COMENTARIOS_REQUIERE_APROBACION', e.target.checked ? 'true' : 'false')}
                  />
                }
                label='Requerir aprobación antes de publicar comentarios de estudiantes'
              />
            </Paper>
          </Box>

          {/* Chat */}
          <Box>
            <Typography variant='h6' gutterBottom>Chat entre Usuarios</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Controla si los alumnos pueden enviarse mensajes directos entre sí. Profesores y administradores siempre pueden chatear con sus alumnos.
            </Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={config.chat_entre_alumnos === 'true'}
                    onChange={(e) => handleInputChange('chat_entre_alumnos', e.target.checked ? 'true' : 'false')}
                  />
                }
                label='Permitir mensajes directos entre alumnos'
              />
            </Paper>
          </Box>
        </Stack>
      )
    },
    {
      label: 'Nosotros',
      icon: 'tabler-users',
      content: (
        <Stack spacing={4}>
          <Box>
            <Typography variant='h6' gutterBottom>Hero</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Título, descripción y estadísticas del banner principal de la página &quot;Nosotros&quot;.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label='Título del hero'
                value={config.NOSOTROS_HERO_TITLE}
                onChange={(e) => handleInputChange('NOSOTROS_HERO_TITLE', e.target.value)}
                helperText='La última palabra se resalta automáticamente con el color claro del tema.'
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Descripción del hero'
                value={config.NOSOTROS_HERO_DESCRIPTION}
                onChange={(e) => handleInputChange('NOSOTROS_HERO_DESCRIPTION', e.target.value)}
              />
            </Stack>

            <Typography variant='subtitle2' sx={{ mt: 3, mb: 1.5 }}>Estadísticas</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              El emoji de cada tarjeta es fijo según su posición — aquí solo editas el valor y la etiqueta.
            </Typography>
            <Grid container spacing={2}>
              {nosotrosStatsArray.map((s, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Paper variant='outlined' sx={{ p: 2 }}>
                    <Stack spacing={1.5}>
                      <TextField
                        size='small'
                        fullWidth
                        label='Valor'
                        value={s.value}
                        onChange={(e) => handleUpdateStat(i, { value: e.target.value })}
                      />
                      <TextField
                        size='small'
                        fullWidth
                        label='Etiqueta'
                        value={s.label}
                        onChange={(e) => handleUpdateStat(i, { label: e.target.value })}
                      />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider />

          <Box>
            <Typography variant='h6' gutterBottom>Misión y Visión</Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Misión'
                value={config.NOSOTROS_MISION_TEXTO}
                onChange={(e) => handleInputChange('NOSOTROS_MISION_TEXTO', e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label='Visión'
                value={config.NOSOTROS_VISION_TEXTO}
                onChange={(e) => handleInputChange('NOSOTROS_VISION_TEXTO', e.target.value)}
              />
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant='h6' gutterBottom>Valores</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              El ícono de cada tarjeta es fijo según su posición — aquí solo editas título y descripción.
            </Typography>
            <Stack spacing={2}>
              {nosotrosValoresArray.map((v, i) => (
                <Paper key={i} variant='outlined' sx={{ p: 2 }}>
                  <Stack spacing={1.5}>
                    <TextField
                      size='small'
                      fullWidth
                      label={`Título ${i + 1}`}
                      value={v.titulo}
                      onChange={(e) => handleUpdateValor(i, { titulo: e.target.value })}
                    />
                    <TextField
                      size='small'
                      fullWidth
                      multiline
                      rows={2}
                      label='Descripción'
                      value={v.descripcion}
                      onChange={(e) => handleUpdateValor(i, { descripcion: e.target.value })}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      )
    },
    {
      label: 'Legal',
      icon: 'tabler-file-text',
      content: (
        <Stack spacing={4} divider={<Divider />}>
          <LegalPageEditor prefix='LEGAL_TERMINOS' label='Términos y Condiciones' config={config} onInputChange={handleInputChange} />
          <LegalPageEditor prefix='LEGAL_DEVOLUCIONES' label='Política de Cambios y Devoluciones' config={config} onInputChange={handleInputChange} />
          <LegalPageEditor prefix='LEGAL_PRIVACIDAD' label='Política de Privacidad' config={config} onInputChange={handleInputChange} />

          <Box>
            <Typography variant='h6' gutterBottom>Libro de Reclamaciones</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              El formulario de reclamos es fijo (campos exigidos por ley) — aquí solo se edita el texto introductorio y los datos del proveedor que se muestran encima del formulario.
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label='Texto introductorio'
                value={config.LEGAL_RECLAMOS_INTRO}
                onChange={(e) => handleInputChange('LEGAL_RECLAMOS_INTRO', e.target.value)}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label='Proveedor'
                    value={config.LEGAL_RECLAMOS_PROVEEDOR}
                    onChange={(e) => handleInputChange('LEGAL_RECLAMOS_PROVEEDOR', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label='RUC'
                    value={config.LEGAL_RECLAMOS_RUC}
                    onChange={(e) => handleInputChange('LEGAL_RECLAMOS_RUC', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label='Domicilio'
                    value={config.LEGAL_RECLAMOS_DOMICILIO}
                    onChange={(e) => handleInputChange('LEGAL_RECLAMOS_DOMICILIO', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Stack>
          </Box>
        </Stack>
      )
    },
    {
      label: 'Branding',
      icon: 'tabler-palette',
      content: (
        <Stack spacing={4}>
          <Box>
            <SectionLabel>Identidad de la Plataforma</SectionLabel>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Nombre de la Plataforma'
                  value={config.TEMPLATE_NAME}
                  onChange={(e) => handleInputChange('TEMPLATE_NAME', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Slogan'
                  value={config.TEMPLATE_SLOGAN}
                  onChange={(e) => handleInputChange('TEMPLATE_SLOGAN', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Nombre de Cookie'
                  value={config.SETTINGS_COOKIE_NAME}
                  onChange={(e) => handleInputChange('SETTINGS_COOKIE_NAME', e.target.value)}
                  helperText='Prefijo usado para cookies de configuración del tema'
                />
              </Grid>
            </Grid>
          </Box>

          <Divider />

          <Box>
            <SectionLabel>Logo</SectionLabel>
            <Grid container spacing={3} alignItems='flex-start'>
              <Grid item xs={12} md={4}>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2, textAlign: 'center', borderRadius: 2,
                    minHeight: 120, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 1.5
                  }}
                >
                  {config.TEMPLATE_LOGO ? (
                    <img
                      src={config.TEMPLATE_LOGO}
                      alt='Logo'
                      style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <Typography variant='caption' color='text.disabled'>Sin logo</Typography>
                  )}
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<i className='tabler-photo' />}
                    onClick={() => setOpenMedia(true)}
                  >
                    Cambiar logo
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            <MediaLibrary
              open={openMedia}
              onClose={() => setOpenMedia(false)}
              onSelect={(url) => {
                handleInputChange('TEMPLATE_LOGO', url)
                enqueueSnackbar('Logo seleccionado — recuerda guardar los cambios', { variant: 'info' })
              }}
              title='Seleccionar Logo'
            />
          </Box>

          <Divider />

          <Box>
            <SectionLabel>Favicon</SectionLabel>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Icono que aparece en la pestaña del navegador. Usa una imagen cuadrada (mínimo 32×32 px).
              Al guardar, se generará automáticamente el favicon del sitio.
            </Typography>
            <Grid container spacing={3} alignItems='flex-start'>
              <Grid item xs={12} md={4}>
                <Paper
                  variant='outlined'
                  sx={{
                    p: 2, textAlign: 'center', borderRadius: 2,
                    minHeight: 120, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 1.5
                  }}
                >
                  {config.SITE_FAVICON ? (
                    <img
                      src={config.SITE_FAVICON}
                      alt='Favicon'
                      style={{ width: 48, height: 48, objectFit: 'contain' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <Typography variant='caption' color='text.disabled'>Sin favicon personalizado</Typography>
                  )}
                  <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='center'>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<i className='tabler-photo' />}
                      onClick={() => setOpenFaviconMedia(true)}
                    >
                      Cambiar favicon
                    </Button>
                    {config.SITE_FAVICON ? (
                      <Button
                        variant='text'
                        size='small'
                        color='error'
                        onClick={() => handleInputChange('SITE_FAVICON', '')}
                      >
                        Quitar
                      </Button>
                    ) : null}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
            <MediaLibrary
              open={openFaviconMedia}
              onClose={() => setOpenFaviconMedia(false)}
              onSelect={(url) => {
                handleInputChange('SITE_FAVICON', url)
                enqueueSnackbar('Favicon seleccionado — recuerda guardar los cambios', { variant: 'info' })
              }}
              title='Seleccionar Favicon'
            />
          </Box>

          <Divider />

          <Box>
            <SectionLabel>Imágenes de Portada (Hero)</SectionLabel>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Imagen(es) que se muestran en el banner principal de inicio. Si agregas más de una, se mostrarán
              como un carrusel automático. Si no subes ninguna, se muestra el visual interactivo predeterminado.
            </Typography>

            {heroImagesArray.length > 0 && (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {heroImagesArray.map((url, i) => (
                  <Paper key={i} variant='outlined' sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 100, height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                      <img src={url} alt={`Portada ${i + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                    </Box>
                    <Typography variant='body2' sx={{ flex: 1 }}>Imagen {i + 1}</Typography>
                    <IconButton size='small' onClick={() => handleMoveHeroImage(i, -1)} disabled={i === 0}>
                      <i className='tabler-arrow-up' style={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton size='small' onClick={() => handleMoveHeroImage(i, 1)} disabled={i === heroImagesArray.length - 1}>
                      <i className='tabler-arrow-down' style={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleRemoveHeroImage(i)}>
                      <i className='tabler-trash' style={{ fontSize: '1rem' }} />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}

            <Button
              variant='outlined'
              size='small'
              startIcon={<i className='tabler-photo' />}
              onClick={() => setOpenHeroImageMedia(true)}
            >
              Añadir imagen
            </Button>

            <MediaLibrary
              open={openHeroImageMedia}
              onClose={() => setOpenHeroImageMedia(false)}
              onSelect={(url) => {
                const actualizado = [...heroImagesArray, url]

                handleInputChange('HOME_HERO_IMAGES', JSON.stringify(actualizado))
                enqueueSnackbar('Imagen añadida — recuerda guardar los cambios', { variant: 'info' })
                setOpenHeroImageMedia(false)
              }}
              title='Seleccionar Imagen de Portada'
              acceptType='IMAGEN'
            />
          </Box>

          <Divider />

          <Box>
            <SectionLabel>Colores del Tema</SectionLabel>

            {/* Paletas predefinidas */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>Paletas Predefinidas</Typography>
              <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
                Haz clic en una paleta para aplicar los colores automáticamente.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 110px)', gap: 1.5 }}>
                {[
                  { label: 'Teal & Lima', main: '#25927F', light: '#BDD962', dark: '#025E44' },
                  { label: 'Índigo & Lima', main: '#4F46E5', light: '#A3E635', dark: '#3730A3' },
                  { label: 'Océano Profundo', main: '#0369A1', light: '#38BDF8', dark: '#082F49' },
                  { label: 'Índigo & Dorado', main: '#7C3AED', light: '#FCD34D', dark: '#4C1D95' },
                  { label: 'Esmeralda', main: '#059669', light: '#A7F3D0', dark: '#064E3B' },
                  { label: 'Pizarra & Coral', main: '#475569', light: '#FB923C', dark: '#1E293B' },
                  { label: 'Granate & Champán', main: '#9F1239', light: '#FBCFE8', dark: '#4C0519' },
                  { label: 'Cian Tecnológico', main: '#0891B2', light: '#67E8F9', dark: '#164E63' },
                  { label: 'Naranja Fuego', main: '#EA580C', light: '#FED7AA', dark: '#7C2D12' },
                  { label: 'Naranja & Negro', main: '#F97316', light: '#FFEDD5', dark: '#1C1917' },
                  { label: 'Ámbar Dorado', main: '#D97706', light: '#FDE68A', dark: '#78350F' },
                  { label: 'Azul Presidencial', main: '#1D4ED8', light: '#93C5FD', dark: '#1E3A8A' },
                  { label: 'Azul & Oro', main: '#2563EB', light: '#FCD34D', dark: '#1E3A8A' },
                  { label: 'Marino Oficial', main: '#0F4C81', light: '#BAE6FD', dark: '#0C2340' },
                ].map((palette) => (
                  <Box
                    key={palette.label}
                    onClick={() => {
                      handleInputChange('PRIMARY_COLOR_MAIN', palette.main)
                      handleInputChange('PRIMARY_COLOR_LIGHT', palette.light)
                      handleInputChange('PRIMARY_COLOR_DARK', palette.dark)
                    }}
                    sx={{
                      width: 110,
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: config.PRIMARY_COLOR_MAIN === palette.main ? 'primary.main' : 'divider',
                      overflow: 'hidden',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                      '&:hover': { transform: 'scale(1.04)', boxShadow: 3 },
                    }}
                  >
                    <Stack direction='row' sx={{ height: 32 }}>
                      <Box sx={{ flex: 1, bgcolor: palette.dark }} />
                      <Box sx={{ flex: 1, bgcolor: palette.main }} />
                      <Box sx={{ flex: 1, bgcolor: palette.light }} />
                    </Stack>
                    <Box sx={{ px: 1, py: 0.5, bgcolor: 'background.paper', width: '100%' }}>
                      <Typography variant='caption' sx={{ fontSize: '0.65rem', fontWeight: 600, display: 'block', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {palette.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Grid container spacing={3}>
              {[
                { label: 'Color Primario Principal', key: 'PRIMARY_COLOR_MAIN' },
                { label: 'Color Primario Claro (Light)', key: 'PRIMARY_COLOR_LIGHT' },
                { label: 'Color Primario Oscuro (Dark)', key: 'PRIMARY_COLOR_DARK' }
              ].map(({ label, key }) => (
                <Grid item xs={12} md={4} key={key}>
                  <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>{label}</Typography>
                  <Stack direction='row' spacing={1.5} alignItems='center'>
                    <TextField
                      fullWidth
                      size='small'
                      value={config[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      inputProps={{ style: { fontFamily: 'monospace', fontSize: 13 } }}
                    />
                    <Box
                      sx={{
                        width: 44, height: 44, flexShrink: 0,
                        borderRadius: 1.5, bgcolor: config[key],
                        border: '2px solid', borderColor: 'divider',
                        cursor: 'pointer'
                      }}
                      component='label'
                    >
                      <input
                        type='color'
                        value={/^#[0-9A-Fa-f]{6}$/.test(config[key]) ? config[key] : '#000000'}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
                      />
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      )
    },
    {
      label: 'Pagos',
      icon: 'tabler-credit-card',
      content: (
        <Stack spacing={1.5}>
          <Paper
            variant='outlined'
            sx={{
              p: 2, borderRadius: 2, borderLeft: '4px solid',
              borderLeftColor: 'info.main', bgcolor: 'action.hover'
            }}
          >
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <i className='tabler-info-circle' style={{ fontSize: 20, color: 'var(--mui-palette-info-main)' }} />
              <Typography variant='body2' color='text.secondary'>
                Las claves <strong>privadas/secretas</strong> (Secret Key, API Key, Access Token) se gestionan de forma segura en el servidor y no se muestran aquí.
              </Typography>
            </Stack>
          </Paper>

          <GatewayAccordion
            icon='tabler-building-bank'
            title='Culqi'
            subtitle='Tarjetas de débito y crédito (Perú)'
            enabledKey='CULQI_ENABLED'
            config={config}
            onInputChange={handleInputChange}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Public Key'
                  value={config.CULQI_PUBLIC_KEY}
                  onChange={(e) => handleInputChange('CULQI_PUBLIC_KEY', e.target.value)}
                  helperText='pk_test_... o pk_live_... — usada en el frontend para tokenizar'
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='RSA ID'
                  value={config.CULQI_RSA_ID}
                  onChange={(e) => handleInputChange('CULQI_RSA_ID', e.target.value)}
                  helperText='Identificador para el cifrado RSA (requerido para v4)'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='RSA Public Key'
                  multiline
                  rows={3}
                  value={config.CULQI_RSA_PUBLIC_KEY}
                  onChange={(e) => handleInputChange('CULQI_RSA_PUBLIC_KEY', e.target.value)}
                  helperText='Clave pública RSA para cifrado de datos sensibles'
                />
              </Grid>
            </Grid>
          </GatewayAccordion>

          <GatewayAccordion
            icon='tabler-shield-check'
            title='IziPay'
            subtitle='Pasarela de pagos peruana — tarjetas y billeteras'
            enabledKey='IZIPAY_ENABLED'
            config={config}
            onInputChange={handleInputChange}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity='info' sx={{ borderRadius: 2 }}>
                  Las credenciales de Izipay (Usuario, Contraseña, Clave HMAC-SHA-256 y Endpoint API) se configuran
                  por variables de entorno (IZIPAY_REST_USER, IZIPAY_REST_PASSWORD, IZIPAY_HASH_KEY, IZIPAY_ENDPOINT),
                  no desde este panel. Aquí solo puedes activar/desactivar la pasarela.
                </Alert>
              </Grid>
            </Grid>
          </GatewayAccordion>

          <GatewayAccordion
            icon='tabler-brand-paypal'
            title='PayPal'
            subtitle='Pagos internacionales en dólares (USD)'
            enabledKey='PAYPAL_ENABLED'
            config={config}
            onInputChange={handleInputChange}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Client ID'
                  value={config.PAYPAL_CLIENT_ID}
                  onChange={(e) => handleInputChange('PAYPAL_CLIENT_ID', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='API URL'
                  value={config.PAYPAL_API_URL}
                  onChange={(e) => handleInputChange('PAYPAL_API_URL', e.target.value)}
                  helperText='https://api-m.paypal.com (producción) o https://api-m.sandbox.paypal.com'
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant='caption' color='text.secondary'>Tipo de Cambio</Typography>
                </Divider>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type='number'
                  label='Soles por Dólar'
                  value={config.PAYPAL_EXCHANGE_RATE}
                  onChange={(e) => handleInputChange('PAYPAL_EXCHANGE_RATE', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position='start'>S/</InputAdornment>,
                    endAdornment: <InputAdornment position='end'>por $1</InputAdornment>
                  }}
                  helperText='Define cuántos soles equivale 1 dólar para los cobros en PayPal'
                />
              </Grid>
            </Grid>
          </GatewayAccordion>

          <GatewayAccordion
            icon='tabler-shopping-cart'
            title='Mercado Pago'
            subtitle='Pagos en línea con tarjetas, billeteras y más (Latinoamérica)'
            enabledKey='MP_ENABLED'
            config={config}
            onInputChange={handleInputChange}
          >
            <Grid container spacing={3}>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Public Key'
                  value={config.MP_PUBLIC_KEY || ''}
                  onChange={(e) => handleInputChange('MP_PUBLIC_KEY', e.target.value)}
                  helperText='TEST-... (sandbox) — usada en el frontend'
                />
              </Grid>
            </Grid>
          </GatewayAccordion>

          <GatewayAccordion
            icon='tabler-device-mobile'
            title='Pago Manual'
            subtitle='Yape, transferencias bancarias — el admin verifica el voucher'
            enabledKey='PAGO_MANUAL_ENABLED'
            config={config}
            onInputChange={handleInputChange}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label='Número de WhatsApp'
                  value={config.PAGO_MANUAL_WHATSAPP_NUMERO || ''}
                  onChange={(e) => handleInputChange('PAGO_MANUAL_WHATSAPP_NUMERO', e.target.value)}
                  helperText='Sin + ni espacios. Ej: 51959436827'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='tabler-brand-whatsapp' style={{ fontSize: 18, color: '#25D366' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Stack direction='row' alignItems='center' justifyContent='space-between' flexWrap='wrap' gap={2}>
                    <Box>
                      <Typography variant='subtitle2'>Cuentas y Métodos de Pago</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Administra los números de Yape, cuentas bancarias y QRs que verá el estudiante en el checkout.
                      </Typography>
                    </Box>
                    <Button
                      variant='outlined'
                      size='small'
                      href='/admin/metodos-pago'
                      component={Link}
                      endIcon={<i className='tabler-arrow-right' style={{ fontSize: 16 }} />}
                    >
                      Gestionar métodos
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </GatewayAccordion>
        </Stack>
      )
    },
    {
      label: 'Integraciones',
      icon: 'tabler-plug',
      content: (
        <Stack spacing={3}>
          <TextField
            label='Google Client ID'
            fullWidth
            value={config.GOOGLE_CLIENT_ID}
            onChange={(e) => handleInputChange('GOOGLE_CLIENT_ID', e.target.value)}
          />
          <SecretField
            label='Google Client Secret'
            configKey='GOOGLE_CLIENT_SECRET'
          />
        </Stack>
      )
    },
    {
      label: 'Certificación',
      icon: 'tabler-certificate',
      content: <CertificadosSettings config={config} onInputChange={handleInputChange} />
    }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardHeader title='Configuración del Sistema' className='pbe-4' sx={{ flexShrink: 0 }} />
        <Divider sx={{ flexShrink: 0 }} />

        <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label='configuracion tabs'
            sx={{
              px: 2, pt: 1,
              '& .MuiTab-root': { minHeight: 52, textTransform: 'none', fontWeight: 500, fontSize: '0.875rem' },
              '& .MuiTab-iconWrapper': { mr: 0.75 }
            }}
            variant='scrollable'
            scrollButtons='auto'
          >
            {tabs.map((tab, i) => (
              <Tab
                key={i}
                label={tab.label}
                icon={tab.icon ? <i className={tab.icon} style={{ fontSize: 18 }} /> : undefined}
                iconPosition='start'
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', px: 3 }}>
          {tabs.map((tab, i) => (
            <CustomTabPanel key={i} value={tabValue} index={i}>
              {tab.content}
            </CustomTabPanel>
          ))}
        </Box>

        <Box
          sx={{
            flexShrink: 0,
            borderTop: 1,
            borderColor: 'divider',
            px: 3,
            py: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            bgcolor: 'background.paper'
          }}
        >
          <Button
            variant='contained'
            size='large'
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-device-floppy' />}
            sx={{ minWidth: 180 }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
