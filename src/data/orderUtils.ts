/**
 * Goal order management utilities
 * Handles reordering operations and display order integrity
 */

import type { Goal, GoalStatus } from '../types/goals';
import type { ReorderOperation, ReorderResult } from '../types/dragDrop';

/**
 * Reorder a goal within its status group
 * Removes goal from fromIndex, inserts at toIndex, recalculates sequential order
 */
export function reorderGoals(
  goals: Goal[],
  operation: ReorderOperation
): ReorderResult {
  try {
    // Validate indices
    const statusGoals = goals.filter(g => g.status === operation.status);
    
    if (operation.fromIndex < 0 || operation.fromIndex >= statusGoals.length) {
      return {
        goals,
        success: false,
        error: `Invalid fromIndex: ${operation.fromIndex}`,
      };
    }

    if (operation.toIndex < 0 || operation.toIndex >= statusGoals.length) {
      return {
        goals,
        success: false,
        error: `Invalid toIndex: ${operation.toIndex}`,
      };
    }

    // Create a working array of status goals only
    const reordered = [...statusGoals];
    
    // Remove from source index
    const [draggedGoal] = reordered.splice(operation.fromIndex, 1);
    
    // Insert at destination index
    reordered.splice(operation.toIndex, 0, draggedGoal);
    
    // Recalculate displayOrder for reordered goals
    reordered.forEach((goal, index) => {
      goal.displayOrder = index;
    });

    // Get other status group (unchanged)
    const otherStatus: GoalStatus = operation.status === 'active' ? 'completed' : 'active';
    const otherGoals = goals.filter(g => g.status === otherStatus);

    // Combine and return
    const updatedGoals = operation.status === 'active'
      ? [...reordered, ...otherGoals]
      : [...otherGoals, ...reordered];

    return {
      goals: updatedGoals,
      success: true,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      goals,
      success: false,
      error: `Reorder failed: ${errorMsg}`,
    };
  }
}

/**
 * Normalize displayOrder for a status group to ensure sequential 0, 1, 2, ...
 * Fixes any gaps or duplicates in the order sequence
 */
export function normalizeDisplayOrder(
  goals: Goal[],
  status: GoalStatus
): Goal[] {
  const updated = [...goals];
  
  // Process each status group separately
  const statusGoals = updated.filter(g => g.status === status);
  
  // Reassign sequential order
  statusGoals.forEach((goal, index) => {
    goal.displayOrder = index;
  });

  return updated;
}

/**
 * Validate displayOrder integrity for a status group
 * Returns true if displayOrder values are sequential (0, 1, 2, ...) with no gaps
 */
export function validateDisplayOrder(goals: Goal[], status: GoalStatus): boolean {
  const statusGoals = goals
    .filter(g => g.status === status)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Check that orders are sequential starting from 0
  for (let i = 0; i < statusGoals.length; i++) {
    if (statusGoals[i].displayOrder !== i) {
      return false;
    }
  }

  return true;
}
