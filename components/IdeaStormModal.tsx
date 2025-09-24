import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useToast } from '../hooks/useToast';
import { generateBrainstormIdeas } from '../services/geminiService';
import { BrainstormIdea } from '../types';
import { motion } from 'framer-motion';
import { LightBulbIcon } from '../constants';
import AddTaskFromIdeaModal from './AddTaskFromIdeaModal';

const IdeaCard: React.FC<{ idea: BrainstormIdea, onAddTask: () => void }> = ({ idea, onAddTask }) => {
    const randomRotation = Math.random() * 8 - 4; // between -4 and 4 degrees
    
    const categoryColors = {
        'Practical Task': 'border-blue-300 bg-blue-50',
        'Big Concept': 'border-purple-300 bg-purple-50',
        'Wildcard Idea': 'border-amber-300 bg-amber-50',
    };

    return (
        <motion.div
            className={`p-4 rounded-lg shadow-md border ${categoryColors[idea.category]}`}
            initial={{ opacity: 0, y: 50, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: randomRotation }}
            transition={{ type: 'spring', stiffness: 100 }}
            whileHover={{ scale: 1.05, rotate: 0 }}
        >
            <p className="font-bold text-sm text-brand-text">{idea.text}</p>
            <div className="flex justify-between items-center mt-3">
                <span className="text-xs font-semibold text-slate-500">{idea.category}</span>
                <Button size="sm" variant="secondary" onClick={onAddTask}>Add as Task</Button>
            </div>
        </motion.div>
    );
};


const IdeaStormModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [topic, setTopic] = useState('');
    const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToast();
    const { currentBrand } = useCurrentBrand();

    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [ideaToAddTask, setIdeaToAddTask] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!topic) {
            addToast('Please enter a topic to brainstorm.', 'error');
            return;
        }
        if (!currentBrand) return;

        setIsLoading(true);
        setIdeas([]);
        try {
            const result = await generateBrainstormIdeas(topic);
            setIdeas(result);
        } catch (error) {
            addToast("Failed to generate ideas. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenAddTaskModal = (ideaText: string) => {
        setIdeaToAddTask(ideaText);
        setIsAddTaskModalOpen(true);
    };

    return (
        <>
            <Modal title="Idea Storm" onClose={onClose}>
                <div className="space-y-4">
                    <p className="text-slate-600">Enter a topic and let the AI generate a storm of ideas. Things might get a little messy!</p>
                    <div className="flex gap-2 items-end">
                        <div className="flex-grow">
                             <Input label="Brainstorm Topic" id="idea-topic" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., Marketing our new sneaker line"/>
                        </div>
                        <Button onClick={handleGenerate} isLoading={isLoading}>
                            <LightBulbIcon className="mr-2" />
                            Generate
                        </Button>
                    </div>

                    <div className="mt-6 max-h-[50vh] overflow-y-auto p-4 bg-slate-100 rounded-lg">
                        {isLoading && <p className="text-center p-8">The storm is brewing...</p>}
                        {ideas.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ideas.map((idea, index) => (
                                    <IdeaCard key={index} idea={idea} onAddTask={() => handleOpenAddTaskModal(idea.text)} />
                                ))}
                            </div>
                        )}
                        {!isLoading && ideas.length === 0 && <p className="text-center p-8 text-slate-500">Your ideas will appear here.</p>}
                    </div>
                </div>
            </Modal>
            {isAddTaskModalOpen && ideaToAddTask && (
                <AddTaskFromIdeaModal
                    ideaText={ideaToAddTask}
                    onClose={() => setIsAddTaskModalOpen(false)}
                />
            )}
        </>
    );
};

export default IdeaStormModal;