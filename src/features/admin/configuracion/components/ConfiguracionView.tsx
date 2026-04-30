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
  FormControlLabel
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { getSession } from 'next-auth/react'
import { Rol } from '@prisma/client'

import { AxiosConfiguracion } from '../http/axiosConfiguracion'
import type { Configuracion } from '../entity/Configuracion'
import MediaLibrary from '../../cursos/components/MediaLibrary'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'

interface ConfiguracionViewProps {
  initialData?: Configuracion[]
}

const COLOR_PRESETS = [
  { name: 'Teal & Lima', main: '#25927F', light: '#BDD962', dark: '#025E44' },
  { name: 'Índigo & Lima', main: '#4F46E5', light: '#A3E635', dark: '#1E1B4B' },
  { name: 'Océano Profundo', main: '#2563EB', light: '#FCD34D', dark: '#0D1F3C' },
  { name: 'Índigo & Dorado', main: '#7C3AED', light: '#FCD34D', dark: '#1E1B4B' },
  { name: 'Esmeralda', main: '#10B981', light: '#A3E635', dark: '#022C1E' },
  { name: 'Pizarra & Coral', main: '#EA580C', light: '#FEF08A', dark: '#0F172A' },
  { name: 'Granate & Champán', main: '#BE185D', light: '#FDE68A', dark: '#1A0A14' },
  { name: 'Cian Tecnológico', main: '#0891B2', light: '#67E8F9', dark: '#0C1A2E' },
]

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function CertificadosSettings({ config, onInputChange }: { config: any, onInputChange: (clave: string, valor: string) => void }) {
  const { data: usuarios, isLoading } = useUsuarios()

  // Filtrar solo Admins y Profesores para que puedan ser Gerentes
  const candidatos = (usuarios || []).filter(u => u.rol === Rol.ADMIN || u.rol === Rol.PROFESOR)

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant='h6' gutterBottom>Información de la Institución en el Certificado</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Estos datos se imprimirán en la cabecera del certificado. Si se dejan en blanco, se usarán los datos generales de branding de la plataforma.
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
        <Typography variant='h6' gutterBottom>Configuración de Firmas</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Selecciona al usuario que actuará como <strong>Gerente General</strong> en los certificados.
          Asegúrate de que este usuario tenga su <strong>Cargo</strong> y <strong>Firma</strong> configurados en su perfil.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label='Designar Gerente General'
              value={config.CERTIFICADO_GERENTE_GENERAL_ID || ''}
              onChange={(e) => onInputChange('CERTIFICADO_GERENTE_GENERAL_ID', e.target.value)}
              disabled={isLoading}
              helperText='Este usuario aparecerá como la segunda firma en todos los certificados.'
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
        </Grid>
      </Box>

      {config.CERTIFICADO_GERENTE_GENERAL_ID && candidatos.find(u => u.id === config.CERTIFICADO_GERENTE_GENERAL_ID) && (
        <Paper variant='outlined' sx={{ p: 3, bgcolor: 'action.hover' }}>
          <Typography variant='subtitle2' gutterBottom>Vista Previa de Datos del Gerente:</Typography>
          {(() => {
            const gerente = candidatos.find(u => u.id === config.CERTIFICADO_GERENTE_GENERAL_ID)

            return (
              <Grid container spacing={2} alignItems='center'>
                <Grid item>
                  {gerente?.firma ? (
                    <Box sx={{ width: 120, height: 60, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider', p: 0.5 }}>
                      <img src={gerente.firma} alt="Firma" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </Box>
                  ) : (
                    <Typography variant='caption' color='error'>Sin firma configurada</Typography>
                  )}
                </Grid>
                <Grid item xs>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>{gerente?.nombre} {gerente?.apellido}</Typography>
                  <Typography variant='caption' display='block'>{gerente?.cargo || <span style={{ color: 'red' }}>Sin cargo configurado</span>}</Typography>
                </Grid>
              </Grid>
            )
          })()}
        </Paper>
      )}
    </Stack>
  )
}

export function ConfiguracionView({ initialData }: ConfiguracionViewProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [tabValue, setTabValue] = useState(0)
  const [saving, setSaving] = useState(false)
  const [openMedia, setOpenMedia] = useState(false)
  const [openLogoMedia, setOpenLogoMedia] = useState(false)
  const [pendingLogoLabel, setPendingLogoLabel] = useState('')

  const [showSecret, setShowSecret] = useState<{ [key: string]: boolean }>({})

  const initialMapped = (initialData || []).reduce((acc: { [key: string]: string }, curr: Configuracion) => {
    acc[curr.clave] = curr.valor

    return acc
  }, {})

  const [config, setConfig] = useState<{ [key: string]: string }>({
    HOME_HERO_TITLE: '',
    HOME_HERO_DESCRIPTION: '',
    HOME_LOGOS: '[]',
    TEMPLATE_NAME: 'Aula Virtual',
    TEMPLATE_SLOGAN: '',
    CERTIFICADO_INSTITUTION_NAME: '',
    CERTIFICADO_SLOGAN: '',
    CERTIFICADO_INSTITUTION_URL: '',
    TEMPLATE_LOGO: '/images/logo.png',
    SETTINGS_COOKIE_NAME: 'arm',
    PRIMARY_COLOR_MAIN: '#131FF2',
    PRIMARY_COLOR_LIGHT: '#242CBF',
    PRIMARY_COLOR_DARK: '#9196F2',
    PAYPAL_ENABLED: 'true',
    PAYPAL_CLIENT_ID: '',
    PAYPAL_CLIENT_SECRET: '',
    PAYPAL_API_URL: 'https://api-m.sandbox.paypal.com',
    PAYPAL_PUBLIC_CLIENT_ID: '',
    PAYPAL_EXCHANGE_RATE: '3.80',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    IZIPAY_ENABLED: 'true',
    IZIPAY_MERCHANT_CODE: '',
    IZIPAY_API_KEY: '',
    IZIPAY_RSA_KEY: '',
    IZIPAY_ENDPOINT: 'https://sandbox-api-pw.izipay.pe',
    IZIPAY_SDK_URL: 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js',
    CULQI_ENABLED: 'true',
    CULQI_PUBLIC_KEY: '',
    CULQI_PRIVATE_KEY: '',
    CULQI_RSA_ID: '',
    CULQI_RSA_PUBLIC_KEY: '',
    CERTIFICADO_GERENTE_GENERAL_ID: '',
    WEB_RUTAS_HABILITADO: 'true',
    WEB_EMPRESAS_HABILITADO: 'true',
    ...initialMapped
  })

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (clave: string, valor: string) => {
    setConfig(prev => ({ ...prev, [clave]: valor }))
  }

  const toggleSecret = (key: string) => {
    setShowSecret(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const payload = Object.entries(config).map(([clave, valor]) => {
        const item = initialData?.find(d => d.clave === clave)

        return {
          clave,
          valor,
          descripcion: item?.descripcion || ''
        }
      })

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosConfig = new AxiosConfiguracion({ getAuthToken })

      await axiosConfig.save(payload)
      enqueueSnackbar('Configuración actualizada. Los cambios estéticos pueden requerir recargar la página.', { variant: 'success' })
    } catch (err) {
      console.error(err)
      enqueueSnackbar('Error al guardar la configuración', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const logosArray: { label: string; url: string }[] = (() => {
    try { return JSON.parse(config.HOME_LOGOS || '[]') } catch { return [] }
  })()

  const handleRemoveLogo = (index: number) => {
    const updated = logosArray.filter((_, i) => i !== index)

    handleInputChange('HOME_LOGOS', JSON.stringify(updated))
  }

  // Definición de pestañas dinámicas
  const tabs = [
    {
      label: 'Web',
      content: (
        <Stack spacing={4}>
          {/* Hero */}
          <Box>
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

          {/* Visibilidad de páginas */}
          <Box>
            <Typography variant='h6' gutterBottom>Visibilidad de Páginas</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
              Activa o desactiva las páginas del sitio web público. Los cambios pueden tardar unos minutos en aplicarse.
            </Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={<Switch checked={config.WEB_RUTAS_HABILITADO === 'true'} onChange={(e) => handleInputChange('WEB_RUTAS_HABILITADO', e.target.checked ? 'true' : 'false')} />}
                  label='Mostrar página de Rutas de Aprendizaje'
                />
                <FormControlLabel
                  control={<Switch checked={config.WEB_EMPRESAS_HABILITADO === 'true'} onChange={(e) => handleInputChange('WEB_EMPRESAS_HABILITADO', e.target.checked ? 'true' : 'false')} />}
                  label='Mostrar página de Empresas'
                />
              </Stack>
            </Paper>
          </Box>
        </Stack>
      )
    },
    {
      label: 'General (Branding)',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' gutterBottom>Información General</Typography>
            <Stack spacing={3} sx={{ mb: 4 }}>
              <TextField label='Nombre de la Plataforma' fullWidth value={config.TEMPLATE_NAME} onChange={(e) => handleInputChange('TEMPLATE_NAME', e.target.value)} />
              <TextField label='Slogan de la Plataforma' fullWidth value={config.TEMPLATE_SLOGAN} onChange={(e) => handleInputChange('TEMPLATE_SLOGAN', e.target.value)} />
              <TextField label='Nombre de Cookie de Configuración' fullWidth value={config.SETTINGS_COOKIE_NAME} onChange={(e) => handleInputChange('SETTINGS_COOKIE_NAME', e.target.value)} />
            </Stack>

            <Typography variant='h6' gutterBottom>Pasarelas de Pago</Typography>
            <Paper variant='outlined' sx={{ p: 2, bgcolor: 'background.default' }}>
              <Stack spacing={1}>
                <FormControlLabel control={<Switch checked={config.CULQI_ENABLED === 'true'} onChange={(e) => handleInputChange('CULQI_ENABLED', e.target.checked ? 'true' : 'false')} />} label="Habilitar Culqi (Tarjetas)" />
                <FormControlLabel control={<Switch checked={config.IZIPAY_ENABLED === 'true'} onChange={(e) => handleInputChange('IZIPAY_ENABLED', e.target.checked ? 'true' : 'false')} />} label="Habilitar Izipay" />
                <FormControlLabel control={<Switch checked={config.PAYPAL_ENABLED === 'true'} onChange={(e) => handleInputChange('PAYPAL_ENABLED', e.target.checked ? 'true' : 'false')} />} label="Habilitar PayPal" />
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h6' gutterBottom>Logo y Assets</Typography>
            <Stack spacing={3}>
              <TextField label='URL del Logo' fullWidth value={config.TEMPLATE_LOGO} onChange={(e) => handleInputChange('TEMPLATE_LOGO', e.target.value)} />
              {config.TEMPLATE_LOGO && (
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', textAlign: 'center', position: 'relative' }}>
                  <Typography variant='caption' display='block' gutterBottom>Vista Previa Logo</Typography>
                  <img src={config.TEMPLATE_LOGO} alt='Preview' style={{ maxHeight: 80, maxWidth: '100%' }} />
                  <Box sx={{ mt: 2 }}>
                    <Button variant="outlined" size="small" disabled={saving} startIcon={<i className='tabler-photo' />} onClick={() => setOpenMedia(true)}>Cambiar Logo</Button>
                  </Box>
                </Box>
              )}
              <MediaLibrary open={openMedia} onClose={() => setOpenMedia(false)} onSelect={(url) => { handleInputChange('TEMPLATE_LOGO', url); enqueueSnackbar('Logo actualizado en el formulario, recuerda Guardar Todo', { variant: 'success' }); }} title="Seleccionar Logo" />
            </Stack>
          </Grid>
        </Grid>
      )
    },
    {
      label: 'Apariencia (Colores)',
      content: (
        <Stack spacing={4}>
          {/* Palette presets */}
          <Box>
            <Typography variant='subtitle1' fontWeight={700} gutterBottom>Paletas Predefinidas</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Haz clic en una paleta para aplicar los colores automáticamente.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              {COLOR_PRESETS.map(preset => {
                const isActive =
                  config.PRIMARY_COLOR_MAIN.toLowerCase() === preset.main.toLowerCase() &&
                  config.PRIMARY_COLOR_LIGHT.toLowerCase() === preset.light.toLowerCase() &&
                  config.PRIMARY_COLOR_DARK.toLowerCase() === preset.dark.toLowerCase()

                return (
                  <Box
                    key={preset.name}
                    onClick={() => {
                      handleInputChange('PRIMARY_COLOR_MAIN', preset.main)
                      handleInputChange('PRIMARY_COLOR_LIGHT', preset.light)
                      handleInputChange('PRIMARY_COLOR_DARK', preset.dark)
                    }}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: isActive ? preset.main : 'divider',
                      boxShadow: isActive ? `0 0 0 2px ${preset.main}40` : 1,
                      transition: 'all 0.18s',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
                      minWidth: 110,
                    }}
                  >
                    {/* Color strip: dark | main | light */}
                    <Box sx={{ display: 'flex', height: 28 }}>
                      <Box sx={{ flex: 1, bgcolor: preset.dark }} />
                      <Box sx={{ flex: 1, bgcolor: preset.main }} />
                      <Box sx={{ flex: 1, bgcolor: preset.light }} />
                    </Box>
                    <Box sx={{ px: 1.5, py: 0.75, bgcolor: 'background.paper' }}>
                      <Typography variant='caption' fontWeight={isActive ? 700 : 500} color={isActive ? preset.main : 'text.primary'}>
                        {preset.name}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>

          <Divider />

          {/* Individual color pickers */}
          <Grid container spacing={3}>
            {([
              { label: 'Color Primario Principal', key: 'PRIMARY_COLOR_MAIN' },
              { label: 'Color Primario Claro (Light)', key: 'PRIMARY_COLOR_LIGHT' },
              { label: 'Color Primario Oscuro (Dark)', key: 'PRIMARY_COLOR_DARK' },
            ] as const).map(({ label, key }) => (
              <Grid item xs={12} md={4} key={key}>
                <Typography variant='subtitle2' gutterBottom>{label}</Typography>
                <Stack direction='row' spacing={1.5} alignItems='center'>
                  <TextField
                    fullWidth
                    value={config[key]}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                  {/* Clickable color swatch — opens native color picker */}
                  <Box sx={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
                    <Box
                      component='input'
                      type='color'
                      value={config[key]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(key, e.target.value)}
                      sx={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        opacity: 0, cursor: 'pointer',
                        border: 'none', padding: 0, margin: 0,
                      }}
                    />
                    <Box sx={{
                      width: 48, height: 48,
                      borderRadius: 2,
                      bgcolor: config[key],
                      border: '2px solid',
                      borderColor: 'divider',
                      boxShadow: 1,
                      pointerEvents: 'none',
                    }} />
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
      )
    },
    config.PAYPAL_ENABLED === 'true' && {
      label: 'Integración PayPal',
      content: (
        <Stack spacing={3}>
          <TextField label='PayPal Client ID' fullWidth value={config.PAYPAL_CLIENT_ID} onChange={(e) => handleInputChange('PAYPAL_CLIENT_ID', e.target.value)} />
          <TextField
            label='PayPal Client Secret'
            fullWidth
            type={showSecret.PAYPAL_CLIENT_SECRET ? 'text' : 'password'}
            value={config.PAYPAL_CLIENT_SECRET}
            onChange={(e) => handleInputChange('PAYPAL_CLIENT_SECRET', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => toggleSecret('PAYPAL_CLIENT_SECRET')} edge='end'>
                    <i className={showSecret.PAYPAL_CLIENT_SECRET ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField label='PayPal API URL' fullWidth value={config.PAYPAL_API_URL} onChange={(e) => handleInputChange('PAYPAL_API_URL', e.target.value)} helperText='Ejemplo: https://api-m.paypal.com o https://api-m.sandbox.paypal.com' />
        </Stack>
      )
    },
    {
      label: 'Integración Google',
      content: (
        <Stack spacing={3}>
          <TextField label='Google Client ID' fullWidth value={config.GOOGLE_CLIENT_ID} onChange={(e) => handleInputChange('GOOGLE_CLIENT_ID', e.target.value)} />
          <TextField
            label='Google Client Secret'
            fullWidth
            type={showSecret.GOOGLE_CLIENT_SECRET ? 'text' : 'password'}
            value={config.GOOGLE_CLIENT_SECRET}
            onChange={(e) => handleInputChange('GOOGLE_CLIENT_SECRET', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => toggleSecret('GOOGLE_CLIENT_SECRET')} edge='end'>
                    <i className={showSecret.GOOGLE_CLIENT_SECRET ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Stack>
      )
    },
    config.IZIPAY_ENABLED === 'true' && {
      label: 'Integración Izipay',
      content: (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField label='Merchant Code' fullWidth value={config.IZIPAY_MERCHANT_CODE} onChange={(e) => handleInputChange('IZIPAY_MERCHANT_CODE', e.target.value)} />
              <TextField
                label='API Key'
                fullWidth
                type={showSecret.IZIPAY_API_KEY ? 'text' : 'password'}
                value={config.IZIPAY_API_KEY}
                onChange={(e) => handleInputChange('IZIPAY_API_KEY', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => toggleSecret('IZIPAY_API_KEY')} edge='end'>
                        <i className={showSecret.IZIPAY_API_KEY ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <TextField label='RSA Key' fullWidth multiline rows={2} value={config.IZIPAY_RSA_KEY} onChange={(e) => handleInputChange('IZIPAY_RSA_KEY', e.target.value)} />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField label='Endpoint API' fullWidth value={config.IZIPAY_ENDPOINT} onChange={(e) => handleInputChange('IZIPAY_ENDPOINT', e.target.value)} />
              <TextField label='SDK JS URL' fullWidth value={config.IZIPAY_SDK_URL} onChange={(e) => handleInputChange('IZIPAY_SDK_URL', e.target.value)} />
            </Stack>
          </Grid>
        </Grid>
      )
    },
    config.CULQI_ENABLED === 'true' && {
      label: 'Integración Culqi',
      content: (
        <Stack spacing={3}>
          <TextField label='Culqi Public Key (pk_test_... o pk_live_...)' fullWidth value={config.CULQI_PUBLIC_KEY} onChange={(e) => handleInputChange('CULQI_PUBLIC_KEY', e.target.value)} helperText='Key utilizada en el frontend para tokenizar la tarjeta.' />
          <TextField
            label='Culqi Private Key (sk_test_... o sk_live_...)'
            fullWidth
            type={showSecret.CULQI_PRIVATE_KEY ? 'text' : 'password'}
            value={config.CULQI_PRIVATE_KEY}
            onChange={(e) => handleInputChange('CULQI_PRIVATE_KEY', e.target.value)}
            helperText='Key utilizada en el backend para realizar el cargo.'
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={() => toggleSecret('CULQI_PRIVATE_KEY')} edge='end'>
                    <i className={showSecret.CULQI_PRIVATE_KEY ? 'tabler-eye-off' : 'tabler-eye'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField label='Culqi RSA ID (Cualquier ID o el asignado en CulqiPanel)' fullWidth value={config.CULQI_RSA_ID} onChange={(e) => handleInputChange('CULQI_RSA_ID', e.target.value)} helperText='ID identificador para el cifrado RSA (requerido para v4).' />
          <TextField label='Culqi RSA Public Key' fullWidth multiline rows={3} value={config.CULQI_RSA_PUBLIC_KEY} onChange={(e) => handleInputChange('CULQI_RSA_PUBLIC_KEY', e.target.value)} helperText='Clave pública RSA para cifrado de datos sensibles (requerido para v4).' />
        </Stack>
      )
    },
    {
      label: 'Certificados',
      content: <CertificadosSettings config={config} onInputChange={handleInputChange} />
    },
    {
      label: 'Finanzas',
      content: (
        <Box>
          <Typography variant='subtitle2' sx={{ mb: 1 }}>Tipo de Cambio PayPal (PEN → USD)</Typography>
          <TextField fullWidth type='number' placeholder='3.80' value={config.PAYPAL_EXCHANGE_RATE} onChange={(e) => handleInputChange('PAYPAL_EXCHANGE_RATE', e.target.value)} InputProps={{ startAdornment: <InputAdornment position='start'>S/</InputAdornment>, endAdornment: <InputAdornment position='end'>por $1.00</InputAdornment> }} helperText='Define cuántos Soles equivale 1 Dólar para el cobro en PayPal.' />
        </Box>
      )
    }
  ].filter(Boolean) as { label: string, content: React.ReactNode }[]

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue >= tabs.length ? 0 : tabValue}
          onChange={handleChangeTab}
          aria-label='configuracion tabs'
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant='scrollable'
          scrollButtons='auto'
        >
          {tabs.map((tab, i) => (
            <Tab key={i} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabs.map((tab, i) => (
            <CustomTabPanel key={i} value={tabValue} index={i}>
              {tab.content}
            </CustomTabPanel>
          ))}
        </Box>

        <Divider />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            size='large'
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} color='inherit' /> : null}
            sx={{ minWidth: 200 }}
          >
            {saving ? 'Guardando...' : 'Guardar Todo'}
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default ConfiguracionView
