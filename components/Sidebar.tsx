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
        <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0 border border-indigo-500/30">
          {brandName.charAt(0)}
        </div>
      );
    }
    return <img src={logoUrl} alt={`${brandName} logo`} className="w-9 h-9 rounded-lg flex-shrink-0 object-cover border border-slate-700" />;
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
      className={`group relative flex items-center px-3 py-2.5 mx-3 mb-1 text-sm rounded-lg transition-all duration-200
        ${isCollapsed ? 'justify-center mx-2' : ''}
        ${
          activeView === item.view
            ? 'bg-brand-primary/10 text-brand-primary font-semibold shadow-sm border border-brand-primary/20'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 font-medium border border-transparent'
        }`}
    >
      <span className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-colors ${activeView === item.view ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-300'}`}>
          {item.icon}
      </span>
      {!isCollapsed && <span className="ml-3 flex-1 whitespace-nowrap">{item.name}</span>}
      {isCollapsed && (
          <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-lg text-white bg-slate-800 border border-slate-700 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
              {item.name}
          </span>
      )}
    </a>
  );

  const NavHeading: React.FC<{item: NavStructureItem}> = ({item}) => (
    <h3 className="px-6 pt-5 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {item.name}
    </h3>
  );

  return (
    <aside className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-[#0b1120] text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800/60 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Sidebar Header */}
      <div className={`flex items-center h-20 flex-shrink-0 ${isCollapsed ? 'justify-center' : 'justify-start px-6'}`}>
        <div className="bg-brand-primary/10 p-2 rounded-xl">
            <SparklesIcon className="h-7 w-7 text-brand-primary flex-shrink-0" />
        </div>
        {!isCollapsed && <h1 className="text-xl font-extrabold ml-3 tracking-tight text-white">BrandSpark</h1>}
      </div>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 min-h-0 overflow-y-auto sidebar-nav-scroll py-2">
        <nav className="flex-1 space-y-0.5">
          {navStructure.map((item, index) => {
            if (item.type === 'heading') {
                return isCollapsed ? (
                    <div key={`${item.name}-${index}`} className="my-4 mx-4 border-t border-slate-800/60"/>
                ) : (
                    <NavHeading key={`${item.name}-${index}`} item={item} />
                );
            }
            return <NavLink key={item.name} item={item} />;
           })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex-shrink-0 p-4 bg-slate-900/50 border-t border-slate-800/60">
        {currentBrand && (
        <div className={`flex items-center p-2 mb-2 rounded-xl bg-slate-800/40 border border-slate-700/50 group relative ${isCollapsed ? 'justify-center' : ''}`}>
            <BrandLogo logoUrl={currentBrand.logo} brandName={currentBrand.name} />
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-bold text-slate-200 truncate">{currentBrand.name}</p>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Selected Brand</p>
              </div>
            )}
            {isCollapsed && (
                <span className="absolute left-full ml-4 w-auto p-2 min-w-max rounded-md shadow-lg text-white bg-slate-800 border border-slate-700 text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100 z-50">
                    {currentBrand.name}
                </span>
             )}
        </div>
        )}
         <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors border border-transparent hover:border-slate-700"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <ChevronDoubleRightIcon className="h-5 w-5"/> : <ChevronDoubleLeftIcon className="h-5 w-5"/>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
