/**
 * Goal entity types for doit goal tracking application
 * Defines the data structure for goals and related operations
 */

/**
 * Goal status enumeration
 */
export type GoalStatus = 'active' | 'completed';

/**
 * Core Goal entity matching localStorage persistence schema
 */
export interface Goal {
  /** Unique identifier for the goal (UUID v4 format) */
  id: string;

  /** Goal title - required field (1-100 characters) */
  title: string;

  /** Optional goal description (max 500 characters) */
  description?: string;

  /** Target end date for the goal (required) */
  endDate: Date;

  /** Current goal status: active (in progress) or completed */
  status: GoalStatus;

  /** Date when goal was created (auto-generated, UTC ISO string in storage) */
  createdDate: Date;

  /** Display order rank within status column (0-based index, auto-assigned) */
  displayOrder: number;
}

/**
 * Goal with computed/derived fields for display
 * Extends Goal with calculated properties based on current date
 */
export interface GoalWithDerivedFields extends Goal {
  /** Number of calendar days remaining until end date (can be negative for overdue) */
  daysRemaining: number;

  /** True if goal is due within 3 calendar days (1-3 days from today) */
  isDueSoon: boolean;

  /** True if goal end date is in the past */
  isOverdue: boolean;

  /** True if goal end date is today */
  isDueToday: boolean;
}

/**
 * Request/response types for goal operations
 */

/** Payload for creating a new goal (excludes id, createdDate) */
export interface CreateGoalInput {
  title: string;
  description?: string;
  endDate: Date;
}

/** Payload for updating an existing goal (partial update) */
export interface UpdateGoalInput {
  title?: string;
  description?: string;
  endDate?: Date;
  status?: GoalStatus;
}

/** Generic response wrapper for goals operations */
export interface GoalsResponse {
  goals: Goal[];
  error?: string;
}

/** Response for single goal operation */
export interface GoalResponse {
  goal: Goal;
  error?: string;
}
