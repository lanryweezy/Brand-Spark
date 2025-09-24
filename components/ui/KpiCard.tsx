
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
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                {clonedIcon && (
                    <div className={`p-2.5 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
                        <div className={color}>{clonedIcon}</div>
                    </div>
                )}
            </div>
            <p className="text-3xl font-bold text-brand-text mt-2">{value}</p>
        </Card>
    );
};

export default KpiCard;