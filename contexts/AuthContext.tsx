
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    signInWithPopup, 
    signOut, 
    updateProfile, 
    sendPasswordResetEmail, 
    deleteUser,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    type User 
} from "firebase/auth";
import { auth, googleProvider, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
    currentUser: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signOutUser: () => Promise<void>;
    updateUserProfile: (displayName: string) => Promise<void>;
    sendPasswordReset: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    const signInWithGoogle = async () => {
        try {
            setAuthLoading(true);
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google: ", error);
            const errorCode = error.code;
            if (errorCode === 'auth/cancelled-popup-request') {
                // User cancelled — swallow silently
                return;
            }
            throw error; // re-throw so UI can display the error
        } finally {
            setAuthLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setAuthLoading(true);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("Error signing in with email: ", error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        try {
            setAuthLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error("Error signing up with email: ", error);
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const updateUserProfile = async (displayName: string) => {
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { displayName });
            // The auth.currentUser object is mutated. To trigger a React re-render,
            // we need to update our state with a new object reference.
            // NOTE: Spreading the user object is not ideal as it loses methods,
            // but for displaying basic info (displayName, email, photoURL) it works.
            setCurrentUser({ ...auth.currentUser } as User);
        }
    };

    const sendPasswordReset = async () => {
        if (auth.currentUser?.email) {
            try {
                await sendPasswordResetEmail(auth, auth.currentUser.email);
                alert("Password reset email sent successfully!");
            } catch (error: any) {
                console.error("Error sending password reset email: ", error);
                alert(`Failed to send email: ${error.message}`);
            }
        } else {
            alert("Could not send password reset email. User has no associated email address.");
        }
    };

    const deleteAccount = async () => {
        if (auth.currentUser) {
            try {
                await deleteUser(auth.currentUser);
            } catch (error: any) {
                console.error("Error deleting account: ", error);
                if (error.code === 'auth/requires-recent-login') {
                    alert("This is a sensitive operation and requires a recent login. Please sign out and sign back in to delete your account.");
                } else {
                    alert(`Failed to delete account: ${error.message}`);
                }
                throw error; // Re-throw to be caught in component if needed
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        await setDoc(userDocRef, {
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL,
                            createdAt: serverTimestamp(),
                            isPaid: false,
                            hasUsedFreeDownload: false
                        }, { merge: true });
                    }
                } catch (err) {
                    console.error('Failed to sync user doc in Firestore:', err);
                }
            }
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        loading: authLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        updateUserProfile,
        sendPasswordReset,
        deleteAccount,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
