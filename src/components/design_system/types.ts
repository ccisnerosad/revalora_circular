import type { FieldError } from 'react-hook-form'

// --- Modos de Operación ---

export type FieldMode = 'preview' | 'batch' | 'live'

// --- Props Específicas por Modo ---

export interface PreviewModeProps {
  mode: 'preview'
  value?: string | number
}

export interface BatchModeProps {
  mode: 'batch'
  /** Nombre del campo para react-hook-form */
  name: string
  /** Objeto register de react-hook-form */
  register: any // Usamos any temporalmente para flexibilidad, idealmente UseFormRegister<T>
  /** Error del campo si existe */
  error?: FieldError
  /** Validaciones opcionales */
  validation?: object
}

export interface LiveModeProps {
  mode: 'live'
  /** Valor inicial */
  initialValue?: string | number
  /** Función asíncrona para guardar el dato */
  onSave: (value: string | number) => Promise<void>
  /** Tiempo de espera para el debounce en ms (default: 500ms) */
  debounceTime?: number
}

// --- Props Universales ---

export type UniversalFieldProps = (PreviewModeProps | BatchModeProps | LiveModeProps) & {
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password'
}

// --- Estados de Feedback (Live Mode) ---
export type SaveStatus = 'idle' | 'saving' | 'success' | 'error'
