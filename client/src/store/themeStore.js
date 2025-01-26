import { create } from "zustand";



export const themeStore = create((set)=>({
    theme : localStorage.getItem("chatzy-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("chatzy-theme", theme);
        set({theme});
    },
}))