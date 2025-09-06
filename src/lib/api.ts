import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          tokenStorage.setTokens(access, refreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          tokenStorage.clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// API Types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  display_name: string;
  avatar?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: User;
  members_count: number;
  progress: number;
  is_archived?: boolean;
  created_at: string;
  updated_at: string;
  members?: ProjectMember[];
}

export interface ProjectMember {
  id: string;
  user: User;
  role: 'admin' | 'member' | 'viewer';
  joined_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  reporter: User;
  due_date?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  body: string;
  author: User;
  parent?: string;
  task?: string;
  replies: Comment[];
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_updated' | 'comment_added' | 'deadline_soon' | 'project_invite';
  message: string;
  project?: Project;
  task?: Task;
  is_read: boolean;
  created_at: string;
}

// API Functions
export const authAPI = {
  register: (data: { username: string; email: string; password: string; password_confirm: string; full_name?: string }) =>
    apiClient.post('/accounts/register/', data),
    
  login: (data: { email?: string; username?: string; password: string }) =>
    apiClient.post('/accounts/login/', data),
    
  getCurrentUser: () => apiClient.get('/accounts/me/'),
  
  refreshToken: (refresh: string) =>
    apiClient.post('/auth/token/refresh/', { refresh }),
};

export const projectsAPI = {
  list: (params?: { mine?: boolean }) => 
    apiClient.get('/projects/', { params }),
    
  create: (data: { name: string; description: string }) =>
    apiClient.post('/projects/', data),
    
  get: (id: string) =>
    apiClient.get(`/projects/${id}/`),
    
  update: (id: string, data: Partial<Project>) =>
    apiClient.patch(`/projects/${id}/`, data),
    
  delete: (id: string) =>
    apiClient.delete(`/projects/${id}/`),
    
  addMember: (id: string, data: { user_id: string; role: string }) =>
    apiClient.post(`/projects/${id}/add_member/`, data),
};

export const tasksAPI = {
  list: (projectId: string) =>
    apiClient.get('/tasks/', { params: { project: projectId } }),
    
  create: (data: { 
    project_id: string; 
    title: string; 
    description?: string; 
    assignee_id?: string; 
    due_date?: string; 
    priority?: string; 
  }) => apiClient.post('/tasks/', data),
  
  update: (id: string, data: Partial<Task>) =>
    apiClient.patch(`/tasks/${id}/`, data),
    
  delete: (id: string) =>
    apiClient.delete(`/tasks/${id}/`),
    
  getWorkload: (projectId: string) =>
    apiClient.get('/tasks/workload/', { params: { project: projectId } }),
};

export const commentsAPI = {
  list: (params: { project?: string; task?: string }) =>
    apiClient.get('/comments/', { params }),
    
  create: (data: { project_id: string; task_id?: string; body: string; parent?: string }) =>
    apiClient.post('/comments/', data),
    
  update: (id: string, data: { body: string }) =>
    apiClient.patch(`/comments/${id}/`, data),
    
  delete: (id: string) =>
    apiClient.delete(`/comments/${id}/`),
};

export const notificationsAPI = {
  list: () => apiClient.get('/notifications/'),
  
  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/`, { is_read: true }),
    
  markAllAsRead: () =>
    apiClient.post('/notifications/mark_all_read/'),
};

export default apiClient;