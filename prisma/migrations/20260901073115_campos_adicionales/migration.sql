-- AlterTable
ALTER TABLE "ebooks" ALTER COLUMN "idioma" SET DEFAULT 'Espa├▒ol';

-- CreateTable
CREATE TABLE "inscripciones_ruta" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "ruta_id" TEXT NOT NULL,
    "inscrito_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inscripciones_ruta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inscripciones_ruta_usuario_id_idx" ON "inscripciones_ruta"("usuario_id");

-- CreateIndex
CREATE INDEX "inscripciones_ruta_ruta_id_idx" ON "inscripciones_ruta"("ruta_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_ruta_usuario_id_ruta_id_key" ON "inscripciones_ruta"("usuario_id", "ruta_id");

-- AddForeignKey
ALTER TABLE "inscripciones_ruta" ADD CONSTRAINT "inscripciones_ruta_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones_ruta" ADD CONSTRAINT "inscripciones_ruta_ruta_id_fkey" FOREIGN KEY ("ruta_id") REFERENCES "rutas_aprendizaje"("id") ON DELETE CASCADE ON UPDATE CASCADE;
