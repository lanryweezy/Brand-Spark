import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { BrandProfile } from '../types';
import { ChevronDownIcon, PlusIcon } from '../constants';
import Button from './ui/Button';

const BrandLogo: React.FC<{ logoUrl?: string; alt: string }> = ({ logoUrl, alt }) => {
    if(!logoUrl) {
      return (
        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs mr-3 flex-shrink-0 border border-slate-200">
          {alt.charAt(0)}
        </div>
      );
    }
    return <img src={logoUrl} alt={alt} className="w-6 h-6 rounded-md mr-3 flex-shrink-0 object-cover border border-slate-200" />;
}

const BrandSelector: React.FC = () => {
    const { brands, currentBrand, setCurrentBrand, addBrand } = useCurrentBrand();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredBrands = useMemo(() => {
        return brands.filter(brand =>
            brand.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [brands, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    const handleAddNewBrand = async () => {
        if (newBrandName.trim() !== '') {
            const newBrand = await addBrand(newBrandName.trim());
            setCurrentBrand(newBrand);
            setNewBrandName('');
            setSearchTerm('');
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className="relative w-64">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl shadow-sm px-4 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all duration-200"
            >
                {currentBrand ? (
                    <span className="flex items-center truncate">
                        <BrandLogo logoUrl={currentBrand.logo} alt={currentBrand.name} />
                        <span className="truncate">{currentBrand.name}</span>
                    </span>
                ) : (
                    <span className="text-slate-500 font-medium">Select a Brand</span>
                )}
                <ChevronDownIcon className={`w-5 h-5 ml-2 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden transform opacity-100 scale-100 transition-all origin-top">
                    <div className="p-3 border-b border-slate-100 bg-slate-50">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto py-2">
                        {filteredBrands.map((brand: BrandProfile) => (
                            <li key={brand.id}>
                                <button
                                    onClick={() => { setCurrentBrand(brand); setIsOpen(false); }}
                                    className={`w-full flex items-center px-4 py-2.5 text-left text-sm font-medium transition-colors ${currentBrand?.id === brand.id ? 'bg-brand-primary/5 text-brand-primary' : 'text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <BrandLogo logoUrl={brand.logo} alt={brand.name} />
                                    <span className="truncate">{brand.name}</span>
                                    {currentBrand?.id === brand.id && (
                                        <svg className="w-4 h-4 ml-auto text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Add new brand..."
                                className="flex-grow px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors placeholder:text-slate-400"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNewBrand()}
                            />
                            <Button onClick={handleAddNewBrand} size="sm" className="px-3" disabled={!newBrandName.trim()}><PlusIcon className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandSelector;
