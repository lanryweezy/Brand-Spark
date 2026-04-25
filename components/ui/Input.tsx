
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className="relative group">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-brand-primary">{label}</label>
        <div className="relative">
            <input
                id={id}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 hover:border-brand-primary/50 sm:text-sm p-3.5 transition-all duration-300 ease-out"
                {...props}
            />
            <div className="absolute inset-0 rounded-xl border border-brand-primary opacity-0 transition-opacity duration-300 pointer-events-none group-focus-within:opacity-20"></div>
        </div>
    </div>
  );
};

export default Input;