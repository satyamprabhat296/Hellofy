import { create } from 'zustand'

 export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("Hellofy-theme") || "coffee",
  setTheme:(theme) =>{
    localStorage.setItem("Hellofy-theme", theme);
    set({theme});
  },
}));