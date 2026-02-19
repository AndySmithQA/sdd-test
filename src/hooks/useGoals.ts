/**
 * useGoals React hook
 * Manages goal state with localStorage persistence and computed fields
 */

import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Goal, GoalWithDerivedFields, CreateGoalInput, UpdateGoalInput } from '../types/goals';
import {
  getAllGoals,
  saveGoals,
  addGoal as storageAddGoal,
  updateGoal as storageUpdateGoal,
  deleteGoal as storageDeleteGoal,
} from '../data/goalsStorage';
import { differenceInCalendarDays, startOfDay } from 'date-fns';

/**
 * Compute derived fields for a goal based on current date
 */
function computeDerivedFields(goal: Goal): GoalWithDerivedFields {
  const today = startOfDay(new Date());
  const endDate = startOfDay(new Date(goal.endDate));
  const daysRemaining = differenceInCalendarDays(endDate, today);

  return {
    ...goal,
    daysRemaining,
    isDueSoon: goal.status === 'active' && daysRemaining >= 1 && daysRemaining <= 3,
    isOverdue: goal.status === 'active' && daysRemaining < 0,
    isDueToday: goal.status === 'active' && daysRemaining === 0,
  };
}

/**
 * Generate UUID v4 for new goals
 * Falls back to simple random ID if crypto is not available
 */
function generateGoalId(): string {
  try {
    return uuidv4();
  } catch {
    // Fallback to simple random ID
    return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export interface UseGoalsReturn {
  /** All goals with computed derived fields */
  goals: GoalWithDerivedFields[];

  /** Active goals (not completed) */
  activeGoals: GoalWithDerivedFields[];

  /** Completed goals */
  completedGoals: GoalWithDerivedFields[];

  /** Loading state for initial load from localStorage */
  isLoading: boolean;

  /** Error message if any operation failed */
  error: string | null;

  /** Add a new goal */
  addGoal: (input: CreateGoalInput) => void;

  /** Update goal status or other fields */
  updateGoal: (goalId: string, updates: UpdateGoalInput) => void;

  /** Delete a goal permanently */
  deleteGoal: (goalId: string) => void;

  /** Mark goal as completed */
  completeGoal: (goalId: string) => void;

  /** Get single goal with derived fields */
  getGoal: (goalId: string) => GoalWithDerivedFields | undefined;

  /** Clear all goals (testing/reset) */
  clearAllGoals: () => void;
}

/**
 * React hook for managing goals with localStorage persistence
 * Provides CRUD operations and computed derived fields
 */
export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<GoalWithDerivedFields[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals from localStorage on mount
  useEffect(() => {
    try {
      const stored = getAllGoals();
      const withDerived = stored.map(computeDerivedFields);
      setGoals(withDerived);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load goals';
      setError(message);
      console.error('Failed to load goals:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-persist to localStorage whenever goals change
  useEffect(() => {
    if (!isLoading && goals.length > 0) {
      try {
        // Remove derived fields before saving
        const toSave: Goal[] = goals.map(({ daysRemaining, isDueSoon, isOverdue, isDueToday, ...rest }) => ({
          ...rest,
          endDate: new Date(rest.endDate),
          createdDate: new Date(rest.createdDate),
        }));
        saveGoals(toSave);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save goals';
        setError(message);
        console.error('Failed to save goals:', err);
      }
    }
  }, [goals, isLoading]);

  const addGoal = useCallback((input: CreateGoalInput) => {
    try {
      const newGoal: Goal = {
        id: generateGoalId(),
        title: input.title,
        description: input.description,
        endDate: new Date(input.endDate),
        status: 'active',
        createdDate: new Date(),
      };

      const withDerived = computeDerivedFields(newGoal);
      setGoals((prev) => [...prev, withDerived]);
      setError(null);

      // Also persist immediately
      storageAddGoal(newGoal);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add goal';
      setError(message);
      console.error('Failed to add goal:', err);
    }
  }, []);

  const updateGoal = useCallback((goalId: string, updates: UpdateGoalInput) => {
    try {
      setGoals((prev) => {
        const updated = prev.map((goal) => {
          if (goal.id === goalId) {
            const newGoal: Goal = {
              ...goal,
              ...updates,
              id: goal.id,
              createdDate: goal.createdDate,
              endDate: updates.endDate ? new Date(updates.endDate) : goal.endDate,
            };
            return computeDerivedFields(newGoal);
          }
          return goal;
        });
        return updated;
      });

      // Persist update
      const current = goals.find((g) => g.id === goalId);
      if (current) {
        const toUpdate: Goal = { ...current, ...updates } as Goal;
        storageUpdateGoal(goalId, toUpdate);
      }

      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update goal';
      setError(message);
      console.error('Failed to update goal:', err);
    }
  }, [goals]);

  const completeGoal = useCallback((goalId: string) => {
    updateGoal(goalId, { status: 'completed' });
  }, [updateGoal]);

  const deleteGoal = useCallback((goalId: string) => {
    try {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      storageDeleteGoal(goalId);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete goal';
      setError(message);
      console.error('Failed to delete goal:', err);
    }
  }, []);

  const getGoal = useCallback((goalId: string): GoalWithDerivedFields | undefined => {
    return goals.find((g) => g.id === goalId);
  }, [goals]);

  const clearAllGoals = useCallback(() => {
    try {
      setGoals([]);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear goals';
      setError(message);
      console.error('Failed to clear goals:', err);
    }
  }, []);

  return {
    goals,
    activeGoals: goals.filter((g) => g.status === 'active'),
    completedGoals: goals.filter((g) => g.status === 'completed'),
    isLoading,
    error,
    addGoal,
    updateGoal,
    completeGoal,
    deleteGoal,
    getGoal,
    clearAllGoals,
  };
}
