import React from 'react';
import { useFieldMode } from '@ds/hooks/useFieldMode';
import type { UniversalFieldProps } from '@ds/types';
import { twMerge } from 'tailwind-merge';

export type TextAreaProps = UniversalFieldProps & {
  rows?: number;
};

export const TextArea = (props: TextAreaProps) => {
  const { inputProps, status, error, isLive } = useFieldMode(props);

  // Iconos de estado para modo Live (Reutilizados del Input, podríamos extraerlos a un componente StatusIndicator)
  const StatusIcon = () => {
    if (!isLive || status === 'idle') return null;
    
    if (status === 'saving') {
      return (
        <div className="absolute right-3 top-3">
          <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }
    
    if (status === 'success') {
      return (
        <div className="absolute right-3 top-3 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="absolute right-3 top-3 text-red-500" title="Error al guardar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className={twMerge("flex flex-col gap-1 w-full", props.className)}>
      {props.label && (
        <label className="text-sm font-medium text-gray-700">
          {props.label}
          {props.mode === 'batch' && props.validation && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          {...inputProps}
          rows={props.rows || 3}
          className={twMerge(
            "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors resize-y",
            "disabled:bg-gray-100 disabled:text-gray-500",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:border-blue-500 focus:ring-blue-200",
            props.mode === 'preview' && "bg-transparent border-transparent shadow-none px-0 resize-none"
          )}
        />
        <StatusIcon />
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-0.5">{error}</span>
      )}
    </div>
  );
};
