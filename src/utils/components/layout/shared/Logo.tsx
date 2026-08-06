'use client'

// React Imports
import { useState } from 'react'
import type { SyntheticEvent } from 'react'

// Next Imports
// import Img from 'next/image'
import Link from 'next/link'

// Config Imports
import themeConfig from '@/utils/configs/themeConfig'

// Hook Imports
import { useConfig } from '@/contexts/ConfigContext'

interface LogoProps {

  // Cuando el logo subido es casi cuadrado (o vertical) se ve muy pequeño a la
  // altura fija de 46px. Con esto activado, se mide el aspect ratio real de la
  // imagen y se le da más alto a los logos cuadrados; los horizontales/anchos
  // se quedan tal cual (46px), que es como ya se ven bien.

  enlargeSquare?: boolean
}

const COMPACT_HEIGHT = 46
const SQUARE_HEIGHT = 68

const Logo = ({ enlargeSquare = false }: LogoProps = {}) => {
  // Hooks
  const configs = useConfig()
  const [imgHeight, setImgHeight] = useState(COMPACT_HEIGHT)

  // Vars
  const templateLogo = configs.TEMPLATE_LOGO || themeConfig.templateLogo
  const templateName = themeConfig.templateName

  const handleImgLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!enlargeSquare) return

    const { naturalWidth, naturalHeight } = e.currentTarget

    if (!naturalWidth || !naturalHeight) return

    const ratio = naturalWidth / naturalHeight

    setImgHeight(ratio < 1.6 ? SQUARE_HEIGHT : COMPACT_HEIGHT)
  }

  return (
    <Link href='/' className='flex items-center'>
      <img
        src={templateLogo}
        alt={`${templateName} Logo`}
        onLoad={handleImgLoad}
        className={enlargeSquare ? undefined : 'bs-[46px]'}
        style={enlargeSquare ? { height: imgHeight, width: 'auto' } : undefined}
      />
    </Link>
  )
}

export default Logo
