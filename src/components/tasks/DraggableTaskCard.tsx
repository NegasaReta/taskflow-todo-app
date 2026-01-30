/**
 * Draggable Task Card Component.
 * Task card with drag-and-drop support using @dnd-kit.
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import type { Task } from '@/types';
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
  Calendar,
  MoreHorizontal,
  Pencil,
  Trash2,
  Flag,
  Tag,
  GripVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  isOverlay?: boolean;
}

export function DraggableTaskCard({
  task,
  onEdit,
  onToggle,
  onDelete,
  isDragging = false,
  isOverlay = false,
}: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

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
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        'group transition-all duration-200 border-border/50 cursor-grab active:cursor-grabbing',
        task.status === 'completed' && 'opacity-60',
        isCurrentlyDragging && 'opacity-50 shadow-lg scale-105 ring-2 ring-primary/50',
        isOverlay && 'shadow-xl rotate-2 cursor-grabbing'
      )}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 rounded hover:bg-muted cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Checkbox */}
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={() => onToggle(task.id)}
            className={cn(
              'mt-1 h-4 w-4 rounded-full border-2 transition-colors',
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
                  'text-sm font-medium leading-tight',
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
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {/* Due Date */}
              {task.due_date && (
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] px-1.5 py-0',
                    isOverdue
                      ? 'bg-destructive/10 text-destructive border-destructive/30'
                      : 'text-muted-foreground'
                  )}
                >
                  <Calendar className="h-2.5 w-2.5 mr-1" />
                  {formatDueDate(task.due_date)}
                </Badge>
              )}

              {/* Category */}
              {task.category && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <Tag className="h-2.5 w-2.5 mr-1" />
                  {task.category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Static version for drag overlay
 */
export function TaskCardOverlay({ task }: { task: Task }) {
  const priorityStyles = {
    high: 'bg-priority-high/10 text-priority-high border-priority-high/30',
    medium: 'bg-priority-medium/10 text-priority-medium border-priority-medium/30',
    low: 'bg-priority-low/10 text-priority-low border-priority-low/30',
  };

  return (
    <Card className="shadow-xl rotate-2 cursor-grabbing border-primary/50 ring-2 ring-primary/30">
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn('text-[10px] px-1.5 py-0 capitalize', priorityStyles[task.priority])}
              >
                <Flag className="h-2.5 w-2.5 mr-1" />
                {task.priority}
              </Badge>
            </div>
            <h3 className="text-sm font-medium mt-1">{task.title}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
