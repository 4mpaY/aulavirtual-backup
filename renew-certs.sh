#!/bin/bash

# Obtener la ruta del directorio donde está ubicado el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Silenciar advertencias de contenedores huérfanos en los logs
export COMPOSE_IGNORE_ORPHANS=True

echo "=== Iniciando comprobación de renovación: $(date) ==="

# 1. Ejecutar ÚNICAMENTE el contenedor de certbot sin levantar el nginx temporal de certificación.
# Usamos --no-deps para no recrear el Nginx en producción y --rm para no dejar contenedores huérfanos.
docker compose -f compose.cert.yml run --no-deps --rm certbot

# 2. Recargar Nginx en producción para cargar el nuevo certificado (si es que se renovó)
# Usamos -T para evitar errores de TTY cuando el script corre en un Cronjob
docker compose -f compose.prod.yml exec -T nginx nginx -s reload

echo "=== Proceso finalizado: $(date) ==="
echo ""
