'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

import HydratedDate from '@/utils/components/HydratedDate'

// Hook Imports


// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  // Vars

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© `}<HydratedDate date={new Date()} format="year" />{`, Desarrollado con`}</span>
        <span>{`❤️`}</span>
        <span className='text-textSecondary'>{` por `}</span>
        <Link href='https://fly-software.lovable.app/' target='_blank' className='text-primary'>
          Fly
        </Link>
      </p>
      {/* {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='https://themeforest.net/licenses/standard' target='_blank' className='text-primary'>
            License
          </Link>
          <Link href='https://themeforest.net/user/pixinvent/portfolio' target='_blank' className='text-primary'>
            More Themes
          </Link>
          <Link
            href='https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
            target='_blank'
            className='text-primary'
          >
            Documentation
          </Link>
          <Link href='https://pixinvent.ticksy.com' target='_blank' className='text-primary'>
            Support
          </Link>
        </div>
      )} */}
    </div>
  )
}

export default FooterContent
