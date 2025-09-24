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
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">
            {currentUser.name.charAt(0)}
        </div>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200/60 transition-colors"
            >
                <UserAvatar />
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-64 right-0 bg-white shadow-lg rounded-lg border border-slate-200">
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-3">
                            <UserAvatar />
                            <div>
                                <p className="font-semibold text-sm text-brand-text truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                         <button
                            onClick={logout}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md"
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
    <header className="flex-shrink-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/90 h-16 flex items-center justify-between px-6 sm:px-8 lg:px-10">
      <div />
      <div className="flex items-center gap-4">
        <BrandSelector />
        <div className="w-px h-8 bg-slate-200" />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
