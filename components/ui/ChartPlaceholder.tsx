
import React from 'react';

interface ChartPlaceholderProps {
    className?: string;
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ className = 'h-80' }) => {
    return (
        <div className={`w-full bg-slate-50 rounded-lg p-4 ${className} overflow-hidden`}>
            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-md flex items-end justify-around p-4 animate-pulse">
                <div className="bg-slate-200 w-8 h-2/5 rounded-t-md animate-bar-up-1"></div>
                <div className="bg-slate-200 w-8 h-4/5 rounded-t-md animate-bar-up-2"></div>
                <div className="bg-slate-200 w-8 h-3/5 rounded-t-md animate-bar-up-3"></div>
                <div className="bg-slate-200 w-8 h-2/4 rounded-t-md animate-bar-up-4"></div>
                <div className="bg-slate-200 w-8 h-3/4 rounded-t-md animate-bar-up-5"></div>
                <div className="bg-slate-200 w-8 h-2/5 rounded-t-md animate-bar-up-6"></div>
                <div className="bg-slate-200 w-8 h-1/2 rounded-t-md animate-bar-up-7"></div>
            </div>
            <style>{`
                @keyframes bar-up {
                    0% { transform: scaleY(0.1); }
                    50% { transform: scaleY(1); }
                    100% { transform: scaleY(0.1); }
                }
                .animate-bar-up-1 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.1s; }
                .animate-bar-up-2 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.2s; }
                .animate-bar-up-3 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.3s; }
                .animate-bar-up-4 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.4s; }
                .animate-bar-up-5 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.5s; }
                .animate-bar-up-6 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.6s; }
                .animate-bar-up-7 { animation: bar-up 1.5s infinite ease-in-out; animation-delay: 0.7s; }
            `}</style>
        </div>
    );
};

export default ChartPlaceholder;
