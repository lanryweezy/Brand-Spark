
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div className="relative group">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5 transition-colors group-focus-within:text-brand-primary">{label}</label>
        <div className="relative">
            <select
                id={id}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10 hover:border-brand-primary/50 sm:text-sm p-3.5 transition-all duration-300 ease-out appearance-none"
                {...props}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400 group-hover:text-brand-primary transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            </div>
            <div className="absolute inset-0 rounded-xl border border-brand-primary opacity-0 transition-opacity duration-300 pointer-events-none group-focus-within:opacity-20"></div>
        </div>
    </div>
  );
};

export default Select;