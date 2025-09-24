
import React from 'react';

const colors = ['#5c22d9', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

interface DonutChartData {
    category: string;
    amount: number;
}

const DonutChartPlaceholder: React.FC<{data: DonutChartData[]}> = ({ data }) => {
    const categoryTotals = data.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    if (total === 0) return <p className="text-slate-500 text-center py-10">No expense data to display.</p>;
    
    const segments = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        percentage: (amount / total) * 100
    }));

    let accumulatedPercentage = 0;

    return (
        <div className="flex items-center justify-around h-64">
            <svg viewBox="0 0 36 36" className="w-48 h-48 block">
                 {segments.map((segment, index) => {
                    const strokeDasharray = `${segment.percentage} ${100 - segment.percentage}`;
                    const strokeDashoffset = 25 - accumulatedPercentage;
                    accumulatedPercentage += segment.percentage;
                    return (
                        <circle
                            key={index}
                            className="transition-all duration-500"
                            stroke={colors[index % colors.length]}
                            strokeWidth="4"
                            fill="none"
                            r="16"
                            cx="18"
                            cy="18"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 18 18)"
                        />
                    );
                })}
                <text x="18" y="20" className="text-base font-bold fill-current text-brand-text" textAnchor="middle">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                </text>
            </svg>
            <div className="space-y-2">
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-sm mr-2" style={{backgroundColor: colors[index % colors.length]}}></div>
                        <span className="font-medium text-slate-700">{segment.category}</span>
                        <span className="ml-2 text-slate-500">{segment.percentage.toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

interface BarChartData {
    name: string;
    budget: number;
    spent: number;
}

const BarChartPlaceholder: React.FC<{data: BarChartData[]}> = ({data}) => {
     if (data.length === 0) return <p className="text-slate-500 text-center py-10">No budget data to display.</p>;
    return (
        <div className="w-full h-64 space-y-4">
            {data.map((item, index) => {
                const spentPercentage = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
                return (
                    <div key={index}>
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-slate-700">{item.name}</span>
                            <span className="text-slate-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.spent)} / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.budget)}</span>
                        </div>
                         <div className="w-full bg-slate-200 rounded-full h-4 relative">
                             <div className="bg-brand-primary h-4 rounded-full transition-all duration-700" style={{width: `${Math.min(spentPercentage, 100)}%`}}></div>
                         </div>
                    </div>
                )
            })}
        </div>
    )
};

interface FinancialChartPlaceholderProps {
    type: 'donut' | 'bar';
    data?: any;
}

const FinancialChartPlaceholder: React.FC<FinancialChartPlaceholderProps> = ({ type, data }) => {
    switch (type) {
        case 'donut':
            return <DonutChartPlaceholder data={data} />;
        case 'bar':
            return <BarChartPlaceholder data={data} />;
        default:
            return <div>Invalid chart type</div>;
    }
};

export default FinancialChartPlaceholder;