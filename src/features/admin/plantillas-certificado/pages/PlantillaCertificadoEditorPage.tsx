import PlantillaCertificadoEditor from '../components/PlantillaCertificadoEditor'

interface Props {
  plantillaId: string
}

export default function PlantillaCertificadoEditorPage({ plantillaId }: Props) {
  return <PlantillaCertificadoEditor plantillaId={plantillaId} />
}
