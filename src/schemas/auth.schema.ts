import { z } from 'zod'

/**
 * Schema para login
 */
export const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido'),
  contrasena: z
    .string()
    .trim()
    .min(1, 'La contraseña es requerida')
})

export type LoginDto = z.infer<typeof loginSchema>

/**
 * Schema para registro de usuario
 */
export const registerSchema = z
  .object({
    correo: z
      .string()
      .trim()
      .min(1, 'El correo es requerido')
      .email('Correo electrónico inválido'),
    contrasena: z
      .string()
      .trim()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmarContrasena: z
      .string()
      .trim()
      .min(1, 'Confirma tu contraseña'),
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
      .or(z.literal(''))
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarContrasena']
  })

export type RegisterDto = z.infer<typeof registerSchema>

/**
 * Schema para cambiar contraseña
 */
export const changePasswordSchema = z
  .object({
    contrasenaActual: z
      .string()
      .trim()
      .min(1, 'La contraseña actual es requerida'),
    nuevaContrasena: z
      .string()
      .trim()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmarNuevaContrasena: z
      .string()
      .trim()
      .min(1, 'Confirma tu nueva contraseña')
  })
  .refine((data) => data.nuevaContrasena === data.confirmarNuevaContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarNuevaContrasena']
  })

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>

/**
 * Schema para solicitar recuperación de contraseña
 */
export const forgotPasswordSchema = z.object({
  correo: z
    .string()
    .trim()
    .min(1, 'El correo es requerido')
    .email('Correo electrónico inválido')
})

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>

/**
 * Schema para resetear contraseña
 */
export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, 'Token inválido'),
    nuevaContrasena: z
      .string()
      .trim()
      .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmarNuevaContrasena: z
      .string()
      .trim()
      .min(1, 'Confirma tu nueva contraseña')
  })
  .refine((data) => data.nuevaContrasena === data.confirmarNuevaContrasena, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmarNuevaContrasena']
  })

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>
