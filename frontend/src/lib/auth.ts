import { User } from '@/types';
import { mockUsers, DEMO_CREDENTIALS } from '@/data/mockData';

const TOKEN_KEY = 'synergysphere_token';
const USER_KEY = 'synergysphere_user';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private static instance: AuthService;
  private listeners: Array<(state: AuthState) => void> = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    const state = this.getAuthState();
    this.listeners.forEach(listener => listener(state));
  }

  getAuthState(): AuthState {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      user,
      token,
      isAuthenticated: !!(token && user)
    };
  }

  async login(email: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check demo credentials
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const user = mockUsers[0]; // Demo user
      const token = 'mock_jwt_token_' + Date.now();
      
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      
      this.notify();
      return { success: true };
    }
    
    return { success: false, message: 'Invalid credentials' };
  }

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    username: string;
  }): Promise<{ success: boolean; message?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create new user (in real app, this would call the API)
    const newUser: User = {
      id: Date.now(),
      email: userData.email,
      full_name: userData.full_name,
      username: userData.username,
      avatar: '👤',
      created_at: new Date().toISOString()
    };
    
    return { success: true };
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.getAuthState().user;
  }

  getToken(): string | null {
    return this.getAuthState().token;
  }
}

export const authService = AuthService.getInstance();