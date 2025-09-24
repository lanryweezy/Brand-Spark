import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AIStudio from './components/AIStudio';
import { View, NavStructureItem } from './types';
import { SparklesIcon, LayoutDashboardIcon, BuildingStorefrontIcon, CalendarDaysIcon, MegaphoneIcon, RocketLaunchIcon, UserGroupIcon, ChartBarIcon, CpuChipIcon, LinkIcon, FolderIcon, BriefcaseIcon, CurrencyDollarIcon, CogIcon } from './constants';
import BrandSettings from './components/BrandSettings';
import ContentCalendar from './components/ContentCalendar';
import CampaignPlanner from './components/CampaignPlanner';
import AssetRepository from './components/AssetRepository';
import Automation from './components/Automation';
import InfluencerManager from './components/InfluencerManager';
import Analytics from './components/Analytics';
import Integrations from './components/Integrations';
import Projects from './components/Projects';
import Clients from './components/Clients';
import TeamManagement from './components/TeamManagement';
import { ToastContainer } from './components/ui/Toast';
import { motion, AnimatePresence } from 'framer-motion';
import Financials from './components/Financials';

const SIDEBAR_COLLAPSED_KEY = 'brandspark_sidebar_collapsed';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Dashboard);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const renderActiveView = () => {
    switch (activeView) {
      case View.AIStudio:
        return <AIStudio />;
      case View.BrandSettings:
        return <BrandSettings />;
      case View.ContentCalendar:
        return <ContentCalendar setActiveView={setActiveView} />;
      case View.CampaignPlanner:
        return <CampaignPlanner />;
      case View.Projects:
        return <Projects />;
      case View.AssetRepository:
        return <AssetRepository />;
      case View.Automation:
        return <Automation />;
      case View.InfluencerManager:
        return <InfluencerManager />;
      case View.Analytics:
        return <Analytics />;
      case View.Integrations:
        return <Integrations />;
       case View.Clients:
        return <Clients />;
       case View.Financials:
        return <Financials />;
       case View.TeamManagement:
        return <TeamManagement />;
      case View.Dashboard:
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  const navStructure: NavStructureItem[] = [
    { type: 'link', name: 'Dashboard', view: View.Dashboard, icon: <LayoutDashboardIcon /> },
    { type: 'heading', name: 'Agency' },
    { type: 'link', name: 'Client Hub', view: View.Clients, icon: <BriefcaseIcon /> },
    { type: 'link', name: 'Financials', view: View.Financials, icon: <CurrencyDollarIcon /> },
    { type: 'link', name: 'Team Management', view: View.TeamManagement, icon: <CogIcon /> },
    { type: 'link', name: 'Brand Kit', view: View.BrandSettings, icon: <BuildingStorefrontIcon /> },
    { type: 'heading', name: 'Strategy' },
    { type: 'link', name: 'Campaigns', view: View.CampaignPlanner, icon: <RocketLaunchIcon /> },
    { type: 'link', name: 'Projects', view: View.Projects, icon: <FolderIcon /> },
    { type: 'heading', name: 'Content' },
    { type: 'link', name: 'AI Studio', view: View.AIStudio, icon: <SparklesIcon /> },
    { type: 'link', name: 'Calendar', view: View.ContentCalendar, icon: <CalendarDaysIcon /> },
    { type: 'link', name: 'Assets', view: View.AssetRepository, icon: <MegaphoneIcon /> },
    { type: 'heading', name: 'Execution' },
    { type: 'link', name: 'Automations', view: View.Automation, icon: <CpuChipIcon /> },
    { type: 'link', name: 'Influencers', view: View.InfluencerManager, icon: <UserGroupIcon /> },
    { type: 'link', name: 'Integrations', view: View.Integrations, icon: <LinkIcon /> },
    { type: 'heading', name: 'Intelligence' },
    { type: 'link', name: 'Analytics', view: View.Analytics, icon: <ChartBarIcon /> },
  ];


  return (
    <div className="bg-slate-50 font-sans">
      <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          navStructure={navStructure}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className={`relative transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'pl-20' : 'pl-64'}`}>
          <div className="flex flex-col h-screen">
              <Header />
              <main className="flex-1 overflow-y-auto">
                <div className="p-6 sm:p-8 lg:p-10 mx-auto max-w-7xl w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeView}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                    >
                      {renderActiveView()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
          </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;
