/**
 * React hook for managing mouse-based drag-and-drop operations
 * Handles drag state, event handlers, and visual feedback classes
 */

import { useState, useCallback, useEffect } from 'react';
import type { Goal, GoalStatus } from '../types/goals';
import type { DragState } from '../types/dragDrop';

export interface UseDragAndDropReturn {
  /** Current drag state */
  dragState: DragState;

  /** Mouse event handlers for drag operations */
  handlers: {
    onMouseDown: (goal: Goal) => (e: React.MouseEvent) => void;
    onMouseMove: (index: number) => (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };

  /**
   * Get CSS classes for a goal card based on drag state
   * Returns classes for dragging effect, shift direction, etc.
   */
  getGoalClasses: (goalId: string, currentIndex: number) => string;
}

/**
 * Custom hook for managing drag-and-drop state and handlers
 * @param status - Filter goals by status (active or completed)
 * @param goals - Current list of goals in this column
 * @param onReorder - Callback when reordering completes with new order
 */
export function useDragAndDrop(
  status: GoalStatus,
  goals: Goal[],
  onReorder: (fromIndex: number, toIndex: number) => void
): UseDragAndDropReturn {
  const [dragState, setDragState] = useState<DragState>({
    draggedGoal: null,
    draggedIndex: null,
    dropTargetIndex: null,
    status,
  });

  // Reset drag state when goals change externally
  useEffect(() => {
    setDragState(prev => ({
      ...prev,
      draggedGoal: null,
      draggedIndex: null,
      dropTargetIndex: null,
    }));
  }, [goals]);

  const onMouseDown = useCallback((goal: Goal) => (e: React.MouseEvent) => {
    // Only allow drag from left mouse button, not from input/button elements
    if (e.button !== 0 || (e.target as HTMLElement).closest('input, button')) {
      return;
    }

    e.preventDefault();
    const index = goals.findIndex(g => g.id === goal.id);

    if (index === -1) {
      return;
    }

    setDragState({
      draggedGoal: goal,
      draggedIndex: index,
      dropTargetIndex: index,
      status,
    });

    // Add class to body to indicate drag in progress
    document.body.classList.add('drag-in-progress');
  }, [goals, status]);

  const onMouseMove = useCallback((hoverIndex: number) => (e: React.MouseEvent) => {
    if (!dragState.draggedGoal || dragState.draggedIndex === null) {
      return;
    }

    e.preventDefault();

    // Calculate drop target based on cursor Y position and goal card height
    // Determine if we should place before or after the hovered goal
    const goalElement = (e.currentTarget as HTMLElement);
    const goalRect = goalElement.getBoundingClientRect();
    const relativeY = e.clientY - goalRect.top;
    const midpoint = goalRect.height / 2;

    // If cursor is in the top half, drop before; bottom half, drop after
    let targetIndex = relativeY < midpoint ? hoverIndex : hoverIndex + 1;

    // Clamp to valid range
    targetIndex = Math.max(0, Math.min(goals.length - 1, targetIndex));

    // Don't update if target hasn't changed
    if (targetIndex === dragState.dropTargetIndex) {
      return;
    }

    setDragState(prev => ({
      ...prev,
      dropTargetIndex: targetIndex,
    }));
  }, [dragState, goals.length]);

  const onMouseUp = useCallback(() => {
    if (!dragState.draggedGoal || dragState.draggedIndex === null || dragState.dropTargetIndex === null) {
      setDragState(prev => ({
        ...prev,
        draggedGoal: null,
        draggedIndex: null,
        dropTargetIndex: null,
      }));
      document.body.classList.remove('drag-in-progress');
      return;
    }

    // Execute reorder if target is different from source
    if (dragState.draggedIndex !== dragState.dropTargetIndex) {
      onReorder(dragState.draggedIndex, dragState.dropTargetIndex);
    }

    // Reset drag state
    setDragState({
      draggedGoal: null,
      draggedIndex: null,
      dropTargetIndex: null,
      status,
    });

    document.body.classList.remove('drag-in-progress');
  }, [dragState, onReorder, status]);

  const onMouseLeave = useCallback(() => {
    // Optional: could reset drag state on mouse leave if desired
    // For now, we keep the drag state to allow moving outside and back
  }, []);

  const getGoalClasses = useCallback((goalId: string, currentIndex: number): string => {
    const classes: string[] = [];

    if (dragState.draggedGoal?.id === goalId) {
      classes.push('dragging');
    }

    // Add shift classes for visual feedback
    if (dragState.draggedIndex !== null && dragState.dropTargetIndex !== null) {
      if (currentIndex >= Math.min(dragState.draggedIndex, dragState.dropTargetIndex) &&
          currentIndex <= Math.max(dragState.draggedIndex, dragState.dropTargetIndex)) {
        if (dragState.dropTargetIndex < dragState.draggedIndex) {
          // Moving up, shift down goals that will move
          if (currentIndex >= dragState.dropTargetIndex && currentIndex < dragState.draggedIndex) {
            classes.push('shift-down');
          }
        } else if (dragState.dropTargetIndex > dragState.draggedIndex) {
          // Moving down, shift up goals that will move
          if (currentIndex > dragState.draggedIndex && currentIndex <= dragState.dropTargetIndex) {
            classes.push('shift-up');
          }
        }
      }
    }

    return classes.join(' ');
  }, [dragState.draggedIndex, dragState.dropTargetIndex, dragState.draggedGoal]);

  return {
    dragState,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
    getGoalClasses,
  };
}
