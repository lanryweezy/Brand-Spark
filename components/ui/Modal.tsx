
import React, { useEffect } from 'react';
import { XIcon } from '../../constants';
import { motion } from 'framer-motion';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div 
      className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 flex justify-center items-center transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lifted w-full max-w-lg mx-4 border border-slate-200/80"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-200/80">
          <h2 id="modal-title" className="text-xl font-bold text-brand-text">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200/70 hover:text-slate-600 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Modal;