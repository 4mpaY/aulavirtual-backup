import { z } from 'zod'
import { Rol } from '@prisma/client'

/**
 * Schema para crear usuario (Admin)
 */
export const crearUsuarioSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  contrasena: z
    .string()
    .trim()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellido: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  numero_documento: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
  celular: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, 'El celular debe tener 9 dígitos y comenzar con 9')
    .optional()
    .or(z.literal('')),
  rol: z
    .nativeEnum(Rol)
    .optional()
    .default(Rol.ESTUDIANTE),
  biografia: z
    .string()
    .trim()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  avatar: z
    .string()
    .trim()
    .url('URL de avatar inválida')
    .optional()
})

export type CrearUsuarioDto = z.infer<typeof crearUsuarioSchema>

/**
 * Schema para actualizar usuario
 */
export const actualizarUsuarioSchema = z.object({
  correo: z
    .string()
    .trim()
    .email('Correo electrónico inválido')
    .optional(),
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .optional(),
  apellido: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .optional(),
  numero_documento: z
    .string()
    .trim()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
    .optional(),
  celular: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, 'El celular debe tener 9 dígitos y comenzar con 9')
    .optional()
    .or(z.literal('')),
  rol: z
    .nativeEnum(Rol)
    .optional(),
  biografia: z
    .string()
    .trim()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  avatar: z
    .string()
    .trim()
    .url('URL de avatar inválida')
    .optional(),
  esta_activo: z
    .boolean()
    .optional()
})

export type ActualizarUsuarioDto = z.infer<typeof actualizarUsuarioSchema>

/**
 * Schema para actualizar perfil propio
 */
export const actualizarPerfilSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres')
    .optional(),
  apellido: z
    .string()
    .trim()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres')
    .optional(),
  celular: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, 'El celular debe tener 9 dígitos y comenzar con 9')
    .optional()
    .or(z.literal('')),
  biografia: z
    .string()
    .trim()
    .max(500, 'La biografía no puede exceder 500 caracteres')
    .optional(),
  avatar: z
    .string()
    .trim()
    .url('URL de avatar inválida')
    .optional()
})

export type ActualizarPerfilDto = z.infer<typeof actualizarPerfilSchema>

/**
 * Schema para query params de listado de usuarios
 */
export const listarUsuariosQuerySchema = z.object({
  page: z
    .coerce
    .number()
    .int()
    .positive()
    .default(1),
  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(1000)
    .default(10),
  rol: z
    .nativeEnum(Rol)
    .optional(),
  buscar: z
    .string()
    .trim()
    .optional(),
  esta_activo: z
    .coerce
    .boolean()
    .optional()
})

export type ListarUsuariosQuery = z.infer<typeof listarUsuariosQuerySchema>
