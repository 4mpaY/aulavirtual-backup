-- CreateTable
CREATE TABLE "eventos_externos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "todo_el_dia" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "usuario_id" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_externos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "eventos_externos_usuario_id_idx" ON "eventos_externos"("usuario_id");

-- CreateIndex
CREATE INDEX "eventos_externos_fecha_inicio_idx" ON "eventos_externos"("fecha_inicio");

-- AddForeignKey
ALTER TABLE "eventos_externos" ADD CONSTRAINT "eventos_externos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
