/**
 * GoalColumn component - displays a list of goals in a column format
 */

import React from 'react';
import type { GoalWithDerivedFields } from '../types/goals';
import GoalCard from './GoalCard';

export interface GoalColumnProps {
  /** List of goals to display */
  goals: GoalWithDerivedFields[];

  /** Column title */
  title: string;

  /** Badge color for the count */
  badgeColor?: 'primary' | 'success' | 'danger';

  /** Callback when goal is marked complete */
  onComplete?: (goalId: string) => void;

  /** Callback when goal is deleted */
  onDelete?: (goalId: string) => void;

  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Displays a column of goal cards with title and count
 */
export const GoalColumn: React.FC<GoalColumnProps> = ({
  goals,
  title,
  badgeColor = 'primary',
  onComplete,
  onDelete,
  emptyMessage = 'No goals in this column',
}) => {
  return (
    <div className="card bg-light">
      <div className="card-header bg-white border-bottom">
        <h2 className="h5 mb-0">
          {title}
          <span className={`badge bg-${badgeColor} ms-2`}>{goals.length}</span>
        </h2>
      </div>
      <div className="card-body">
        {goals.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">{emptyMessage}</p>
        ) : (
          <div className="goals-list">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalColumn;
