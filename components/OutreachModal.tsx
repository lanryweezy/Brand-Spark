
import React, { useState } from 'react';
import Modal from './ui/Modal';
import { Influencer, InfluencerOutreach } from '../types';
import { generateInfluencerOutreach } from '../services/geminiService';
import { useCurrentBrand } from '../hooks/useCurrentBrand';
import { useToast } from '../hooks/useToast';
import Input from './ui/Input';
import Button from './ui/Button';
import CopyButton from './studio/common/CopyButton';

interface OutreachModalProps {
    influencer: Influencer;
    onClose: () => void;
}

const OutreachModal: React.FC<OutreachModalProps> = ({ influencer, onClose }) => {
    const [goal, setGoal] = useState('');
    const [message, setMessage] = useState<InfluencerOutreach | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();

    const handleGenerate = async () => {
        if (!currentBrand) {
            addToast("Please select a brand.", 'error');
            return;
        }
        if (!goal) {
            addToast("Please specify a goal for your outreach.", 'error');
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            const result = await generateInfluencerOutreach(currentBrand, influencer, goal);
            setMessage(result);
            addToast("Outreach message drafted!", 'success');
        } catch (error) {
            addToast("Could not draft message. Please try again.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal title={`Draft Outreach for ${influencer.name}`} onClose={onClose}>
            <div className="space-y-4">
                <p className="text-sm text-slate-500">Specify your goal and let the AI draft a personalized outreach message.</p>
                <div className="flex gap-2 items-end">
                    <div className="flex-grow">
                        <Input 
                            label="Outreach Goal"
                            id="outreach-goal"
                            value={goal}
                            onChange={e => setGoal(e.target.value)}
                            placeholder="e.g., Paid collaboration for new product"
                        />
                    </div>
                    <Button onClick={handleGenerate} isLoading={isLoading}>Generate</Button>
                </div>

                {isLoading && (
                    <div className="text-center p-8">
                        <p>Drafting your personalized message...</p>
                    </div>
                )}
                
                {message && (
                    <div className="space-y-4 pt-4 mt-4 border-t">
                        <div className="relative">
                            <h4 className="text-sm font-bold text-slate-700 mb-1">Subject</h4>
                            <p className="p-3 bg-slate-100 rounded-md text-sm">{message.subject}</p>
                            <CopyButton textToCopy={message.subject} />
                        </div>
                        <div className="relative">
                             <h4 className="text-sm font-bold text-slate-700 mb-1">Body</h4>
                            <div className="p-3 bg-slate-100 rounded-md text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">{message.body}</div>
                            <CopyButton textToCopy={message.body} />
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default OutreachModal;
