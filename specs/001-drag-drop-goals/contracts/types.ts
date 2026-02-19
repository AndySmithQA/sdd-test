/**
 * TypeScript Type Definitions for Drag-and-Drop Goal Reordering
 * 
 * These types define the contracts for drag-and-drop and keyboard reordering
 * functionality. They extend the existing Goal types with display order
 * management and provide runtime state types for drag operations.
 * 
 * @see data-model.md for detailed entity documentation
 */

import type { Goal, GoalStatus } from '../../../src/types/goals';

// =============================================================================
// ENHANCED GOAL TYPES
// =============================================================================

/**
 * Goal with display order field (enhanced from base Goal type)
 * 
 * This extends the existing Goal interface to include displayOrder,
 * which determines the visual position within a status column.
 * 
 * @extends Goal
 */
export interface GoalWithOrder extends Goal {
  /**
   * Zero-based position index within the status group (active or completed)
   * Lower values appear first in the list
   * Must be non-negative integer, unique within status group
   */
  displayOrder: number;
}

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
  goals: GoalWithOrder[];

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
export type ReorderDirection = 'up' | 'down';

// =============================================================================
// VISUAL FEEDBACK TYPES
// =============================================================================

/**
 * CSS class names for drag-and-drop visual states
 * Applied to goal cards during drag operations
 */
export interface DragVisualState {
  /**
   * Applied to the goal currently being dragged
   */
  dragging: string;

  /**
   * Applied to goals that should shift down to make space
   */
  shiftDown: string;

  /**
   * Applied to goals that should shift up to make space
   */
  shiftUp: string;

  /**
   * Applied to indicate drop target position
   */
  dropTarget: string;
}

/**
 * CSS class names for keyboard reorder visual states
 */
export interface KeyboardVisualState {
  /**
   * Applied to goal in active reorder mode
   */
  reorderMode: string;

  /**
   * Applied to pending position indicator
   */
  pendingPosition: string;

  /**
   * Applied to goal with keyboard focus
   */
  focused: string;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Return type for useDragAndDrop custom hook
 * Provides state and handlers for mouse-based drag-and-drop
 */
export interface UseDragAndDropReturn {
  /**
   * Current drag state
   */
  dragState: DragState;

  /**
   * Event handlers to bind to goal cards
   */
  handlers: DragHandlers;

  /**
   * Whether a drag is currently in progress
   */
  isDragging: boolean;

  /**
   * Get CSS classes for a goal based on drag state
   * @param goalId - ID of the goal
   * @param index - Current index of the goal
   */
  getGoalClasses: (goalId: string, index: number) => string;
}

/**
 * Return type for useKeyboardReorder custom hook
 * Provides state and handlers for keyboard-based reordering
 */
export interface UseKeyboardReorderReturn {
  /**
   * Current keyboard reorder state
   */
  reorderState: KeyboardReorderState;

  /**
   * Event handlers to bind to goal cards
   */
  handlers: KeyboardReorderHandlers;

  /**
   * Whether reorder mode is active
   */
  isReordering: boolean;

  /**
   * Get CSS classes for a goal based on keyboard state
   * @param goalId - ID of the goal
   * @param index - Current index of the goal
   */
  getGoalClasses: (goalId: string, index: number) => string;

  /**
   * Get ARIA label for a goal card
   * @param goal - The goal
   * @param index - Current index
   * @param totalCount - Total goals in the list
   */
  getAriaLabel: (goal: Goal, index: number, totalCount: number) => string;
}

// =============================================================================
// STORAGE TYPES
// =============================================================================

/**
 * localStorage serialization format for goals with display order
 * Extends existing StoredGoal with displayOrder field
 */
export interface StoredGoalWithOrder {
  id: string;
  title: string;
  description?: string;
  endDate: string; // ISO date string
  status: GoalStatus;
  createdDate: string; // ISO date string
  displayOrder: number;
}

/**
 * Parameters for reordering goals in storage
 */
export interface ReorderGoalsParams {
  /**
   * All current goals
   */
  goals: GoalWithOrder[];

  /**
   * Reorder operation to apply
   */
  operation: ReorderOperation;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Type guard to check if a goal has displayOrder
 */
export function hasDisplayOrder(goal: Goal): goal is GoalWithOrder {
  return 'displayOrder' in goal && typeof (goal as GoalWithOrder).displayOrder === 'number';
}

/**
 * Type guard to check if drag state is active
 */
export function isDragActive(dragState: DragState): boolean {
  return dragState.draggedGoal !== null;
}

/**
 * Type guard to check if keyboard reorder is active
 */
export function isKeyboardReordering(state: KeyboardReorderState): boolean {
  return state.active && state.goalId !== null;
}
