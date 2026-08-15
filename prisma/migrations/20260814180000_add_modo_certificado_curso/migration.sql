-- CreateEnum
CREATE TYPE "ModoCertificado" AS ENUM ('AUTOMATICO', 'MANUAL');

-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "modo_certificado" "ModoCertificado" NOT NULL DEFAULT 'AUTOMATICO';
