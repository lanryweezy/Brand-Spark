import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <Modal onClose={onClose} title="Welcome to BrandSpark AI Studio">
      <div className="space-y-4">
        <p className="text-slate-600">Quick tour to get you started:</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700">
          <li><strong>Brand Kit</strong>: set your brand name, audience, and tone.</li>
          <li><strong>AI Studio</strong>: generate social posts, ad copy, emails, and more.</li>
          <li><strong>Calendar</strong>: schedule content and keep your pipeline full.</li>
          <li><strong>Assets</strong>: save generated content for reuse.</li>
        </ul>
        <p className="text-slate-600">Tip: You're likely in Demo Mode — outputs are mocked until you connect the backend.</p>
        <div className="pt-2 flex justify-end">
          <Button onClick={onClose}>Got it</Button>
        </div>
      </div>
    </Modal>
  );
};

export default GuideModal;