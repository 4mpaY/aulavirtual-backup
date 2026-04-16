-- CreateEnum
CREATE TYPE "TipoExamen" AS ENUM ('FINAL', 'INTERMEDIO');

-- CreateEnum
CREATE TYPE "EstadoNota" AS ENUM ('APROBADO', 'DESAPROBADO', 'EN_PROGRESO');

-- AlterTable
ALTER TABLE "examenes" ADD COLUMN     "modulo_id" TEXT,
ADD COLUMN     "orden" INTEGER,
ADD COLUMN     "peso" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "progreso_minimo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tipo" "TipoExamen" NOT NULL DEFAULT 'FINAL';

-- AlterTable
ALTER TABLE "inscripciones" ADD COLUMN     "estado_nota" "EstadoNota",
ADD COLUMN     "nota_final" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "examenes_modulo_id_idx" ON "examenes"("modulo_id");

-- AddForeignKey
ALTER TABLE "examenes" ADD CONSTRAINT "examenes_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
