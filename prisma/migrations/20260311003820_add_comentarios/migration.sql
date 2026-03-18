-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "leccion_id" TEXT NOT NULL,
    "respuesta_a_id" TEXT,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comentarios_usuario_id_idx" ON "comentarios"("usuario_id");

-- CreateIndex
CREATE INDEX "comentarios_leccion_id_idx" ON "comentarios"("leccion_id");

-- CreateIndex
CREATE INDEX "comentarios_respuesta_a_id_idx" ON "comentarios"("respuesta_a_id");

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_respuesta_a_id_fkey" FOREIGN KEY ("respuesta_a_id") REFERENCES "comentarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
