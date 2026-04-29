

import DeleteCursoModal from './DeleteCursoModal'
import CourseStudentsModal from './CourseStudentsModal'

import type { Curso } from '../entity/Curso'

type ModalConfig = {
    isOpen: boolean
    closeHandler: () => void
}

interface CursosActionsProps {
    cursoClicked: Curso | null
    deleteCurso: ModalConfig
    viewStudents: ModalConfig
    onSuccess?: () => void
}

export const CursosActions = ({
    cursoClicked,
    deleteCurso,
    viewStudents,
    onSuccess
}: CursosActionsProps) => {
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

            {/* Modal Ver Alumnos */}
            <CourseStudentsModal
                open={viewStudents.isOpen}
                handleClose={viewStudents.closeHandler}
                cursoId={cursoClicked?.id ?? null}
                cursoTitulo={cursoClicked?.titulo ?? null}
            />
        </>
    )
}

