/*
  Warnings:

  - You are about to drop the column `link` on the `notificaciones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notificaciones" DROP COLUMN "link",
ADD COLUMN     "enlace" TEXT,
ADD COLUMN     "tipo" TEXT;
