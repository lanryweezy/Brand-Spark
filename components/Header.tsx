import React, { useState, useRef, useEffect } from 'react';
import BrandSelector from './BrandSelector';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../hooks/useDarkMode';
import { ChevronDownIcon, SunIcon, MoonIcon, SearchIcon } from '../constants';

const GlobalSearch: React.FC = () => {
    return (
        <div className="relative w-full max-w-md hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                placeholder="Search campaigns, assets, tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary dark:focus:ring-brand-primary sm:text-sm transition-colors text-slate-900 dark:text-slate-100"
            />
        </div>
    );
};

const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            title="Toggle Dark Mode"
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    );
};

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
                    <div className="absolute z-50 mt-2 w-64 right-0 bg-white dark:bg-slate-800 shadow-xl rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-3">
                            <UserAvatar />
                            <div className="overflow-hidden">
                                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                         <button
                            onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
    <header className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-20 flex items-center justify-between px-6 sm:px-8 lg:px-10 z-30 sticky top-0 transition-colors duration-200">
      <div className="flex-1 flex items-center justify-start max-w-2xl mr-4">
        <GlobalSearch />
      </div>
      <div className="flex items-center gap-5">
        <BrandSelector />
        <DarkModeToggle />
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
