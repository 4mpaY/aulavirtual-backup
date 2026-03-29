-- Generar slugs para todos los usuarios que no tienen uno todavía.
-- El slug se construye como: nombre-apellido-id_corto (sin tildes ni caracteres especiales).

UPDATE "usuarios"
SET "slug" = (
  -- Convertir nombre + apellido a slug: minúsculas, sin tildes, sin espacios extra
  REGEXP_REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(
              REPLACE(
                REPLACE(
                  LOWER(TRIM(CONCAT(nombre, '-', apellido))),
                  'á', 'a'),
                'é', 'e'),
              'í', 'i'),
            'ó', 'o'),
          'ú', 'u'),
        'ñ', 'n'),
      ' ', '-'),
    '[^a-z0-9\-]', '', 'g'
  ) || '-' || SUBSTRING(id::text, 1, 8)
)
WHERE "slug" IS NULL;
