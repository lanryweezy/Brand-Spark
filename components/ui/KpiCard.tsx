import React from 'react';
import Card from './Card';

interface KpiCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: { value: number; isPositive: boolean };
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, color, trend }) => {

    const clonedIcon = React.isValidElement(icon) && icon.type !== React.Fragment
        ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })
        : null;

    return (
        <Card className="p-6 relative overflow-hidden group">
            {/* Subtle background accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${color.replace('text-', 'bg-')}/5 transition-transform duration-500 group-hover:scale-150`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase">{title}</p>
                    {clonedIcon && (
                        <div className={`p-2.5 rounded-xl ${color.replace('text-', 'bg-')}/10 border border-${color.replace('text-', '')}/20 shadow-sm`}>
                            <div className={color}>{clonedIcon}</div>
                        </div>
                    )}
                </div>
                <div className="flex items-end gap-3">
                    <p className="text-4xl font-extrabold text-slate-800 tracking-tight">{value}</p>
                    {trend && (
                        <div className={`flex items-center text-sm font-medium mb-1 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default KpiCard;
