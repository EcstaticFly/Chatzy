import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5000";

export const authStore = create((set, get) => ({
  user: null,
  isLoggingIn: false,
  isUpdating: false,
  isLoading: true,
  isDeletingImage: false,
  isSendingOtp: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ user: response.data });

      get().connectSocket();
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
      set({ user: response.data });
      toast.success(response.data.message);
      get().connectSocket();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isRegistering: false });
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ user: response.data });
      toast.success(response.data.message);

      get().connectSocket();
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

      get().disconnectSocket();
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  },

  updateProfile: async (profilePic) => {
    set({ isUpdating: true });
    try {
      const response = await axiosInstance.put("/auth/update", profilePic);
      console.log(response.data);
      set({ user: response.data.user });
      toast.success(response.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message || "File size should be less than 5mb");
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteProfilePic: async () => {
    set({ isDeletingImage: true });
    try {
      const response = await axiosInstance.delete("/auth/deleteImage");
      // console.log(response.data);
      set({ user: response.data.user });
      toast.success(response.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isDeletingImage: false });
    }
  },

  sendOtp: async (formData) => {
    set({ isSendingOtp: true });
    try {
      const response = await axiosInstance.post("/auth/sendOtp", formData);
      toast.success(response.data.message);
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isSendingOtp: false });
    }
  },

  verifyOtp: async (formData, givenOTP) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/verifyOtp", {
        formData,
        givenOTP,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;

    const socket = io(BASE_URL,{
      query: {
        userId : user._id,
      }
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (onlineUserIds)=>{
      set({ onlineUsers: onlineUserIds });
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
