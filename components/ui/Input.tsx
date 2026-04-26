import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <input
            id={id}
            className="block w-full rounded-lg border border-slate-200 bg-slate-50/50 shadow-sm focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 sm:text-sm p-3 transition-all duration-200 outline-none placeholder:text-slate-400"
            {...props}
        />
    </div>
  );
};

export default Input;
