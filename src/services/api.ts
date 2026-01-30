/**
 * Centralized API service layer for TaskFlow.
 * All API calls go through this module for consistent error handling and token management.
 */

import type {
  AuthCredentials,
  RegisterCredentials,
  AuthResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  TaskFilters,
  PaginatedResponse,
  ApiError,
} from '@/types';

// ============================================
// Configuration
// ============================================

// Base URL from environment variable - defaults to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Token storage key
const TOKEN_KEY = 'taskflow_access_token';

// ============================================
// Token Management
// ============================================

/**
 * Securely store the JWT token.
 * In production, consider using httpOnly cookies via backend.
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// ============================================
// HTTP Client
// ============================================

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

/**
 * Generic fetch wrapper with authentication and error handling.
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Set default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle token expiration (401)
      if (response.status === 401) {
        removeToken();
        // Trigger auth state update - could emit event or use callback
        window.dispatchEvent(new CustomEvent('auth:expired'));
      }

      const error: ApiError = {
        message: errorData.message || errorData.detail || 'An error occurred',
        detail: errorData.detail,
        status_code: response.status,
      };
      
      throw error;
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  } catch (error) {
    // Re-throw API errors
    if ((error as ApiError).status_code) {
      throw error;
    }
    
    // Network or other errors
    throw {
      message: 'Network error. Please check your connection.',
      status_code: 0,
    } as ApiError;
  }
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  /**
   * Register a new user account.
   */
  register: (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Login with email and password.
   */
  login: (credentials: AuthCredentials): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get current user profile.
   */
  getProfile: (): Promise<{ user: import('@/types').User }> => {
    return request<{ user: import('@/types').User }>('/auth/me');
  },
};

// ============================================
// Tasks API
// ============================================

export const tasksApi = {
  /**
   * Get paginated list of tasks with optional filters.
   */
  getTasks: (filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> => {
    return request<PaginatedResponse<Task>>('/tasks', {
      params: {
        status: filters.status,
        priority: filters.priority,
        category: filters.category,
        search: filters.search,
        page: filters.page,
        page_size: filters.page_size,
      },
    });
  },

  /**
   * Get a single task by ID.
   */
  getTask: (id: string): Promise<Task> => {
    return request<Task>(`/tasks/${id}`);
  },

  /**
   * Create a new task.
   */
  createTask: (input: CreateTaskInput): Promise<Task> => {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  /**
   * Update an existing task.
   */
  updateTask: (id: string, input: UpdateTaskInput): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  /**
   * Delete a task.
   */
  deleteTask: (id: string): Promise<void> => {
    return request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Toggle task completion status.
   */
  toggleTask: (id: string, currentStatus: import('@/types').TaskStatus): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: currentStatus === 'completed' ? 'pending' : 'completed',
      }),
    });
  },
};
