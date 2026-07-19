-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "firmante_1_id" TEXT,
ADD COLUMN     "firmante_2_id" TEXT;

-- CreateTable
CREATE TABLE "firmantes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cargo" TEXT,
    "firma" TEXT,
    "sello" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "firmantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cursos_firmante_1_id_idx" ON "cursos"("firmante_1_id");

-- CreateIndex
CREATE INDEX "cursos_firmante_2_id_idx" ON "cursos"("firmante_2_id");

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_firmante_1_id_fkey" FOREIGN KEY ("firmante_1_id") REFERENCES "firmantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_firmante_2_id_fkey" FOREIGN KEY ("firmante_2_id") REFERENCES "firmantes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
