
import React, { useState } from 'react';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    initialTab?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, initialTab = 0 }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(initialTab);

    return (
        <div>
            <div className="mb-8">
                <div className="border-b border-slate-200">
                    <nav className="-mb-px flex space-x-6 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab.label}
                                onClick={() => setActiveTabIndex(index)}
                                className={`${
                                    activeTabIndex === index
                                        ? 'border-brand-primary text-brand-primary'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-sm transition-colors focus:outline-none`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
            <div>
                {tabs.length > 0 && tabs[activeTabIndex] && tabs[activeTabIndex].content}
            </div>
        </div>
    );
};

export default Tabs;