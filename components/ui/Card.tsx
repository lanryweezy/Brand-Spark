import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, noPadding = false, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
