import { create } from "zustand";

interface IAuthState {
  isLoggedIn: boolean;
  email: string;
  password: string;
  socialId: number;
  login: (email: string) => void;
  logout: () => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setSocialId: (socialId: number) => void;
  resetAuth: () => void;
}

const useAuthStore = create<IAuthState>((set) => ({
  isLoggedIn: false,
  email: "",
  password: "",
  socialId: -1,
  login: (email) => set({ isLoggedIn: true, email }),
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ isLoggedIn: false, email: "", password: "", socialId: -1 });
  },
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setSocialId: (socialId) => set({ socialId }),
  resetAuth: () => set({ email: "", password: "" }),
}));

export default useAuthStore;
