
import React from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { View, NavStructureItem } from '../types';
import { SparklesIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '../constants';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  navStructure: NavStructureItem[];
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

const BrandLogo: React.FC<{ logoUrl?: string; brandName: string }> = ({ logoUrl, brandName }) => {
    if (!logoUrl) {
      return (
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {brandName.charAt(0)}
        </div>
      );
    }
    return <img src={logoUrl} alt={`${brandName} logo`} className="w-10 h-10 rounded-full flex-shrink-0" />;
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, navStructure, isCollapsed, setIsCollapsed }) => {
  const { currentBrand } = useCurrentBrand();

  const NavLink: React.FC<{item: NavStructureItem}> = ({item}) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if(item.view) {
            setActiveView(item.view);
        }
      }}
      className={`group relative flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200
        ${isCollapsed ? 'justify-center' : ''}
        ${
          activeView === item.view
            ? 'bg-slate-700/80 text-white font-semibold'
            : 'text-slate-400 hover:bg-slate-800/60 hover:text-white font-medium'
        }`}
    >
      <span className="w-6 h-6 flex items-center justify-center flex-shrink-0">{item.icon}</span>
      {!isCollapsed && <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>}
      {isCollapsed && (
          <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-slate-800 border border-slate-700 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-20">
              {item.name}
          </span>
      )}
    </a>
  );

  const NavHeading: React.FC<{item: NavStructureItem}> = ({item}) => (
    <h3 className="px-4 pt-4 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {item.name}
    </h3>
  );

  return (
    <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className={`flex items-center h-20 border-b border-slate-800 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-center px-6'}`}>
        <SparklesIcon className="h-9 w-9 text-brand-primary flex-shrink-0" />
        {!isCollapsed && <h1 className="text-2xl font-bold ml-2 tracking-tight">BrandSpark</h1>}
      </div>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 min-h-0 overflow-y-auto sidebar-nav-scroll">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navStructure.map((item, index) => {
            if (item.type === 'heading') {
                return isCollapsed ? (
                    <hr key={`${item.name}-${index}`} className="my-3 mx-2 border-slate-700"/>
                ) : (
                    <NavHeading key={`${item.name}-${index}`} item={item} />
                );
            }
            return <NavLink key={item.name} item={item} />;
           })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex-shrink-0 p-3 border-t border-slate-800">
        {currentBrand && (
        <div className={`flex items-center p-2 group relative ${isCollapsed ? 'justify-center' : ''}`}>
            <BrandLogo logoUrl={currentBrand.logo} brandName={currentBrand.name} />
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate">{currentBrand.name}</p>
                  <p className="text-xs text-slate-400">Selected Brand</p>
              </div>
            )}
            {isCollapsed && (
                <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-md text-white bg-slate-800 border border-slate-700 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-20">
                    {currentBrand.name}
                </span>
             )}
        </div>
        )}
         <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center mt-2 px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5"/> : <ChevronDoubleLeftIcon className="h-5 w-5"/>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
