/**
 * React hook for managing keyboard-based goal reordering
 * Handles keyboard navigation, reorder mode, and ARIA announcements
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Goal, GoalStatus } from '../types/goals';
import type { KeyboardReorderState } from '../types/dragDrop';

export interface UseKeyboardReorderReturn {
  /** Current keyboard reorder state */
  reorderState: KeyboardReorderState;

  /** Keyboard event handlers */
  handlers: {
    onKeyDown: (goal: Goal, currentIndex: number) => (e: React.KeyboardEvent) => void;
    onBlur: () => void;
  };

  /** Get CSS classes for a goal based on keyboard reorder state */
  getGoalClasses: (goalId: string) => string;

  /** ARIA label for the goal */
  getAriaLabel: (goal: Goal, currentIndex: number) => string;

  /** Announcement text for live region */
  announcementText: string;
}

/**
 * Custom hook for managing keyboard-based reordering
 * @param status - Filter goals by status (active or completed)
 * @param goals - Current list of goals in this column
 * @param onReorder - Callback when reordering completes with new order
 */
export function useKeyboardReorder(
  status: GoalStatus,
  goals: Goal[],
  onReorder: (fromIndex: number, toIndex: number) => void
): UseKeyboardReorderReturn {
  const [reorderState, setReorderState] = useState<KeyboardReorderState>({
    active: false,
    goalId: null,
    currentIndex: null,
    originalIndex: null,
    status,
  });

  const [announcementText, setAnnouncementText] = useState('');
  const announcementTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset keyboard state when goals change externally
  useEffect(() => {
    if (reorderState.active) {
      setReorderState(prev => ({
        ...prev,
        active: false,
        goalId: null,
        currentIndex: null,
        originalIndex: null,
      }));
    }
  }, [goals]);

  const announce = useCallback((message: string) => {
    // Clear previous announcement timer
    if (announcementTimeoutRef.current !== null) {
      clearTimeout(announcementTimeoutRef.current);
    }

    setAnnouncementText(message);

    // Clear after 1 second to allow screen reader to announce fresh updates
    announcementTimeoutRef.current = setTimeout(() => {
      setAnnouncementText('');
    }, 1000);
  }, []);

  const getAriaLabel = useCallback((goal: Goal, currentIndex: number): string => {
    if (reorderState.active && reorderState.goalId === goal.id) {
      const totalGoals = goals.length;
      const position = reorderState.currentIndex !== null ? reorderState.currentIndex + 1 : currentIndex + 1;
      return `Goal: ${goal.title}. In reorder mode. Current position: ${position} of ${totalGoals}. Use arrow keys to move, Enter to confirm, Escape to cancel.`;
    }
    return `Goal: ${goal.title}. Press Space or Enter to start reordering.`;
  }, [reorderState, goals.length]);

  const onKeyDown = useCallback((goal: Goal, currentIndex: number) => (e: React.KeyboardEvent) => {
    // Space/Enter: Toggle reorder mode
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();

      if (!reorderState.active) {
        // Activate reorder mode
        setReorderState({
          active: true,
          goalId: goal.id,
          currentIndex,
          originalIndex: currentIndex,
          status,
        });

        announce(`Reorder mode activated for ${goal.title}. At position ${currentIndex + 1} of ${goals.length}. Use arrow up/down to move.`);
      } else if (reorderState.goalId === goal.id) {
        // Confirm reorder
        if (reorderState.currentIndex !== null && reorderState.originalIndex !== null) {
          onReorder(reorderState.originalIndex, reorderState.currentIndex);
          announce(`${goal.title} moved to position ${reorderState.currentIndex + 1}.`);
        }

        // Exit reorder mode
        setReorderState({
          active: false,
          goalId: null,
          currentIndex: null,
          originalIndex: null,
          status,
        });
      }
    }

    // Escape: Cancel reorder mode
    if (e.key === 'Escape' && reorderState.active && reorderState.goalId === goal.id) {
      e.preventDefault();
      announce(`Reorder cancelled for ${goal.title}. Returned to original position ${reorderState.originalIndex! + 1}.`);

      setReorderState({
        active: false,
        goalId: null,
        currentIndex: null,
        originalIndex: null,
        status,
      });
    }

    // Arrow keys: Move in reorder mode
    if (reorderState.active && reorderState.goalId === goal.id) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();

        const direction = e.key === 'ArrowUp' ? -1 : 1;
        const newIndex = (reorderState.currentIndex ?? reorderState.originalIndex ?? currentIndex) + direction;

        // Clamp to valid range
        const clampedIndex = Math.max(0, Math.min(goals.length - 1, newIndex));

        if (clampedIndex !== reorderState.currentIndex) {
          setReorderState(prev => ({
            ...prev,
            currentIndex: clampedIndex,
          }));

          announce(`Moved to position ${clampedIndex + 1} of ${goals.length}.`);
        }
      }
    }
  }, [reorderState, goals.length, onReorder, announce, status]);

  const onBlur = useCallback(() => {
    // Auto-save current position on focus loss
    if (reorderState.active && reorderState.currentIndex !== null && reorderState.originalIndex !== null) {
      onReorder(reorderState.originalIndex, reorderState.currentIndex);
      announce('Reorder saved on focus loss.');
    }

    // Reset reorder state
    setReorderState({
      active: false,
      goalId: null,
      currentIndex: null,
      originalIndex: null,
      status,
    });
  }, [reorderState, onReorder, announce, status]);

  const getGoalClasses = useCallback((goalId: string): string => {
    const classes: string[] = [];

    if (reorderState.active && reorderState.goalId === goalId) {
      classes.push('keyboard-reorder-mode');

      // Add indicator for pending position
      if (reorderState.currentIndex !== null && reorderState.originalIndex !== null && reorderState.currentIndex !== reorderState.originalIndex) {
        if (reorderState.currentIndex < reorderState.originalIndex) {
          classes.push('shift-down');
        } else {
          classes.push('shift-up');
        }
      }
    }

    return classes.join(' ');
  }, [reorderState.active, reorderState.goalId, reorderState.currentIndex, reorderState.originalIndex]);

  return {
    reorderState,
    handlers: {
      onKeyDown,
      onBlur,
    },
    getGoalClasses,
    getAriaLabel,
    announcementText,
  };
}
