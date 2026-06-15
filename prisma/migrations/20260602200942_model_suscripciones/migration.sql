-- CreateEnum
CREATE TYPE "IntervaloSuscripcion" AS ENUM ('MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "EstadoSuscripcion" AS ENUM ('ACTIVA', 'CANCELADA', 'VENCIDA', 'PENDIENTE', 'EN_PRUEBA');

-- CreateEnum
CREATE TYPE "EstadoPagoSuscripcion" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');

-- AlterTable
ALTER TABLE "cursos" ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "planes_suscripcion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "intervalo" "IntervaloSuscripcion" NOT NULL,
    "culqi_interval_unit" INTEGER NOT NULL DEFAULT 1,
    "culqi_interval_count" INTEGER NOT NULL DEFAULT 1,
    "dias_prueba" INTEGER NOT NULL DEFAULT 0,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "culqi_plan_id" TEXT,
    "culqi_short_name" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planes_suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos_en_plan" (
    "plan_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "cursos_en_plan_pkey" PRIMARY KEY ("plan_id","curso_id")
);

-- CreateTable
CREATE TABLE "suscripciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "estado" "EstadoSuscripcion" NOT NULL DEFAULT 'PENDIENTE',
    "culqi_suscripcion_id" TEXT,
    "culqi_customer_id" TEXT,
    "culqi_card_id" TEXT,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "fecha_proximo_cobro" TIMESTAMP(3),
    "fecha_cancelacion" TIMESTAMP(3),
    "cancelado_por_usuario" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos_suscripcion" (
    "id" TEXT NOT NULL,
    "suscripcion_id" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "estado" "EstadoPagoSuscripcion" NOT NULL DEFAULT 'PENDIENTE',
    "culqi_cargo_id" TEXT,
    "periodo_inicio" TIMESTAMP(3),
    "periodo_fin" TIMESTAMP(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_suscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planes_suscripcion_culqi_plan_id_key" ON "planes_suscripcion"("culqi_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "planes_suscripcion_culqi_short_name_key" ON "planes_suscripcion"("culqi_short_name");

-- CreateIndex
CREATE INDEX "planes_suscripcion_esta_activo_idx" ON "planes_suscripcion"("esta_activo");

-- CreateIndex
CREATE INDEX "cursos_en_plan_plan_id_idx" ON "cursos_en_plan"("plan_id");

-- CreateIndex
CREATE INDEX "cursos_en_plan_curso_id_idx" ON "cursos_en_plan"("curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "suscripciones_culqi_suscripcion_id_key" ON "suscripciones"("culqi_suscripcion_id");

-- CreateIndex
CREATE INDEX "suscripciones_usuario_id_idx" ON "suscripciones"("usuario_id");

-- CreateIndex
CREATE INDEX "suscripciones_plan_id_idx" ON "suscripciones"("plan_id");

-- CreateIndex
CREATE INDEX "suscripciones_estado_idx" ON "suscripciones"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_suscripcion_culqi_cargo_id_key" ON "pagos_suscripcion"("culqi_cargo_id");

-- CreateIndex
CREATE INDEX "pagos_suscripcion_suscripcion_id_idx" ON "pagos_suscripcion"("suscripcion_id");

-- CreateIndex
CREATE INDEX "pagos_suscripcion_estado_idx" ON "pagos_suscripcion"("estado");

-- AddForeignKey
ALTER TABLE "cursos_en_plan" ADD CONSTRAINT "cursos_en_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes_suscripcion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos_en_plan" ADD CONSTRAINT "cursos_en_plan_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suscripciones" ADD CONSTRAINT "suscripciones_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "planes_suscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos_suscripcion" ADD CONSTRAINT "pagos_suscripcion_suscripcion_id_fkey" FOREIGN KEY ("suscripcion_id") REFERENCES "suscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
