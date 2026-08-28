import { redirect } from 'next/navigation'

import { Typography, Container, Box } from '@mui/material'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import prisma from '@/utils/libs/prisma'
import UserProfileForm from '@/features/perfil/components/UserProfileForm'

export const metadata = {
  title: 'Mi Perfil | Aula Virtual',
  description: 'Gestiona tu perfil personal'
}

export default async function PerfilPage() {
  const session = await getAuthSession()

  if (!session?.user?.email) {
    redirect('/login')
  }

  let user = null

  try {
    user = await prisma.usuario.findUnique({
      where: { correo: session.user.email },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        numero_documento: true,
        celular: true,
        avatar: true,
        biografia: true,
        rol: true,
        cargo: true,
        firma: true,
        licencia: true,
        equipo_opera: true,
        empresa: true,
        ciudad: true,
        pais: true,
        codigo_instructor_nsc: true,
        foto_auto: true
      }
    })
  } catch (error) {
    console.error('Error fetching user profile from database:', error)
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
          Mi Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tu información personal y detalles de tu cuenta.
        </Typography>
      </Box>

      {/* Aquí insertamos el componente cliente que maneja el formulario */}
      <UserProfileForm user={{ ...user, numero_documento: user.numero_documento || '' }} />
    </Container>
  )
}
