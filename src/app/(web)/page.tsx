import type { Metadata } from 'next'

import HomePage from '@sout/pages/Index'
import { getPublicCourses } from '@sout/lib/getPublicCourses'

export const metadata: Metadata = {
  title: 'Manejo Defensivo y Seguridad Vial',
  description:
    'Centro de capacitación líder en manejo defensivo NSC, seguridad vial, primeros auxilios y prevención de riesgos para minería, industria y transporte en Perú.',
  keywords: [
    'manejo defensivo',
    'seguridad vial',
    'capacitaciones mineras',
    'NSC',
    'primeros auxilios',
    '4x4',
    'Perú',
    'MATPEL',
    'Montacargas',
  ],
}

export default async function Page() {
  const { courses } = await getPublicCourses()

  return <HomePage courses={courses} />
}
