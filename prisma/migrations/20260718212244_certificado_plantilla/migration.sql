-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "certificado_plantilla" TEXT;

-- CreateTable
CREATE TABLE "plantillas_certificado_personalizadas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cara_frente_url" TEXT NOT NULL,
    "cara_reverso_url" TEXT,
    "campos" JSONB NOT NULL DEFAULT '[]',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plantillas_certificado_personalizadas_pkey" PRIMARY KEY ("id")
);
