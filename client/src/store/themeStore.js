import { create } from "zustand";

export const themeStore = create((set) => ({
  theme: localStorage.getItem("chatzy-theme") || "retro",
  setTheme: (theme) => {
    localStorage.setItem("chatzy-theme", theme);
    set({ theme });
  },
}));
