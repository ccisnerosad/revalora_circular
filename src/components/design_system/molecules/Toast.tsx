import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextProps {
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem = ({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) => {
  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-brand-500" />,
    error: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
    warning: <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />,
    info: <InformationCircleIcon className="w-6 h-6 text-accent-500" />,
  };

  const borderColors = {
    success: 'border-l-brand-500',
    error: 'border-l-red-500',
    warning: 'border-l-yellow-500',
    info: 'border-l-accent-500',
  };

  return (
    <div
      className={twMerge(
        "flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md border-l-4 animate-slide-in-right",
        borderColors[toast.type]
      )}
      role="alert"
    >
      <div className="flex items-center justify-center w-12 bg-gray-50">
        {icons[toast.type]}
      </div>

      <div className="px-4 py-3 -mx-3">
        <div className="mx-3">
          <span className={twMerge("font-semibold", 
             toast.type === 'success' ? 'text-brand-500' : 
             toast.type === 'error' ? 'text-red-500' :
             toast.type === 'warning' ? 'text-yellow-500' : 'text-accent-500'
          )}>
            {toast.title}
          </span>
          {toast.message && <p className="text-sm text-gray-600">{toast.message}</p>}
        </div>
      </div>
      
      <div className="flex items-start ml-auto p-2">
        <button 
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
            <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


const StackedToast = ({ count, type }: { count: number; type: ToastType }) => {
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-gray-500" />,
    error: <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />,
    warning: <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />,
    info: <InformationCircleIcon className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className="relative w-full max-w-sm flex items-end justify-end pointer-events-none">
      {/* Efecto de pila visual */}
      <div className="absolute -top-2 right-1 w-[96%] h-full bg-gray-200 rounded-lg border border-gray-300 shadow-sm z-0"></div>
      <div className="absolute -top-1 right-0.5 w-[98%] h-full bg-gray-100 rounded-lg border border-gray-300 shadow-sm z-10"></div>
      
      {/* Tarjeta principal */}
      <div className="relative pl-4 pr-3 py-3 bg-white w-full rounded-lg shadow-md border border-gray-300 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          {icons[type]}
          <div>
              <span className="font-semibold text-gray-700 text-sm">
                  {count} notificaciones nuevas
              </span>
              <p className="text-xs text-gray-500">Revisa tu bandeja</p>
          </div>
        </div>
        <span className="flex items-center justify-center w-6 h-6 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
            {count}
        </span>
      </div>
    </div>
  );
};


export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const STACK_THRESHOLD = 3;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllCb = useCallback(() => {
    setToasts([]);
    setIsExpanded(false);
  }, []);

  const isStackMode = toasts.length > STACK_THRESHOLD && !isExpanded;
  const latestToast = toasts[toasts.length - 1]; // El más reciente

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearAllCb }}>
      {children}
      {mounted && createPortal(
        <div className="fixed top-5 right-5 z-50 flex flex-col items-end w-full max-w-sm pointer-events-none pr-4 md:pr-0">
            {/* Contenedor interactivo */}
            <div className='pointer-events-auto flex flex-col gap-2 w-full transition-all duration-300 ease-in-out'>
                
                {/* --- MODO STACK: Solo mostramos UNO con estilo de pila --- */}
                {isStackMode && latestToast && (
                    <div className="relative group">
                        {/* Capas decorativas de "pila" */}
                        <div className="absolute top-2 left-2 right-2 h-full bg-white border border-gray-200 rounded-lg shadow-sm transform translate-y-2 opacity-60 z-0"></div>
                        <div className="absolute top-1 left-1 right-1 h-full bg-white border border-gray-200 rounded-lg shadow-sm transform translate-y-1 opacity-80 z-10"></div>
                        
                        {/* Toast Principal (El más reciente) */}
                        <div className="relative z-20">
                            <ToastItem toast={latestToast} onRemove={removeToast} />
                            
                            {/* Barra de Control del Stack (Badge y Botones) */}
                            <div className="absolute -top-3 -right-2 flex items-center gap-1 animate-bounce-in">
                                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white shadow-md ring-2 ring-white">
                                    +{toasts.length - 1}
                                </span>
                            </div>
                            
                            {/* Overlay de acciones al hacer hover (o siempre visible abajo) */}
                            <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                                <div className="flex bg-white rounded-full shadow-lg border border-gray-200 p-1 gap-1">
                                    <button 
                                        onClick={() => setIsExpanded(true)}
                                        className="p-1.5 hover:bg-gray-100 rounded-full text-blue-600 transition-colors"
                                        title="Desplegar todas"
                                    >
                                        <ChevronDownIcon className="w-4 h-4" />
                                    </button>
                                    <div className="w-px bg-gray-200 my-1"></div>
                                    <button 
                                        onClick={clearAllCb}
                                        className="p-1.5 hover:bg-red-50 rounded-full text-red-600 transition-colors"
                                        title="Cerrar todas"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- MODO LISTA NORMAL / EXPANDIDO --- */}
                {(!isStackMode) && (
                    <>
                        {/* Cabecera de controles si hay muchas y está expandido */}
                        {isExpanded && (
                            <div className="flex justify-between items-center bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm mb-2 animate-fade-in border border-gray-100">
                                <span className="text-xs font-medium text-gray-500 ml-2">
                                    {toasts.length} notificaciones
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsExpanded(false)}
                                        className="text-xs flex items-center gap-1 text-gray-600 hover:text-blue-600 px-2 py-1 rounded hover:bg-gray-100"
                                    >
                                        <ChevronUpIcon className="w-3 h-3" /> Colapsar
                                    </button>
                                    <button 
                                        onClick={clearAllCb}
                                        className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        <TrashIcon className="w-3 h-3" /> Borrar todo
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de Toasts */}
                        <div className="flex flex-col gap-2 w-full">
                            {toasts.map((toast) => (
                                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
