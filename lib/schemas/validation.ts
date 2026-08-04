import { z } from 'zod'

export const contactoSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export const citaSchema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida'),
  hora: z.string().regex(/^([0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Hora inválida'),
  servicio: z.string().optional(),
})

export type ContactoInput = z.infer<typeof contactoSchema>
export type CitaInput = z.infer<typeof citaSchema>
