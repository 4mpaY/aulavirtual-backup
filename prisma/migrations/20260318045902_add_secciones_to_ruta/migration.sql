-- AlterTable
ALTER TABLE "cursos_en_ruta" ADD COLUMN     "seccion_id" TEXT;

-- AlterTable
ALTER TABLE "rutas_aprendizaje" ADD COLUMN     "secciones" JSONB DEFAULT '[]';
