import React from 'react';

const DemoModeBanner: React.FC = () => {
  if ((import.meta as any).env?.VITE_DEMO_MODE !== 'true') return null;
  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-sm flex items-center justify-between">
      <span>
        You are in Demo Mode. Data and AI outputs are mocked for preview. Connect your backend and keys to enable live generation.
      </span>
      <span className="text-amber-700 hidden sm:block">
        Tip: Save or export to see demo flow with toasts and confirmations.
      </span>
    </div>
  );
};

export default DemoModeBanner;