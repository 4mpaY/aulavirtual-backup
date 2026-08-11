const fs = require('fs');

// Read the old and new schema
let newSchema = fs.readFileSync('test.prisma', 'utf8');

// The missing models
const missingModels = `
model RutaAprendizaje {
  id             String        @id @default(uuid())
  titulo         String
  slug           String        @unique
  descripcion    String?
  miniatura      String?
  esta_activo    Boolean       @default(true)
  creado_en      DateTime      @default(now())
  actualizado_en DateTime      @updatedAt
  beneficios     Json?         @default("[]")
  secciones      Json?         @default("[]")
  cursos         CursoEnRuta[]
  escuela_id     String?
  escuela        Escuela?      @relation(fields: [escuela_id], references: [id], onDelete: SetNull)
  certificados   Certificado[]

  @@index([escuela_id])
  @@map("rutas_aprendizaje")
}

model Escuela {
  id             String            @id @default(uuid())
  nombre         String            @unique
  slug           String            @unique
  descripcion    String?
  estado         String            @default("DISPONIBLE")
  orden          Int               @default(0)
  creado_en      DateTime          @default(now())
  actualizado_en DateTime          @updatedAt
  rutas          RutaAprendizaje[]

  @@map("escuelas")
}

model CursoEnRuta {
  id             String          @id @default(uuid())
  orden          Int
  creado_en      DateTime        @default(now())
  actualizado_en DateTime        @updatedAt
  ruta_id        String
  curso_id       String
  seccion_id     String?
  curso          Curso           @relation(fields: [curso_id], references: [id], onDelete: Cascade)
  ruta           RutaAprendizaje @relation(fields: [ruta_id], references: [id], onDelete: Cascade)

  @@unique([ruta_id, curso_id])
  @@index([ruta_id])
  @@index([curso_id])
  @@map("cursos_en_ruta")
}
`;

// Append models if they don't exist
if (!newSchema.includes('model Escuela {')) {
  newSchema += missingModels;
}

// Modify Certificado model
if (newSchema.includes('model Certificado {') && !newSchema.includes('ruta_id')) {
  newSchema = newSchema.replace(
    '  curso               Curso    @relation(fields: [curso_id], references: [id], onDelete: Cascade)',
    '  ruta_id             String?\n  curso               Curso?   @relation(fields: [curso_id], references: [id], onDelete: Cascade)\n  ruta                RutaAprendizaje? @relation(fields: [ruta_id], references: [id], onDelete: Cascade)'
  );
  newSchema = newSchema.replace(
    '  curso_id            String',
    '  curso_id            String?'
  );
  newSchema = newSchema.replace(
    '@@unique([usuario_id, curso_id])',
    '@@unique([usuario_id, curso_id])\n  @@unique([usuario_id, ruta_id])'
  );
  newSchema = newSchema.replace(
    '@@index([curso_id])',
    '@@index([curso_id])\n  @@index([ruta_id])'
  );
}

// Modify Curso model
if (newSchema.includes('model Curso {') && !newSchema.includes('rutas                 CursoEnRuta[]')) {
  newSchema = newSchema.replace(
    '  detalles_pedido       DetallePedido[]',
    '  rutas                 CursoEnRuta[]\n  detalles_pedido       DetallePedido[]'
  );
}

fs.writeFileSync('prisma/schema.prisma', newSchema, 'utf8');
console.log('Schema patched successfully.');
