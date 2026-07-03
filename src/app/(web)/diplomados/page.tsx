import ProgramCatalogLayout from '@/features/web/home/components/ProgramCatalogLayout'
import { getProgramCatalogData } from '@/features/web/cursos/getProgramCatalogData'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { getTipoProgramaConfig } from '@/utils/configs/tipoPrograma'

export default async function DiplomadosPage() {
  const session = await getAuthSession()
  const token = session?.user?.accessToken ?? null
  const { courses, categories } = await getProgramCatalogData('DIPLOMADO', token)

  return <ProgramCatalogLayout tipo="DIPLOMADO" courses={courses} categories={categories} />
}

export function generateMetadata() {
  const config = getTipoProgramaConfig('DIPLOMADO')

  return {
    title: config.catalogTitle,
    description: config.catalogDescription
  }
}
