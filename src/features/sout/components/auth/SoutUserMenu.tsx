'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signOut, useSession } from 'next-auth/react'
import {
  User,
  LogIn,
  UserPlus,
  LayoutDashboard,
  LogOut,
} from 'lucide-react'

import { useAuthModal } from '@/contexts/AuthModalContext'
import UserAvatar from '@/utils/components/UserAvatar'
import SoutHeaderAvatar from '@sout/components/auth/SoutHeaderAvatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@sout/components/ui/dropdown-menu'
import { cn } from '@sout/lib/utils'

function getUserDashboardHref(rol?: string): string | null {
  switch (rol) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'PROFESOR':
      return '/profesor/dashboard'
    case 'ESTUDIANTE':
      return '/estudiante/dashboard'
    default:
      return null
  }
}

type Props = {
  className?: string
  variant?: 'header' | 'mobile'
  onNavigate?: () => void
}

export default function SoutUserMenu({ className, variant = 'header', onNavigate }: Props) {
  const { data: session, status } = useSession()
  const { openLogin, openRegister } = useAuthModal()
  const router = useRouter()

  const handleLogout = async () => {
    onNavigate?.()
    await signOut({ redirect: false })
    router.push('/')
    router.refresh()
  }

  if (status === 'loading') {
    return (
      <div
        className={cn(
          'rounded-full bg-muted animate-pulse shrink-0',
          variant === 'header' ? 'w-9 h-9' : 'w-10 h-10',
          className
        )}
        aria-hidden
      />
    )
  }

  if (!session?.user) {
    if (variant === 'mobile') {
      return (
        <div className={cn('flex flex-col gap-2 pt-2 border-t border-border', className)}>
          <button
            type="button"
            onClick={() => {
              onNavigate?.()
              openLogin()
            }}
            className="flex items-center gap-2 px-4 py-2.5 font-heading text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              onNavigate?.()
              openRegister()
            }}
            className="flex items-center gap-2 px-4 py-2.5 font-heading text-sm font-medium rounded-lg text-primary hover:bg-primary/10 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta
          </button>
        </div>
      )
    }

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'sout-user-trigger inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-background p-0 text-gray-800 outline-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40',
              className
            )}
            aria-label="Cuenta"
          >
            <User className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 font-heading">
          <DropdownMenuItem
            onClick={() => openLogin()}
            className="cursor-pointer gap-2"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => openRegister()}
            className="cursor-pointer gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const user = session.user
  const dashboardHref = getUserDashboardHref(user.rol)
  const nameParts = (user.name || '').trim().split(/\s+/)
  const nombre = nameParts[0] || 'Usuario'
  const apellido = nameParts.slice(1).join(' ')

  const trigger =
    variant === 'mobile' ? (
      <button
        type="button"
        className={cn(
          'flex items-center gap-3 w-full px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left',
          className
        )}
      >
        <span className="inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-full">
          <SoutHeaderAvatar src={user.avatar} name={nombre} apellido={apellido} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-semibold text-foreground truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </button>
    ) : (
      <button
        type="button"
        className={cn(
          'sout-user-trigger inline-flex items-center justify-center overflow-hidden rounded-full border border-border p-0 outline-none transition-colors hover:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/40',
          className
        )}
        aria-label="Menú de cuenta"
      >
        <SoutHeaderAvatar src={user.avatar} name={nombre} apellido={apellido} />
      </button>
    )

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 font-heading">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 py-1">
            <UserAvatar src={user.avatar} name={nombre} apellido={apellido} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2">
          <Link href="/perfil" onClick={onNavigate}>
            <User className="w-4 h-4" />
            Mi perfil
          </Link>
        </DropdownMenuItem>
        {dashboardHref ? (
          <DropdownMenuItem asChild className="cursor-pointer gap-2">
            <Link href={dashboardHref} onClick={onNavigate}>
              <LayoutDashboard className="w-4 h-4" />
              Panel de usuario
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
