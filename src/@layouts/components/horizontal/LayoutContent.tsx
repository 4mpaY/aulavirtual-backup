'use client'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import { MaterialDesignContent, SnackbarProvider } from 'notistack'

import { styled } from '@mui/material'

import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@/utils/configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled Component Imports
import StyledMain from '@layouts/styles/shared/StyledMain'

const StyledMaterialDesignContent = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.error.main
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.success.main
  }
}))

const LayoutContent = ({ children }: ChildrenType) => {
  // Hooks
  const { settings } = useSettings()

  // Vars
  const contentCompact = settings.contentWidth === 'compact'
  const contentWide = settings.contentWidth === 'wide'

  return (
    <StyledMain
      isContentCompact={contentCompact}
      className={classnames(horizontalLayoutClasses.content, 'flex-auto', {
        [`${horizontalLayoutClasses.contentCompact} is-full`]: contentCompact,
        [horizontalLayoutClasses.contentWide]: contentWide
      })}
      style={{ padding: themeConfig.layoutPadding }}
    >
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={3000}
        preventDuplicate
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {children}
      </SnackbarProvider>
    </StyledMain>
  )
}

export default LayoutContent
