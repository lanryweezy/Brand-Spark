
import React, { createContext, useState, useContext, useCallback } from 'react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type'], duration?: number) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: number) => {
    setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
  };

  const addToast = useCallback((message: string, type: ToastMessage['type'], duration = 4000) => {
    const id = new Date().getTime();
    setToasts(currentToasts => [...currentToasts, { id, message, type, duration }]);
    
    // Automatically remove the toast after its duration
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    // This is a bit advanced, but it's to prevent memory leaks if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
