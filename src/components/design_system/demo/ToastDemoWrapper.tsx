import React from 'react';
import { ToastProvider } from '../molecules/Toast';
import { ToastDemo } from './ToastDemo';

export const ToastDemoWrapper = () => {
    return (
        <ToastProvider>
            <ToastDemo />
        </ToastProvider>
    );
};
