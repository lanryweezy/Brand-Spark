
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
  return (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <select
            id={id}
            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 sm:text-sm p-2.5 transition"
            {...props}
        >
            {children}
        </select>
    </div>
  );
};

export default Select;