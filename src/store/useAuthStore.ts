import { create } from "zustand";

interface IAuthState {
  isLoggedIn: boolean;
  isTokenInitialized: boolean;
  accessToken: string | null;
  email: string;
  socialId: number | null;

  login: (email: string, accessToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setTokenInitialized: () => void;
  setEmail: (email: string) => void;
  setSocialId: (socialId: number) => void;
  resetAuth: () => void;
}

const useAuthStore = create<IAuthState>((set) => ({
  isLoggedIn: false,
  isTokenInitialized: false,
  accessToken: null,
  email: "",
  socialId: null,

  login: (email, accessToken) => {
    localStorage.setItem("hasSession", "true");
    set({ isLoggedIn: true, email, accessToken });
  },
  logout: () => {
    localStorage.removeItem("hasSession");
    set({
      isLoggedIn: false,
      accessToken: null,
      email: "",
      socialId: null,
    });
  },

  setAccessToken: (token) => {
    localStorage.setItem("hasSession", "true");
    set({ accessToken: token, isLoggedIn: true });
  },
  setTokenInitialized: () => set({ isTokenInitialized: true }),
  setEmail: (email) => set({ email }),
  setSocialId: (socialId) => set({ socialId }),
  resetAuth: () => set({ email: "" }),
}));

export default useAuthStore;
