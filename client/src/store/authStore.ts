import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updatedFields) => 
    set((state) => ({ 
      user: state.user ? { ...state.user, ...updatedFields } : null 
    })),
}));
