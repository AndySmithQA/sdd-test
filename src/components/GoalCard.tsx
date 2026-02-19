/**
 * GoalCard component - displays individual goal with days remaining
 */

import React from 'react';
import type { GoalWithDerivedFields } from '../types/goals';
import '../styles/theme.css';

export interface GoalCardProps {
  goal: GoalWithDerivedFields;
  onComplete?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
}

/**
 * Renders a single goal card with title, description, days remaining, and action buttons
 */
export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onComplete,
  onDelete,
}) => {
  // Format days remaining for display
  const getDaysRemainingText = (): { text: string; className: string } => {
    if (goal.isDueToday) {
      return { text: 'Due today', className: 'today' };
    }
    if (goal.isOverdue) {
      return { text: `${Math.abs(goal.daysRemaining)} days overdue`, className: 'overdue' };
    }
    const daysWord = goal.daysRemaining === 1 ? 'day' : 'days';
    return { text: `${goal.daysRemaining} ${daysWord} left`, className: '' };
  };

  const daysDisplay = getDaysRemainingText();

  // Determine card CSS class based on status
  const getCardClasses = (): string => {
    const baseClass = 'goal-card';
    if (goal.status === 'completed') {
      return `${baseClass} completed`;
    }
    if (goal.isDueSoon) {
      return `${baseClass} due-soon`;
    }
    if (goal.isOverdue) {
      return `${baseClass} overdue`;
    }
    return baseClass;
  };

  return (
    <div className={getCardClasses()} role="article" aria-label={`Goal: ${goal.title}`}>
      {/* Checkbox for completion */}
      <div className="d-flex align-items-flex-start gap-2">
        <input
          type="checkbox"
          className="goal-checkbox mt-1"
          checked={goal.status === 'completed'}
          onChange={() => onComplete?.(goal.id)}
          aria-label={`Mark goal as ${goal.status === 'completed' ? 'incomplete' : 'complete'}`}
          disabled={goal.status === 'completed'}
        />
        <div className="flex-grow-1">
          <h3 className="goal-title">{goal.title}</h3>

          {/* Description - only show if present */}
          {goal.description && (
            <p className="goal-description">{goal.description}</p>
          )}

          {/* Days remaining */}
          <p className={`goal-days-remaining ${daysDisplay.className}`}>
            {daysDisplay.text}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="goal-actions">
        {goal.status === 'active' && (
          <>
            <button
              className="goal-btn goal-btn-primary"
              onClick={() => onComplete?.(goal.id)}
              aria-label="Mark as completed"
              title="Mark goal as completed"
            >
              ✓ Complete
            </button>
            <button
              className="goal-btn goal-btn-danger"
              onClick={() => onDelete?.(goal.id)}
              aria-label="Delete goal"
              title="Delete goal permanently"
            >
              🗑 Delete
            </button>
          </>
        )}
        {goal.status === 'completed' && (
          <button
            className="goal-btn goal-btn-secondary"
            onClick={() => onDelete?.(goal.id)}
            aria-label="Delete completed goal"
            title="Delete goal permanently"
          >
            🗑 Delete
          </button>
        )}
      </div>

      {/* Hidden text for screen readers with goal metadata */}
      <div className="visually-hidden" role="status">
        Goal status: {goal.status}. End date: {goal.endDate.toLocaleDateString()}. Created: {goal.createdDate.toLocaleDateString()}.
      </div>
    </div>
  );
};

export default GoalCard;
