/**
 * Kanban Board Component.
 * Drag-and-drop board view with priority columns.
 */

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Task, TaskPriority } from '@/types';
import { useTasks } from '@/contexts/TaskContext';
import { PriorityColumn } from './PriorityColumn';
import { TaskCardOverlay } from './DraggableTaskCard';
import { toast } from 'sonner';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
}

const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

export function KanbanBoard({ tasks, onEdit }: KanbanBoardProps) {
  const { updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensors for mouse and touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // Group tasks by priority
  const tasksByPriority = useMemo(() => {
    const grouped: Record<TaskPriority, Task[]> = {
      high: [],
      medium: [],
      low: [],
    };

    // Only show pending tasks in kanban view
    tasks
      .filter(t => t.status === 'pending')
      .forEach((task) => {
        grouped[task.priority].push(task);
      });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle visual feedback during drag
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Determine target priority
    let targetPriority: TaskPriority | null = null;

    // Check if dropped on a column
    if (PRIORITIES.includes(overId as TaskPriority)) {
      targetPriority = overId as TaskPriority;
    } else {
      // Dropped on another task - find its priority
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        targetPriority = overTask.priority;
      }
    }

    // If priority changed, update the task
    if (targetPriority && targetPriority !== activeTask.priority) {
      try {
        await updateTask(activeId, { priority: targetPriority });
        toast.success(`Task priority changed to ${targetPriority}`);
      } catch {
        toast.error('Failed to update task priority');
      }
    }
  };

  const handleToggle = async (id: string) => {
    await toggleTaskStatus(id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRIORITIES.map((priority) => (
          <PriorityColumn
            key={priority}
            priority={priority}
            tasks={tasksByPriority[priority]}
            onEdit={onEdit}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? <TaskCardOverlay task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
