#!/bin/bash

# Obtener la ruta del directorio donde está ubicado el script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Silenciar advertencias de contenedores huérfanos en los logs
export COMPOSE_IGNORE_ORPHANS=True

echo "=== Iniciando comprobación de renovación: $(date) ==="

# 1. Ejecutar el contenedor de certbot (validará contra Let's Encrypt si está por expirar)
docker compose -f compose.cert.yml up certbot

# 2. Recargar Nginx en producción para cargar el nuevo certificado (si es que se renovó)
# Usamos -T para evitar errores de TTY cuando el script corre en un Cronjob
docker compose -f compose.prod.yml exec -T nginx nginx -s reload

echo "=== Proceso finalizado: $(date) ==="
echo ""
