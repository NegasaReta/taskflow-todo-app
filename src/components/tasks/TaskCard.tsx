/**
 * Task Card Component.
 * Displays individual task with actions for editing, completing, and deleting.
 */

import { useState } from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import type { Task } from '@/types';
import { useTasks } from '@/contexts/TaskContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { toggleTaskStatus, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggle = async () => {
    await toggleTaskStatus(task.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Format due date with relative labels
  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  // Check if task is overdue
  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && task.status !== 'completed';

  // Priority badge styles
  const priorityStyles = {
    high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
    medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
    low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
  };

  return (
    <>
      <Card
        className={cn(
          'group transition-all duration-200 hover:shadow-md border-border/50',
          task.status === 'completed' && 'opacity-60',
          'animate-slide-up'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <Checkbox
              checked={task.status === 'completed'}
              onCheckedChange={handleToggle}
              className={cn(
                'mt-1 h-5 w-5 rounded-full border-2 transition-colors',
                task.status === 'completed'
                  ? 'bg-success border-success'
                  : 'border-border hover:border-primary'
              )}
            />

            {/* Task Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3
                  className={cn(
                    'font-medium leading-tight',
                    task.status === 'completed' && 'line-through text-muted-foreground'
                  )}
                >
                  {task.title}
                </h3>

                {/* Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Priority */}
                <Badge
                  variant="outline"
                  className={cn('text-xs capitalize', priorityStyles[task.priority])}
                >
                  <Flag className="h-3 w-3 mr-1" />
                  {task.priority}
                </Badge>

                {/* Due Date */}
                {task.due_date && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      isOverdue
                        ? 'bg-destructive/10 text-destructive border-destructive/30'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDueDate(task.due_date)}
                  </Badge>
                )}

                {/* Category */}
                {task.category && (
                  <Badge variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {task.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{task.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
