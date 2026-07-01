import type { Metadata } from 'next'

import LibroReclamacionesPage from '@sout/pages/LibroReclamaciones'

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones',
  description:
    'Libro de reclamaciones virtual de SOUT Training Center para el registro de quejas y reclamos conforme a la ley peruana.',
}

export default function Page() {
  return <LibroReclamacionesPage />
}
