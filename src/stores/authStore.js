import { create } from 'zustand';
import {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    logOut,
    resetPassword,
    onAuthChange,
    getUserData,
} from '../services/firebase';

export const useAuthStore = create((set, get) => ({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,

    // Initialize auth listener
    initAuth: () => {
        onAuthChange(async (user) => {
            if (user) {
                // Fetch additional user data from Firestore
                const userData = await getUserData(user.uid);
                
                set({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: userData?.displayName || user.displayName,
                        photoURL: userData?.photoURL || user.photoURL,
                    },
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        });
    },

    // Login with email/password
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await signInWithEmail(email, password);
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Login with Google
    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            await signInWithGoogle();
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Sign up
    signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            await signUpWithEmail(email, password, name);
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Logout
    logout: async () => {
        try {
            await logOut();
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    // Reset password
    sendPasswordReset: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await resetPassword(email);
            set({ isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Clear error
    clearError: () => set({ error: null }),
}));
