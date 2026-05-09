import type { Metadata } from 'next'

import NosotrosClient from './NosotrosClient'

export const metadata: Metadata = {
  title: 'Nosotros - VISIONA',
  description: 'Conoce la historia, misión, valores y el equipo de profesionales que impulsan a VISIONA hacia la excelencia.',
}

export default function NosotrosPage() {
  return <NosotrosClient />
}
