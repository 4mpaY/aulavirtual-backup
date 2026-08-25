'use client'

import { useState, type ReactNode } from 'react'

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'

/**
 * Maneja errores globales de React Query.
 * Si una petición devuelve 401, cierra sesión y redirige al login.
 */
function handleGlobalQueryError(error: unknown) {
  const isUnauthorized =
    (error instanceof Response && error.status === 401) ||
    (error instanceof Error && (error as any).status === 401) ||
    (typeof error === 'object' && error !== null && (error as any).status === 401)

  if (isUnauthorized) {
    signOut({ callbackUrl: '/login?expired=1' })
  }
}

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: handleGlobalQueryError
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 1000, // 5 segundos — evita peticiones inmediatas al navegar entre páginas
                        gcTime: 10 * 60 * 1000, // 10 minutos en cache
                        refetchOnWindowFocus: false, // Evita ráfagas de red al volver a la pestaña
                        retry: 1
                    }
                }
            })
    )

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    )
}
