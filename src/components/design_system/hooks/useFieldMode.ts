import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import type { UniversalFieldProps, SaveStatus } from '../types'

/**
 * Hook central de lógica de negocio para componentes de entrada multimodal.
 * Maneja tres modos de operación:
 *
 * 1. **Preview**: Solo lectura.
 * 2. **Batch**: Integración con formularios (react-hook-form). La conexión a API se hace en el `onSubmit` del padre.
 * 3. **Live**: Auto-guardado individual. La conexión a API se hace inyectando una función `onSave`.
 *
 * @example
 *  --Integración con API en modo LIVE (Auto-guardado)
 * const handleSave = async (value: string | number) => {
 *   await fetch('/api/endpoint', {
 *     method: 'PUT',
 *     body: JSON.stringify({ field_name: value })
 *   });
 * };
 *
 * <DSInput mode="live" onSave={handleSave} ... />
 *
 * @example
 *  --Integración con API en modo BATCH (Formulario clásico)
 * const { register, handleSubmit } = useForm();
 * const onSubmit = async (data) => {
 *   await fetch('/api/form-submit', { method: 'POST', body: data });
 * };
 *
 * <form onSubmit={handleSubmit(onSubmit)}>
 *   <DSInput mode="batch" register={register} ... />
 * </form>
 */
export const useFieldMode = (props: UniversalFieldProps) => {
  const [localValue, setLocalValue] = useState<string | number>(props.mode === 'live' ? props.initialValue || '' : props.mode === 'preview' ? props.value || '' : '')

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // --- Lógica Live Mode ---
  const debouncedSave = useDebouncedCallback(
    async (val: string | number) => {
      if (props.mode !== 'live') return

      setSaveStatus('saving')
      setErrorMessage(null)

      try {
        await props.onSave(val)
        setSaveStatus('success')
        // Resetear a idle después de unos segundos
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Error saving field:', error)
        setSaveStatus('error')
        setErrorMessage('Error al guardar')
      }
    },
    props.mode === 'live' ? props.debounceTime || 1000 : 1000
  )

  const handleLiveChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    setLocalValue(val)
    debouncedSave(val)
  }

  // --- Retorno de Props para el Input ---

  if (props.mode === 'batch') {
    // Modo Batch: Delegamos todo a react-hook-form
    const { register, name, validation, error } = props
    return {
      inputProps: {
        ...register(name, validation),
        disabled: props.disabled,
        type: props.type || 'text',
        placeholder: props.placeholder
      },
      status: 'idle' as SaveStatus,
      error: error?.message,
      isLive: false
    }
  }

  if (props.mode === 'live') {
    // Modo Live: Controlamos el estado localmente
    return {
      inputProps: {
        value: localValue,
        onChange: handleLiveChange,
        disabled: props.disabled,
        type: props.type || 'text',
        placeholder: props.placeholder
      },
      status: saveStatus,
      error: errorMessage,
      isLive: true
    }
  }

  // Modo Preview: Solo lectura / estático
  return {
    inputProps: {
      value: props.value || '',
      readOnly: true,
      disabled: props.disabled,
      type: props.type || 'text',
      placeholder: props.placeholder,
      className: 'cursor-default focus:ring-0'
    },
    status: 'idle' as SaveStatus,
    error: null,
    isLive: false
  }
}
