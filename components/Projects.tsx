
import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Select from './ui/Select';
import { Project, Task, SuggestedTask } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, FolderIcon, LightBulbIcon, SparklesIcon } from '../constants';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import { useToast } from '../hooks/useToast';
import * as geminiService from '../services/geminiService';
import IdeaStormModal from './IdeaStormModal';
import { motion } from 'framer-motion';

const ProjectFormModal: React.FC<{
    project: Project | null;
    onClose: () => void;
}> = ({ project, onClose }) => {
    const { addProject, updateProject } = useProjects();
    const { addTask } = useTasks();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const [name, setName] = useState(project?.name || '');
    const [description, setDescription] = useState(project?.description || '');
    const [startDate, setStartDate] = useState(project?.startDate || '');
    const [endDate, setEndDate] = useState(project?.endDate || '');
    const [status, setStatus] = useState<'Planning' | 'In Progress' | 'Completed' | 'On Hold'>(project?.status || 'Planning');
    
    const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<{[key: string]: boolean}>({});
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateTasks = async () => {
        if (!name || !description) {
            addToast('Please provide a name and description first.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const tasks = await geminiService.generateProjectTasks({ name, description });
            setSuggestedTasks(tasks);
            const initialSelection = tasks.reduce((acc, task) => ({ ...acc, [task.title]: true }), {});
            setSelectedTasks(initialSelection);
        } catch (error) {
            addToast('Failed to generate tasks.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTaskSelection = (title: string, isSelected: boolean) => {
        setSelectedTasks(prev => ({ ...prev, [title]: isSelected }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand) return;

        const projectData = { brandId: currentBrand.id, name, description, startDate, endDate, status };

        try {
            if (project) {
                await updateProject(project.id, projectData);
                addToast('Project updated!', 'success');
            } else {
                const newProject = await addProject(projectData); 
                addToast('Project created!', 'success');
                
                const taskPromises = suggestedTasks
                    .filter(task => selectedTasks[task.title])
                    .map(task => addTask({
                        brandId: currentBrand.id,
                        projectId: newProject.id,
                        title: task.title,
                        description: task.description,
                        dueDate: endDate, // Default due date to project end date
                        status: 'To Do',
                    }));

                if (taskPromises.length > 0) {
                    await Promise.all(taskPromises);
                    addToast('Suggested tasks added to the project.', 'info');
                }
            }
            onClose();
        } catch (error) {
            addToast(`Error saving project: ${error}`, 'error');
        }
    };

    return (
        <Modal title={project ? 'Edit Project' : 'Create New Project'} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="name" label="Project Name" value={name} onChange={e => setName(e.target.value)} required />
                <Textarea id="description" label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                <div className="grid grid-cols-2 gap-4">
                    <Input id="startDate" label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    <Input id="endDate" label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                </div>
                <Select id="status" label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                </Select>

                {!project && (
                    <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-bold text-brand-text">AI Task Suggestions</h4>
                        <Button type="button" onClick={handleGenerateTasks} isLoading={isGenerating}>
                            <SparklesIcon className="mr-2" /> Generate Task Ideas
                        </Button>
                        {suggestedTasks.length > 0 && (
                             <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                                {suggestedTasks.map(task => (
                                    <div key={task.title} className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id={`task-${task.title}`}
                                            checked={selectedTasks[task.title] || false}
                                            onChange={(e) => handleTaskSelection(task.title, e.target.checked)}
                                            className="h-4 w-4 mt-1 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        />
                                        <label htmlFor={`task-${task.title}`} className="ml-3 text-sm flex flex-col">
                                            <span className="font-medium text-slate-800">{task.title}</span>
                                            <span className="text-slate-500">{task.description}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{project ? 'Save Changes' : 'Create Project'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const TaskList: React.FC<{ tasks: Task[], onToggle: (taskId: string) => void }> = ({ tasks, onToggle }) => (
    <ul className="space-y-2">
        {tasks.map(task => (
             <li key={task.id} className="flex items-center">
                <input
                    type="checkbox"
                    id={`task-toggle-${task.id}`}
                    checked={task.status === 'Completed'}
                    onChange={() => onToggle(task.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                />
                <label htmlFor={`task-toggle-${task.id}`} className={`ml-3 text-sm ${task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {task.title}
                </label>
            </li>
        ))}
    </ul>
);

const ProjectCard: React.FC<{
    project: Project;
    onEdit: () => void;
    onDelete: () => void;
    onAddTask: () => void;
}> = ({ project, onEdit, onDelete, onAddTask }) => {
    const { getTasksByProjectId, updateTask } = useTasks();
    const tasks = useMemo(() => getTasksByProjectId(project.id), [project.id, getTasksByProjectId]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'Completed').length, [tasks]);
    const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
    
    const handleToggleTask = (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updateTask(taskId, { status: task.status === 'Completed' ? 'In Progress' : 'Completed' });
        }
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-brand-text flex-1 pr-2">{project.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                        {'Planning': 'bg-blue-100 text-blue-800', 'In Progress': 'bg-yellow-100 text-yellow-800', 'Completed': 'bg-green-100 text-green-800', 'On Hold': 'bg-slate-200 text-slate-800'}[project.status]
                    }`}>{project.status}</span>
                </div>
                <p className="text-slate-600 mt-4 text-sm">{project.description}</p>
                
                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center mb-1">
                        <h4 className="font-semibold text-sm">Tasks ({completedTasks}/{tasks.length})</h4>
                         <Button size="sm" variant="ghost" onClick={onAddTask}><PlusIcon className="w-4 h-4 mr-1"/> Add Task</Button>
                    </div>
                    {tasks.length > 0 ? (
                        <>
                            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 mb-3">
                                <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <TaskList tasks={tasks} onToggle={handleToggleTask} />
                        </>
                    ) : (
                        <p className="text-sm text-slate-500 mt-2">No tasks in this project yet.</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button size="sm" variant="ghost" onClick={onDelete}><TrashIcon /></Button>
                <Button size="sm" variant="secondary" onClick={onEdit}><PencilIcon className="mr-2"/> Edit</Button>
            </div>
        </Card>
    );
};

const Projects: React.FC = () => {
    const { brandProjects, deleteProject } = useProjects();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    const { addTask } = useTasks();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskProjectTarget, setTaskProjectTarget] = useState<string>('');
    const [taskTitle, setTaskTitle] = useState('');

    const [isIdeaStormOpen, setIsIdeaStormOpen] = useState(false);

    const openFormModal = (project: Project | null = null) => {
        setEditingProject(project);
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => {
        setEditingProject(null);
        setIsFormModalOpen(false);
    };

    const openTaskModal = (projectId: string) => {
        setTaskProjectTarget(projectId);
        setIsTaskModalOpen(true);
    };
    const closeTaskModal = () => {
        setTaskProjectTarget('');
        setTaskTitle('');
        setIsTaskModalOpen(false);
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand || !taskTitle) return;
        await addTask({
            brandId: currentBrand.id,
            projectId: taskProjectTarget,
            title: taskTitle,
            status: 'To Do',
            dueDate: new Date().toISOString().split('T')[0]
        });
        addToast("Task added!", "success");
        closeTaskModal();
    };

    const handleDelete = async (projectId: string) => {
        if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
            await deleteProject(projectId);
            addToast('Project deleted.', 'info');
        }
    };

    return (
        <div>
            <PageTitle
                title="Projects"
                subtitle="Organize your work into projects and track progress on tasks."
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => setIsIdeaStormOpen(true)} disabled={!currentBrand}>
                            <LightBulbIcon className="w-4 h-4 mr-2" /> Idea Storm
                        </Button>
                        <Button onClick={() => openFormModal()} disabled={!currentBrand}>
                            <PlusIcon className="-ml-1 mr-2" /> New Project
                        </Button>
                    </div>
                }
            />

            {currentBrand ? (
                brandProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {brandProjects.map(project => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="h-full"
                            >
                                <ProjectCard
                                    project={project}
                                    onEdit={() => openFormModal(project)}
                                    onDelete={() => handleDelete(project.id)}
                                    onAddTask={() => openTaskModal(project.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<FolderIcon />}
                        title="No Projects Yet"
                        message="Create your first project to organize your work and start tracking tasks."
                        action={<Button onClick={() => openFormModal()}>Create First Project</Button>}
                    />
                )
            ) : (
                <EmptyState
                    icon={<FolderIcon />}
                    title="Select a Brand"
                    message="Please select a brand to manage its projects."
                />
            )}

            {isFormModalOpen && (
                <ProjectFormModal project={editingProject} onClose={closeFormModal} />
            )}

            {isTaskModalOpen && (
                <Modal title="Add New Task" onClose={closeTaskModal}>
                    <form onSubmit={handleAddTask} className="space-y-4">
                        <Input id="task-title" label="Task Title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="secondary" type="button" onClick={closeTaskModal}>Cancel</Button>
                            <Button type="submit">Add Task</Button>
                        </div>
                    </form>
                </Modal>
            )}

            {isIdeaStormOpen && <IdeaStormModal onClose={() => setIsIdeaStormOpen(false)} />}
        </div>
    );
};

export default Projects;
