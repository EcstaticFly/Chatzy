import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import { toast } from "react-hot-toast";
import { authStore } from "../store/authStore.js";

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isChatLoading: false,
  isSendingMessage: false,

  setSelectedUser: (user) => {
    // if(!user) return;
    set({ selectedUser: user });
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isChatLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isChatLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    set({ isSendingMessage: true });
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (e) {
      console.log(e);
      toast.error(
        e.response.data.message || "File size should be less than 5mb"
      );
    } finally {
      set({ isSendingMessage: false });
    }
  },

  listenIncomingMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;
    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
    });
  },

  stopListenIncomingMessage: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
  },
}));
