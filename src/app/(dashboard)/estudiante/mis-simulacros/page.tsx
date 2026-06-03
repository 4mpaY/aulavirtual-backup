import { redirect } from 'next/navigation'
import { Container, Typography, Box, Stack, Button } from '@mui/material'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import MySimulacrosList from '@/features/estudiante/mis-simulacros/components/MySimulacrosList'
import { AxiosMisSimulacros } from '@/features/estudiante/mis-simulacros/http/axiosMisSimulacros'

export const metadata = { title: 'Mis Simulacros' }

export default async function MisSimulacrosPage() {
  const session = await getAuthSession()
  if (!session) redirect('/login')

  const token = session.user?.accessToken ?? null
  const client = new AxiosMisSimulacros({ getAuthToken: () => token })

  let simulacros: any[] = []
  try {
    simulacros = await client.getAll()
  } catch (error) {
    console.error('Error fetching mis-simulacros:', error)
  }

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                Mis <span style={{ color: 'var(--mui-palette-primary-main)' }}>Simulacros</span>
              </Typography>
              <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
                Accede a tus simulacros adquiridos y pon a prueba tus conocimientos.
              </Typography>
            </Box>
            <Button
              variant='contained' color='primary' size='medium'
              sx={{ borderRadius: '10px' }}
              startIcon={<i className='tabler-search' />}
              href='/simulacros'
            >
              Explorar Simulacros
            </Button>
          </Box>
          <MySimulacrosList simulacros={simulacros} />
        </Stack>
      </Container>
    </Box>
  )
}
