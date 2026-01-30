/**
 * Task Context Provider.
 * Manages task state and provides CRUD operations.
 * Uses mock data for development, switches to API when backend is available.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Task, CreateTaskInput, UpdateTaskInput, TaskFilters, ViewMode, ApiError } from '@/types';
import { tasksApi } from '@/services/api';
import { useAuth } from './AuthContext';

// ============================================
// Mock Data for Development
// ============================================

const MOCK_CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning'];

const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and submit the Q1 project proposal for the new client',
      status: 'pending',
      priority: 'high',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Work',
      tags: ['project', 'client'],
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, vegetables, and fruits',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Shopping',
      tags: ['groceries'],
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Morning workout',
      description: '30 minutes cardio + strength training',
      status: 'completed',
      priority: 'low',
      category: 'Health',
      tags: ['fitness', 'routine'],
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Read TypeScript documentation',
      description: 'Study advanced types and generics',
      status: 'pending',
      priority: 'medium',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Learning',
      tags: ['programming', 'typescript'],
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Schedule dentist appointment',
      description: 'Annual checkup overdue',
      status: 'pending',
      priority: 'high',
      category: 'Health',
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Review pull request',
      description: 'Review the authentication feature PR from the team',
      status: 'completed',
      priority: 'high',
      category: 'Work',
      tags: ['code-review'],
      user_id: 'mock-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
  return tasks;
};

// ============================================
// Types
// ============================================

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  viewMode: ViewMode;
  selectedCategory: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface TaskContextValue extends TaskState {
  // CRUD operations
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  
  // Filtering
  setFilters: (filters: TaskFilters) => void;
  setViewMode: (mode: ViewMode) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Pagination
  setPage: (page: number) => void;
  
  // Utilities
  refreshTasks: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// Context
// ============================================

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

// ============================================
// Provider
// ============================================

interface TaskProviderProps {
  children: React.ReactNode;
}

// Flag to use mock data (set to false when backend is connected)
const USE_MOCK_DATA = true;

export function TaskProvider({ children }: TaskProviderProps) {
  const { isAuthenticated } = useAuth();
  
  const [state, setState] = useState<TaskState>({
    tasks: [],
    filteredTasks: [],
    categories: MOCK_CATEGORIES,
    isLoading: false,
    error: null,
    filters: {},
    viewMode: 'all',
    selectedCategory: null,
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
    },
  });

  // Apply filters to tasks
  const applyFilters = useCallback((tasks: Task[], filters: TaskFilters, viewMode: ViewMode, selectedCategory: string | null): Task[] => {
    let filtered = [...tasks];

    // Apply view mode filter
    if (viewMode === 'pending') {
      filtered = filtered.filter(t => t.status === 'pending');
    } else if (viewMode === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    } else if (viewMode === 'category' && selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Apply additional filters
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(t => t.category === filters.category);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort: pending first, then by priority, then by due date
    filtered.sort((a, b) => {
      // Status: pending before completed
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      // Priority: high > medium > low
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Due date: earlier first
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      return a.due_date ? -1 : 1;
    });

    return filtered;
  }, []);

  // Fetch tasks from API or use mock data
  const fetchTasks = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockTasks = generateMockTasks();
        const filtered = applyFilters(mockTasks, state.filters, state.viewMode, state.selectedCategory);
        
        setState(prev => ({
          ...prev,
          tasks: mockTasks,
          filteredTasks: filtered,
          isLoading: false,
          pagination: {
            ...prev.pagination,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.pagination.pageSize),
          },
        }));
      } else {
        const response = await tasksApi.getTasks(state.filters);
        setState(prev => ({
          ...prev,
          tasks: response.items,
          filteredTasks: applyFilters(response.items, prev.filters, prev.viewMode, prev.selectedCategory),
          isLoading: false,
          pagination: {
            page: response.page,
            pageSize: response.page_size,
            total: response.total,
            totalPages: response.total_pages,
          },
        }));
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message || 'Failed to fetch tasks',
      }));
    }
  }, [state.filters, state.viewMode, state.selectedCategory, applyFilters]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (isAuthenticated || USE_MOCK_DATA) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  // Update filtered tasks when filters change
  useEffect(() => {
    const filtered = applyFilters(state.tasks, state.filters, state.viewMode, state.selectedCategory);
    setState(prev => ({
      ...prev,
      filteredTasks: filtered,
      pagination: {
        ...prev.pagination,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / prev.pagination.pageSize),
      },
    }));
  }, [state.tasks, state.filters, state.viewMode, state.selectedCategory, applyFilters]);

  // CRUD Operations
  const createTask = useCallback(async (input: CreateTaskInput) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const newTask: Task = {
          id: Date.now().toString(),
          ...input,
          status: 'pending',
          priority: input.priority || 'medium',
          user_id: 'mock-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setState(prev => ({
          ...prev,
          tasks: [newTask, ...prev.tasks],
          isLoading: false,
        }));
      } else {
        const newTask = await tasksApi.createTask(input);
        setState(prev => ({
          ...prev,
          tasks: [newTask, ...prev.tasks],
          isLoading: false,
        }));
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: apiError.message || 'Failed to create task',
      }));
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (id: string, input: UpdateTaskInput) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t =>
            t.id === id
              ? { ...t, ...input, updated_at: new Date().toISOString() }
              : t
          ),
        }));
      } else {
        const updatedTask = await tasksApi.updateTask(id, input);
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === id ? updatedTask : t),
        }));
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        error: apiError.message || 'Failed to update task',
      }));
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, error: null }));

    try {
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.filter(t => t.id !== id),
        }));
      } else {
        await tasksApi.deleteTask(id);
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.filter(t => t.id !== id),
        }));
      }
    } catch (error) {
      const apiError = error as ApiError;
      setState(prev => ({
        ...prev,
        error: apiError.message || 'Failed to delete task',
      }));
      throw error;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(id, { status: newStatus });
  }, [state.tasks, updateTask]);

  // Filter setters
  const setFilters = useCallback((filters: TaskFilters) => {
    setState(prev => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  }, []);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode, selectedCategory: viewMode === 'category' ? prev.selectedCategory : null }));
  }, []);

  const setSelectedCategory = useCallback((category: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: category, viewMode: category ? 'category' : 'all' }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setState(prev => ({ ...prev, filters: { ...prev.filters, search: query || undefined } }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page },
      filters: { ...prev.filters, page },
    }));
  }, []);

  const refreshTasks = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: TaskContextValue = {
    ...state,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
    setViewMode,
    setSelectedCategory,
    setSearchQuery,
    setPage,
    refreshTasks,
    clearError,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
