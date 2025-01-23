import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import toast from "react-hot-toast";
export const authStore = create((set) => ({
    user: null,
    isLoggingIn: false,
    isRegistering: false,
    isUpdating: false,
    isLoading: true,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ user: response.data });
        } catch (error) {
            console.log(error);
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (formData) => {
        set({ isRegistering: true });
        try {
            const response = await axiosInstance.post("/auth/register", formData);
            toast.success("Account created successfully!");
            set({ user: response.data });
        } catch (e) {
            console.log(e);
            toast.error("Failed to create account");
        } finally {
            set({ isRegistering: false });
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post("/auth/login", formData);
            toast.success("Logged in successfully!");
            set({ user: response.data });
        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully!");
            set({ user: null });

        } catch (e) {
            console.log(e);
            toast.error(e.response.data.message)
        }
    }


}));
