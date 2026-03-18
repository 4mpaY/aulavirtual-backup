import React from 'react'

import { redirect } from 'next/navigation'

import { Typography, Container, Box } from '@mui/material'
import { getServerSession } from 'next-auth'

import prisma from '@/utils/libs/prisma'
import { authOptions } from '@/utils/configs/auth'
import UserProfileForm from '@/features/perfil/components/UserProfileForm'

export const metadata = {
  title: 'Mi Perfil | Aula Virtual',
  description: 'Gestiona tu perfil personal'
}

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login')
  }

  // Buscar el usuario en la base de datos
  const user = await prisma.usuario.findUnique({
    where: { correo: session.user.email },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      correo: true,
      numero_documento: true,
      celular: true,
      biografia: true,
      avatar: true,
      rol: true
    }
  })

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
      <UserProfileForm user={user} />
    </Container>
  )
}
