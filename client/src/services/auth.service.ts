// import { api } from './api';
import type { UserProfile } from '../store/authStore';

export interface LoginCredentials {
  email: string;
  password?: string; // Optional for mock since it accepts anything initially
}

export interface AuthResponse {
  user: UserProfile;
}

export const authService = {
  // Mock login endpoint until real backend is ready
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // TODO: Uncomment when backend is ready
    // const response = await api.post<AuthResponse>('/auth/login', credentials);
    // return response.data;

    // --- Mock Implementation ---
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: 'u-1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'admin',
        };
        localStorage.setItem('auth-session', JSON.stringify(user));
        resolve({ user });
      }, 800);
    });
  },

  async logout(): Promise<void> {
    // await api.post('/auth/logout');
    localStorage.removeItem('auth-session');
    return Promise.resolve();
  },

  async getProfile(): Promise<UserProfile> {
    // const response = await api.get<UserProfile>('/auth/me');
    // return response.data;
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const session = localStorage.getItem('auth-session');
        if (session) {
          resolve(JSON.parse(session));
        } else {
          reject(new Error("No active session"));
        }
      }, 300); // Small delay to simulate network
    });
  }
};
