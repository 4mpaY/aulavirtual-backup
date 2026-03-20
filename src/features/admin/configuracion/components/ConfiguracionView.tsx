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
  Tabs,
  Tab,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'

import { AxiosConfiguracion } from '../http/axiosConfiguracion'
import type { Configuracion } from '../entity/Configuracion'
import MediaLibrary from '../../cursos/components/MediaLibrary'

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

export function ConfiguracionView({ initialData }: ConfiguracionViewProps) {
  const [tabValue, setTabValue] = useState(0)
  const [saving, setSaving] = useState(false)
  const [openMedia, setOpenMedia] = useState(false)

  const initialMapped = (initialData || []).reduce((acc: { [key: string]: string }, curr: Configuracion) => {
    acc[curr.clave] = curr.valor

    return acc
  }, {})

  const [config, setConfig] = useState<{ [key: string]: string }>({
    TEMPLATE_NAME: 'Aula Virtual',
    TEMPLATE_SLOGAN: '',
    TEMPLATE_LOGO: '/images/logo-arm.png',
    SETTINGS_COOKIE_NAME: 'arm',
    PRIMARY_COLOR_MAIN: '#131FF2',
    PRIMARY_COLOR_LIGHT: '#242CBF',
    PRIMARY_COLOR_DARK: '#9196F2',
    PAYPAL_CLIENT_ID: '',
    PAYPAL_CLIENT_SECRET: '',
    PAYPAL_API_URL: 'https://api-m.sandbox.paypal.com',
    PAYPAL_PUBLIC_CLIENT_ID: '',
    PAYPAL_EXCHANGE_RATE: '3.80',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    IZIPAY_MERCHANT_CODE: '',
    IZIPAY_API_KEY: '',
    IZIPAY_RSA_KEY: '',
    IZIPAY_ENDPOINT: 'https://sandbox-api-pw.izipay.pe',
    IZIPAY_SDK_URL: 'https://sandbox-checkout.izipay.pe/payments/v1/js/index.js',
    ...initialMapped
  })

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleInputChange = (clave: string, valor: string) => {
    setConfig(prev => ({ ...prev, [clave]: valor }))
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
      toast.success('Configuración actualizada. Los cambios estéticos pueden requerir recargar la página.')
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }


  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          aria-label='configuracion tabs'
          sx={{ borderBottom: 1, borderColor: 'divider' }}
          variant='scrollable'
          scrollButtons='auto'
        >
          <Tab label='General (Branding)' />
          <Tab label='Apariencia (Colores)' />
          <Tab label='Integración PayPal' />
          <Tab label='Integración Google' />
          <Tab label='Integración Izipay' />
          <Tab label='Finanzas' />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {/* TAB 0: GENERAL */}
          <CustomTabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant='h6' gutterBottom>Información General</Typography>
                <Stack spacing={3}>
                  <TextField
                    label='Nombre de la Plataforma'
                    fullWidth
                    value={config.TEMPLATE_NAME}
                    onChange={(e) => handleInputChange('TEMPLATE_NAME', e.target.value)}
                  />
                  <TextField
                    label='Slogan de la Plataforma'
                    fullWidth
                    value={config.TEMPLATE_SLOGAN}
                    onChange={(e) => handleInputChange('TEMPLATE_SLOGAN', e.target.value)}
                  />
                  <TextField
                    label='Nombre de Cookie de Configuración'
                    fullWidth
                    value={config.SETTINGS_COOKIE_NAME}
                    onChange={(e) => handleInputChange('SETTINGS_COOKIE_NAME', e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='h6' gutterBottom>Logo y Assets</Typography>
                <Stack spacing={3}>
                  <TextField
                    label='URL del Logo'
                    fullWidth
                    value={config.TEMPLATE_LOGO}
                    onChange={(e) => handleInputChange('TEMPLATE_LOGO', e.target.value)}
                  />
                  {config.TEMPLATE_LOGO && (
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', textAlign: 'center', position: 'relative' }}>
                      <Typography variant='caption' display='block' gutterBottom>Vista Previa Logo</Typography>
                      <img src={config.TEMPLATE_LOGO} alt='Preview' style={{ maxHeight: 80, maxWidth: '100%' }} />
                      <Box sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" disabled={saving} startIcon={<i className='tabler-photo' />} onClick={() => setOpenMedia(true)}>
                          Cambiar Logo
                        </Button>
                      </Box>
                    </Box>
                  )}
                  <MediaLibrary
                      open={openMedia}
                      onClose={() => setOpenMedia(false)}
                      onSelect={(url) => {
                        handleInputChange('TEMPLATE_LOGO', url)
                        toast.success('Logo actualizado en el formulario, recuerda Guardar Todo')
                      }}
                      title="Seleccionar Logo"
                  />
                </Stack>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* TAB 1: APARIENCIA */}
          <CustomTabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>Color Primario Principal</Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    fullWidth
                    value={config.PRIMARY_COLOR_MAIN}
                    onChange={(e) => handleInputChange('PRIMARY_COLOR_MAIN', e.target.value)}
                  />
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: config.PRIMARY_COLOR_MAIN, border: '1px solid grey' }} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>Color Primario Claro (Light)</Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    fullWidth
                    value={config.PRIMARY_COLOR_LIGHT}
                    onChange={(e) => handleInputChange('PRIMARY_COLOR_LIGHT', e.target.value)}
                  />
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: config.PRIMARY_COLOR_LIGHT, border: '1px solid grey' }} />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle2' gutterBottom>Color Primario Oscuro (Dark)</Typography>
                <Stack direction='row' spacing={2} alignItems='center'>
                  <TextField
                    fullWidth
                    value={config.PRIMARY_COLOR_DARK}
                    onChange={(e) => handleInputChange('PRIMARY_COLOR_DARK', e.target.value)}
                  />
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: config.PRIMARY_COLOR_DARK, border: '1px solid grey' }} />
                </Stack>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* TAB 2: PAYPAL */}
          <CustomTabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              <TextField
                label='PayPal Client ID'
                fullWidth
                value={config.PAYPAL_CLIENT_ID}
                onChange={(e) => handleInputChange('PAYPAL_CLIENT_ID', e.target.value)}
              />
              <TextField
                label='PayPal Client Secret'
                fullWidth
                type='password'
                value={config.PAYPAL_CLIENT_SECRET}
                onChange={(e) => handleInputChange('PAYPAL_CLIENT_SECRET', e.target.value)}
              />
              <TextField
                label='PayPal API URL'
                fullWidth
                value={config.PAYPAL_API_URL}
                onChange={(e) => handleInputChange('PAYPAL_API_URL', e.target.value)}
                helperText='Ejemplo: https://api-m.paypal.com o https://api-m.sandbox.paypal.com'
              />
            </Stack>
          </CustomTabPanel>

          {/* TAB 3: GOOGLE */}
          <CustomTabPanel value={tabValue} index={3}>
            <Stack spacing={3}>
              <TextField
                label='Google Client ID'
                fullWidth
                value={config.GOOGLE_CLIENT_ID}
                onChange={(e) => handleInputChange('GOOGLE_CLIENT_ID', e.target.value)}
              />
              <TextField
                label='Google Client Secret'
                fullWidth
                type='password'
                value={config.GOOGLE_CLIENT_SECRET}
                onChange={(e) => handleInputChange('GOOGLE_CLIENT_SECRET', e.target.value)}
              />
            </Stack>
          </CustomTabPanel>

          {/* TAB 4: IZIPAY */}
          <CustomTabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField
                    label='Merchant Code'
                    fullWidth
                    value={config.IZIPAY_MERCHANT_CODE}
                    onChange={(e) => handleInputChange('IZIPAY_MERCHANT_CODE', e.target.value)}
                  />
                  <TextField
                    label='API Key'
                    fullWidth
                    type='password'
                    value={config.IZIPAY_API_KEY}
                    onChange={(e) => handleInputChange('IZIPAY_API_KEY', e.target.value)}
                  />
                  <TextField
                    label='RSA Key'
                    fullWidth
                    multiline
                    rows={2}
                    value={config.IZIPAY_RSA_KEY}
                    onChange={(e) => handleInputChange('IZIPAY_RSA_KEY', e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                  <TextField
                    label='Endpoint API'
                    fullWidth
                    value={config.IZIPAY_ENDPOINT}
                    onChange={(e) => handleInputChange('IZIPAY_ENDPOINT', e.target.value)}
                  />
                  <TextField
                    label='SDK JS URL'
                    fullWidth
                    value={config.IZIPAY_SDK_URL}
                    onChange={(e) => handleInputChange('IZIPAY_SDK_URL', e.target.value)}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* TAB 5: FINANZAS */}
          <CustomTabPanel value={tabValue} index={5}>
            <Box>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Tipo de Cambio PayPal (PEN → USD)
              </Typography>
              <TextField
                fullWidth
                type='number'
                placeholder='3.80'
                value={config.PAYPAL_EXCHANGE_RATE}
                onChange={(e) => handleInputChange('PAYPAL_EXCHANGE_RATE', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>S/</InputAdornment>,
                  endAdornment: <InputAdornment position='end'>por $1.00</InputAdornment>
                }}
                helperText='Define cuántos Soles equivale 1 Dólar para el cobro en PayPal.'
              />
            </Box>
          </CustomTabPanel>
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
