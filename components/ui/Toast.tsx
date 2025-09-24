
import React from 'react';
import { useToast, ToastMessage } from '../../hooks/useToast';
import { XIcon } from '../../constants';

const InfoIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ErrorIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SuccessIcon: React.FC<{className?: string}> = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const Toast: React.FC<{ toast: ToastMessage, onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
    const icons = {
        success: <SuccessIcon className="h-6 w-6 text-green-500" />,
        error: <ErrorIcon className="h-6 w-6 text-red-500" />,
        info: <InfoIcon className="h-6 w-6 text-blue-500" />,
    };

    const textColors = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800'
    }

    return (
        <div className={`max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-500 animate-toast-in`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        {icons[toast.type]}
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className={`text-sm font-semibold ${textColors[toast.type]}`}>{toast.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={() => onRemove(toast.id)} className="inline-flex text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary rounded-full">
                            <span className="sr-only">Close</span>
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes toast-in {
                    from { 
                      transform: translateY(20px) scale(0.95);
                      opacity: 0; 
                    }
                    to { 
                      transform: translateY(0) scale(1);
                      opacity: 1; 
                    }
                }
                .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-[9999]">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </div>
    );
};
