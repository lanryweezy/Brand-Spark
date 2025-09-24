import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OnboardingPage from './components/OnboardingPage';
import LoginPage from './components/LoginPage';
import { BrandProvider } from './hooks/useCurrentBrand';
import { ClientsProvider } from './hooks/useClients';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ProjectsProvider } from './hooks/useProjects';
import { TasksProvider } from './hooks/useTasks';
import { CampaignsProvider } from './hooks/useCampaigns';
import { CollectionsProvider } from './hooks/useCollections';
import { AssetsProvider } from './hooks/useAssets';
import { CalendarProvider } from './hooks/useCalendar';
import { AutomationsProvider } from './hooks/useAutomations';
import { InfluencersProvider } from './hooks/useInfluencers';
import { FinancialsProvider } from './hooks/useFinancials';
import { GoalsProvider } from './hooks/useGoals';
import { ToastProvider } from './hooks/useToast';
import { UsersProvider } from './hooks/useUsers';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);

const AppContainer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const urlParams = new URLSearchParams(window.location.search);
  const clientIdForOnboarding = urlParams.get('onboard-client');

  if (clientIdForOnboarding) {
    // The onboarding page is standalone and doesn't require authentication
    return <OnboardingPage clientId={clientIdForOnboarding} />;
  }

  return isAuthenticated ? <App /> : <LoginPage />;
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrandProvider>
        <ClientsProvider>
          <UsersProvider>
            <ProjectsProvider>
              <TasksProvider>
                <CampaignsProvider>
                  <CollectionsProvider>
                    <AssetsProvider>
                      <CalendarProvider>
                        <AutomationsProvider>
                          <InfluencersProvider>
                            <FinancialsProvider>
                              <GoalsProvider>
                                <ToastProvider>
                                  <AppContainer />
                                </ToastProvider>
                              </GoalsProvider>
                            </FinancialsProvider>
                          </InfluencersProvider>
                        </AutomationsProvider>
                      </CalendarProvider>
                    </AssetsProvider>
                  </CollectionsProvider>
                </CampaignsProvider>
              </TasksProvider>
            </ProjectsProvider>
          </UsersProvider>
        </ClientsProvider>
      </BrandProvider>
    </AuthProvider>
  </React.StrictMode>
);
