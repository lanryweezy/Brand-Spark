
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useClients } from '../hooks/useClients';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useCampaigns } from '../hooks/useCampaigns';
import { useProjects } from '../hooks/useProjects';
import { useFinancials } from '../hooks/useFinancials';
import Card from './ui/Card';
import Button from './ui/Button';
import PageTitle from './ui/PageTitle';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { Client, BrandProfile, Campaign, Project, Invoice } from '../types';
import { PlusIcon, PencilIcon, TrashIcon, BriefcaseIcon, PaperAirplaneIcon, ChevronDownIcon, DocumentArrowDownIcon, EnvelopeIcon, CalendarDaysIcon } from '../constants';
import { generateClientReport } from '../services/geminiService';
import CopyButton from './studio/common/CopyButton';
import EmptyState from './ui/EmptyState';
import { useToast } from '../hooks/useToast';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Tabs from './ui/Tabs';
import { motion } from 'framer-motion';

// Dropdown component for export options
interface ExportDropdownProps {
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  onSendEmail: () => void;
}
const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportPdf, onExportMarkdown, onSendEmail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Export as PDF', icon: <DocumentArrowDownIcon />, action: onExportPdf },
    { label: 'Export as Markdown', icon: <DocumentArrowDownIcon />, action: onExportMarkdown },
    { label: 'Send via Email', icon: <EnvelopeIcon />, action: onSendEmail },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="secondary" size="sm" onClick={() => setIsOpen(!isOpen)}>
        Export
        <ChevronDownIcon className="w-4 h-4 ml-1" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 border border-slate-200">
          <ul className="py-1">
            {menuItems.map(item => (
              <li key={item.label}>
                <button
                  onClick={() => { item.action(); setIsOpen(false); }}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  <span className="mr-3 w-5 h-5">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const Clients: React.FC = () => {
    const { clients, addClient, updateClient, deleteClient } = useClients();
    const { brands } = useCurrentBrand();
    const { campaigns } = useCampaigns();
    const { invoices } = useFinancials();
    const { projects } = useProjects();
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    
    const [onboardingLink, setOnboardingLink] = useState('');
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

    const openModal = (client: Client | null = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const openOnboardingLinkModal = (client: Client) => {
        const link = `${window.location.origin}${window.location.pathname}?onboard-client=${client.id}`;
        setOnboardingLink(link);
        setIsLinkModalOpen(true);
    };

    const handleDelete = (clientId: string) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(clientId);
            if(selectedClient?.id === clientId) {
                setSelectedClient(null);
            }
            addToast("Client deleted.", 'info');
        }
    };
    
    const handleLogContact = (client: Client) => {
        updateClient(client.id, { lastContacted: new Date().toISOString() });
        addToast(`Logged contact for ${client.name}`, 'success');
    };

    const ClientForm: React.FC<{ client: Client | null }> = ({ client }) => {
        const [name, setName] = useState(client?.name || '');
        const [contactEmail, setContactEmail] = useState(client?.contactEmail || '');
        const [brandIds, setBrandIds] = useState<string[]>(client?.brandIds || []);

        const handleBrandToggle = (brandId: string) => {
            setBrandIds(prev => prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]);
        };

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            const clientData = { name, contactEmail, brandIds };
            if (client) {
                updateClient(client.id, clientData);
                addToast("Client updated successfully!", 'success');
            } else {
                addClient(clientData);
                addToast("Client created successfully!", 'success');
            }
            closeModal();
        };

        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="name" label="Client Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input id="email" label="Contact Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Associated Brands</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                        {brands.length > 0 ? brands.map(brand => (
                            <div key={brand.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`brand-${brand.id}`}
                                    checked={brandIds.includes(brand.id)}
                                    onChange={() => handleBrandToggle(brand.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <label htmlFor={`brand-${brand.id}`} className="ml-3 text-sm text-slate-700">{brand.name}</label>
                            </div>
                        )) : <p className="text-sm text-slate-500 text-center py-2">No brands exist. Create one in the Brand Kit first.</p>}
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                    <Button type="submit">{client ? 'Save Changes' : 'Create Client'}</Button>
                </div>
            </form>
        );
    };
    
    const ReportGenerator: React.FC<{ client: Client }> = ({ client }) => {
        const today = new Date().toISOString().split('T')[0];
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const [startDate, setStartDate] = useState(lastMonth.toISOString().split('T')[0]);
        const [endDate, setEndDate] = useState(today);
        const [generatedReport, setGeneratedReport] = useState('');
        const [reportHtml, setReportHtml] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isExporting, setIsExporting] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const reportContainerRef = useRef<HTMLDivElement>(null);

        const handleGenerateReport = async () => {
            setIsLoading(true);
            setError(null);
            setGeneratedReport('');

            const relevantBrands = brands.filter(b => client.brandIds.includes(b.id));
            const relevantCampaigns = campaigns.filter(c => 
                client.brandIds.includes(c.brandId) && new Date(c.startDate) <= new Date(endDate) && new Date(c.endDate) >= new Date(startDate)
            );
            const relevantProjects = projects.filter(p => client.brandIds.includes(p.brandId));
            const relevantInvoices = invoices.filter(i => i.clientId === client.id);

            try {
                const report = await generateClientReport(client, relevantBrands, relevantCampaigns, relevantProjects, relevantInvoices, { start: startDate, end: endDate });
                setGeneratedReport(report);
                const html = await marked.parse(report);
                setReportHtml(html);
            } catch (err: any) {
                setError(err.message);
                addToast(err.message, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        const handleExportPdf = () => {
            if (!reportContainerRef.current) return;
            setIsExporting(true);
            addToast("Generating PDF...", 'info');
            html2canvas(reportContainerRef.current, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'p',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save(`${client.name}-report-${endDate}.pdf`);
                setIsExporting(false);
                addToast("PDF downloaded!", 'success');
            }).catch(err => {
                addToast("Failed to generate PDF.", 'error');
                setIsExporting(false);
            });
        };
    
        const handleExportMarkdown = () => {
            const blob = new Blob([generatedReport], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${client.name}-report-${endDate}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            addToast("Markdown file downloaded!", 'success');
        };
    
        const handleSendEmail = () => {
            const subject = `Performance Report for ${client.name} (${startDate} to ${endDate})`;
            const body = `Hi team,\n\nPlease find the latest performance report attached below:\n\n---\n\n${generatedReport}`;
            const mailtoLink = `mailto:${client.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
        };

        return (
            <Card>
                <h3 className="text-xl font-bold text-brand-text">AI Report Generator</h3>
                <p className="text-slate-500 mt-1 mb-6">Generate a performance summary for your client.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-lg">
                    <Input label="Start Date" id="report-start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <Input label="End Date" id="report-end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <Button onClick={handleGenerateReport} isLoading={isLoading}>Generate Report</Button>
                </div>

                <div className="mt-6">
                    {(isLoading || isExporting) && <div className="text-center p-8"><p>{isExporting ? 'Exporting report...' : 'Generating your report...'}</p></div>}
                    {error && !isLoading && <div className="text-center p-8"><p className="text-red-500">{error}</p></div>}
                    {generatedReport && !isLoading && !isExporting && (
                        <div className="relative">
                            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                                <CopyButton textToCopy={generatedReport} />
                                <ExportDropdown
                                    onExportPdf={handleExportPdf}
                                    onExportMarkdown={handleExportMarkdown}
                                    onSendEmail={handleSendEmail}
                                />
                            </div>
                             <div ref={reportContainerRef} className="p-6 bg-white border border-slate-200 rounded-lg">
                                <h4 className="text-xl font-bold text-brand-text mb-4">Client Performance Report</h4>
                                <div 
                                    className="prose prose-slate max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold"
                                    dangerouslySetInnerHTML={{ __html: reportHtml }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        )
    };
    
    const clientBrands = useMemo(() => {
        if (!selectedClient) return [];
        return brands.filter(b => selectedClient.brandIds.includes(b.id));
    }, [selectedClient, brands]);
    
    const renderDetailView = () => {
        if (!selectedClient) return null;
        
        const NotesView = () => {
            const [notes, setNotes] = useState(selectedClient.notes || '');

            const handleSaveNotes = () => {
                updateClient(selectedClient.id, { notes });
                addToast('Notes saved!', 'success');
            };

            return (
                <Card>
                    <Textarea 
                        label="Internal Client Notes"
                        id="client-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={10}
                        placeholder="Log communication, key decisions, or reminders here..."
                    />
                    <div className="mt-4 flex justify-end">
                        <Button onClick={handleSaveNotes}>Save Notes</Button>
                    </div>
                </Card>
            )
        };

        const tabs = [
            { label: 'Report Generator', content: <ReportGenerator client={selectedClient} /> },
            { label: 'Notes', content: <NotesView /> }
        ];

        return (
            <motion.div
                key={selectedClient.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
            >
                 <PageTitle 
                    title={selectedClient.name}
                    subtitle={`Managing ${selectedClient.brandIds.length} brand(s) • ${selectedClient.contactEmail}`}
                    actions={
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" onClick={() => handleLogContact(selectedClient)}>
                                <CalendarDaysIcon className="h-4 w-4 mr-2" /> Log Contact
                            </Button>
                            <Button variant="secondary" onClick={() => setSelectedClient(null)}>Back to All Clients</Button>
                        </div>
                    }
                />
                <Tabs tabs={tabs} />
            </motion.div>
        )
    };
    
    if (selectedClient) {
        return renderDetailView();
    }

    return (
        <div>
            <PageTitle 
                title="Client Hub"
                subtitle="Manage your agency's clients and generate reports."
                actions={<Button onClick={() => openModal()}><PlusIcon className="-ml-1 mr-2" /> Add Client</Button>}
            />
            {clients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map(client => {
                        const activeCampaigns = campaigns.filter(c => client.brandIds.includes(c.brandId) && c.status === 'Active').length;
                        const totalInvoiced = invoices.filter(i => i.clientId === client.id).reduce((sum, i) => sum + i.amount, 0);
                        return (
                            <Card key={client.id} className="flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-brand-text">{client.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{client.contactEmail}</p>
                                    {client.lastContacted && (
                                        <p className="text-xs text-slate-400 mt-1">Last Contact: {new Date(client.lastContacted).toLocaleDateString()}</p>
                                    )}
                                    <div className="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <span className="text-xs font-semibold text-slate-400 uppercase">Brands</span>
                                            <p className="text-lg font-bold text-slate-600">{client.brandIds.length}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-400 uppercase">Active Campaigns</span>
                                            <p className="text-lg font-bold text-slate-600">{activeCampaigns}</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-400 uppercase">Invoiced</span>
                                            <p className="text-lg font-bold text-slate-600">${(totalInvoiced / 1000).toFixed(1)}k</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-slate-200/60">
                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(client.id) }}><TrashIcon/></Button>
                                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); openModal(client) }}><PencilIcon/></Button>
                                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); openOnboardingLinkModal(client) }} title="Create Onboarding Link">
                                        <PaperAirplaneIcon className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" onClick={() => setSelectedClient(client)}>View</Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <EmptyState 
                    icon={<BriefcaseIcon />}
                    title="No Clients Yet"
                    message="Get started by adding your first client to manage their brands and generate reports."
                    action={<Button onClick={() => openModal()}>Add First Client</Button>}
                />
            )}
            {isModalOpen && (
                <Modal title={editingClient ? "Edit Client" : "Create New Client"} onClose={closeModal}>
                    <ClientForm client={editingClient} />
                </Modal>
            )}
             {isLinkModalOpen && (
                <Modal title="Client Onboarding Link" onClose={() => setIsLinkModalOpen(false)}>
                    <p className="text-slate-600 mb-4">Share this link with your client. They will be guided to fill out their brand details, which will automatically create a Brand Kit in your studio.</p>
                    <div className="relative bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <input type="text" readOnly value={onboardingLink} className="w-full bg-transparent outline-none text-slate-800 text-sm pr-10"/>
                        <CopyButton textToCopy={onboardingLink} />
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Clients;
