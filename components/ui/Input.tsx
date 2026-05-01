import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <input
            id={id}
            className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 shadow-sm focus:border-brand-primary focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 sm:text-sm p-3 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
            {...props}
        />
    </div>
  );
};

export default Input;
