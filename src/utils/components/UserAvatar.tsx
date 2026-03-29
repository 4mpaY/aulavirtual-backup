'use client'

import React, { useState, useMemo } from 'react'

import type { SxProps, Theme } from '@mui/material';
import { Avatar } from '@mui/material'

interface UserAvatarProps {
  src?: string | null
  name?: string
  apellido?: string
  size?: number
  sx?: SxProps<Theme>
  className?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

/**
 * Genera un color consistente basado en el nombre del usuario
 */
const stringToColor = (string: string) => {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff

    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

const UserAvatar = ({
  src,
  name = 'U',
  apellido = '',
  size = 40,
  sx = {},
  className,
  onClick
}: UserAvatarProps) => {
  const [imgError, setImgError] = useState(false)

  const initials = useMemo(() => {
    const firstInitial = name?.charAt(0) || ''
    const secondInitial = apellido?.charAt(0) || ''


    return `${firstInitial}${secondInitial}`.toUpperCase() || '?'
  }, [name, apellido])

  const bgColor = useMemo(() => {
    return stringToColor(`${name}${apellido}` || 'Default')
  }, [name, apellido])

  // Si no hay src o hubo un error al cargar, mostramos las iniciales
  const showInitials = !src || imgError

  return (
    <Avatar
      src={!imgError ? (src || undefined) : undefined}
      alt={name}
      className={className}
      onClick={onClick}
      imgProps={{
        referrerPolicy: 'no-referrer',
        onError: () => setImgError(true)
      }}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 700,
        bgcolor: showInitials ? bgColor : 'transparent',
        border: '1px solid rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ...sx
      }}
    >
      {initials}
    </Avatar>
  )
}

export default UserAvatar
