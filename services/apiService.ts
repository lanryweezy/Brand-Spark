import { 
    BrandProfile, Competitor, Integration, Campaign, Project, Budget, Expense, Invoice, Client, Asset, Task, 
    ContentCalendarEvent, Collection, AutomationWorkflow, Influencer, Goal 
} from '../types';
import { MOCK_BRANDS } from '../data/mockBrands';
import {
    MOCK_CAMPAIGNS, MOCK_ASSETS, MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TASKS, MOCK_AUTOMATIONS, MOCK_INFLUENCERS,
    MOCK_BUDGETS, MOCK_EXPENSES, MOCK_INVOICES, MOCK_CALENDAR_EVENTS, MOCK_COLLECTIONS, MOCK_GOALS
} from '../data/mockData';

const SIMULATED_DELAY = 500; // ms

// --- LocalStorage Mock Database ---
const db = {
    getItem: <T>(key: string, mockData: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : mockData;
        } catch (error) {
            console.error(`Error reading from localStorage key “${key}”:`, error);
            return mockData;
        }
    },
    setItem: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key “${key}”:`, error);
        }
    }
};

const DB_KEYS = {
    BRANDS: 'db_brands',
    CAMPAIGNS: 'db_campaigns',
    ASSETS: 'db_assets',
    CLIENTS: 'db_clients',
    PROJECTS: 'db_projects',
    TASKS: 'db_tasks',
    AUTOMATIONS: 'db_automations',
    INFLUENCERS: 'db_influencers',
    BUDGETS: 'db_budgets',
    EXPENSES: 'db_expenses',
    INVOICES: 'db_invoices',
    CALENDAR: 'db_calendar',
    COLLECTIONS: 'db_collections',
    GOALS: 'db_goals',
};

// Initialize DB if empty
if (!localStorage.getItem(DB_KEYS.BRANDS)) {
    db.setItem(DB_KEYS.BRANDS, MOCK_BRANDS);
    db.setItem(DB_KEYS.CAMPAIGNS, MOCK_CAMPAIGNS);
    db.setItem(DB_KEYS.ASSETS, MOCK_ASSETS);
    db.setItem(DB_KEYS.CLIENTS, MOCK_CLIENTS);
    db.setItem(DB_KEYS.PROJECTS, MOCK_PROJECTS);
    db.setItem(DB_KEYS.TASKS, MOCK_TASKS);
    db.setItem(DB_KEYS.AUTOMATIONS, MOCK_AUTOMATIONS);
    db.setItem(DB_KEYS.INFLUENCERS, MOCK_INFLUENCERS);
    db.setItem(DB_KEYS.BUDGETS, MOCK_BUDGETS);
    db.setItem(DB_KEYS.EXPENSES, MOCK_EXPENSES);
    db.setItem(DB_KEYS.INVOICES, MOCK_INVOICES);
    db.setItem(DB_KEYS.CALENDAR, MOCK_CALENDAR_EVENTS);
    db.setItem(DB_KEYS.COLLECTIONS, MOCK_COLLECTIONS);
    db.setItem(DB_KEYS.GOALS, MOCK_GOALS);
}

// --- API Simulation Functions ---

const createApi = <T extends { id: string }>(dbKey: string, mockData: T[]) => {
    let items = db.getItem<T[]>(dbKey, mockData);

    return {
        getAll: (): Promise<T[]> => new Promise(resolve => {
            setTimeout(() => resolve(db.getItem<T[]>(dbKey, mockData)), SIMULATED_DELAY);
        }),
        add: (newItemData: Omit<T, 'id'>): Promise<T> => new Promise(resolve => {
            setTimeout(() => {
                const newItem = { ...newItemData, id: `${dbKey}-${Date.now()}` } as T;
                items = [newItem, ...db.getItem<T[]>(dbKey, mockData)];
                db.setItem(dbKey, items);
                resolve(newItem);
            }, SIMULATED_DELAY);
        }),
        update: (id: string, updates: Partial<T>): Promise<T> => new Promise((resolve, reject) => {
            setTimeout(() => {
                items = db.getItem<T[]>(dbKey, mockData);
                const itemIndex = items.findIndex(i => i.id === id);
                if (itemIndex === -1) return reject(new Error('Item not found'));
                
                const updatedItem = { ...items[itemIndex], ...updates };
                items[itemIndex] = updatedItem;
                db.setItem(dbKey, items);
                resolve(updatedItem);
            }, SIMULATED_DELAY);
        }),
        remove: (id: string): Promise<void> => new Promise(resolve => {
            setTimeout(() => {
                items = db.getItem<T[]>(dbKey, mockData).filter(i => i.id !== id);
                db.setItem(dbKey, items);
                resolve();
            }, SIMULATED_DELAY);
        }),
    };
};

const brandApi = createApi<BrandProfile>(DB_KEYS.BRANDS, MOCK_BRANDS);
const campaignApi = createApi<Campaign>(DB_KEYS.CAMPAIGNS, MOCK_CAMPAIGNS);
const assetApi = createApi<Asset>(DB_KEYS.ASSETS, MOCK_ASSETS);
const clientApi = createApi<Client>(DB_KEYS.CLIENTS, MOCK_CLIENTS);
const projectApi = createApi<Project>(DB_KEYS.PROJECTS, MOCK_PROJECTS);
const taskApi = createApi<Task>(DB_KEYS.TASKS, MOCK_TASKS);
const automationApi = createApi<AutomationWorkflow>(DB_KEYS.AUTOMATIONS, MOCK_AUTOMATIONS);
const influencerApi = createApi<Influencer>(DB_KEYS.INFLUENCERS, MOCK_INFLUENCERS);
const budgetApi = createApi<Budget>(DB_KEYS.BUDGETS, MOCK_BUDGETS);
const expenseApi = createApi<Expense>(DB_KEYS.EXPENSES, MOCK_EXPENSES);
const invoiceApi = createApi<Invoice>(DB_KEYS.INVOICES, MOCK_INVOICES);
const calendarApi = createApi<ContentCalendarEvent>(DB_KEYS.CALENDAR, MOCK_CALENDAR_EVENTS);
const collectionApi = createApi<Collection>(DB_KEYS.COLLECTIONS, MOCK_COLLECTIONS);
const goalApi = createApi<Goal>(DB_KEYS.GOALS, MOCK_GOALS);

// Brands
export const fetchBrands = brandApi.getAll;
// FIX: The `add` method expects an object without an `id`. The original code was spreading a mock object that included an `id` and also explicitly providing an `id` property, causing a type error. This is corrected by destructuring the mock brand to remove its `id` before passing the data.
export const addBrand = (data: { name: string }) => {
    const { id, ...template } = MOCK_BRANDS[0];
    return brandApi.add({
        ...template,
        name: data.name,
        competitors: [],
        integrations: MOCK_BRANDS[0].integrations.map(i => ({...i, connected: false}))
    });
};
export const updateBrand = brandApi.update;
export const deleteBrand = brandApi.remove;

export const uploadBrandImage = (file: File): Promise<{url: string}> => new Promise(resolve => {
    setTimeout(() => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve({ url: reader.result as string });
        };
        reader.readAsDataURL(file);
    }, 1000);
});

export const addCompetitorToBrand = async (brandId: string, data: { name: string }): Promise<Competitor> => {
    const brands = await brandApi.getAll();
    const brand = brands.find(b => b.id === brandId);
    if (!brand) throw new Error("Brand not found");
    const newCompetitor = { id: `comp-${Date.now()}`, ...data };
    const updatedCompetitors = [...brand.competitors, newCompetitor];
    await brandApi.update(brandId, { competitors: updatedCompetitors });
    return newCompetitor;
};
export const updateBrandCompetitor = async (brandId: string, competitorId: string, data: Partial<Competitor>): Promise<Competitor> => {
     const brands = await brandApi.getAll();
    const brand = brands.find(b => b.id === brandId);
    if (!brand) throw new Error("Brand not found");
    let updatedCompetitor: Competitor | undefined;
    const updatedCompetitors = brand.competitors.map(c => {
        if (c.id === competitorId) {
            updatedCompetitor = { ...c, ...data };
            return updatedCompetitor;
        }
        return c;
    });
    await brandApi.update(brandId, { competitors: updatedCompetitors });
    if (!updatedCompetitor) throw new Error("Competitor not found");
    return updatedCompetitor;
};
export const removeBrandCompetitor = async (brandId: string, competitorId: string): Promise<void> => {
    const brands = await brandApi.getAll();
    const brand = brands.find(b => b.id === brandId);
    if (!brand) throw new Error("Brand not found");
    const updatedCompetitors = brand.competitors.filter(c => c.id !== competitorId);
    await brandApi.update(brandId, { competitors: updatedCompetitors });
};
export const updateBrandIntegration = async (brandId: string, data: { integrationId: string, connected: boolean }): Promise<Integration> => {
    const brands = await brandApi.getAll();
    const brand = brands.find(b => b.id === brandId);
    if (!brand) throw new Error("Brand not found");
    let updatedIntegration: Integration | undefined;
    const updatedIntegrations = brand.integrations.map(i => {
        if (i.id === data.integrationId) {
            updatedIntegration = { ...i, connected: data.connected };
            return updatedIntegration;
        }
        return i;
    });
    await brandApi.update(brandId, { integrations: updatedIntegrations });
    if (!updatedIntegration) throw new Error("Integration not found");
    return updatedIntegration;
};

// Campaigns
export const fetchCampaigns = campaignApi.getAll;
export const addCampaign = campaignApi.add;
export const updateCampaign = campaignApi.update;
export const deleteCampaign = campaignApi.remove;

// Assets
export const fetchAssets = assetApi.getAll;
export const addAsset = (data: Omit<Asset, 'id'|'createdAt'>) => assetApi.add({ ...data, createdAt: new Date().toISOString() });
export const updateAsset = assetApi.update;
export const deleteAsset = assetApi.remove;

// Clients
export const fetchClients = clientApi.getAll;
export const addClient = clientApi.add;
export const updateClient = clientApi.update;
export const deleteClient = clientApi.remove;

// Projects & Tasks
export const fetchProjects = projectApi.getAll;
export const addProject = projectApi.add;
export const updateProject = projectApi.update;
export const deleteProject = projectApi.remove;

export const fetchTasks = taskApi.getAll;
export const addTask = taskApi.add;
export const updateTask = taskApi.update;
export const deleteTask = taskApi.remove;

// Automations
export const fetchAutomations = automationApi.getAll;
export const addAutomation = automationApi.add;
export const updateAutomation = automationApi.update;
export const deleteAutomation = automationApi.remove;

// Influencers
export const fetchInfluencers = influencerApi.getAll;
export const addInfluencer = influencerApi.add;
export const updateInfluencer = influencerApi.update;
export const deleteInfluencer = influencerApi.remove;

// Financials
export const fetchBudgets = budgetApi.getAll;
export const addBudget = budgetApi.add;
export const updateBudget = budgetApi.update;
export const deleteBudget = budgetApi.remove;

export const fetchExpenses = expenseApi.getAll;
export const addExpense = expenseApi.add;
export const updateExpense = expenseApi.update;
export const deleteExpense = expenseApi.remove;

export const fetchInvoices = invoiceApi.getAll;
export const addInvoice = invoiceApi.add;
export const updateInvoice = invoiceApi.update;
export const deleteInvoice = invoiceApi.remove;

// Calendar
export const fetchCalendarEvents = calendarApi.getAll;
export const addCalendarEvent = calendarApi.add;
export const deleteCalendarEvent = calendarApi.remove;

// Goals
export const fetchGoals = goalApi.getAll;
export const addGoal = goalApi.add;
export const updateGoal = goalApi.update;
export const deleteGoal = goalApi.remove;

// Collections
export const fetchCollections = collectionApi.getAll;
export const addCollection = collectionApi.add;
export const deleteCollection = collectionApi.remove;
export const updateCollection = collectionApi.update;