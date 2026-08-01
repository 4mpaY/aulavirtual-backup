-- DropForeignKey
ALTER TABLE "detalles_pedido" DROP CONSTRAINT "detalles_pedido_curso_id_fkey";


-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participantes_conversacion" (
    "id" TEXT NOT NULL,
    "conversacion_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "unido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participantes_conversacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes_chat" (
    "id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversacion_id" TEXT NOT NULL,
    "remitente_id" TEXT NOT NULL,
    "adjunto_id" TEXT,

    CONSTRAINT "mensajes_chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "participantes_conversacion_conversacion_id_idx" ON "participantes_conversacion"("conversacion_id");

-- CreateIndex
CREATE INDEX "participantes_conversacion_usuario_id_idx" ON "participantes_conversacion"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_conversacion_conversacion_id_usuario_id_key" ON "participantes_conversacion"("conversacion_id", "usuario_id");

-- CreateIndex
CREATE INDEX "mensajes_chat_conversacion_id_idx" ON "mensajes_chat"("conversacion_id");

-- CreateIndex
CREATE INDEX "mensajes_chat_remitente_id_idx" ON "mensajes_chat"("remitente_id");

-- CreateIndex
CREATE INDEX "mensajes_chat_conversacion_id_creado_en_idx" ON "mensajes_chat"("conversacion_id", "creado_en");

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_conversacion" ADD CONSTRAINT "participantes_conversacion_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_conversacion" ADD CONSTRAINT "participantes_conversacion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_chat" ADD CONSTRAINT "mensajes_chat_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "conversaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_chat" ADD CONSTRAINT "mensajes_chat_remitente_id_fkey" FOREIGN KEY ("remitente_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes_chat" ADD CONSTRAINT "mensajes_chat_adjunto_id_fkey" FOREIGN KEY ("adjunto_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
