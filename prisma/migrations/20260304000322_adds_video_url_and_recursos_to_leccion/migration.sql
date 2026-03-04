-- AlterTable
ALTER TABLE "lecciones" ADD COLUMN     "recursos" JSONB DEFAULT '[]',
ADD COLUMN     "video_url" TEXT;
