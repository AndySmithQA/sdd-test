import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';
import './App.css';

import { useState } from 'react';
import { useGoals } from './hooks/useGoals';
import Header from './components/Header';
import GoalFormModal from './components/GoalFormModal';
import GoalColumn from './components/GoalColumn';
import type { CreateGoalInput } from './types/goals';

/**
 * Main App component
 * Sets up two-column layout with active goals (left) and completed goals (right)
 * Manages goal creation modal state and deletion confirmations
 */
export default function App() {
  const { activeGoals, completedGoals, isLoading, error, addGoal, completeGoal, deleteGoal } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const handleAddGoalClick = () => {
    setIsModalOpen(true);
    setSubmitError(undefined);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSubmitError(undefined);
  };

  const handleFormSubmit = async (goalInput: CreateGoalInput) => {
    try {
      setIsSubmitting(true);
      setSubmitError(undefined);

      // Add goal through hook (auto-persists)
      addGoal(goalInput);

      // Close modal on success
      setIsModalOpen(false);
      setIsSubmitting(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create goal';
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  const handleCompleteGoal = (goalId: string) => {
    completeGoal(goalId);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      deleteGoal(goalId);
    }
  };

  return (
    <div className="app-container bg-light min-vh-100">
      {/* Header with app title and add goal button */}
      <Header onAddGoal={handleAddGoalClick} />

      {/* Goal creation modal */}
      <GoalFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        error={submitError || undefined}
      />

      {/* Main content area */}
      <main className="container-fluid">
        {/* Error message display */}
        {error && (
          <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
            <strong>Warning:</strong> {error}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Two-column layout for goals */}
        {!isLoading && (
          <div className="row g-3">
            {/* Active goals column (left) */}
            <div className="col-12 col-md-6">
              <GoalColumn
                goals={activeGoals}
                title="Active Goals"
                badgeColor="primary"
                onComplete={handleCompleteGoal}
                onDelete={handleDeleteGoal}
                emptyMessage="No active goals yet. Click 'Add Goal' to get started!"
              />
            </div>

            {/* Completed goals column (right) */}
            <div className="col-12 col-md-6">
              <GoalColumn
                goals={completedGoals}
                title="Completed Goals"
                badgeColor="success"
                onDelete={handleDeleteGoal}
                emptyMessage="No completed goals yet. Complete your first goal!"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
