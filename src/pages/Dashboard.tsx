/**
 * Dashboard Page Component.
 * Main view after login with task management.
 */

import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFormModal } from '@/components/tasks/TaskFormModal';
import { useTasks } from '@/contexts/TaskContext';
import type { Task } from '@/types';

// Map view modes to display titles
const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  all: { title: 'All Tasks', subtitle: 'View and manage all your tasks' },
  pending: { title: 'Pending Tasks', subtitle: 'Tasks that need your attention' },
  completed: { title: 'Completed Tasks', subtitle: 'Tasks you have finished' },
  category: { title: 'Category', subtitle: 'Tasks in this category' },
};

export default function Dashboard() {
  const { filteredTasks, isLoading, error, viewMode, selectedCategory, refreshTasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingTask(null);
    }
  };

  // Get title based on current view
  const getHeaderInfo = () => {
    if (viewMode === 'category' && selectedCategory) {
      return {
        title: selectedCategory,
        subtitle: `Tasks in ${selectedCategory} category`,
      };
    }
    return VIEW_TITLES[viewMode] || VIEW_TITLES.all;
  };

  const headerInfo = getHeaderInfo();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar onCreateTask={handleCreateTask} />
        
        <main className="flex-1 min-w-0">
          <DashboardHeader
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
          />
          
          <div className="p-6 space-y-6">
            {/* Stats Section - Only show on 'all' view */}
            {viewMode === 'all' && !selectedCategory && (
              <TaskStats />
            )}

            {/* Task List */}
            <TaskList
              tasks={filteredTasks}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditTask}
              onCreateTask={handleCreateTask}
              onRetry={refreshTasks}
            />
          </div>
        </main>
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        open={isFormOpen}
        onOpenChange={handleFormClose}
        task={editingTask}
      />
    </SidebarProvider>
  );
}
