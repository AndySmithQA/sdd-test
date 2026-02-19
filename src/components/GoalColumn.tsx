/**
 * GoalColumn component - displays a list of goals in a column format
 */

import React, { useRef } from 'react';
import type { GoalWithDerivedFields } from '../types/goals';
import type { ReorderOperation } from '../types/dragDrop';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useKeyboardReorder } from '../hooks/useKeyboardReorder';
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

  /** Callback when goals are reordered */
  onReorder?: (operation: ReorderOperation) => void;

  /** Empty state message */
  emptyMessage?: string;
}

/**
 * Displays a column of goal cards with title and count with drag-and-drop and keyboard support
 */
export const GoalColumn: React.FC<GoalColumnProps> = ({
  goals,
  title,
  badgeColor = 'primary',
  onComplete,
  onDelete,
  onReorder,
  emptyMessage = 'No goals in this column',
}) => {
  const goalsListRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  
  // Determine status based on column (by convention: first column is active, second is completed)
  // This is inferred from the goals themselves
  const status = goals.length > 0 ? goals[0].status : 'active';
  
  const dragAndDrop = useDragAndDrop(
    status,
    goals,
    (fromIndex, toIndex) => {
      onReorder?.({
        fromIndex,
        toIndex,
        status,
      });
    }
  );

  const keyboardReorder = useKeyboardReorder(
    status,
    goals,
    (fromIndex, toIndex) => {
      onReorder?.({
        fromIndex,
        toIndex,
        status,
      });
    }
  );

  const handleMouseUp = () => {
    dragAndDrop.handlers.onMouseUp();
  };

  const handleMouseLeave = () => {
    dragAndDrop.handlers.onMouseLeave();
  };

  return (
    <div className="card bg-light">
      <div className="card-header bg-white border-bottom">
        <h2 className="h5 mb-0">
          {title}
          <span className={`badge bg-${badgeColor} ms-2`}>{goals.length}</span>
        </h2>
      </div>
      
      {/* ARIA live region for keyboard reorder announcements */}
      <div 
        ref={liveRegionRef}
        className="aria-live-region"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
      >
        {keyboardReorder.announcementText}
      </div>
      
      <div 
        className="card-body"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {goals.length === 0 ? (
          <p className="text-muted text-center py-4 mb-0">{emptyMessage}</p>
        ) : (
          <div 
            className="goals-list"
            ref={goalsListRef}
          >
            {goals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onComplete={onComplete}
                onDelete={onDelete}
                className={`${dragAndDrop.getGoalClasses(goal.id, index)} ${keyboardReorder.getGoalClasses(goal.id)}`.trim()}
                onMouseDown={dragAndDrop.handlers.onMouseDown(goal)}
                onMouseMove={dragAndDrop.handlers.onMouseMove(index)}
                onKeyDown={keyboardReorder.handlers.onKeyDown(goal, index)}
                onBlur={keyboardReorder.handlers.onBlur}
                tabIndex={0}
                ariaLabel={keyboardReorder.getAriaLabel(goal, index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalColumn;
