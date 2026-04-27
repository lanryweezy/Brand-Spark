import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 transition-all duration-500 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 hover:border-slate-300/80 ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="p-4 sm:p-6 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Card;