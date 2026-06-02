import { getSimulacrosPublicos } from '@/features/web/simulacros/http/axiosWebSimulacros'
import SimulacrosWebPage from '@/features/web/simulacros/pages/SimulacrosWebPage'

export const metadata = {
  title: 'Simulacros | ATD Academy',
  description: 'Pon a prueba tus conocimientos con nuestros simulacros de examen.',
}

export default async function Page() {
  const simulacros = await getSimulacrosPublicos()
  return <SimulacrosWebPage simulacros={simulacros} />
}
