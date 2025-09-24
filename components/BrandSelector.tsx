
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { BrandProfile } from '../types';
import { ChevronDownIcon, PlusIcon } from '../constants';
import Button from './ui/Button';

const BrandLogo: React.FC<{ logoUrl?: string; alt: string }> = ({ logoUrl, alt }) => {
    if(!logoUrl) {
      return (
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs mr-3 flex-shrink-0">
          {alt.charAt(0)}
        </div>
      );
    }
    return <img src={logoUrl} alt={alt} className="w-6 h-6 rounded-full mr-3 flex-shrink-0" />;
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
                className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {currentBrand ? (
                    <span className="flex items-center truncate">
                        <BrandLogo logoUrl={currentBrand.logo} alt={currentBrand.name} />
                        <span className="truncate">{currentBrand.name}</span>
                    </span>
                ) : (
                    <span>Select a Brand</span>
                )}
                <ChevronDownIcon className={`w-5 h-5 ml-2 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredBrands.map((brand: BrandProfile) => (
                            <li key={brand.id}>
                                <button
                                    onClick={() => { setCurrentBrand(brand); setIsOpen(false); }}
                                    className="w-full flex items-center p-3 text-left text-sm text-gray-700 hover:bg-indigo-50"
                                >
                                    <BrandLogo logoUrl={brand.logo} alt={brand.name} />
                                    <span className="truncate">{brand.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="p-2 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Add new brand..."
                                className="flex-grow px-3 py-2 text-sm text-gray-900 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddNewBrand()}
                            />
                            <Button onClick={handleAddNewBrand} size="sm"><PlusIcon /></Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BrandSelector;
