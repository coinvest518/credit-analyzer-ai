
import React from 'react';
import { SpinnerIcon } from './icons/Icons';

export const FullPageSpinner: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <SpinnerIcon className="w-12 h-12 text-cyan-400 animate-spin" />
        </div>
    );
};
