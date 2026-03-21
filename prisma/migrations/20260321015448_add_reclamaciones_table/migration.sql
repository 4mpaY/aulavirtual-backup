-- CreateEnum
CREATE TYPE "TipoDocumentoReclamo" AS ENUM ('DNI', 'CE', 'PASAPORTE', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoBien" AS ENUM ('PRODUCTO', 'SERVICIO');

-- CreateEnum
CREATE TYPE "TipoReclamacion" AS ENUM ('RECLAMO', 'QUEJA');

-- CreateEnum
CREATE TYPE "EstadoReclamacion" AS ENUM ('PENDIENTE', 'ATENDIDO');

-- CreateTable
CREATE TABLE "reclamaciones" (
    "id" TEXT NOT NULL,
    "numero_correlativo" SERIAL NOT NULL,
    "tipo_documento" "TipoDocumentoReclamo" NOT NULL DEFAULT 'DNI',
    "numero_documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "domicilio" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre_apoderado" TEXT,
    "bien_contratado_tipo" "TipoBien" NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "monto_reclamado" DECIMAL(10,2) NOT NULL,
    "descripcion_bien" TEXT NOT NULL,
    "tipo_reclamacion" "TipoReclamacion" NOT NULL,
    "detalle" TEXT NOT NULL,
    "pedido" TEXT NOT NULL,
    "estado" "EstadoReclamacion" NOT NULL DEFAULT 'PENDIENTE',
    "respuesta_proveedor" TEXT,
    "fecha_respuesta" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reclamaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reclamaciones_numero_correlativo_key" ON "reclamaciones"("numero_correlativo");
