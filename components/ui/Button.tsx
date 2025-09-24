
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
    children, 
    className, 
    isLoading = false, 
    variant = 'primary',
    size = 'md',
    ...props 
}) => {

  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transform hover:-translate-y-px active:translate-y-0';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const variantClasses = {
    primary: `text-white shadow-subtle hover:shadow-medium bg-gradient-to-r from-brand-primary to-purple-600 focus:ring-brand-primary`,
    secondary: `bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-brand-primary`,
    ghost: `bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-brand-primary shadow-none`
  };
  
  const spinnerColor = variant === 'primary' ? 'text-white' : 'text-brand-primary';

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${spinnerColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;