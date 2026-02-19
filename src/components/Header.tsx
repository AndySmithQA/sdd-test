/**
 * Header component for doit application
 * Displays app title and primary actions
 */

import React from 'react';

export interface HeaderProps {
  /** Callback when Add Goal button is clicked */
  onAddGoal?: () => void;
}

/**
 * Header with app title and action buttons
 */
export const Header: React.FC<HeaderProps> = ({ onAddGoal }) => {
  return (
    <header className="bg-white shadow-sm py-3 mb-4">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="h3 mb-0">doit</h1>
            <p className="text-muted mb-0 small">Goal tracking made simple</p>
          </div>
          <div className="col-auto">
            {onAddGoal && (
              <button
                className="btn btn-primary"
                onClick={onAddGoal}
                aria-label="Add a new goal"
              >
                <span className="me-2">➕</span>
                Add Goal
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
