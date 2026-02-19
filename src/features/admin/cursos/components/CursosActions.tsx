'use client'

import type { FC } from 'react'
import type { Curso } from '../entity/Curso'
import CreateCursoWizard from './CreateCursoWizard'
import DeleteCursoModal from './DeleteCursoModal'

type ModalConfig = {
    isOpen: boolean
    closeHandler: () => void
}

interface CursosActionsProps {
    cursoClicked: Curso | null
    addCurso: ModalConfig
    deleteCurso: ModalConfig
    profesores: { id: string; nombre: string; apellido: string }[]
    onSuccess?: () => void
}

export const CursosActions: FC<CursosActionsProps> = ({
    cursoClicked,
    addCurso,
    deleteCurso,
    profesores,
    onSuccess
}) => {
    return (
        <>
            {/* Wizard Crear Curso */}
            <CreateCursoWizard
                open={addCurso.isOpen}
                handleClose={addCurso.closeHandler}
                profesores={profesores}
                onSuccess={onSuccess}
            />

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
