import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow-subtle border border-slate-200/80 transition-all duration-300 hover:shadow-lifted hover:border-slate-300/80 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;