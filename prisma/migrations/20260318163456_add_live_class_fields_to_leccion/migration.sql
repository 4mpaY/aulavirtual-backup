-- AlterTable
ALTER TABLE "lecciones" ADD COLUMN     "es_en_vivo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fecha_programada" TIMESTAMP(3);
