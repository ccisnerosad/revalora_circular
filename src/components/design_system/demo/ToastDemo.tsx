import React from 'react';
import { useToast } from '../molecules/Toast';

export const ToastDemo = () => {
    const { addToast } = useToast();

    return (
        <div className="flex flex-wrap gap-4">
            <button
                onClick={() => addToast('success', 'Operación Exitosa', 'Los cambios se han guardado correctamente.')}
                className="px-4 py-2 bg-white border border-brand-200 text-brand-700 rounded-md shadow-sm hover:bg-brand-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                Success Toast
            </button>

            <button
                onClick={() => addToast('error', 'Error del Sistema', 'No se pudo conectar con el servidor.')}
                className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-md shadow-sm hover:bg-red-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Error Toast
            </button>

            <button
                onClick={() => addToast('warning', 'Advertencia', 'Tu sesión está por expirar.')}
                className="px-4 py-2 bg-white border border-yellow-200 text-yellow-700 rounded-md shadow-sm hover:bg-yellow-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Warning Toast
            </button>

            <button
                onClick={() => addToast('info', 'Nuevo Mensaje', 'Tienes una notificación sin leer.')}
                className="px-4 py-2 bg-white border border-accent-200 text-accent-700 rounded-md shadow-sm hover:bg-accent-50 transition-colors font-medium text-sm flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                Info Toast
            </button>
        </div>
    );
};
