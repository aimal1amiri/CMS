import { create } from 'zustand';
import axios from 'axios';
import dotenv from 'dotenv'
import toast from 'react-hot-toast';




const API_URL = process.env.NODE_ENV === 'production' ? `https://cms-72aj.onrender.com/api/v1/auth` : 'http://localhost:3000/api/v1/auth';
//console.log(API_URL)



export const useAuthenticationStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,

    signup: async (email, password, username) => { 
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, username }); 
            console.log("signin response:" ,response)
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
            console.log(API_URL)
            const response = await axios.post(`${API_URL}/signin`, { username, password },{ withCredentials: true });
            
            const token = response.data.token;
    
            
            localStorage.setItem('authToken', token);
    
            
            set({
                user: { username }, 
                token,
                isAuthenticated: true,
                error: null,
                isLoading: false,
            });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error logging in', isLoading: false });
            toast.error(error.response?.data?.message)
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
                withCredentials: true, 
            });
            set({ user: response.data.user, token, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('authToken'); // Remove invalid token
            set({ isAuthenticated: false, user: null });
        }
    },
}));
