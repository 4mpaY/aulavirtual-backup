import type { FC } from 'react'

import DeleteCursoModal from './DeleteCursoModal'

import type { Curso } from '../entity/Curso'

type ModalConfig = {
    isOpen: boolean
    closeHandler: () => void
}

interface CursosActionsProps {
    cursoClicked: Curso | null
    deleteCurso: ModalConfig
    onSuccess?: () => void
}

export const CursosActions: FC<CursosActionsProps> = ({
    cursoClicked,
    deleteCurso,
    onSuccess
}) => {
    return (
        <>
            {/* Modal Eliminar Curso */}
            <DeleteCursoModal
                open={deleteCurso.isOpen}
                handleClose={deleteCurso.closeHandler}
                curso={
                    cursoClicked
                        ? {
                            id: cursoClicked.id,
                            titulo: cursoClicked.titulo,
                            slug: cursoClicked.slug,
                            estado: cursoClicked.estado
                        }
                        : null
                }
                onSuccess={onSuccess}
            />
        </>
    )
}
