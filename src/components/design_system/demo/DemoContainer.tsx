import React from 'react';
import { useForm } from 'react-hook-form';
import { DSInput } from '../atoms/DSInput';
import { ToastProvider, useToast } from '../molecules/Toast';

interface DemoContainerProps {
  mode: 'batch' | 'live';
}

const DemoContent = ({ mode }: DemoContainerProps) => {
  const { addToast } = useToast();
  
  // --- Lógica para Modo Batch ---
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [batchData, setBatchData] = React.useState<any>(null);

  const onBatchSubmit = (data: any) => {
    setBatchData(data);
    addToast('success', 'Formulario Enviado', 'Los datos se procesaron correctamente en lote.');
    setTimeout(() => setBatchData(null), 3000);
  };

  // --- Lógica para Modo Live ---
  const mockApiSave = async (value: string | number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simular error aleatorio (10% de probabilidad)
        if (Math.random() > 0.9) {
          reject('Error de red simulado');
          addToast('error', 'Error de Conexión', 'No se pudo guardar el cambio. Reintentando...');
        } else {
          console.log('Guardado en API:', value);
          addToast('success', 'Cambio guardado', `Se actualizó el valor a: ${value}`);
          resolve();
        }
      }, 1500);
    });
  };

  if (mode === 'batch') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onBatchSubmit)} className="space-y-4">
          <DSInput 
            mode="batch"
            label="Correo Electrónico"
            name="email"
            placeholder="usuario@empresa.com"
            register={register}
            error={errors.email as any}
            validation={{ 
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Dirección de correo inválida"
              }
            }}
          />
          
          <DSInput 
            mode="batch"
            label="Cargo / Puesto"
            name="role"
            placeholder="Ej. Gerente de Operaciones"
            register={register}
            validation={{ required: 'El puesto es obligatorio' }}
            error={errors.role as any}
          />

          <button 
            type="submit"
            className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700 transition-colors text-sm font-medium"
          >
            Guardar Formulario
          </button>
        </form>

        {batchData && (
          <div className="mt-4 p-3 bg-brand-50 text-brand-700 text-xs rounded border border-brand-100">
            <strong>Datos enviados:</strong>
            <pre className="mt-1">{JSON.stringify(batchData, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  if (mode === 'live') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-6">
        <div>
          <p className="text-xs text-gray-500 mb-2">Intenta escribir algo (guarda tras 1s de inactividad):</p>
          <DSInput 
            mode="live"
            label="Notas del Proyecto"
            initialValue="Revisión inicial pendiente"
            onSave={mockApiSave}
            debounceTime={1000}
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Este campo tiene validación de error simulada (10% fail):</p>
          <DSInput 
            mode="live"
            label="Código de Referencia"
            initialValue="REF-2024-X"
            onSave={mockApiSave}
            debounceTime={800}
          />
        </div>
      </div>
    );
  }

  return null;
};

export const DemoContainer = (props: DemoContainerProps) => {
    return (
        <ToastProvider>
            <DemoContent {...props} />
        </ToastProvider>
    );
}
