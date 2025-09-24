
import React, { useState } from 'react';
import { ClipboardCopyIcon, CheckIcon } from '../../../constants';

interface CopyButtonProps {
    textToCopy: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Copy to clipboard"
        >
            {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardCopyIcon className="w-5 h-5" />}
        </button>
    );
};

export default CopyButton;
