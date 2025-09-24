
import React, { useState, useMemo } from 'react';
import Card from './ui/Card';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useAutomations } from '../hooks/useAutomations';
import { AutomationWorkflow, AutomationNode } from '../types';
import Button from './ui/Button';
import { PlusIcon, CpuChipIcon, TrashIcon, PencilIcon, LightBulbIcon } from '../constants';
import PageTitle from './ui/PageTitle';
import EmptyState from './ui/EmptyState';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { useToast } from '../hooks/useToast';
import * as geminiService from '../services/geminiService';
import { motion } from 'framer-motion';
import AutomationRecipesModal from './AutomationRecipesModal';

const NodeDisplay: React.FC<{ node: AutomationNode }> = ({ node }) => {
    const colorClasses = {
        trigger: 'bg-green-100 border-green-300 text-green-800',
        action: 'bg-blue-100 border-blue-300 text-blue-800',
        delay: 'bg-yellow-100 border-yellow-300 text-yellow-800',
        condition: 'bg-purple-100 border-purple-300 text-purple-800',
    };

    return (
        <div className={`p-3 rounded-lg border ${colorClasses[node.type]}`}>
            <p className="font-bold text-sm">{node.name}</p>
            <p className="text-xs">{node.description}</p>
        </div>
    );
};

const WorkflowCard: React.FC<{ workflow: AutomationWorkflow, onEdit: () => void, onDelete: () => void }> = ({ workflow, onEdit, onDelete }) => {
    const { updateAutomation } = useAutomations();

    const handleToggle = async () => {
        await updateAutomation(workflow.id, { active: !workflow.active });
    };

    return (
        <Card className="flex flex-col h-full">
            <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-brand-text flex-1 pr-2">{workflow.name}</h3>
                    <label htmlFor={`toggle-${workflow.id}`} className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id={`toggle-${workflow.id}`} className="sr-only" checked={workflow.active} onChange={handleToggle} />
                            <div className={`block w-12 h-6 rounded-full ${workflow.active ? 'bg-brand-primary' : 'bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${workflow.active ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-medium text-slate-600">{workflow.active ? 'Active' : 'Inactive'}</span>
                    </label>
                </div>
                <p className="text-slate-600 mt-2 mb-6 text-sm">{workflow.description}</p>
                
                <div className="space-y-2">
                    <NodeDisplay node={workflow.trigger} />
                    {workflow.steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex justify-center">
                                <div className="w-px h-4 bg-slate-300"></div>
                            </div>
                            <NodeDisplay node={step} />
                        </React.Fragment>
                    ))}
                </div>
            </div>
             <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button size="sm" variant="ghost" onClick={onDelete}><TrashIcon /></Button>
                <Button size="sm" variant="secondary" onClick={onEdit}><PencilIcon className="mr-2"/> Edit</Button>
            </div>
        </Card>
    );
};

const AutomationFormModal: React.FC<{ workflow: AutomationWorkflow | null; onClose: () => void; }> = ({ workflow, onClose }) => {
    const { addAutomation, updateAutomation } = useAutomations();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const [name, setName] = useState(workflow?.name || '');
    const [description, setDescription] = useState(workflow?.description || '');
    const [aiGoal, setAiGoal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    
    // For simplicity, trigger and steps are not fully editable in this UI
    const [trigger, setTrigger] = useState(workflow?.trigger);
    const [steps, setSteps] = useState(workflow?.steps);

    const handleGenerateRecipe = async () => {
        if (!currentBrand || !aiGoal) return;
        setIsGenerating(true);
        try {
            const recipe = await geminiService.generateAutomationWorkflow({ brandId: currentBrand.id, goal: aiGoal });
            setName(recipe.name);
            setDescription(recipe.description);
            setTrigger(recipe.trigger);
            setSteps(recipe.steps);
            addToast('AI recipe generated!', 'success');
        } catch (error) {
            addToast('Failed to generate recipe.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentBrand || !name || !trigger || !steps) {
            addToast("Workflow is incomplete.", "error");
            return;
        };

        const workflowData = { brandId: currentBrand.id, name, description, trigger, steps, active: workflow?.active ?? true };
        
        try {
            if (workflow) {
                await updateAutomation(workflow.id, workflowData);
                addToast('Workflow updated!', 'success');
            } else {
                await addAutomation(workflowData);
                addToast('Workflow created!', 'success');
            }
            onClose();
        } catch (error) {
            addToast(`Error saving workflow: ${error}`, 'error');
        }
    };

    return (
        <Modal title={workflow ? "Edit Workflow" : "Create New Workflow"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="p-4 bg-brand-primary-light rounded-lg space-y-3">
                     <h4 className="font-bold text-brand-primary">Generate with AI</h4>
                     <Textarea id="ai-goal" label="Describe your goal" value={aiGoal} onChange={e => setAiGoal(e.target.value)} placeholder="e.g., Welcome new customers after a purchase." />
                     <Button type="button" onClick={handleGenerateRecipe} isLoading={isGenerating}>
                         <LightBulbIcon className="mr-2"/>
                         {isGenerating ? 'Generating...' : 'Generate Recipe'}
                     </Button>
                 </div>
                <Input id="name" label="Workflow Name" value={name} onChange={e => setName(e.target.value)} required />
                <Textarea id="description" label="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                
                {/* Display generated nodes; editing is out of scope for this UI */}
                {(trigger || (steps && steps.length > 0)) && (
                    <div className="space-y-2 pt-2">
                        {trigger && <NodeDisplay node={trigger} />}
                        {steps?.map((step, i) => (
                            <React.Fragment key={i}>
                                 <div className="flex justify-center">
                                    <div className="w-px h-4 bg-slate-300"></div>
                                </div>
                                <NodeDisplay key={step.id} node={step} />
                            </React.Fragment>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-end gap-2 pt-6 border-t mt-4">
                    <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{workflow ? 'Save Changes' : 'Create Workflow'}</Button>
                </div>
            </form>
        </Modal>
    );
};

const Automation: React.FC = () => {
    const { currentBrand } = useCurrentBrand();
    const { brandAutomations, deleteAutomation } = useAutomations();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRecipesModalOpen, setIsRecipesModalOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<AutomationWorkflow | null>(null);

    const openModal = (workflow: AutomationWorkflow | null = null) => {
        setEditingWorkflow(workflow);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setEditingWorkflow(null);
        setIsModalOpen(false);
    };
    const handleDelete = async (workflowId: string) => {
        if (window.confirm("Are you sure you want to delete this workflow?")) {
            await deleteAutomation(workflowId);
            addToast("Workflow deleted.", "info");
        }
    }
    
    return (
        <div>
            <PageTitle
                title="Automation Engine"
                subtitle="Build automated marketing workflows to save time."
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" onClick={() => setIsRecipesModalOpen(true)} disabled={!currentBrand}>
                            <LightBulbIcon className="w-4 h-4 mr-2" /> AI Recipes
                        </Button>
                        <Button onClick={() => openModal()} disabled={!currentBrand}>
                            <PlusIcon className="-ml-1 mr-2" /> New Workflow
                        </Button>
                    </div>
                }
            />
            
             {currentBrand ? (
                brandAutomations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {brandAutomations.map(workflow => (
                            <motion.div
                                key={workflow.id}
                                className="transition-transform duration-300 h-full"
                            >
                                <WorkflowCard 
                                    workflow={workflow} 
                                    onEdit={() => openModal(workflow)}
                                    onDelete={() => handleDelete(workflow.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                     <EmptyState 
                        icon={<CpuChipIcon />}
                        title="No Automations Created"
                        message="Create your first workflow or use the AI Recipe book to get started."
                        action={<Button onClick={() => openModal()}>Create New Workflow</Button>}
                     />
                 )
             ) : (
                <EmptyState 
                    icon={<CpuChipIcon />}
                    title="Select a Brand"
                    message="Please select a brand to manage its automations."
                />
             )}

             {isModalOpen && (
                <AutomationFormModal workflow={editingWorkflow} onClose={closeModal} />
             )}

             {isRecipesModalOpen && <AutomationRecipesModal onClose={() => setIsRecipesModalOpen(false)} />}
        </div>
    );
};

export default Automation;
