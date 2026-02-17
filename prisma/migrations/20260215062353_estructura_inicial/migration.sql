-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'PROFESOR', 'ESTUDIANTE');

-- CreateEnum
CREATE TYPE "EstadoCurso" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "EstadoInscripcion" AS ENUM ('PENDIENTE', 'ACTIVO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'CANCELADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA_CREDITO', 'TARJETA_DEBITO', 'YAPE', 'PLIN', 'TRANSFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoPregunta" AS ENUM ('OPCION_MULTIPLE', 'VERDADERO_FALSO', 'RESPUESTA_ABIERTA');

-- CreateEnum
CREATE TYPE "TipoContenido" AS ENUM ('VIDEO', 'DOCUMENTO', 'IMAGEN', 'AUDIO', 'ENLACE', 'INCRUSTADO');

-- CreateEnum
CREATE TYPE "EstadoLeccion" AS ENUM ('BORRADOR', 'PUBLICADO');

-- CreateEnum
CREATE TYPE "TipoEmision" AS ENUM ('SINCRONO', 'ASINCRONO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "numero_documento" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "avatar" TEXT,
    "biografia" TEXT,
    "celular" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'ESTUDIANTE',
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria_padre_id" TEXT,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "miniatura" TEXT,
    "video_presentacion" TEXT,
    "duracion" TEXT,
    "tipo_emision" "TipoEmision" NOT NULL DEFAULT 'ASINCRONO',
    "estado" "EstadoCurso" NOT NULL DEFAULT 'BORRADOR',
    "es_gratis" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "profesor_id" TEXT NOT NULL,
    "categoria_id" TEXT,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modulos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "modulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecciones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT,
    "orden" INTEGER NOT NULL,
    "duracion" INTEGER,
    "enlace_reunion" TEXT,
    "estado" "EstadoLeccion" NOT NULL DEFAULT 'BORRADOR',
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "modulo_id" TEXT NOT NULL,

    CONSTRAINT "lecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenidos_leccion" (
    "id" TEXT NOT NULL,
    "titulo" TEXT,
    "tipo" "TipoContenido" NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "leccion_id" TEXT NOT NULL,

    CONSTRAINT "contenidos_leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "numero_pedido" SERIAL NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "metodo_pago" "MetodoPago",
    "total" DECIMAL(10,2) NOT NULL,
    "mensaje" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'PEN',
    "transaccion_id" TEXT,
    "referencia_pago" TEXT,
    "url_pago" TEXT,
    "token_pago" TEXT,
    "respuesta_izipay" JSONB,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagado_en" TIMESTAMP(3),
    "cancelado_en" TIMESTAMP(3),
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalles_pedido" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "detalles_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id" TEXT NOT NULL,
    "estado" "EstadoInscripcion" NOT NULL DEFAULT 'ACTIVO',
    "inscrito_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completado_en" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,
    "pedido_id" TEXT,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_leccion" (
    "id" TEXT NOT NULL,
    "esta_completado" BOOLEAN NOT NULL DEFAULT false,
    "completado_en" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "leccion_id" TEXT NOT NULL,

    CONSTRAINT "progreso_leccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progreso_curso" (
    "id" TEXT NOT NULL,
    "porcentaje_progreso" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usuario_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,
    "actualizado_en" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progreso_curso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examenes" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "limite_tiempo" INTEGER,
    "puntaje_aprobacion" DOUBLE PRECISION NOT NULL DEFAULT 60,
    "intentos_maximos" INTEGER NOT NULL DEFAULT 1,
    "mezclar_preguntas" BOOLEAN NOT NULL DEFAULT false,
    "esta_publicado" BOOLEAN NOT NULL DEFAULT false,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "examenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" "TipoPregunta" NOT NULL,
    "puntos" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "orden" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "examen_id" TEXT NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opciones_pregunta" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "es_correcta" BOOLEAN NOT NULL DEFAULT false,
    "orden" INTEGER NOT NULL,
    "pregunta_id" TEXT NOT NULL,

    CONSTRAINT "opciones_pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intentos_examen" (
    "id" TEXT NOT NULL,
    "puntaje" DOUBLE PRECISION,
    "esta_aprobado" BOOLEAN,
    "iniciado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enviado_en" TIMESTAMP(3),
    "usuario_id" TEXT NOT NULL,
    "examen_id" TEXT NOT NULL,

    CONSTRAINT "intentos_examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_intento" (
    "id" TEXT NOT NULL,
    "respuesta_texto" TEXT,
    "es_correcta" BOOLEAN,
    "puntos_obtenidos" DOUBLE PRECISION,
    "intento_id" TEXT NOT NULL,
    "pregunta_id" TEXT NOT NULL,
    "opcion_seleccionada_id" TEXT,

    CONSTRAINT "respuestas_intento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificados" (
    "id" TEXT NOT NULL,
    "codigo_verificacion" TEXT NOT NULL,
    "emitido_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" TEXT NOT NULL,
    "curso_id" TEXT NOT NULL,

    CONSTRAINT "certificados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numero_documento_key" ON "usuarios"("numero_documento");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_slug_key" ON "categorias"("slug");

-- CreateIndex
CREATE INDEX "categorias_categoria_padre_id_idx" ON "categorias"("categoria_padre_id");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_slug_key" ON "cursos"("slug");

-- CreateIndex
CREATE INDEX "cursos_profesor_id_idx" ON "cursos"("profesor_id");

-- CreateIndex
CREATE INDEX "cursos_categoria_id_idx" ON "cursos"("categoria_id");

-- CreateIndex
CREATE INDEX "cursos_estado_idx" ON "cursos"("estado");

-- CreateIndex
CREATE INDEX "modulos_curso_id_idx" ON "modulos"("curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "modulos_curso_id_orden_key" ON "modulos"("curso_id", "orden");

-- CreateIndex
CREATE INDEX "lecciones_modulo_id_idx" ON "lecciones"("modulo_id");

-- CreateIndex
CREATE UNIQUE INDEX "lecciones_modulo_id_orden_key" ON "lecciones"("modulo_id", "orden");

-- CreateIndex
CREATE INDEX "contenidos_leccion_leccion_id_idx" ON "contenidos_leccion"("leccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_numero_pedido_key" ON "pedidos"("numero_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_transaccion_id_key" ON "pedidos"("transaccion_id");

-- CreateIndex
CREATE INDEX "pedidos_usuario_id_idx" ON "pedidos"("usuario_id");

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "pedidos_transaccion_id_idx" ON "pedidos"("transaccion_id");

-- CreateIndex
CREATE INDEX "detalles_pedido_pedido_id_idx" ON "detalles_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "detalles_pedido_curso_id_idx" ON "detalles_pedido"("curso_id");

-- CreateIndex
CREATE INDEX "inscripciones_usuario_id_idx" ON "inscripciones"("usuario_id");

-- CreateIndex
CREATE INDEX "inscripciones_curso_id_idx" ON "inscripciones"("curso_id");

-- CreateIndex
CREATE INDEX "inscripciones_pedido_id_idx" ON "inscripciones"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "inscripciones_usuario_id_curso_id_key" ON "inscripciones"("usuario_id", "curso_id");

-- CreateIndex
CREATE INDEX "progreso_leccion_usuario_id_idx" ON "progreso_leccion"("usuario_id");

-- CreateIndex
CREATE INDEX "progreso_leccion_leccion_id_idx" ON "progreso_leccion"("leccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_leccion_usuario_id_leccion_id_key" ON "progreso_leccion"("usuario_id", "leccion_id");

-- CreateIndex
CREATE INDEX "progreso_curso_usuario_id_idx" ON "progreso_curso"("usuario_id");

-- CreateIndex
CREATE INDEX "progreso_curso_curso_id_idx" ON "progreso_curso"("curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_curso_usuario_id_curso_id_key" ON "progreso_curso"("usuario_id", "curso_id");

-- CreateIndex
CREATE INDEX "examenes_curso_id_idx" ON "examenes"("curso_id");

-- CreateIndex
CREATE INDEX "preguntas_examen_id_idx" ON "preguntas"("examen_id");

-- CreateIndex
CREATE UNIQUE INDEX "preguntas_examen_id_orden_key" ON "preguntas"("examen_id", "orden");

-- CreateIndex
CREATE INDEX "opciones_pregunta_pregunta_id_idx" ON "opciones_pregunta"("pregunta_id");

-- CreateIndex
CREATE INDEX "intentos_examen_usuario_id_idx" ON "intentos_examen"("usuario_id");

-- CreateIndex
CREATE INDEX "intentos_examen_examen_id_idx" ON "intentos_examen"("examen_id");

-- CreateIndex
CREATE INDEX "respuestas_intento_intento_id_idx" ON "respuestas_intento"("intento_id");

-- CreateIndex
CREATE INDEX "respuestas_intento_pregunta_id_idx" ON "respuestas_intento"("pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "respuestas_intento_intento_id_pregunta_id_key" ON "respuestas_intento"("intento_id", "pregunta_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_codigo_verificacion_key" ON "certificados"("codigo_verificacion");

-- CreateIndex
CREATE INDEX "certificados_usuario_id_idx" ON "certificados"("usuario_id");

-- CreateIndex
CREATE INDEX "certificados_curso_id_idx" ON "certificados"("curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "certificados_usuario_id_curso_id_key" ON "certificados"("usuario_id", "curso_id");

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_profesor_id_fkey" FOREIGN KEY ("profesor_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modulos" ADD CONSTRAINT "modulos_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecciones" ADD CONSTRAINT "lecciones_modulo_id_fkey" FOREIGN KEY ("modulo_id") REFERENCES "modulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contenidos_leccion" ADD CONSTRAINT "contenidos_leccion_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalles_pedido" ADD CONSTRAINT "detalles_pedido_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_leccion" ADD CONSTRAINT "progreso_leccion_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_leccion" ADD CONSTRAINT "progreso_leccion_leccion_id_fkey" FOREIGN KEY ("leccion_id") REFERENCES "lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_curso" ADD CONSTRAINT "progreso_curso_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_curso" ADD CONSTRAINT "progreso_curso_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examenes" ADD CONSTRAINT "examenes_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_examen_id_fkey" FOREIGN KEY ("examen_id") REFERENCES "examenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opciones_pregunta" ADD CONSTRAINT "opciones_pregunta_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_examen" ADD CONSTRAINT "intentos_examen_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_examen" ADD CONSTRAINT "intentos_examen_examen_id_fkey" FOREIGN KEY ("examen_id") REFERENCES "examenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_intento" ADD CONSTRAINT "respuestas_intento_intento_id_fkey" FOREIGN KEY ("intento_id") REFERENCES "intentos_examen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_intento" ADD CONSTRAINT "respuestas_intento_pregunta_id_fkey" FOREIGN KEY ("pregunta_id") REFERENCES "preguntas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_intento" ADD CONSTRAINT "respuestas_intento_opcion_seleccionada_id_fkey" FOREIGN KEY ("opcion_seleccionada_id") REFERENCES "opciones_pregunta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificados" ADD CONSTRAINT "certificados_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
