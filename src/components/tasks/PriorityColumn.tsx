/**
 * Priority Column Component.
 * Droppable column for tasks of a specific priority.
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskPriority } from '@/types';
import { DraggableTaskCard } from './DraggableTaskCard';
import { cn } from '@/lib/utils';
import { Flag, AlertTriangle, Minus, ArrowDown } from 'lucide-react';

interface PriorityColumnProps {
  priority: TaskPriority;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  high: {
    label: 'High Priority',
    icon: AlertTriangle,
    color: 'text-priority-high',
    bgColor: 'bg-priority-high/5',
    borderColor: 'border-priority-high/20',
    headerBg: 'bg-priority-high/10',
  },
  medium: {
    label: 'Medium Priority',
    icon: Minus,
    color: 'text-priority-medium',
    bgColor: 'bg-priority-medium/5',
    borderColor: 'border-priority-medium/20',
    headerBg: 'bg-priority-medium/10',
  },
  low: {
    label: 'Low Priority',
    icon: ArrowDown,
    color: 'text-priority-low',
    bgColor: 'bg-priority-low/5',
    borderColor: 'border-priority-low/20',
    headerBg: 'bg-priority-low/10',
  },
};

export function PriorityColumn({
  priority,
  tasks,
  onEdit,
  onToggle,
  onDelete,
}: PriorityColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: priority,
    data: {
      type: 'column',
      priority,
    },
  });

  const config = priorityConfig[priority];
  const Icon = config.icon;
  const taskIds = tasks.map(t => t.id);

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border transition-all duration-200 min-h-[400px]',
        config.borderColor,
        config.bgColor,
        isOver && 'ring-2 ring-primary/50 scale-[1.01]'
      )}
    >
      {/* Column Header */}
      <div className={cn('p-3 rounded-t-xl border-b', config.headerBg, config.borderColor)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', config.color)} />
            <h3 className={cn('font-semibold text-sm', config.color)}>
              {config.label}
            </h3>
          </div>
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.headerBg, config.color)}>
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Tasks Container */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 p-2 space-y-2 overflow-y-auto transition-colors',
          isOver && 'bg-primary/5'
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Flag className={cn('h-8 w-8 mb-2 opacity-30', config.color)} />
              <p className="text-xs text-muted-foreground">
                Drop tasks here
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <DraggableTaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
