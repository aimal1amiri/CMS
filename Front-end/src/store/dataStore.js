import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/data"; // Adjust this to your backend's base URL

export const useDataStore = create((set) => ({
  searchResults: [], // Data fetched from the backend
  isLoading: false, // Loading state
  error: null, // Error message
  successMessage: null, // Success message
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
          error: response.data.message || "No results found.",
        });
      }
    } catch (error) {
      set({
        searchResults: [],
        isLoading: false,
        error: error.response?.data?.message || "Error fetching data.",
      });
    }
  },

  updateRecord: async (id, updatedData) => {
    set({ isLoading: true, error: null, successMessage: null });

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
          successMessage: response.data.message, // Display success message
        });

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
        error: error.response?.data?.message || "Failed to update the record.",
        successMessage: null,
      });
    }
  },

  fetchFilteredResults: async (filters = {}, page = 1, limit = 13) => {
    set({ isLoading: true, error: null });

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
          error: response.data.message || "No results found.",
        });
      }
    } catch (error) {
      set({
        searchResults: [],
        isLoading: false,
        error: error.response?.data?.message || "Error fetching filtered results.",
      });
    }
  },

  
  populateDatabase: async (jsonUrl) => {
    set({ isLoading: true, error: null, successMessage: null });

    try {
      const response = await axios.post(
        `${API_URL}/populate`,
        { jsonUrl },
        { headers: useDataStore.getState().getAuthHeaders() }
      );

      if (response.data.success) {
        set({
          isLoading: false,
          error: null,
          successMessage: response.data.message || "Database populated successfully.",
        });
      } else {
        set({
          isLoading: false,
          error: response.data.message || "Failed to populate the database.",
          successMessage: null,
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error populating the database.",
        successMessage: null,
      });
    }
  },
  
}));


