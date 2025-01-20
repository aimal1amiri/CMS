import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import dotenv from 'dotenv'



const mode = process.env.NODE_ENV
const API_URL = mode === 'production' ? `https://cms-72aj.onrender.com/api/v1/data` : 'http://localhost:3000/api/v1/data';

export const useDataStore = create((set) => ({
  searchResults: [], // Data fetched from the backend
  isLoading: false, // Loading state
  
  pagination: {
    currentPage: 1,
    itemsPerPage: 13, // Default limit is now 15
    totalItems: 0, // Total number of matching items
    totalPages: 0, // Total pages based on itemsPerPage
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: token } : {};
  },

  // Fetch data from the backend
  fetchSearchResults: async (searchQuery = "", page = 1, limit = 13) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: {
          search: searchQuery,
          page,
          limit,
        },
      });

      console.log(response);

      if (response.data.success) {
        const { data, pagination } = response.data;

        set({
          searchResults: data,
          pagination: {
            ...pagination,
            totalPages: Math.ceil(pagination.totalItems / pagination.itemsPerPage), // Calculate total pages
          },
          isLoading: false,
          error: null,
        });
      } else {
        set({
          searchResults: [],
          isLoading: false,
          
        });
        toast.error("No results found.")
      }
    } catch (error) {
      set({
        searchResults: [],
        isLoading: false,
        
      });
      toast.error("Error fetching data.")
    }
  },

  updateRecord: async (id, updatedData) => {
    set({ isLoading: true});

    try {
      const response = await axios.put(
        `${API_URL}/update/${id}`,
        updatedData,
        { headers: useDataStore.getState().getAuthHeaders() }
      );

      if (response.data.success) {
        set({
          isLoading: false,
          error: null,
          
        });
        toast.success(response.data.message)

        // Optionally: Update the local state for the record
        set((state) => ({
          searchResults: state.searchResults.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
          ),
        }));
      }
    } catch (error) {
      set({
        isLoading: false,
         
        
      });
      toast.error(error.response?.data?.message || "Failed to update the record.",)
    }
  },

  fetchFilteredResults: async (filters = {}, page = 1, limit = 13) => {
    set({ isLoading: true });

    try {
      // Send filters and pagination parameters
      const response = await axios.get(`${API_URL}/filter`, {
        params: { ...filters, page, limit },
      });

      if (response.data.success) {
        const { data, pagination } = response.data;

        set({
          searchResults: data,
          pagination: {
            ...pagination,
            currentPage: pagination.current || page,
            itemsPerPage: pagination.itemsPerPage || limit,
            totalItems: pagination.totalItems || 0,
            totalPages: pagination.totalPages || 1,
          },
          isLoading: false,
          error: null,
        });
      } else {
        set({
          searchResults: [],
          isLoading: false,
          
        });
        toast.error(response.data.message || "No results found.")
      }
    } catch (error) {
      set({
        searchResults: [],
        isLoading: false,
        
      });
      toast.error(error.response?.data?.message || "Error fetching filtered results.")
    }
  },

  
  populateDatabase: async (jsonUrl) => {
    set({ isLoading: true });

    try {
      //console.log("jsonURL:",jsonUrl)
      const response = await axios.post(
        `${API_URL}/populate`,
        { jsonUrl },
        { headers: useDataStore.getState().getAuthHeaders() }
      );
      //console.log("response:",response)

      if (response?.data?.success) {
        set({
          isLoading: false,
          
        });
      }
      toast.success(response?.data?.message)
        
      
    } catch (error) {
      set({
        isLoading: false,
        
      });
       toast.error(error.response?.data?.message)
    }
  },
  
}));


