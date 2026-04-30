
import React, { useState, useMemo } from 'react';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import Card from './ui/Card';
import Button from './ui/Button';
import { useGoals } from '../hooks/useGoals';
import { Goal, View } from '../types';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import { SparklesIcon, LayoutDashboardIcon, PlusIcon, TrashIcon, LightBulbIcon, CheckBadgeIcon, RocketLaunchIcon, FolderIcon, MegaphoneIcon, BriefcaseIcon } from '../constants';
import { useAssets } from '../hooks/useAssets';
import { useCampaigns } from '../hooks/useCampaigns';
import Modal from './ui/Modal';
import Input from './ui/Input';
import { useToast } from '../hooks/useToast';
import * as geminiService from '../services/geminiService';
import { motion } from 'framer-motion';
import { useTasks } from '../hooks/useTasks';
import { useClients } from '../hooks/useClients';
import KpiCard from './ui/KpiCard';

const GoalCard: React.FC<{ goal: Goal }> = ({ goal }) => {
    const { toggleSubTask, deleteGoal } = useGoals();
    const completedTasks = goal.subTasks.filter(st => st.completed).length;
    const progress = goal.subTasks.length > 0 ? (completedTasks / goal.subTasks.length) * 100 : 0;
    const isCompleted = progress === 100 && goal.subTasks.length > 0;

    return (
        <Card className="relative overflow-hidden group">
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3 flex-grow min-w-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <CheckBadgeIcon className="w-5 h-5 text-indigo-500" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 truncate">{goal.title}</h3>
                    {isCompleted && (
                        <span className="flex-shrink-0 flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-sm">
                            <CheckBadgeIcon className="w-3.5 h-3.5 mr-1"/>
                            Completed
                        </span>
                    )}
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="flex-shrink-0 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
            <div className="mt-6">
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                    <span className="uppercase tracking-wider">Progress</span>
                    <span>{Math.round(progress)}% ({completedTasks}/{goal.subTasks.length})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-brand-primary to-indigo-400 h-2.5 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <ul className="mt-6 space-y-3">
                {goal.subTasks.map(st => (
                    <li key={st.id} className="flex items-start group/item">
                        <div className="flex items-center h-5 mt-0.5">
                            <input
                                type="checkbox"
                                id={`subtask-${st.id}`}
                                checked={st.completed}
                                onChange={() => toggleSubTask(goal.id, st.id)}
                                className="h-4.5 w-4.5 rounded text-brand-primary border-slate-300 focus:ring-brand-primary focus:ring-offset-2 transition-colors cursor-pointer"
                            />
                        </div>
                        <label
                            htmlFor={`subtask-${st.id}`}
                            className={`ml-3 text-sm leading-relaxed cursor-pointer transition-all duration-200 ${
                                st.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover/item:text-slate-900'
                            }`}
                        >
                            {st.text}
                        </label>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

const AddGoalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addGoal } = useGoals();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand) return;
        setIsLoading(true);
        try {
            const subTasksRaw = await geminiService.generateGoalBreakdown({ brandId: currentBrand.id, goal: title });
            const subTasks = subTasksRaw.map(st => ({
                id: `st-${Date.now()}-${Math.random()}`,
                text: st.text,
                completed: false
            }));

            await addGoal({
                brandId: currentBrand.id,
                title,
                subTasks
            });
            addToast("New goal with AI sub-tasks created!", "success");
            onClose();
        } catch (error) {
            addToast("Failed to generate sub-tasks. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Modal title="Add New Strategic Goal" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-600">Enter a high-level goal, and our AI will break it down into actionable sub-tasks for you.</p>
                <Input label="Goal Title" id="goal-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Increase Q4 lead generation by 20%" required/>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" isLoading={isLoading}><LightBulbIcon className="mr-2" /> Create with AI</Button>
                </div>
            </form>
        </Modal>
    );
};

const Dashboard: React.FC<{setActiveView: (view: View) => void}> = ({setActiveView}) => {
    const { currentBrand } = useCurrentBrand();
    const { brandGoals } = useGoals();
    const { brandAssets } = useAssets();
    const { brandCampaigns } = useCampaigns();
    const { brandTasks } = useTasks();
    const { clients } = useClients();
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    const activeCampaigns = useMemo(() => brandCampaigns.filter(c => c.status === 'Active').length, [brandCampaigns]);
    const tasksInProgress = useMemo(() => brandTasks.filter(t => t.status === 'In Progress').length, [brandTasks]);
    const totalClients = useMemo(() => clients.length, [clients]);
    const totalAssets = useMemo(() => brandAssets.length, [brandAssets]);

    const recentActivity = useMemo(() => {
        const assets = brandAssets.map(a => ({...a, type: 'asset', date: a.createdAt}));
        const campaigns = brandCampaigns.map(c => ({...c, type: 'campaign', date: c.startDate}));
        return [...assets, ...campaigns]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [brandAssets, brandCampaigns]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
    };

    const QuickStartButton: React.FC<{title: string, subtitle: string, icon: React.ReactNode, onClick: () => void}> = ({ title, subtitle, icon, onClick }) => (
        <motion.div variants={itemVariants}>
            <button
                onClick={onClick}
                className="w-full text-left p-4 bg-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-brand-primary/5 hover:-translate-y-1 border border-slate-100 hover:border-brand-primary/20 flex items-center gap-4 group"
            >
                <div className="w-12 h-12 rounded-lg bg-indigo-50/50 flex items-center justify-center text-indigo-500 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                    <div className="w-6 h-6">
                        {icon}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">{title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                </div>
            </button>
        </motion.div>
    );
    
    return (
        <div>
            <PageTitle
                title={currentBrand ? `Welcome, ${currentBrand.name}!` : 'Welcome to BrandSpark!'}
                subtitle={currentBrand ? 'Here is your mission control overview.' : 'Create or select a brand to get started.'}
            />
            
            {currentBrand ? (
                <div className="space-y-8">
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div variants={itemVariants}>
                            <KpiCard title="Total Clients" value={String(totalClients)} icon={<BriefcaseIcon />} color="text-purple-500" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <KpiCard title="Active Campaigns" value={String(activeCampaigns)} icon={<RocketLaunchIcon />} color="text-green-500" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <KpiCard title="Tasks In Progress" value={String(tasksInProgress)} icon={<FolderIcon />} color="text-yellow-500" />
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <KpiCard title="Total Assets" value={String(totalAssets)} icon={<MegaphoneIcon />} color="text-blue-500" />
                        </motion.div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main content: Goals */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-brand-text">Strategic Goals</h2>
                                <Button onClick={() => setIsGoalModalOpen(true)}>
                                    <PlusIcon className="mr-2" /> Add Goal
                                </Button>
                            </div>
                            {brandGoals.length > 0 ? (
                                 <motion.div 
                                    className="space-y-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                 >
                                    {brandGoals.map(goal => (
                                        <motion.div key={goal.id} variants={itemVariants}>
                                            <GoalCard goal={goal} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-4">
                                        <LightBulbIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No goals set yet.</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mb-6">Set a high-level goal and our AI will break it down into actionable sub-tasks.</p>
                                    <Button onClick={() => setIsGoalModalOpen(true)}>
                                        <PlusIcon className="mr-2" /> Add Your First Goal
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right sidebar: Quick actions and activity */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text mb-4">Quick Start</h2>
                                 <motion.div 
                                    className="space-y-3"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                 >
                                    <QuickStartButton icon={<SparklesIcon />} title="Generate Content" subtitle="Go to the AI Studio" onClick={() => setActiveView(View.AIStudio)} />
                                    <QuickStartButton icon={<RocketLaunchIcon />} title="Plan a Campaign" subtitle="Open the Campaign Planner" onClick={() => setActiveView(View.CampaignPlanner)} />
                                    <QuickStartButton icon={<LayoutDashboardIcon />} title="View Calendar" subtitle="See your content schedule" onClick={() => setActiveView(View.ContentCalendar)} />
                                </motion.div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text mb-4">Recent Activity</h2>
                                <Card className="p-1">
                                    {recentActivity.length > 0 ? (
                                         <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                                            {recentActivity.map(item => (
                                                <li key={item.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-lg">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'campaign' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {item.type === 'campaign' ? <RocketLaunchIcon className="w-5 h-5" /> : <MegaphoneIcon className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 capitalize">{item.type} • {new Date(item.date).toLocaleDateString()}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                                                <FolderIcon className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <EmptyState
                    icon={<LayoutDashboardIcon />}
                    title="No Brand Selected"
                    message="Please select a brand from the header dropdown or create a new one to get started."
                />
            )}
            {isGoalModalOpen && <AddGoalModal onClose={() => setIsGoalModalOpen(false)} />}
        </div>
    );
}

export default Dashboard;
