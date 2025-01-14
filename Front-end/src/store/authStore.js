import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth';

export const useAuthenticationStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,

    signup: async (email, password, username) => { // Update 'name' to 'username'
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, username }); // Match with backend
            const token = response.data.token;
            localStorage.setItem('authToken', token); // Store token in localStorage
            set({ user: response.data.user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error signing up', isLoading: false });
            throw error;
        }
    },
    

    login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signin`, { username, password });
            const token = response.data.token;
    
            // Store the token in localStorage
            localStorage.setItem('authToken', token);
    
            // Update the store state
            set({
                user: { username }, // Populate user manually or remove if not needed
                token,
                isAuthenticated: true,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error logging in', isLoading: false });
            throw error;
        }
    },
    

    logout: () => {
        localStorage.removeItem('authToken'); // Clear token from localStorage
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            set({ isAuthenticated: false, user: null });
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/user-check-auth`, {
                headers: { Authorization: token },
            });
            set({ user: response.data.user, token, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('authToken'); // Remove invalid token
            set({ isAuthenticated: false, user: null });
        }
    },
}));
