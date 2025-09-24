
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => {
  return (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
        <textarea
            id={id}
            rows={4}
            className="block w-full rounded-md border-slate-300 bg-white shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/40 sm:text-sm p-2.5 transition"
            {...props}
        />
    </div>
  );
};

export default Textarea;