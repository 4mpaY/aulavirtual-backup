// Context Imports
import { NextAuthProvider } from '@/contexts/nextAuthProvider'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

// Type Imports
import type { ChildrenType, Direction } from '@core/types'
import type { Session } from 'next-auth'

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

    return (
        <NextAuthProvider session={session}>
            <ReactQueryProvider>
                <VerticalNavProvider>
                    <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
                        <ThemeProvider direction={direction} systemMode={systemMode}>
                            {children}
                        </ThemeProvider>
                    </SettingsProvider>
                </VerticalNavProvider>
            </ReactQueryProvider>
        </NextAuthProvider>
    )
}
