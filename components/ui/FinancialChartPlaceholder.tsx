
import React from 'react';
import { motion } from 'framer-motion';

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
                        <motion.circle
                            key={index}
                            initial={{ strokeDasharray: `0 100` }}
                            animate={{ strokeDasharray }}
                            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                            className="transition-all duration-500"
                            stroke={colors[index % colors.length]}
                            strokeWidth="4"
                            fill="none"
                            r="16"
                            cx="18"
                            cy="18"
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 18 18)"
                        />
                    );
                })}
                <text x="18" y="20" className="text-base font-bold fill-current text-brand-text dark:text-brand-light" textAnchor="middle">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                </text>
            </svg>
            <div className="space-y-2">
                {segments.map((segment, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="flex items-center text-sm"
                    >
                        <div className="w-3 h-3 rounded-sm mr-2" style={{backgroundColor: colors[index % colors.length]}}></div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{segment.category}</span>
                        <span className="ml-2 text-slate-500 dark:text-slate-400">{segment.percentage.toFixed(1)}%</span>
                    </motion.div>
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
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                            <span className="text-slate-500 dark:text-slate-400">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.spent)} / {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.budget)}</span>
                        </div>
                         <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative">
                             <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                                className="bg-brand-primary h-4 rounded-full transition-all duration-700"
                            />
                         </div>
                    </motion.div>
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