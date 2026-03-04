-- CreateEnum
CREATE TYPE "NivelCurso" AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');

-- AlterEnum
ALTER TYPE "TipoEmision" ADD VALUE 'MIXTO';

-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "nivel" "NivelCurso" NOT NULL DEFAULT 'BASICO';
