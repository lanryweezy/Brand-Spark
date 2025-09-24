
import React from 'react';

interface PageTitleProps {
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-text to-slate-700 bg-clip-text text-transparent">{title}</h1>
                <p className="mt-1 text-base text-slate-500">{subtitle}</p>
            </div>
            {actions && <div className="mt-4 md:mt-0">{actions}</div>}
        </div>
    );
}

export default PageTitle;