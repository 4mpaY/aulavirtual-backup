// Type Imports
import type { Session } from 'next-auth'

import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import { getTenantConfig } from '@/utils/libs/tenant'

import { CartProvider } from '@/features/web/cart/context/CartContext'
import CartDrawer from '@/features/web/cart/components/CartDrawer'

type Props = ChildrenType & {
    direction?: Direction
    session: Session | null
}

export const Providers = (props: Props) => {
    // Props
    const { children, direction = 'ltr', session } = props

    // Vars
    const mode = getMode()
    const settingsCookie = getSettingsFromCookie()
    const demoName = getDemoName()
    const systemMode = getSystemMode()

    // Tenant Context
    const tenantConfig = getTenantConfig()

    // Override settings with tenant primary color if not set in cookie
    const settings = {
        ...settingsCookie,
        primaryColor: settingsCookie.primaryColor || tenantConfig.color_primario
    }

    return (
        <NextAuthProvider session={session}>
            <ReactQueryProvider>
                <VerticalNavProvider>
                    <SettingsProvider settingsCookie={settings} mode={mode} demoName={demoName}>
                        <ThemeProvider direction={direction} systemMode={systemMode}>
                            <CartProvider>
                                {children}
                                <CartDrawer />
                            </CartProvider>
                        </ThemeProvider>
                    </SettingsProvider>
                </VerticalNavProvider>
            </ReactQueryProvider>
        </NextAuthProvider>
    )
}
