/**
 * localStorage persistence helper for doit goals
 * Handles serialization, deserialization, versioning, and validation
 */

import type { Goal } from '../types/goals';

/**
 * Storage key and version for goals in localStorage
 * Versioning allows for safe schema migrations in future
 */
const STORAGE_KEY = 'goals:v1';
const STORAGE_VERSION = 1;

/**
 * Internal storage format - Date objects serialized to ISO strings
 */
interface StoredGoal extends Omit<Goal, 'endDate' | 'createdDate'> {
  endDate: string;      // ISO date string
  createdDate: string;  // ISO date string
}

interface StorageSchema {
  version: number;
  goals: StoredGoal[];
}

/**
 * Validate stored goal data and convert ISO strings back to Date objects
 */
function deserializeGoal(stored: StoredGoal): Goal {
  return {
    ...stored,
    endDate: new Date(stored.endDate),
    createdDate: new Date(stored.createdDate),
  };
}

/**
 * Convert Goal with Date objects to storable format with ISO strings
 */
function serializeGoal(goal: Goal): StoredGoal {
  return {
    ...goal,
    endDate: goal.endDate.toISOString(),
    createdDate: goal.createdDate.toISOString(),
  };
}

/**
 * Retrieve all goals from localStorage
 * Returns empty array if storage is empty or corrupted
 */
export function getAllGoals(): Goal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const schema: StorageSchema = JSON.parse(stored);

    // Validate schema version
    if (schema.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch. Expected ${STORAGE_VERSION}, got ${schema.version}`);
      return [];
    }

    // Validate and deserialize goals
    if (!Array.isArray(schema.goals)) {
      console.warn('Stored goals is not an array');
      return [];
    }

    return schema.goals.map((goal) => {
      try {
        return deserializeGoal(goal);
      } catch (error) {
        console.error('Failed to deserialize goal:', goal, error);
        return null;
      }
    }).filter((goal): goal is Goal => goal !== null);
  } catch (error) {
    console.error('Failed to retrieve goals from localStorage:', error);
    return [];
  }
}

/**
 * Save goals array to localStorage
 * Overwrites all existing goals
 */
export function saveGoals(goals: Goal[]): boolean {
  try {
    const schema: StorageSchema = {
      version: STORAGE_VERSION,
      goals: goals.map(serializeGoal),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
    return true;
  } catch (error) {
    console.error('Failed to save goals to localStorage:', error);
    return false;
  }
}

/**
 * Add a single new goal to storage
 */
export function addGoal(goal: Goal): boolean {
  try {
    const goals = getAllGoals();
    goals.push(goal);
    return saveGoals(goals);
  } catch (error) {
    console.error('Failed to add goal:', error);
    return false;
  }
}

/**
 * Update an existing goal by ID
 * Returns false if goal not found
 */
export function updateGoal(goalId: string, updates: Partial<Goal>): boolean {
  try {
    const goals = getAllGoals();
    const index = goals.findIndex((g) => g.id === goalId);

    if (index === -1) {
      console.warn(`Goal with ID ${goalId} not found`);
      return false;
    }

    goals[index] = { ...goals[index], ...updates, id: goalId }; // Prevent ID change
    return saveGoals(goals);
  } catch (error) {
    console.error('Failed to update goal:', error);
    return false;
  }
}

/**
 * Delete a goal by ID
 * Returns false if goal not found
 */
export function deleteGoal(goalId: string): boolean {
  try {
    const goals = getAllGoals();
    const filtered = goals.filter((g) => g.id !== goalId);

    if (filtered.length === goals.length) {
      console.warn(`Goal with ID ${goalId} not found`);
      return false;
    }

    return saveGoals(filtered);
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return false;
  }
}

/**
 * Get a single goal by ID
 * Returns null if not found
 */
export function getGoal(goalId: string): Goal | null {
  try {
    const goals = getAllGoals();
    return goals.find((g) => g.id === goalId) || null;
  } catch (error) {
    console.error('Failed to get goal:', error);
    return null;
  }
}

/**
 * Clear all goals from storage (destructive operation)
 * Used for testing or resetting application state
 */
export function clearAllGoals(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear goals:', error);
    return false;
  }
}

/**
 * Get storage statistics for debugging
 */
export function getStorageStats() {
  try {
    const goals = getAllGoals();
    const stored = localStorage.getItem(STORAGE_KEY);
    const sizeEstimate = stored ? new Blob([stored]).size : 0;

    return {
      goalCount: goals.length,
      storageSizeBytes: sizeEstimate,
      storageKey: STORAGE_KEY,
      version: STORAGE_VERSION,
    };
  } catch (error) {
    console.error('Failed to get storage stats:', error);
    return null;
  }
}
