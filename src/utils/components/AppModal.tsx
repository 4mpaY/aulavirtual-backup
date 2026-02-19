import { Backdrop, Box, type BoxProps, Fade, IconButton, Modal, styled } from '@mui/material'
import type { FC } from 'react'
import { lightTheme } from './constants/constants'
import { Icon } from '@iconify/react'

type AppModalProps = {
  open: boolean
  handleClose: () => void
  viewIconClose?: boolean
}

const Wrapper = styled(Box)(({ theme }) => ({
  top: '50%',
  left: '50%',
  padding: 18,
  maxWidth: 700,
  width: '100%',
  borderRadius: 5,
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  backgroundColor: lightTheme(theme) ? '#fff' : theme.palette.background.default
}))

const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  top: 2,
  right: 2,
  zIndex: 100
}))

const AppModal: FC<AppModalProps & BoxProps> = ({ children, open, handleClose, viewIconClose = true, ...props }) => {
  return (
    <Modal
      open={open}
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
            <CloseButton onClick={handleClose} aria-label='close' sx={{ width: 40, height: 40 }}>
              <Icon icon='mdi:close-circle' fontSize={32} />
            </CloseButton>
          )}
          {children}
        </Wrapper>
      </Fade>
    </Modal>
  )
}

export default AppModal
