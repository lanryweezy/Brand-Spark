
import React from 'react';
import Card from './Card';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color }) => {

    const clonedIcon = React.isValidElement(icon) && icon.type !== React.Fragment
        ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })
        : null;

    return (
        <Card className="p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 ${color.replace('text-', 'bg-')}/5 rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150`}></div>
            <div className="flex items-center justify-between relative z-10">
                <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors">{title}</p>
                {clonedIcon && (
                    <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-')}/10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`}>
                        <div className={color}>{clonedIcon}</div>
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-brand-text mt-2 relative z-10">{value}</p>
        </Card>
    );
};

export default KpiCard;