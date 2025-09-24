import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import { useProjects } from '../hooks/useProjects';
import { useTasks } from '../hooks/useTasks';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useToast } from '../hooks/useToast';

interface AddTaskFromIdeaModalProps {
    ideaText: string;
    onClose: () => void;
}

const AddTaskFromIdeaModal: React.FC<AddTaskFromIdeaModalProps> = ({ ideaText, onClose }) => {
    const { brandProjects } = useProjects();
    const { addTask } = useTasks();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const [title, setTitle] = useState(ideaText);
    const [projectId, setProjectId] = useState(brandProjects[0]?.id || '');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand || !projectId || !title || !dueDate) {
            addToast('Please fill out all fields.', 'error');
            return;
        }

        addTask({
            brandId: currentBrand.id,
            projectId,
            title,
            description: 'Generated from Idea Storm.',
            dueDate,
            status: 'To Do'
        });

        addToast(`Task "${title}" added to project.`, 'success');
        onClose();
    };

    return (
        <Modal title="Create Task from Idea" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Task Title" id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                
                {brandProjects.length > 0 ? (
                    <Select label="Project" id="project-id" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                        {brandProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Select>
                ) : (
                    <p className="text-red-600 text-sm">No projects found. Please create a project first.</p>
                )}
                
                <Input label="Due Date" id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={brandProjects.length === 0}>Add Task</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTaskFromIdeaModal;