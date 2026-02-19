'use client'

import type { FC } from 'react'
import type { Usuario } from '../entity/Usuario'
import CreateUsuarioModal from './CreateUsuarioModal'
import EditUsuarioModal from './EditUsuarioModal'
import DeleteUsuarioModal from './DeleteUsuarioModal'

type ModalConfig = {
  isOpen: boolean
  closeHandler: () => void
}

interface UsuariosActionsProps {
  usuarioClicked: Usuario | null
  addUsuario: ModalConfig
  editUsuario: ModalConfig
  deleteUsuario: ModalConfig
  onSuccess?: () => void
}

export const UsuariosActions: FC<UsuariosActionsProps> = ({
  usuarioClicked,
  addUsuario,
  editUsuario,
  deleteUsuario,
  onSuccess
}) => {
  return (
    <>
      {/* Modal Crear Usuario */}
      <CreateUsuarioModal
        open={addUsuario.isOpen}
        handleClose={addUsuario.closeHandler}
        onSuccess={onSuccess}
      />

      {/* Modal Editar Usuario */}
      <EditUsuarioModal
        open={editUsuario.isOpen}
        handleClose={editUsuario.closeHandler}
        usuarioId={usuarioClicked?.id || null}
        onSuccess={onSuccess}
      />

      {/* Modal Eliminar Usuario */}
      <DeleteUsuarioModal
        open={deleteUsuario.isOpen}
        handleClose={deleteUsuario.closeHandler}
        usuario={
          usuarioClicked
            ? {
              id: usuarioClicked.id,
              nombre: usuarioClicked.nombre,
              apellido: usuarioClicked.apellido,
              correo: usuarioClicked.correo
            }
            : null
        }
        onSuccess={onSuccess}
      />
    </>
  )
}
