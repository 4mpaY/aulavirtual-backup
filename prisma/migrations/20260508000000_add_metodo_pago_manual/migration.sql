-- CreateTable
CREATE TABLE "metodos_pago_manual" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "nombre_banco" TEXT,
    "numero_cuenta" TEXT NOT NULL,
    "cci" TEXT,
    "ruc" TEXT,
    "descripcion" TEXT,
    "imagen_url" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metodos_pago_manual_pkey" PRIMARY KEY ("id")
);

-- AlterTable pedidos: columnas del comprobante y método manual
ALTER TABLE "pedidos"
    ADD COLUMN IF NOT EXISTS "comprobante_url" TEXT,
    ADD COLUMN IF NOT EXISTS "comprobante_subido_en" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "metodo_pago_manual_id" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "pedidos_metodo_pago_manual_id_idx" ON "pedidos"("metodo_pago_manual_id");

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_metodo_pago_manual_id_fkey" FOREIGN KEY ("metodo_pago_manual_id") REFERENCES "metodos_pago_manual"("id") ON DELETE SET NULL ON UPDATE CASCADE;
