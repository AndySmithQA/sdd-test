/**
 * TypeScript definitions for drag-and-drop and keyboard reordering
 * Extends Goal types with display order management and provides runtime state types
 * 
 * @see ../data-model.md for detailed entity documentation
 */

import type { Goal, GoalStatus } from './goals';

// =============================================================================
// DRAG-AND-DROP STATE TYPES
// =============================================================================

/**
 * Runtime state for mouse-based drag-and-drop operations
 * Managed by useDragAndDrop hook, not persisted
 */
export interface DragState {
  /**
   * The goal currently being dragged, or null if no active drag
   */
  draggedGoal: Goal | null;

  /**
   * Original index of the dragged goal before drag started
   * Used to restore position if drag is cancelled
   */
  draggedIndex: number | null;

  /**
   * Current drop target index (where goal will be inserted if released now)
   * Updates as cursor moves over other goals
   */
  dropTargetIndex: number | null;

  /**
   * Which column the drag is happening in (determines goal filtering)
   */
  status: GoalStatus;
}

/**
 * Mouse event handlers for drag-and-drop operations
 * Returned by useDragAndDrop hook for binding to goal cards
 */
export interface DragHandlers {
  /**
   * Handler for mousedown event - initiates drag
   * @param goal - The goal being dragged
   */
  onMouseDown: (goal: Goal) => (e: React.MouseEvent) => void;

  /**
   * Handler for mousemove event - updates drop target
   * @param index - Index of the goal being hovered over
   */
  onMouseMove: (index: number) => (e: React.MouseEvent) => void;

  /**
   * Handler for mouseup event - completes or cancels drag
   */
  onMouseUp: () => void;

  /**
   * Handler for mouse leaving droppable area - visual feedback cleanup
   */
  onMouseLeave: () => void;
}

// =============================================================================
// KEYBOARD REORDER STATE TYPES
// =============================================================================

/**
 * Runtime state for keyboard-based reordering
 * Managed by useKeyboardReorder hook, not persisted
 */
export interface KeyboardReorderState {
  /**
   * Whether keyboard reorder mode is currently active
   * True from Space/Enter until Enter/Escape/focus loss
   */
  active: boolean;

  /**
   * ID of the goal currently in reorder mode, or null
   */
  goalId: string | null;

  /**
   * Current pending position during reordering (updates with arrow keys)
   */
  currentIndex: number | null;

  /**
   * Original position before reorder mode started (for cancel/restore)
   */
  originalIndex: number | null;

  /**
   * Which column the keyboard reorder is happening in
   */
  status: GoalStatus;
}

/**
 * Keyboard event handlers for reordering
 * Returned by useKeyboardReorder hook for binding to goal cards
 */
export interface KeyboardReorderHandlers {
  /**
   * Handler for keydown events (Space, Enter, Escape, Arrow keys)
   * @param goal - The goal receiving keyboard focus
   * @param index - Current index of the focused goal
   */
  onKeyDown: (goal: Goal, index: number) => (e: React.KeyboardEvent) => void;

  /**
   * Handler for focus events - maintains keyboard navigation
   */
  onFocus: (goal: Goal, index: number) => () => void;

  /**
   * Handler for blur events - auto-save if in reorder mode
   */
  onBlur: () => void;
}

// =============================================================================
// REORDER OPERATION TYPES
// =============================================================================

/**
 * Parameters for a reorder operation
 * Used by both drag-and-drop and keyboard reordering
 */
export interface ReorderOperation {
  /**
   * Source index (where goal currently is)
   */
  fromIndex: number;

  /**
   * Destination index (where goal should move to)
   */
  toIndex: number;

  /**
   * Status group for the reorder (active or completed column)
   */
  status: GoalStatus;
}

/**
 * Result of a reorder operation
 */
export interface ReorderResult {
  /**
   * Updated goals array with new display orders
   */
  goals: Goal[];

  /**
   * Whether the reorder was successful
   */
  success: boolean;

  /**
   * Error message if reorder failed
   */
  error?: string;
}

/**
 * Direction of reorder movement
 */
export type ReorderDirection = 'up' | 'down' | 'to-index';
