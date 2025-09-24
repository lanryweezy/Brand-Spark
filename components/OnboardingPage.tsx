
import React, { useState, useEffect } from 'react';
import { BrandProfile, ToneOfVoice, Competitor, Client } from '../types';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import Button from './ui/Button';
import Card from './ui/Card';
import { SparklesIcon } from '../constants';
import { useClients } from '../hooks/useClients';
import { useCurrentBrand } from '../hooks/useCurrentBrand';

const OnboardingPage: React.FC<{ clientId: string }> = ({ clientId }) => {
    const { getClientById, updateClient } = useClients();
    const { addBrand, updateBrandProfile, addCompetitor } = useCurrentBrand();

    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [brandName, setBrandName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Professional);
    const [primaryColor, setPrimaryColor] = useState('#5c22d9');
    const [secondaryColor, setSecondaryColor] = useState('#1f2937');
    const [mission, setMission] = useState('');
    const [values, setValues] = useState('');
    const [competitors, setCompetitors] = useState('');

    useEffect(() => {
        const currentClient = getClientById(clientId);
        if (currentClient) {
            setClient(currentClient);
        } else {
            // This might happen if localStorage is not synced yet, give it a moment
            setTimeout(() => {
                const retryClient = getClientById(clientId);
                if (retryClient) {
                    setClient(retryClient);
                } else {
                    setError("Invalid onboarding link. Please contact your agency representative.");
                }
            }, 500);
        }
    }, [clientId, getClientById]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) {
            setError("Client details not found. Cannot submit.");
            return;
        }
        
        setIsLoading(true);

        const competitorList: Competitor[] = competitors.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
            id: new Date().getTime().toString() + name,
            name: name,
            analysis: null,
        }));
        
        try {
            // Create the brand with a name first to get an ID
            const newBrand = await addBrand(brandName);

            // Associate the new brand ID with the client
            await updateClient(client.id, { brandIds: [...client.brandIds, newBrand.id] });

            // Now, update the newly created brand with all the details from the form
            const fullBrandDetails: Partial<Omit<BrandProfile, 'competitors'>> = {
                description,
                website,
                audience,
                baseTone: tone,
                colors: { primary: primaryColor, secondary: secondaryColor },
                mission,
                values: values.split(',').map(v => v.trim()).filter(Boolean),
            };
            await updateBrandProfile(newBrand.id, fullBrandDetails);

            // Add competitors to the new brand
            const competitorPromises = competitorList.map(c => addCompetitor(newBrand.id, c.name));
            await Promise.all(competitorPromises);


            setIsSubmitted(true);
        } catch(e: any) {
            setError("An unexpected error occurred. Please try again or contact your agency.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (error) {
        return (
            <div className="bg-slate-50 min-h-screen flex items-center justify-center text-center p-4">
                <Card>
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-slate-700 mt-2">{error}</p>
                </Card>
            </div>
        );
    }
    
    if (isSubmitted) {
        return (
             <div className="bg-slate-50 min-h-screen flex items-center justify-center text-center p-4">
                <Card>
                    <SparklesIcon className="h-12 w-12 text-brand-primary mx-auto" />
                    <h1 className="text-3xl font-bold text-brand-text mt-4">Thank You!</h1>
                    <p className="text-slate-700 mt-2">Your brand information has been submitted successfully.</p>
                    <p className="text-slate-500 mt-1">Your agency has been notified. You can now close this window.</p>
                </Card>
            </div>
        )
    }

    if (!client) {
         return (
             <div className="bg-slate-50 min-h-screen flex items-center justify-center">
                <p className="text-slate-600">Loading onboarding portal...</p>
             </div>
        )
    }

    return (
        <div className="bg-slate-50 font-sans antialiased">
            <div className="container mx-auto max-w-3xl py-12 px-4">
                <div className="text-center mb-8">
                    <SparklesIcon className="h-12 w-12 text-brand-primary mx-auto" />
                    <h1 className="text-4xl font-extrabold text-brand-text tracking-tight mt-2">Brand Onboarding</h1>
                    <p className="text-lg text-slate-500 mt-2">Welcome! Please fill out this form for <strong className="text-brand-primary">{client.name}</strong>.</p>
                </div>
                
                <Card className="shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Core Identity */}
                        <div className="space-y-6 p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-brand-text">1. Core Identity</h2>
                            <Input label="Brand Name" id="brandName" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., Stellar Solutions" required />
                            <Textarea label="Brand Description" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="A short, compelling summary of what your brand does." required />
                            <Input label="Website URL" id="website" type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" />
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand Colors</label>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <input type="color" id="primaryColor" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent rounded-md cursor-pointer"/>
                                        <label htmlFor="primaryColor" className="text-sm">Primary</label>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <input type="color" id="secondaryColor" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 p-0 border-0 bg-transparent rounded-md cursor-pointer"/>
                                        <label htmlFor="secondaryColor" className="text-sm">Secondary</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Strategy & Voice */}
                         <div className="space-y-6 p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-brand-text">2. Strategy & Voice</h2>
                            <Textarea label="Target Audience" id="audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="Describe your ideal customer." required />
                            <Select label="Default Tone of Voice" id="tone" value={tone} onChange={e => setTone(e.target.value as ToneOfVoice)}>
                                {Object.values(ToneOfVoice).map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                             <Textarea label="Brand Mission" id="mission" value={mission} onChange={e => setMission(e.target.value)} placeholder="What is your brand's ultimate purpose?" />
                             <Textarea label="Brand Values (comma-separated)" id="values" value={values} onChange={e => setValues(e.target.value)} placeholder="e.g., Sustainability, Quality, Community" />
                        </div>

                        {/* Section 3: Market Landscape */}
                        <div className="space-y-6 p-6">
                             <h2 className="text-xl font-bold text-brand-text">3. Market Landscape</h2>
                             <Textarea label="Key Competitors (comma-separated)" id="competitors" value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="List 1-3 of your main competitors." />
                        </div>

                        <div className="p-6 pt-0">
                            <Button type="submit" isLoading={isLoading} disabled={isLoading || !brandName} className="w-full" size="lg">
                                {isLoading ? 'Submitting...' : 'Complete Onboarding'}
                            </Button>
                        </div>
                    </form>
                </Card>
                <p className="text-center text-xs text-slate-400 mt-8">Powered by BrandSpark AI Studio</p>
            </div>
        </div>
    );
};

export default OnboardingPage;
