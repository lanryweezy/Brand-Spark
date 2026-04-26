import React, { useState, useRef, useEffect } from 'react';
import BrandSelector from './BrandSelector';
import { useAuth } from '../hooks/useAuth';
import { ChevronDownIcon } from '../constants';

const UserProfileDropdown: React.FC = () => {
    const { currentUser, logout } = useAuth();
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

    if (!currentUser) return null;

    const UserAvatar = () => (
        <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm border border-brand-primary/20">
            {currentUser.name.charAt(0)}
        </div>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 pr-2 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
                <UserAvatar />
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 w-64 right-0 bg-white shadow-xl rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <UserAvatar />
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm text-slate-800 truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                         <button
                            onClick={logout}
                            className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-6 sm:px-8 lg:px-10 z-30 sticky top-0">
      <div />
      <div className="flex items-center gap-5">
        <BrandSelector />
        <div className="w-px h-8 bg-slate-200" />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
