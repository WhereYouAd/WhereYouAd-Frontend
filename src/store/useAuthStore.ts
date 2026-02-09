import { create } from "zustand";

interface IAuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  email: string;
  password: string;
  socialId: number;

  login: (email: string, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setSocialId: (socialId: number) => void;
  resetAuth: () => void;
}

const useAuthStore = create<IAuthState>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  email: "",
  password: "",
  socialId: -1,

  login: (email, accessToken) => {
    set({ isLoggedIn: true, email, accessToken });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      isLoggedIn: false,
      accessToken: null,
      email: "",
      password: "",
      socialId: -1,
    });
  },

  setAccessToken: (token) => set({ accessToken: token }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setSocialId: (socialId) => set({ socialId }),
  resetAuth: () => set({ email: "", password: "", accessToken: null }),
}));

export default useAuthStore;
