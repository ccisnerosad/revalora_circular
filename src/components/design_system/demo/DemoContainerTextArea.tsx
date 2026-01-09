import React from 'react';
import { useForm } from 'react-hook-form';
import { TextArea } from '../atoms/TextArea';
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
    addToast('success', 'Bitácora Actualizada', 'La descripción se ha guardado correctamente.');
    setTimeout(() => setBatchData(null), 3000);
  };

  // --- Lógica para Modo Live ---
  const mockApiSave = async (value: string | number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        addToast('success', 'Auto-guardado', 'Contenido actualizado en la nube.');
        resolve();
      }, 1000);
    });
  };

  if (mode === 'batch') {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onBatchSubmit)} className="space-y-4">
          <TextArea 
            mode="batch"
            label="Descripción del Proyecto"
            name="description"
            placeholder="Describe los objetivos..."
            rows={4}
            register={register}
            error={errors.description as any}
            validation={{ 
              required: 'La descripción es obligatoria',
              minLength: { value: 10, message: 'Mínimo 10 caracteres' }
            }}
          />
          
          <button 
            type="submit"
            className="w-full bg-brand-600 text-white py-2 px-4 rounded-md hover:bg-brand-700 transition-colors text-sm font-medium"
          >
            Guardar Descripción
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
          <p className="text-xs text-gray-500 mb-2">Edición en vivo de contenido extenso:</p>
          <TextArea 
            mode="live"
            label="Notas de Bitácora"
            initialValue="Entrada inicial de bitácora..."
            rows={5}
            onSave={mockApiSave}
            debounceTime={1500}
          />
        </div>
      </div>
    );
  }

  return null;
};

export const DemoContainerTextArea = (props: DemoContainerProps) => {
    return (
        <ToastProvider>
            <DemoContent {...props} />
        </ToastProvider>
    );
};
