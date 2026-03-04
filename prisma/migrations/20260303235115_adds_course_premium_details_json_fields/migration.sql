-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "beneficios" JSONB DEFAULT '[]',
ADD COLUMN     "incluye" JSONB DEFAULT '[]',
ADD COLUMN     "metodologia" JSONB DEFAULT '[]',
ADD COLUMN     "objetivos" JSONB DEFAULT '[]';
