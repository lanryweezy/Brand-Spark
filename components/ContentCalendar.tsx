
import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { useCalendar } from '../hooks/useCalendar';
import { useTasks } from '../hooks/useTasks';
import { useCampaigns } from '../hooks/useCampaigns';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { ContentCalendarEvent, Task, Campaign, View, CalendarSuggestion } from '../types';
import Modal from './ui/Modal';
import { TrashIcon, PlusIcon, FolderIcon, SparklesIcon } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import { useProjects } from '../hooks/useProjects';
import PageTitle from './ui/PageTitle';
import * as geminiService from '../services/geminiService';
import { useToast } from '../hooks/useToast';

// Combined type for any item that can be displayed
type CalendarItem = 
    | { type: 'content'; data: ContentCalendarEvent }
    | { type: 'task'; data: Task }
    | { type: 'campaign'; data: Campaign };

// Type for the selected item to show in the modal
type SelectedItem = {
    id: string;
    title: string;
    date: string;
} & CalendarItem;


interface ContentCalendarProps {
    setActiveView: (view: View) => void;
}

const ContentCalendar: React.FC<ContentCalendarProps> = ({ setActiveView }) => {
    const { brandEvents, addEvent, deleteEvent } = useCalendar();
    const { brandTasks, addTask, deleteTask } = useTasks();
    const { brandProjects } = useProjects();
    const { brandCampaigns } = useCampaigns();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
    
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [newItemDate, setNewItemDate] = useState<string | null>(null);

    const [isSuggestionsModalOpen, setIsSuggestionsModalOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<CalendarSuggestion[]>([]);
    const [selectedSuggestions, setSelectedSuggestions] = useState<{[key: number]: boolean}>({});
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    // Calendar grid calculation
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const days: Date[] = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const allItemsByDate = useMemo(() => {
        const items: { [key: string]: CalendarItem[] } = {};
        brandEvents.forEach(event => {
            const dateKey = new Date(event.date).toISOString().split('T')[0];
            if (!items[dateKey]) items[dateKey] = [];
            items[dateKey].push({ type: 'content', data: event });
        });
        brandTasks.forEach(task => {
            const dateKey = task.dueDate;
            if (!items[dateKey]) items[dateKey] = [];
            items[dateKey].push({ type: 'task', data: task });
        });
        brandCampaigns.forEach(campaign => {
             for (let d = new Date(campaign.startDate); d <= new Date(campaign.endDate); d.setDate(d.getDate() + 1)) {
                const dateKey = new Date(d).toISOString().split('T')[0];
                if (!items[dateKey]) items[dateKey] = [];
                items[dateKey].push({ type: 'campaign', data: campaign });
            }
        });
        return items;
    }, [brandEvents, brandTasks, brandCampaigns]);
    
    const singleDayItemsByDate = useMemo(() => {
        const items: { [key: string]: SelectedItem[] } = {};
        brandEvents.forEach(event => {
            const dateKey = new Date(event.date).toISOString().split('T')[0];
            if (!items[dateKey]) items[dateKey] = [];
            items[dateKey].push({ id: event.id, date: dateKey, title: event.title, type: 'content', data: event });
        });
        brandTasks.forEach(task => {
            const dateKey = task.dueDate;
            if (!items[dateKey]) items[dateKey] = [];
            items[dateKey].push({ id: task.id, date: dateKey, title: task.title, type: 'task', data: task });
        });
        return items;
    }, [brandEvents, brandTasks]);

    const handleAIAssist = async () => {
        if (!currentBrand) return;
        
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const emptyDates: string[] = [];
        for (let d = firstDayOfMonth; d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            if (!allItemsByDate[dateKey] || allItemsByDate[dateKey].length === 0) {
                emptyDates.push(dateKey);
            }
        }
        
        if (emptyDates.length === 0) {
            addToast("Your calendar is full this month!", "info");
            return;
        }

        setIsLoadingSuggestions(true);
        try {
            const suggestions = await geminiService.generateCalendarSuggestions({ brandId: currentBrand.id, emptyDates });
            setSuggestions(suggestions);
            setSelectedSuggestions(suggestions.reduce((acc, _, index) => ({...acc, [index]: true }), {}));
            setIsSuggestionsModalOpen(true);
        } catch (error) {
            addToast("Could not get AI suggestions. Please try again.", "error");
        } finally {
            setIsLoadingSuggestions(false);
        }
    };
    
    const handleConfirmSuggestions = async () => {
        const promises = suggestions
            .filter((_, index) => selectedSuggestions[index])
            .map(suggestion => addEvent({ ...suggestion, date: new Date(suggestion.date).toISOString() }));

        await Promise.all(promises);
        
        addToast("Suggestions added to your calendar!", "success");
        setIsSuggestionsModalOpen(false);
        setSuggestions([]);
        setSelectedSuggestions({});
    };

    const campaignColors = [
        'bg-teal-500', 'bg-sky-500', 'bg-indigo-500', 'bg-pink-500', 'bg-orange-500'
    ];
    const getCampaignColor = (campaignId: string) => {
        const hash = campaignId.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        return campaignColors[Math.abs(hash) % campaignColors.length];
    }
    
    const openAddItemModal = (date: string) => {
        setNewItemDate(date);
        setIsAddItemModalOpen(true);
    };

    const handleSelectAddItem = (type: 'task' | 'content') => {
        setIsAddItemModalOpen(false);
        if (type === 'task') {
            setIsTaskModalOpen(true); // newItemDate is already set
        } else {
            setActiveView(View.AIStudio);
        }
    };
    
    const TaskForm: React.FC<{ date: string }> = ({ date }) => {
        const [title, setTitle] = useState('');
        const [projectId, setProjectId] = useState<string>('');
        
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!currentBrand) return;
            await addTask({
                brandId: currentBrand.id,
                title,
                projectId: projectId || undefined,
                dueDate: date,
                status: 'To Do',
            });
            setIsTaskModalOpen(false);
            setNewItemDate(null);
        };
        
        return (
             <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="title" label="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
                <Select id="projectId" label="Project (Optional)" value={projectId} onChange={e => setProjectId(e.target.value)}>
                    <option value="">No Project</option>
                    {brandProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </Select>
                 <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Task</Button>
                </div>
            </form>
        );
    };

    const calendarActions = (
        <div className="flex items-center gap-2">
             <Button variant="secondary" onClick={handleAIAssist} isLoading={isLoadingSuggestions} disabled={!currentBrand}>
                <SparklesIcon className="w-4 h-4 mr-2" />
                AI Assist
            </Button>
            <span className="bg-white border border-slate-300 p-1 rounded-md flex items-center">
                <button onClick={() => setViewMode('month')} className={`px-3 py-1 text-sm rounded ${viewMode === 'month' ? 'bg-brand-primary text-white shadow' : 'text-slate-600'}`}>Month</button>
                <button onClick={() => setViewMode('agenda')} className={`px-3 py-1 text-sm rounded ${viewMode === 'agenda' ? 'bg-brand-primary text-white shadow' : 'text-slate-600'}`}>Agenda</button>
            </span>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 rounded-md bg-white border border-slate-300 hover:bg-slate-100 transition-colors">&lt;</button>
            <h3 className="text-xl font-semibold w-32 md:w-48 text-center text-slate-700">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 rounded-md bg-white border border-slate-300 hover:bg-slate-100 transition-colors">&gt;</button>
        </div>
    );

    const AgendaView = () => {
        const sortedItems = Object.entries(allItemsByDate)
            .map(([date, items]) => ({ date, items }))
            .filter(entry => {
                const d = new Date(entry.date + 'T00:00:00');
                return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
            })
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return (
            <div className="space-y-4">
                {sortedItems.length > 0 ? sortedItems.map(({date, items}) => (
                    <div key={date}>
                        <h4 className="font-bold text-lg text-brand-text mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-sm py-2">
                           {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h4>
                        <div className="space-y-2">
                            {items.map(item => (
                                <Card key={item.data.id} className="p-4 flex items-center gap-4">
                                    <span className={`w-2 h-10 rounded-full ${item.type === 'content' ? 'bg-purple-500' : item.type === 'task' ? 'bg-green-500' : getCampaignColor(item.data.id)}`}></span>
                                    <div>
                                        <p className="font-semibold text-brand-text">{'name' in item.data ? item.data.name : item.data.title}</p>
                                        <p className="text-sm text-slate-500 capitalize">{item.type}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )) : (
                    <Card className="text-center py-12">No scheduled items for this month.</Card>
                )}
            </div>
        );
    }
    
    const MonthView = () => (
         <Card className="p-0 overflow-hidden">
            <div className="grid grid-cols-7 bg-slate-50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                    <div key={dayName} className="text-center font-bold py-4 text-sm text-slate-600 border-b border-slate-200">{dayName}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-px bg-slate-200">
                {days.map(d => {
                    const dateKey = d.toISOString().split('T')[0];
                    const todaysItems = singleDayItemsByDate[dateKey] || [];
                    const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                    const isToday = new Date().toISOString().split('T')[0] === dateKey;
                    
                     const todaysCampaigns = brandCampaigns.filter(c => {
                        const start = new Date(c.startDate + "T00:00:00");
                        const end = new Date(c.endDate + "T00:00:00");
                        return d >= start && d <= end;
                    });

                    const getCampaignClasses = (campaign: Campaign) => {
                        const dayOfWeek = d.getDay();
                        const isStart = campaign.startDate === dateKey || dayOfWeek === 0;
                        const isEnd = campaign.endDate === dateKey || dayOfWeek === 6;
                        let classes = 'w-full text-left text-xs p-1.5 font-medium truncate transition-colors text-white ';
                        classes += getCampaignColor(campaign.id);

                        if (isStart && isEnd) return classes + ' rounded-md';
                        if (isStart) return classes + ' rounded-l-md';
                        if (isEnd) return classes + ' rounded-r-md';
                        return classes;
                    };

                    return (
                        <div key={dateKey} className={`relative flex flex-col bg-white p-2 min-h-[140px] transition-colors duration-300 group ${!isCurrentMonth ? 'bg-slate-50/70' : 'hover:bg-slate-50/50'}`}>
                            <time dateTime={dateKey} className={`text-sm font-semibold ${isToday ? 'bg-brand-primary text-white rounded-full flex items-center justify-center h-7 w-7' : ''} ${!isCurrentMonth ? 'text-slate-400' : 'text-slate-900'}`}>
                                {d.getDate()}
                            </time>
                            <button onClick={() => openAddItemModal(dateKey)} className="absolute top-1 right-1 p-1 rounded-full text-slate-400 bg-slate-100 opacity-0 group-hover:opacity-100 hover:bg-brand-primary hover:text-white transition-all">
                                <PlusIcon className="w-4 h-4" />
                            </button>
                            <div className="mt-2 flex-grow overflow-y-auto space-y-1.5">
                                <ul className="space-y-1.5">
                                     {todaysCampaigns.map(campaign => (
                                        <li key={`camp-${campaign.id}`}>
                                            <button 
                                                onClick={() => setSelectedItem({ id: campaign.id, title: campaign.name, date: campaign.startDate, type: 'campaign', data: campaign })}
                                                className={getCampaignClasses(campaign)}
                                            >
                                                {campaign.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="space-y-1.5">
                                {todaysItems.map(item => (
                                    <li key={item.id}>
                                        <button onClick={() => setSelectedItem(item)} className={`w-full text-left text-xs p-1.5 rounded-md font-medium truncate transition-colors ${item.type === 'content' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' : `bg-green-100 text-green-800 hover:bg-green-200 ${ (item.data as Task).status === 'Completed' ? 'line-through opacity-70' : ''}`}`}>
                                            {item.title}
                                        </button>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );

    return (
        <div>
            <PageTitle 
                title="Content Calendar" 
                subtitle="Schedule and visualize your content, tasks, and campaigns."
                actions={calendarActions}
            />
            
            {!currentBrand ? (
                <Card>
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold text-brand-text">Select a Brand</h3>
                        <p className="text-slate-600 mt-2">Please select a brand to view its content calendar.</p>
                    </div>
                </Card>
            ) : (
                viewMode === 'month' ? <MonthView /> : <AgendaView />
            )}
            
            {/* Main Details Modal */}
            {selectedItem && (
                <Modal title={selectedItem.title} onClose={() => setSelectedItem(null)}>
                    <div className="space-y-4">
                        {selectedItem.type === 'content' && (
                            <>
                                <div><p className="text-sm font-medium text-slate-500">Date</p><p className="text-slate-800">{new Date(selectedItem.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                                <div><p className="text-sm font-medium text-slate-500">Content Type</p><p className="text-slate-800">{selectedItem.data.content.type}</p></div>
                                <div><p className="text-sm font-medium text-slate-500">Content</p>
                                    {selectedItem.data.content.imageUrl && <img src={selectedItem.data.content.imageUrl} alt={selectedItem.title} className="my-2 rounded-lg max-h-60 w-auto shadow-md" />}
                                    <p className="text-sm bg-slate-100 p-3 rounded-md whitespace-pre-wrap mt-1">{selectedItem.data.content.text}</p>
                                </div>
                            </>
                        )}
                        {selectedItem.type === 'task' && (
                             <>
                                <div><p className="text-sm font-medium text-slate-500">Due Date</p><p className="text-slate-800">{new Date(selectedItem.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedItem.data.status === 'Completed' ? 'bg-green-100 text-green-800' : selectedItem.data.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {selectedItem.data.status}
                                    </span>
                                </div>
                                {selectedItem.data.description && (
                                    <div><p className="text-sm font-medium text-slate-500">Description</p><p className="text-slate-800">{selectedItem.data.description}</p></div>
                                )}
                            </>
                        )}
                        {selectedItem.type === 'campaign' && (
                             <>
                                <div><p className="text-sm font-medium text-slate-500">Duration</p><p className="text-slate-800">{new Date(selectedItem.data.startDate + 'T00:00:00').toLocaleDateString()} - {new Date(selectedItem.data.endDate + 'T00:00:00').toLocaleDateString()}</p></div>
                                <div><p className="text-sm font-medium text-slate-500">Status</p><p className="text-slate-800">{selectedItem.data.status}</p></div>
                                <div><p className="text-sm font-medium text-slate-500">Description</p><p className="text-slate-800 whitespace-pre-wrap mt-1">{selectedItem.data.description}</p></div>
                            </>
                        )}

                        <div className="flex justify-end pt-4">
                             <button onClick={async () => {
                                if (window.confirm(`Are you sure you want to delete this ${selectedItem.type}?`)) {
                                    if (selectedItem.type === 'content') await deleteEvent(selectedItem.id);
                                    if (selectedItem.type === 'task') await deleteTask(selectedItem.id);
                                    if (selectedItem.type !== 'campaign') setSelectedItem(null);
                                }
                             }} 
                             disabled={selectedItem.type === 'campaign'}
                             className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
                                <TrashIcon className="w-4 h-4 mr-2"/>
                                Delete {selectedItem.type}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* AI Suggestions Modal */}
            {isSuggestionsModalOpen && (
                <Modal title="AI Content Suggestions" onClose={() => setIsSuggestionsModalOpen(false)}>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {suggestions.map((s, i) => (
                             <div key={i} className="flex items-start p-3 rounded-lg bg-slate-50">
                                <input
                                    type="checkbox"
                                    id={`suggestion-${i}`}
                                    checked={!!selectedSuggestions[i]}
                                    onChange={(e) => setSelectedSuggestions(p => ({...p, [i]: e.target.checked}))}
                                    className="h-4 w-4 mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                />
                                <label htmlFor={`suggestion-${i}`} className="ml-3 text-sm">
                                    <p className="font-bold text-brand-text">{s.title}</p>
                                    <p className="text-slate-500">{new Date(s.date + 'T00:00:00').toLocaleDateString()}</p>
                                    <p className="mt-1 text-slate-600">{s.content.text}</p>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                        <Button variant="secondary" onClick={() => setIsSuggestionsModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmSuggestions}>Add to Calendar</Button>
                    </div>
                </Modal>
            )}

            {/* Add Item Choice Modal */}
            {isAddItemModalOpen && newItemDate && (
                <Modal title={`Add to ${new Date(newItemDate + 'T00:00:00').toLocaleDateString()}`} onClose={() => setIsAddItemModalOpen(false)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => handleSelectAddItem('task')} className="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                            <FolderIcon className="mx-auto h-10 w-10 text-slate-500"/>
                            <h3 className="mt-2 font-semibold text-brand-text">Create New Task</h3>
                            <p className="text-sm text-slate-500">Add a to-do item for this day.</p>
                        </button>
                         <button onClick={() => handleSelectAddItem('content')} className="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-brand-primary hover:bg-brand-primary/5 transition-all">
                            <SparklesIcon className="mx-auto h-10 w-10 text-slate-500"/>
                            <h3 className="mt-2 font-semibold text-brand-text">Generate Content</h3>
                            <p className="text-sm text-slate-500">Go to the AI Studio to create content.</p>
                        </button>
                    </div>
                </Modal>
            )}
            
            {/* New Task Form Modal */}
            {isTaskModalOpen && newItemDate && (
                <Modal title={`Add new task for ${new Date(newItemDate + 'T00:00:00').toLocaleDateString()}`} onClose={() => setIsTaskModalOpen(false)}>
                    <TaskForm date={newItemDate} />
                </Modal>
            )}
        </div>
    );
};

export default ContentCalendar;
