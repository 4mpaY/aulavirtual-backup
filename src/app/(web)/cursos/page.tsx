import type { Metadata } from 'next'

import SoutCoursesCatalog from '@sout/pages/CoursesCatalog'
import { getPublicCourses } from '@sout/lib/getPublicCourses'

export const metadata: Metadata = {
  title: 'Cursos y Talleres | Certificaciones NSC',
  description:
    'Explora nuestros cursos de capacitación publicados en la plataforma. Compra en línea y accede desde tu panel de estudiante.',
}

export default async function Page() {
  const { courses, categories } = await getPublicCourses()

  return <SoutCoursesCatalog courses={courses} categories={categories} />
}
