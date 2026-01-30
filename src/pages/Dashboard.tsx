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
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { useTasks } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

// Map view modes to display titles
const VIEW_TITLES: Record<string, { title: string; subtitle: string }> = {
  all: { title: 'All Tasks', subtitle: 'View and manage all your tasks' },
  pending: { title: 'Pending Tasks', subtitle: 'Tasks that need your attention' },
  completed: { title: 'Completed Tasks', subtitle: 'Tasks you have finished' },
  category: { title: 'Category', subtitle: 'Tasks in this category' },
};

type DisplayMode = 'list' | 'kanban';

export default function Dashboard() {
  const { filteredTasks, tasks, isLoading, error, viewMode, selectedCategory, refreshTasks } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');

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

  // Show kanban only on 'all' or 'pending' views
  const canShowKanban = viewMode === 'all' || viewMode === 'pending';

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
            {viewMode === 'all' && !selectedCategory && displayMode === 'list' && (
              <TaskStats />
            )}

            {/* View Toggle */}
            {canShowKanban && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDisplayMode('list')}
                    className={cn(
                      'gap-2 h-8',
                      displayMode === 'list' && 'bg-background shadow-sm'
                    )}
                  >
                    <LayoutList className="h-4 w-4" />
                    List
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDisplayMode('kanban')}
                    className={cn(
                      'gap-2 h-8',
                      displayMode === 'kanban' && 'bg-background shadow-sm'
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Board
                  </Button>
                </div>
                {displayMode === 'kanban' && (
                  <p className="text-sm text-muted-foreground">
                    Drag tasks between columns to change priority
                  </p>
                )}
              </div>
            )}

            {/* Content based on display mode */}
            {displayMode === 'kanban' && canShowKanban ? (
              <KanbanBoard
                tasks={tasks}
                onEdit={handleEditTask}
              />
            ) : (
              <TaskList
                tasks={filteredTasks}
                isLoading={isLoading}
                error={error}
                onEdit={handleEditTask}
                onCreateTask={handleCreateTask}
                onRetry={refreshTasks}
              />
            )}
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
