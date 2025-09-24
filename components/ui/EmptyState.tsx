
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
        <Card>
            <div className="text-center py-16 px-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary-light">
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'h-8 w-8 text-brand-primary' }) : null}
                </div>
                <h3 className="text-2xl font-bold text-brand-text mt-6">{title}</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">{message}</p>
                {action && <div className="mt-8">{action}</div>}
            </div>
        </Card>
    );
};

export default EmptyState;
