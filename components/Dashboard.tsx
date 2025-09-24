
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
        <Card>
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                    <h3 className="font-bold text-lg text-brand-text truncate">{goal.title}</h3>
                    {isCompleted && (
                        <span className="flex-shrink-0 flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-accent text-white">
                            <CheckBadgeIcon className="w-4 h-4 mr-1"/>
                            Completed!
                        </span>
                    )}
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="flex-shrink-0 p-1 text-slate-400 hover:text-red-500 rounded-full"><TrashIcon className="w-4 h-4" /></button>
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{completedTasks} / {goal.subTasks.length} Completed</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-brand-primary h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <ul className="mt-4 space-y-2">
                {goal.subTasks.map(st => (
                    <li key={st.id} className="flex items-center">
                        <input
                            type="checkbox"
                            id={`subtask-${st.id}`}
                            checked={st.completed}
                            onChange={() => toggleSubTask(goal.id, st.id)}
                            className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                        />
                        <label htmlFor={`subtask-${st.id}`} className={`ml-3 text-sm ${st.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
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

    const QuickStartButton: React.FC<{title: string, subtitle: string, onClick: () => void}> = ({ title, subtitle, onClick }) => (
        <motion.div variants={itemVariants}>
            <button onClick={onClick} className="w-full text-left p-4 bg-slate-50 rounded-lg transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-1 border border-transparent hover:border-slate-200">
                <h4 className="font-bold text-brand-text">{title}</h4>
                <p className="text-sm text-slate-500">{subtitle}</p>
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
                                <div className="text-center py-16 bg-slate-50 rounded-lg">
                                    <h3 className="text-lg font-semibold">No goals set yet.</h3>
                                    <p className="text-slate-500 mt-1">Set a high-level goal to get started.</p>
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
                                    <QuickStartButton title="Generate Content" subtitle="Go to the AI Studio" onClick={() => setActiveView(View.AIStudio)} />
                                    <QuickStartButton title="Plan a Campaign" subtitle="Open the Campaign Planner" onClick={() => setActiveView(View.CampaignPlanner)} />
                                    <QuickStartButton title="View Calendar" subtitle="See your content schedule" onClick={() => setActiveView(View.ContentCalendar)} />
                                </motion.div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-text mb-4">Recent Activity</h2>
                                <Card className="p-4">
                                    {recentActivity.length > 0 ? (
                                         <ul className="space-y-3">
                                            {recentActivity.map(item => (
                                                <li key={item.id} className="text-sm">
                                                    <span className="font-semibold text-brand-text">{item.name}</span>
                                                    <span className="text-slate-500"> was created. ({item.type})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
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
