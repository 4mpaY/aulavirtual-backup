'use client'

import { useMemo, useState } from 'react'

import { cn } from '@sout/lib/utils'

function stringToColor(string: string) {
  let hash = 0

  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff

    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}

type Props = {
  src?: string | null
  name?: string
  apellido?: string
  className?: string
}

export default function SoutHeaderAvatar({ src, name = 'U', apellido = '', className }: Props) {
  const [imgError, setImgError] = useState(false)

  const initials = useMemo(() => {
    const first = name?.charAt(0) || ''
    const second = apellido?.charAt(0) || ''

    
return `${first}${second}`.toUpperCase() || '?'
  }, [name, apellido])

  const bgColor = useMemo(() => stringToColor(`${name}${apellido}` || 'Default'), [name, apellido])
  const showImage = Boolean(src) && !imgError

  return (
    <span
      className={cn(
        'inline-flex h-full w-full items-center justify-center overflow-hidden rounded-full',
        className
      )}
    >
      {showImage ? (
        <img
          src={src!}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center font-heading text-xs font-bold text-white sm:text-sm"
          style={{ backgroundColor: bgColor }}
        >
          {initials}
        </span>
      )}
    </span>
  )
}
