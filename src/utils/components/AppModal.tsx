import type { FC } from 'react'

import { Backdrop, Box, type BoxProps, Fade, IconButton, Modal, styled } from '@mui/material'

import { Icon } from '@iconify/react'

import { lightTheme } from './constants/constants'


type AppModalProps = {
  open: boolean
  handleClose: () => void
  viewIconClose?: boolean
}

const Wrapper = styled(Box)(({ theme }) => ({
  top: '50%',
  left: '50%',
  padding: theme.spacing(6),
  maxWidth: 700,
  width: 'calc(100% - 32px)',
  maxHeight: 'calc(100% - 48px)', // Increased top/bottom margin slightly
  borderRadius: theme.shape.borderRadius * 4,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  backgroundColor: lightTheme(theme) ? '#fff' : theme.palette.background.default,
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  overflowY: 'auto',
  outline: 'none',
  [theme.breakpoints.up('sm')]: {
    width: '100%',
    padding: theme.spacing(10)
  }
}))

const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 100
}))

const AppModal: FC<AppModalProps & BoxProps> = ({ children, open, handleClose, viewIconClose = true, ...props }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      slots={{
        backdrop: Backdrop
      }}
      slotProps={{
        backdrop: {
          timeout: 200
        }
      }}
    >
      <Fade in={open}>
        <Wrapper {...props}>
          {viewIconClose && (
            <CloseButton onClick={handleClose} aria-label='close' size='small'>
              <Icon icon='tabler:x' fontSize={24} />
            </CloseButton>
          )}
          {children}
        </Wrapper>
      </Fade>
    </Modal>
  )
}

export default AppModal
