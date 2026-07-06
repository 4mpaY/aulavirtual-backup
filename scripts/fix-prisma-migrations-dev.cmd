@echo off
REM Recuperacion de migraciones Prisma en entorno local (historial divergente).
REM Ejecutar con el servidor detenido: pnpm run dev -> Ctrl+C

cd /d "%~dp0.."

echo === Marcar migracion fallida correcciones ===
pnpm exec prisma migrate resolve --applied 20260625150504_correcciones

echo === Marcar migraciones ya existentes en BD ===
pnpm exec prisma migrate resolve --applied 20260610180723_add_trabajos
pnpm exec prisma migrate resolve --applied 20260616000000_add_actividades
pnpm exec prisma migrate resolve --applied 20260616120000_add_es_pdf_leccion

echo === Si add_simulacros fallo a medias, marcar rollback y redeploy ===
pnpm exec prisma migrate resolve --rolled-back 20260623224510_add_simulacros

echo === Aplicar pendientes ===
pnpm exec prisma migrate deploy

echo === Regenerar cliente ===
pnpm db:generate

echo Listo. Reinicia: pnpm run dev
