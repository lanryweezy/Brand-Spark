import { LogOut } from 'lucide-react';
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
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
            {currentUser.name.charAt(0)}
        </div>
    );

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all duration-200 hover:shadow-sm"
            >
                <UserAvatar />
                <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-3 w-64 right-0 bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden origin-top-right transition-all transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <UserAvatar />
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm text-brand-text truncate">{currentUser.name}</p>
                                <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                         <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Log Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};



interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-slate-200/50 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary md:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:block">
            <BrandSelector />
        </div>
        <div className="hidden sm:block w-px h-8 bg-slate-200" />
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
