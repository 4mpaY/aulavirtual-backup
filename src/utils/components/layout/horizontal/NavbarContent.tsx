'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import ChatNavbarButton from '@components/layout/shared/ChatNavbarButton'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import UserDropdown from '@components/layout/shared/UserDropdown'

import Logo from '@components/layout/shared/Logo'
import NavToggle from './NavToggle'

// Hook Imports
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <div
      className={classnames(horizontalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}
    >
      <div className='flex items-center gap-4'>
        <NavToggle />
        {/* Hide Logo on Smaller screens */}
        {!isBreakpointReached && <Logo />}
      </div>
      <div className='flex items-center gap-2'>
        <ChatNavbarButton />
        <NotificationsDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
