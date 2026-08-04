export interface ContactoFormData {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
}

export interface CitaFormData {
  nombre: string
  email: string
  telefono: string
  fecha: string
  hora: string
  servicio?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
