import React from 'react';
import PageTitle from './ui/PageTitle';
import Card from './ui/Card';
import Analytics from './Analytics';
import ContentCalendar from './ContentCalendar';
import AssetRepository from './AssetRepository';
import AIStudio from './AIStudio';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import Button from './ui/Button';
import { DocumentArrowDownIcon } from '../constants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DemoPage: React.FC = () => {
  const { currentBrand } = useCurrentBrand();

  const handleExport = async () => {
    const container = document.getElementById('demo-report');
    if (!container) return;
    const canvas = await html2canvas(container, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save('brandspark-demo.pdf');
  };

  return (
    <div>
      <PageTitle
        title="Brandspark Demo"
        subtitle="Explore a full, mock-powered walkthrough. No backend required."
        actions={
          <Button onClick={handleExport}>
            <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
            Export Demo as PDF
          </Button>
        }
      />
      <div id="demo-report" className="space-y-8">
        <Card>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold text-brand-text">Overview</h3>
            <p className="text-slate-600">
              This demo uses mock data to showcase the end-to-end loop: plan → create → schedule → analyze.
              AI actions will only call mock endpoints where available; avoid backend calls in demo mode.
            </p>
            <p className="text-slate-600">
              Current brand: <span className="font-semibold">{currentBrand?.name ?? 'Select a brand in Brand Kit'}</span>
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-text">Content Calendar</h3>
          <ContentCalendar setActiveView={() => { /* no-op in demo */ }} disableAIAssist />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-text">Assets</h3>
          <AssetRepository />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-text">AI Studio (Highlights)</h3>
          <AIStudio />
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-brand-text">Analytics Snapshot</h3>
          <Analytics />
        </div>
      </div>
    </div>
  );
};

export default DemoPage;