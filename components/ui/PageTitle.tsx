
import React from 'react';

interface PageTitleProps {
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-4 border-b border-slate-200/60">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-brand-text via-slate-800 to-slate-600 bg-clip-text text-transparent">{title}</h1>
                <p className="mt-2 text-base text-slate-500 max-w-2xl">{subtitle}</p>
            </div>
            {actions && <div className="mt-4 md:mt-0 flex gap-3">{actions}</div>}
        </div>
    );
}

export default PageTitle;