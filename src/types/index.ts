/**
 * Core type definitions for the TaskFlow application.
 * These types mirror the expected backend API response structures.
 */

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: string;
}

// ============================================
// Task Types
// ============================================

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  category?: string;
  tags?: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  status?: TaskStatus;
}

// ============================================
// API Types
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface ApiError {
  message: string;
  detail?: string;
  status_code: number;
}

// ============================================
// UI State Types
// ============================================

export type ViewMode = 'all' | 'pending' | 'completed' | 'category';

export interface AppState {
  isLoading: boolean;
  error: string | null;
}
