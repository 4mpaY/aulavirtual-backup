'use client'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import ChatNavbarButton from '@components/layout/shared/ChatNavbarButton'
import NotificationsDropdown from '@components/layout/shared/NotificationsDropdown'
import ReclamacionesBadge from '@components/layout/shared/ReclamacionesBadge'
import UserDropdown from '@components/layout/shared/UserDropdown'

import NavToggle from './NavToggle'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
      </div>
      <div className='flex items-center gap-2'>
        <ReclamacionesBadge />
        <ChatNavbarButton />
        <NotificationsDropdown />
        <UserDropdown />
      </div>
    </div>
  )
}

export default NavbarContent
