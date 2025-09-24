
import React, { useState, useEffect, useRef } from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { BrandProfile, ToneOfVoice, Competitor } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Card from './ui/Card';
import { PlusIcon, TrashIcon, LightBulbIcon, BuildingStorefrontIcon, DocumentArrowDownIcon } from '../constants';
import AISuggestionButton from './ui/AISuggestionButton';
import * as apiService from '../services/apiService';
import * as geminiService from '../services/geminiService';
import PageTitle from './ui/PageTitle';
import Tabs from './ui/Tabs';
import { useToast } from '../hooks/useToast';
import EmptyState from './ui/EmptyState';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BrandSettings: React.FC = () => {
    const { brands, currentBrand, setCurrentBrand, addBrand, updateBrandProfile, deleteBrand, addCompetitor, updateCompetitor, removeCompetitor } = useCurrentBrand();
    const { addToast } = useToast();
    const [editingBrand, setEditingBrand] = useState<BrandProfile | null>(null);
    const [newBrandName, setNewBrandName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    const [newCompetitorName, setNewCompetitorName] = useState('');
    const [competitorAnalysisLoading, setCompetitorAnalysisLoading] = useState<string | null>(null);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
    const brandGuideRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (currentBrand) {
            setEditingBrand({ ...currentBrand });
        } else {
            setEditingBrand(null);
        }
    }, [currentBrand, brands]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBrand) {
            try {
                await updateBrandProfile(editingBrand.id, editingBrand);
                addToast('Brand updated successfully!', 'success');
            } catch (error) {
                addToast(`Error updating brand: ${error}`, 'error');
            }
        }
    };

    const handleAddBrand = async () => {
        if (newBrandName.trim()) {
            try {
                const newBrand = await addBrand(newBrandName.trim());
                setCurrentBrand(newBrand);
                setNewBrandName('');
                setIsAdding(false);
                addToast(`Brand "${newBrandName.trim()}" created!`, 'success');
            } catch(error) {
                addToast(`Error creating brand: ${error}`, 'error');
            }
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
            try {
                await deleteBrand(id);
                addToast(`Brand "${name}" deleted.`, 'info');
            } catch(error) {
                addToast(`Error deleting brand: ${error}`, 'error');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editingBrand) return;
        const { name, value } = e.target;
        setEditingBrand({ ...editingBrand, [name]: value });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'secondaryLogo') => {
        if (!editingBrand || !e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        try {
            const { url } = await apiService.uploadBrandImage(file);
            setEditingBrand(prev => prev ? ({...prev, [field]: url}) : null);
            addToast('Image uploaded!', 'success');
        } catch(error) {
            addToast(`Image upload failed: ${error}`, 'error');
        }
        e.target.value = ''; // Reset file input
    };
    
    // Note: Multiple file upload for approved images would require a different backend endpoint.
    // This is a placeholder for single-image fields for now.
    const handleApprovedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
         if (!editingBrand || !e.target.files) return;
        addToast('Multiple image uploads should be handled by a dedicated backend endpoint.', 'info');
    };

    const handleDownloadGuide = () => {
        if (!brandGuideRef.current) return;
        setIsDownloadingPdf(true);
        addToast("Generating your Brand Guide...", 'info');
    
        brandGuideRef.current.style.display = 'block';
    
        html2canvas(brandGuideRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${editingBrand?.name || 'Brand'}-Guide.pdf`);
                addToast("Brand Guide downloaded!", 'success');
            })
            .catch(err => {
                console.error("PDF generation error:", err);
                addToast("Could not generate PDF.", 'error');
            })
            .finally(() => {
                if (brandGuideRef.current) {
                    brandGuideRef.current.style.display = 'none';
                }
                setIsDownloadingPdf(false);
            });
    };
    
    const handleColorChange = (colorType: 'primary' | 'secondary', value: string) => {
         if (!editingBrand) return;
         setEditingBrand({
             ...editingBrand,
             colors: {
                 ...(editingBrand.colors || { primary: '#000000', secondary: '#ffffff' }),
                 [colorType]: value
             }
         })
    }

    const handleAddCompetitor = async () => {
        if (newCompetitorName.trim() && currentBrand) {
            await addCompetitor(currentBrand.id, newCompetitorName.trim());
            setNewCompetitorName('');
        }
    };

    const handleAnalyzeCompetitor = async (competitor: Competitor) => {
        if (!currentBrand) return;
        setCompetitorAnalysisLoading(competitor.id);
        try {
            const analysis = await geminiService.analyzeCompetitor({ brandId: currentBrand.id, competitor });
            await updateCompetitor(currentBrand.id, competitor.id, { analysis });
            addToast(`Analysis complete for ${competitor.name}`, 'info');
        } catch (error) {
            console.error("Failed to analyze competitor", error);
            addToast("Failed to get analysis. Please try again.", 'error');
        } finally {
            setCompetitorAnalysisLoading(null);
        }
    };

    const renderIdentityTab = () => editingBrand && (
        <div className="space-y-6">
            <Input label="Brand Name" id="name" name="name" value={editingBrand.name} onChange={handleInputChange} required />
            <div>
                 <Textarea label="Brand Description" id="description" name="description" value={editingBrand.description || ''} onChange={handleInputChange} placeholder="e.g., We sell eco-friendly products for modern homes." />
                 <AISuggestionButton 
                    prompt={`Generate a brand description for a company named '${editingBrand.name}'.`}
                    onSuggestion={suggestion => setEditingBrand({...editingBrand, description: suggestion})}
                />
            </div>
            <Input label="Website" id="website" name="website" type="url" value={editingBrand.website || ''} onChange={handleInputChange} placeholder="https://example.com" />
             <div>
                <Textarea label="Target Audience" id="audience" name="audience" value={editingBrand.audience || ''} onChange={handleInputChange} placeholder="e.g., Millennials interested in sustainable living." />
                <AISuggestionButton
                     prompt={`Suggest a target audience for a brand with the description: "${editingBrand.description}".`}
                     onSuggestion={suggestion => setEditingBrand({...editingBrand, audience: suggestion})}
                />
            </div>
        </div>
    );
    
    const renderVoiceTab = () => editingBrand && (
        <div className="space-y-6">
             <Select label="Base Tone of Voice" id="baseTone" name="baseTone" value={editingBrand.baseTone || ''} onChange={handleInputChange}>
                {Object.values(ToneOfVoice).map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
            <div>
                 <Textarea label="Messaging Pillars (comma-separated)" id="messagingPillars" name="messagingPillars" value={(editingBrand.messagingPillars || []).join(', ')} onChange={e => setEditingBrand({...editingBrand, messagingPillars: e.target.value.split(',').map(v => v.trim())})} placeholder="e.g., Sustainability, Innovation, Quality" />
                 <AISuggestionButton
                    prompt={`Based on the description "${editingBrand.description}", suggest 3-4 key messaging pillars.`}
                    onSuggestion={suggestion => setEditingBrand({...editingBrand, messagingPillars: suggestion.split(',').map(v => v.trim())})}
                />
            </div>
            <div>
                <Textarea label="Dos (one per line)" id="dos" name="dos" rows={3} value={(editingBrand.dos || []).join('\n')} onChange={e => setEditingBrand({...editingBrand, dos: e.target.value.split('\n')})} placeholder="e.g., Use an optimistic tone" />
            </div>
             <div>
                <Textarea label="Don'ts (one per line)" id="donts" name="donts" rows={3} value={(editingBrand.donts || []).join('\n')} onChange={e => setEditingBrand({...editingBrand, donts: e.target.value.split('\n')})} placeholder="e.g., Avoid technical jargon" />
            </div>
        </div>
    );

    const renderVisualsTab = () => {
        if (!editingBrand) return null;

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Logo</label>
                        {editingBrand.logo && <img src={editingBrand.logo} alt="Primary Logo" className="w-24 h-24 object-contain p-2 border rounded-md bg-slate-50 mb-2" />}
                        <Input id="logo" label="" type="file" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Secondary Logo / Favicon</label>
                        {editingBrand.secondaryLogo && <img src={editingBrand.secondaryLogo} alt="Secondary Logo" className="w-16 h-16 object-contain p-2 border rounded-md bg-slate-50 mb-2" />}
                        <Input id="secondaryLogo" label="" type="file" accept="image/*" onChange={e => handleFileUpload(e, 'secondaryLogo')} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand Colors</label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <input type="color" id="primaryColor" value={editingBrand.colors?.primary || '#000000'} onChange={e => handleColorChange('primary', e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent rounded-md cursor-pointer"/>
                            <label htmlFor="primaryColor">Primary</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="color" id="secondaryColor" value={editingBrand.colors?.secondary || '#ffffff'} onChange={e => handleColorChange('secondary', e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent rounded-md cursor-pointer"/>
                            <label htmlFor="secondaryColor">Secondary</label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Primary Font" id="primaryFont" value={editingBrand.fonts?.primary || ''} onChange={e => setEditingBrand({...editingBrand, fonts: {...editingBrand.fonts!, primary: e.target.value}})} placeholder="e.g., Inter"/>
                    <Input label="Secondary Font" id="secondaryFont" value={editingBrand.fonts?.secondary || ''} onChange={e => setEditingBrand({...editingBrand, fonts: {...editingBrand.fonts!, secondary: e.target.value}})} placeholder="e.g., Lora"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Approved Imagery</label>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-slate-50 min-h-[80px]">
                        {(editingBrand.approvedImages || []).map((img, index) => <img key={index} src={img} alt="Approved" className="w-20 h-20 object-cover rounded-md"/>)}
                    </div>
                    <Input className="mt-2" id="approvedImages" label="" type="file" multiple accept="image/*" onChange={handleApprovedImageUpload}/>
                </div>
            </div>
        );
    }

    const renderStrategyTab = () => editingBrand && (
        <div className="space-y-6">
            <div>
                <Textarea label="Brand Mission" id="mission" name="mission" value={editingBrand.mission || ''} onChange={handleInputChange} placeholder="e.g., To make sustainable living accessible to everyone." />
                 <AISuggestionButton
                    prompt={`Based on the brand description "${editingBrand.description}", suggest a concise brand mission statement.`}
                    onSuggestion={suggestion => setEditingBrand({...editingBrand, mission: suggestion})}
                />
            </div>
             <div>
                <Textarea label="Brand Values (comma-separated)" id="values" name="values" value={(editingBrand.values || []).join(', ')} onChange={e => setEditingBrand({...editingBrand, values: e.target.value.split(',').map(v => v.trim())})} placeholder="e.g., Sustainability, Quality, Community" />
                 <AISuggestionButton
                    prompt={`Based on the brand mission "${editingBrand.mission}", suggest 3-5 core brand values.`}
                    onSuggestion={suggestion => setEditingBrand({...editingBrand, values: suggestion.split(',').map(v => v.trim())})}
                />
            </div>
        </div>
    );

    const renderCompetitorsTab = () => editingBrand && (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-medium text-gray-900">Track Competitors</h4>
                <p className="text-sm text-gray-500">Add competitors to analyze their strategy.</p>
            </div>
            <div className="flex gap-2">
                <Input label="" id="new-competitor-name" value={newCompetitorName} onChange={e => setNewCompetitorName(e.target.value)} placeholder="Enter competitor name" />
                <Button onClick={handleAddCompetitor}><PlusIcon /></Button>
            </div>
            <div className="space-y-4">
                {editingBrand.competitors.map(c => (
                    <Card key={c.id} className="p-0 overflow-visible">
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <Input 
                                        label="Competitor Name"
                                        id={`c-name-${c.id}`}
                                        value={c.name}
                                        onChange={(e) => updateCompetitor(editingBrand.id, c.id, {name: e.target.value})}
                                    />
                                    <Input 
                                        label="Website (optional)"
                                        id={`c-web-${c.id}`}
                                        value={c.website || ''}
                                        onChange={(e) => updateCompetitor(editingBrand.id, c.id, {website: e.target.value})}
                                        placeholder="example.com"
                                        className="mt-2"
                                    />
                                </div>
                                <button
                                    onClick={() => removeCompetitor(editingBrand.id, c.id)}
                                    className="ml-4 p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600"
                                >
                                    <TrashIcon className="w-4 h-4"/>
                                </button>
                            </div>
                             <Button
                                className="mt-4"
                                onClick={() => handleAnalyzeCompetitor(c)}
                                isLoading={competitorAnalysisLoading === c.id}
                                disabled={competitorAnalysisLoading !== null}
                            >
                                {competitorAnalysisLoading === c.id ? 'Analyzing...' : 'Analyze with AI'}
                            </Button>
                        </div>
                        {c.analysis && (
                            <div className="bg-brand-primary-light p-4 border-t border-purple-200">
                                <h5 className="font-bold text-brand-primary">AI Analysis</h5>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.analysis}</p>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );

    const TABS = [
        { label: 'Identity', content: renderIdentityTab() },
        { label: 'Voice & Tone', content: renderVoiceTab() },
        { label: 'Visuals', content: renderVisualsTab() },
        { label: 'Strategy', content: renderStrategyTab() },
        { label: 'Competitors', content: renderCompetitorsTab() },
    ];

    return (
        <div>
            {editingBrand && <div style={{ display: 'none', width: '800px' }}><BrandGuideHtml ref={brandGuideRef} brand={editingBrand} /></div>}

            <PageTitle
                title="Brand Kit"
                subtitle="Manage your brand identities and strategic assets."
                actions={ editingBrand && 
                    <Button onClick={handleDownloadGuide} isLoading={isDownloadingPdf} variant="secondary">
                        <DocumentArrowDownIcon className="mr-2"/> Download Brand Guide
                    </Button>
                }
            />
           
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <Card className="p-0">
                        <div className="p-4 border-b">
                            <h3 className="font-bold">All Brands</h3>
                        </div>
                        <div className="p-4">
                           {isAdding ? (
                                <div className="flex gap-2">
                                    <Input label="" id="new-brand-name" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} placeholder="New brand name" />
                                    <Button onClick={handleAddBrand}><PlusIcon /></Button>
                                </div>
                           ) : (
                                <Button onClick={() => setIsAdding(true)} className="w-full">Add Brand</Button>
                           )}
                        </div>
                        <ul className="max-h-96 overflow-y-auto">
                            {brands.map(brand => (
                                <li key={brand.id}>
                                    <button 
                                        onClick={() => setCurrentBrand(brand)}
                                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${currentBrand?.id === brand.id ? 'bg-brand-primary-light text-brand-primary' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className="font-medium truncate">{brand.name}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(brand.id, brand.name);}}
                                            className="p-1 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-600"
                                            aria-label={`Delete ${brand.name}`}
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <div className="md:col-span-3">
                    {editingBrand ? (
                        <form onSubmit={handleSave}>
                            <Card className="p-0">
                                <div className="p-6">
                                    <Tabs tabs={TABS}/>
                                </div>
                                <div className="mt-2 p-6 border-t bg-slate-50 rounded-b-2xl">
                                    <div className="flex justify-end">
                                        <Button type="submit">Save Changes</Button>
                                    </div>
                                </div>
                            </Card>
                        </form>
                    ) : (
                        <EmptyState
                            icon={<BuildingStorefrontIcon/>}
                            title="Select a Brand"
                            message="Select a brand from the list to edit its details, or add a new brand to get started."
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Component to render HTML for PDF generation
const BrandGuideHtml = React.forwardRef<HTMLDivElement, {brand: BrandProfile}>(({brand}, ref) => (
     <div ref={ref} className="p-10 font-sans bg-white text-brand-text">
        <style>{`
            .guide-h1 { font-size: 32px; font-weight: 800; color: ${brand.colors?.primary || '#000'}; margin-bottom: 8px; }
            .guide-h2 { font-size: 24px; font-weight: 700; color: ${brand.colors?.primary || '#000'}; border-bottom: 2px solid ${brand.colors?.primary || '#000'}; padding-bottom: 4px; margin-top: 24px; margin-bottom: 16px; }
            .guide-h3 { font-size: 18px; font-weight: 600; margin-top: 16px; margin-bottom: 8px; }
            .guide-p { font-size: 14px; line-height: 1.6; color: #334155; }
            .guide-list { list-style-position: inside; }
        `}</style>
        <div className="text-center mb-10">
            {brand.logo && <img src={brand.logo} alt="Brand Logo" className="mx-auto h-24 w-auto mb-4" crossOrigin="anonymous" />}
            <h1 className="guide-h1">{brand.name}</h1>
            <p className="guide-p">Brand Guide</p>
        </div>

        <h2 className="guide-h2">Identity</h2>
        <h3 className="guide-h3">Description</h3>
        <p className="guide-p">{brand.description}</p>
        <h3 className="guide-h3">Website</h3>
        <p className="guide-p">{brand.website}</p>
         <h3 className="guide-h3">Target Audience</h3>
        <p className="guide-p">{brand.audience}</p>

        <h2 className="guide-h2">Visuals</h2>
        <h3 className="guide-h3">Logos</h3>
        <div className="flex gap-8 items-center">
            {brand.logo && <div><p className="guide-p mb-2">Primary</p><img src={brand.logo} alt="Primary" className="h-20 border p-2 rounded" crossOrigin="anonymous"/></div>}
            {brand.secondaryLogo && <div><p className="guide-p mb-2">Secondary</p><img src={brand.secondaryLogo} alt="Secondary" className="h-20 border p-2 rounded" crossOrigin="anonymous"/></div>}
        </div>
        <h3 className="guide-h3">Colors</h3>
        <div className="flex gap-4">
            <div className="text-center">
                <div style={{backgroundColor: brand.colors?.primary}} className="w-24 h-24 rounded-lg"></div>
                <p className="guide-p mt-1">{brand.colors?.primary}</p>
            </div>
            <div className="text-center">
                <div style={{backgroundColor: brand.colors?.secondary}} className="w-24 h-24 rounded-lg border"></div>
                <p className="guide-p mt-1">{brand.colors?.secondary}</p>
            </div>
        </div>
         <h3 className="guide-h3">Typography</h3>
        <p className="guide-p">Primary Font: <span style={{fontFamily: brand.fonts?.primary}}>{brand.fonts?.primary}</span></p>
        <p className="guide-p">Secondary Font: <span style={{fontFamily: brand.fonts?.secondary}}>{brand.fonts?.secondary}</span></p>
        
        <h2 className="guide-h2">Voice & Tone</h2>
        <h3 className="guide-h3">Base Tone</h3>
        <p className="guide-p">{brand.baseTone}</p>
        <h3 className="guide-h3">Messaging Pillars</h3>
        <ul className="guide-list list-disc guide-p">{(brand.messagingPillars || []).map(p => <li key={p}>{p}</li>)}</ul>
        <h3 className="guide-h3">Dos and Don'ts</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h4 className="font-semibold text-green-600">Dos</h4>
                <ul className="guide-list list-disc guide-p">{(brand.dos || []).map(d => <li key={d}>{d}</li>)}</ul>
            </div>
            <div>
                <h4 className="font-semibold text-red-600">Don'ts</h4>
                <ul className="guide-list list-disc guide-p">{(brand.donts || []).map(d => <li key={d}>{d}</li>)}</ul>
            </div>
        </div>
    </div>
));

export default BrandSettings;
