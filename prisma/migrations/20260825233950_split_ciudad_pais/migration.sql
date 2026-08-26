/*
  Warnings:

  - You are about to drop the column `ciudad_pais` on the `usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "ciudad_pais",
ADD COLUMN     "ciudad" TEXT,
ADD COLUMN     "pais" TEXT;
