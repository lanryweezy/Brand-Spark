
import React from 'react';
import Card from './Card';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
    return (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300">
            <div className="text-center py-20 px-6">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 shadow-inner">
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'h-10 w-10 text-brand-primary opacity-80' }) : null}
                </div>
                <h3 className="text-2xl font-bold text-brand-text mt-6">{title}</h3>
                <p className="text-slate-500 mt-3 max-w-md mx-auto text-base">{message}</p>
                {action && <div className="mt-8">{action}</div>}
            </div>
        </Card>
    );
};

export default EmptyState;
