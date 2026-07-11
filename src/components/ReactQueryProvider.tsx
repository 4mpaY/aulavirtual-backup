'use client'

import { useState, type ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
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
