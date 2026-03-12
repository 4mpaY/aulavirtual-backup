-- CreateEnum
CREATE TYPE "TipoDescuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "cupon_id" TEXT;

-- CreateTable
CREATE TABLE "cupones" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "tipo" "TipoDescuento" NOT NULL DEFAULT 'PORCENTAJE',
    "limite_uso" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "fecha_expiracion" TIMESTAMP(3),
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cupones_codigo_key" ON "cupones"("codigo");

-- CreateIndex
CREATE INDEX "pedidos_cupon_id_idx" ON "pedidos"("cupon_id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
