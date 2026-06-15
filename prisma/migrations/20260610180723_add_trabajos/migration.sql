-- CreateTable
CREATE TABLE "trabajos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "archivo_url" TEXT,
    "archivo_nombre" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "leccion_id" TEXT NOT NULL,

    CONSTRAINT "trabajos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas_trabajo" (
    "id" TEXT NOT NULL,
    "archivo_url" TEXT NOT NULL,
    "archivo_nombre" TEXT NOT NULL,
    "comentario_estudiante" TEXT,
    "nota" DOUBLE PRECISION,
    "comentario_docente" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "trabajo_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "entregas_trabajo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trabajos_leccion_id_key" ON "trabajos"("leccion_id");

-- CreateIndex
CREATE INDEX "entregas_trabajo_trabajo_id_idx" ON "entregas_trabajo"("trabajo_id");

-- CreateIndex
CREATE INDEX "entregas_trabajo_usuario_id_idx" ON "entregas_trabajo"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_trabajo_trabajo_id_usuario_id_key" ON "entregas_trabajo"("trabajo_id", "usuario_id");

-- AddForeignKey
ALTER TABLE "trabajos" ADD CONSTRAINT "trabajos_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_trabajo" ADD CONSTRAINT "entregas_trabajo_trabajo_id_fkey" FOREIGN KEY ("trabajo_id") REFERENCES "trabajos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas_trabajo" ADD CONSTRAINT "entregas_trabajo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
