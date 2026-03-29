import UserAvatar from '@/utils/components/UserAvatar'

interface Props {
  src: string | null | undefined
  alt: string
  size?: number
}

export default function DocenteAvatarImage({ src, alt, size = 200 }: Props) {
  // Extraer nombre de alt para las iniciales (ej: "Juan Profesor")
  const nameParts = alt.split(' ')
  const name = nameParts[0] || ''
  const apellido = nameParts.slice(1).join(' ') || ''

  return (
    <UserAvatar
      src={src}
      name={name}
      apellido={apellido}
      size={size}
      sx={{
        borderRadius: '50%',
        border: '4px solid rgba(16,185,129,0.4)',
        boxShadow: '0 0 40px rgba(16,185,129,0.2)'
      }}
    />
  )
}
