import { create } from "zustand";
import { axiosInstance } from "../configs/axios.js";
import { toast } from "react-toastify";
import { authStore } from "../store/authStore.js";

export const chatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isChatLoading: false,
  isSendingMessage: false,
  searchResults: [],
  isSearchingUser: false,

  setSelectedUser: (user) => {
    // if(!user) return;
    set({ selectedUser: user });
  },

  getSearchResults: async (keyword) => {
    // console.log("called");
    set({ isSearchingUser: true });
    try {
      const response = await axiosInstance.get(
        `/messages/searchUsers?search=${keyword}`
      );
      set({ searchResults: response.data });
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    } finally {
      set({ isSearchingUser: false });
    }
  },

  resetSearchResults: async () => {
    set({ searchResults: [] });
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

  sendMessage: async (formData) => {
    set({ isSendingMessage: true });
    const { selectedUser, messages } = get();
    // console.log(selectedUser);
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  markMessagesAsSeen: (senderId) => {
    const socket = authStore.getState().socket;
    if (socket) {
      socket.emit("markMessagesAsSeen", { senderId });
    }
  },

  listenMessagesSeen: () => {
    const socket = authStore.getState().socket;

    socket.on("messagesSeen", ({ seenBy, seenAt }) => {
      const { messages, selectedUser } = get();

      if (selectedUser?._id === seenBy) {
        const updatedMessages = messages.map((msg) => {
          if (msg.senderId === authStore.getState().user._id && !msg.seenAt) {
            return { ...msg, seenAt };
          }
          return msg;
        });
        set({ messages: updatedMessages });
      }
    });
  },

  stopListenMessagesSeen: () => {
    const socket = authStore.getState().socket;
    socket.off("messagesSeen");
  },

  listenIncomingMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;
    socket.on("newMessage", (message) => {
      if (message.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, message] });
      get().markMessagesAsSeen(selectedUser._id);
    });
    get().listenMessagesSeen();
  },

  stopListenIncomingMessage: () => {
    const socket = authStore.getState().socket;
    socket.off("newMessage");
    get().stopListenMessagesSeen();
  },
}));
