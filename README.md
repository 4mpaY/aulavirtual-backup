# Aula Virtual - LMS Platform

Plataforma de e-learning (LMS) para gestión de cursos, estudiantes, profesores, pagos y emisión de certificados.

---

## Desarrollo Local

### Requisitos previos
- Node.js (v18 o superior recomendado)
- pnpm instalado globalmente (`npm i -g pnpm`)

### Primeros pasos

1. **Instalar las dependencias:**
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz basado en `.env.example`.

3. **Levantar base de datos local (Opcional - Docker):**
   Si no cuentas con una base de datos PostgreSQL instalada en tu sistema local, puedes levantar la base de datos de desarrollo usando Docker Compose:
   ```bash
   docker compose -f compose.dev.yml up -d db
   ```
   *(Esto creará e iniciará una base de datos PostgreSQL en el puerto especificado en tu archivo `.env`).*

4. **Preparar la base de datos (Prisma Migrations & Seeds):**
   Una vez que tu base de datos esté corriendo, ejecuta las migraciones de Prisma para crear las tablas e inserta los datos iniciales (seed):
   ```bash
   # Aplicar y crear migraciones de base de datos
   pnpm db:migration:dev

   # Ejecutar el seed para poblar datos iniciales
   pnpm db:seed
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

6. **Abrir la aplicación:**
   Accede a [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Despliegue en Producción (Docker Compose)

El despliegue utiliza una arquitectura de contenedores Docker con Nginx y Let's Encrypt para certificados SSL automáticos y seguros.

### Paso 1: Configurar variables en `.env`
Antes de comenzar, asegúrate de definir las siguientes variables obligatorias para la generación del certificado SSL en tu archivo `.env`:

```env
# Dominio principal (ej: tudominio.com)
SSL_DOMAIN_1=tudominio.com

# Dominio secundario u opcional (ej: www.tudominio.com)
SSL_DOMAIN_2=www.tudominio.com

# Correo de contacto para notificaciones de Let's Encrypt
SSL_EMAIL=tuemail@tudominio.com
```

### Paso 2: Generación del certificado SSL
Utilizaremos una configuración temporal de Nginx y Certbot para realizar la validación HTTP (reto de ACME) y descargar los certificados.

1. Levanta el entorno de certificación:
   ```bash
   docker compose -f compose.cert.yml up -d
   ```
2. Revisa los logs de Certbot para confirmar la correcta generación:
   ```bash
   docker compose -f compose.cert.yml logs -f certbot
   ```
3. Una vez finalizado el proceso de obtención, detén y elimina todos los servicios temporales activos del flujo de certificación:
   ```bash
   docker compose -f compose.cert.yml down
   ```

### Paso 3: Configurar permisos de carpetas en el Host (Paso Crítico)
Por motivos de seguridad, la aplicación corre dentro del contenedor bajo el usuario no-root `nextjs` (con UID `1001` y GID `1001`). Por lo tanto, los volúmenes compartidos del servidor host para subidas de archivos (`public/uploads` y `private`) deben ser legibles y escribibles por este usuario:

```bash
# Crear directorios en el servidor host si no existen
mkdir -p public/uploads private

# Cambiar el propietario al UID/GID del contenedor (1001)
sudo chown -R 1001:1001 public/uploads
sudo chown -R 1001:1001 private

# Asignar permisos de lectura y escritura correctos
sudo chmod -R 775 public/uploads
sudo chmod -R 775 private
```

> [!TIP]
> Si tras ejecutar los comandos de permisos (`chmod`), Git detecta cambios de modo de archivo (filemode changes) en los archivos internos, puedes indicarle a Git que ignore la diferencia de permisos ejecutando:
> ```bash
> git config core.fileMode false
> ```

### Paso 4: Levantar la aplicación en producción
Con los certificados generados y los permisos de las carpetas correctamente configurados, inicia todos los servicios productivos (Next.js, PostgreSQL y Nginx con SSL en el puerto 443):

```bash
docker compose -f compose.prod.yml up -d
```

---

## Renovación de Certificados SSL

### ¿Cómo funciona la renovación?
Los certificados emitidos por Let's Encrypt son válidos por **90 días**. Para evitar fallos, se recomienda validarlos de manera periódica.
El script de renovación utiliza la bandera `--keep-until-expiring` configurada en Certbot. Esto significa que el comando se puede ejecutar todos los días, pero Certbot **solo** solicitará una renovación real cuando el certificado actual tenga menos de **30 días** restantes de validez.

### Automatización con Cron
Hemos incluido un script en la raíz del proyecto para automatizar este proceso: [renew-certs.sh](file:///c:/TRABAJO/aulavirtual/renew-certs.sh).

Para configurarlo en tu servidor de producción Linux VPS:

1. **Dar permisos de ejecución al script:**
   ```bash
   chmod +x renew-certs.sh
   ```

2. **Abrir el editor de tareas programadas (Crontab):**
   ```bash
   crontab -e
   ```

3. **Añadir la tarea automática diaria:**
   Agrega la siguiente línea al final del archivo de configuración (esto programará la ejecución diaria a las 3:00 AM, guardando un registro en el directorio `logs`):
   ```cron
   0 3 * * * /ruta/absoluta/a/tu/aulavirtual/renew-certs.sh >> /ruta/absoluta/a/tu/aulavirtual/logs/certbot-renew.log 2>&1
   ```
   *Nota: Reemplaza `/ruta/absoluta/a/tu/aulavirtual` por la ruta real de la carpeta del proyecto en tu servidor (ej. `/var/www/aulavirtual`).*

