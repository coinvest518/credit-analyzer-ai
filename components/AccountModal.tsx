
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SpinnerIcon } from './icons/Icons';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, updateUserProfile, sendPasswordReset, deleteAccount } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '');
        }
    }, [currentUser, isOpen]);

    if (!isOpen || !currentUser) {
        return null;
    }

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (displayName.trim() && displayName !== currentUser.displayName) {
            setIsSaving(true);
            try {
                await updateUserProfile(displayName.trim());
            } catch (error) {
                console.error("Failed to update profile", error);
                alert("Failed to update profile.");
            } finally {
                setIsSaving(false);
            }
        }
    };
    
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
            setIsDeleting(true);
            try {
                await deleteAccount();
                onClose(); 
            } catch (error) {
                // Error is already alerted in AuthContext
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const isGoogleProvider = currentUser.providerData.some(p => p.providerId === 'google.com');

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
        >
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-md shadow-2xl p-6 md:p-8 relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl leading-none"
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <div className="flex flex-col items-center text-center">
                    {currentUser.photoURL && <img src={currentUser.photoURL} alt="User avatar" className="w-24 h-24 rounded-full border-4 border-gray-600 mb-4" />}
                    <h2 id="account-modal-title" className="text-2xl font-bold text-white break-all">{currentUser.displayName}</h2>
                    <p className="text-gray-400 break-all">{currentUser.email}</p>
                </div>
                
                <div className="my-6 border-t border-dashed border-gray-600"></div>

                <form onSubmit={handleSaveName} className="space-y-4">
                    <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
                        <input type="text" id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500" />
                    </div>
                     <button type="submit" disabled={isSaving || displayName === (currentUser.displayName || '')} className="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSaving ? <><SpinnerIcon className="w-5 h-5 mr-2 animate-spin" /> Saving...</> : 'Save Changes'}
                    </button>
                </form>

                <div className="mt-6 space-y-3">
                     <button onClick={sendPasswordReset} disabled={isGoogleProvider} title={isGoogleProvider ? "Password management is handled by your Google account" : "Send password reset email"} className="w-full text-center px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">Send Password Reset Email</button>
                     <button onClick={handleDelete} disabled={isDeleting} className="w-full text-center px-4 py-2 bg-red-800 text-red-100 font-semibold rounded-lg hover:bg-red-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-wait">
                         {isDeleting ? <><SpinnerIcon className="w-5 h-5 mr-2 animate-spin" /> Deleting...</> : 'Delete Account'}
                     </button>
                </div>
                
            </div>
             <style>{`
                @keyframes fade-in-fast {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                .animate-fade-in-fast {
                  animation: fade-in-fast 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
