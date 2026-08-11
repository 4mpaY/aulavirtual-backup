/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `cursos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "fecha_fin" TIMESTAMP(3),
ADD COLUMN     "precio_falso" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "tipo" "TipoCurso" NOT NULL DEFAULT 'CURSO',
ADD COLUMN     "vigencia_meses" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "cursos_codigo_key" ON "cursos"("codigo");

-- CreateIndex
CREATE INDEX "cursos_tipo_idx" ON "cursos"("tipo");
