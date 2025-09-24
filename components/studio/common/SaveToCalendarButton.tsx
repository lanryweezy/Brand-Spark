
import React, { useState } from 'react';
import { useCalendar } from '../../../hooks/useCalendar';
import { GeneratedContentType } from '../../../types';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import { CalendarPlusIcon } from '../../../constants';
import { useToast } from '../../../hooks/useToast';
import { useCurrentBrand } from '../../../hooks/useCurrentBrand';

interface SaveToCalendarButtonProps {
    title: string;
    content: string;
    type: GeneratedContentType;
    imageUrl?: string;
}

const SaveToCalendarButton: React.FC<SaveToCalendarButtonProps> = ({ title, content, type, imageUrl }) => {
    const { addEvent } = useCalendar();
    const { currentBrand } = useCurrentBrand();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState(title);
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSaved, setIsSaved] = useState(false);

    const handleOpenModal = () => {
        if (!currentBrand) {
            addToast('Please select a brand first.', 'error');
            return;
        }
        setIsModalOpen(true);
    }

    const handleSave = async () => {
        if (!eventDate || !eventTitle) {
            addToast('Please provide a date and title.', 'error');
            return;
        }

        try {
            await addEvent({
                date: new Date(eventDate).toISOString(),
                title: eventTitle,
                content: {
                    type,
                    text: content,
                    imageUrl,
                },
            });
            
            setIsModalOpen(false);
            addToast('Saved to calendar!', 'success');
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2500);
        } catch (error) {
            addToast(`Error saving to calendar: ${error}`, 'error');
        }
    };

    return (
        <>
            <Button onClick={handleOpenModal} disabled={isSaved} variant="secondary" size="sm">
                 <CalendarPlusIcon className="mr-2" />
                {isSaved ? 'Added to Calendar!' : 'Add to Calendar'}
            </Button>

            {isModalOpen && (
                <Modal title="Add to Content Calendar" onClose={() => setIsModalOpen(false)}>
                    <div className="space-y-4">
                        <Input 
                            id="eventTitle" 
                            label="Event Title" 
                            value={eventTitle} 
                            onChange={e => setEventTitle(e.target.value)} 
                        />
                        <Input 
                            id="eventDate" 
                            label="Date" 
                            type="date"
                            value={eventDate} 
                            onChange={e => setEventDate(e.target.value)} 
                        />
                         <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="button" onClick={handleSave}>Save Event</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default SaveToCalendarButton;
