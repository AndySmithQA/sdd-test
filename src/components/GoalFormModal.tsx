/**
 * GoalFormModal component for creating new goals
 * Modal form with title, date, and description fields
 */

import React, { useState, useEffect } from 'react';
import type { CreateGoalInput } from '../types/goals';
import './GoalFormModal.css';

export interface GoalFormModalProps {
  /** Whether modal is open */
  isOpen: boolean;

  /** Callback when modal should close (user clicked Cancel or outside) */
  onClose: () => void;

  /** Callback with goal data when form is submitted */
  onSubmit: (goal: CreateGoalInput) => void;

  /** Whether form is currently submitting */
  isLoading?: boolean;

  /** Error message to display if any */
  error?: string | null;
}

interface FormData {
  title: string;
  endDate: string;
  description: string;
}

interface FormErrors {
  title?: string;
  endDate?: string;
  description?: string;
}

/**
 * Modal form for creating a new goal
 * Collects title, end date, and optional description
 */
export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    endDate: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Get minimum date (today) in YYYY-MM-DD format for date input
  const minDate = new Date().toISOString().split('T')[0];

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: '', endDate: '', description: '' });
      setErrors({});
      setSubmitted(false);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Goal title must be 100 characters or less';
    }

    // Validate end date
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) < new Date(minDate)) {
      newErrors.endDate = 'End date cannot be in the past';
    }

    // Validate description  (optional but validate if provided)
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      return;
    }

    const goalInput: CreateGoalInput = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      endDate: new Date(formData.endDate),
    };

    onSubmit(goalInput);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (submitted && errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on backdrop, not on modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="goal-modal-backdrop"
        onClick={handleBackdropClick}
        role="presentation"
      ></div>

      {/* Modal */}
      <div className="goal-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="goal-modal-content">
          <div className="goal-modal-header">
            <h2 id="modal-title" className="h5 mb-0">
              Create New Goal
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close modal"
              disabled={isLoading}
            ></button>
          </div>

          {/* Error message */}
          {error && (
            <div className="goal-modal-alert alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="goal-form">
            {/* Title field */}
            <div className="goal-form-group mb-3">
              <label htmlFor="goal-title" className="form-label">
                Goal Title <span className="text-danger">*</span>
              </label>
              <input
                id="goal-title"
                type="text"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                placeholder="What do you want to accomplish?"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                disabled={isLoading}
                required
                aria-required="true"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              <small className="form-text text-muted d-block mt-1">
                {formData.title.length}/100 characters
              </small>
              {errors.title && (
                <div id="title-error" className="invalid-feedback d-block">
                  {errors.title}
                </div>
              )}
            </div>

            {/* End date field */}
            <div className="goal-form-group mb-3">
              <label htmlFor="goal-end-date" className="form-label">
                Target End Date <span className="text-danger">*</span>
              </label>
              <input
                id="goal-end-date"
                type="date"
                name="endDate"
                className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                value={formData.endDate}
                onChange={handleChange}
                min={minDate}
                disabled={isLoading}
                required
                aria-required="true"
                aria-describedby={errors.endDate ? 'endDate-error' : undefined}
              />
              {errors.endDate && (
                <div id="endDate-error" className="invalid-feedback d-block">
                  {errors.endDate}
                </div>
              )}
            </div>

            {/* Description field */}
            <div className="goal-form-group mb-3">
              <label htmlFor="goal-description" className="form-label">
                Description <span className="text-muted small">(optional)</span>
              </label>
              <textarea
                id="goal-description"
                name="description"
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                placeholder="Add more details about your goal..."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                disabled={isLoading}
                aria-describedby={errors.description ? 'description-error' : undefined}
              ></textarea>
              <small className="form-text text-muted d-block mt-1">
                {formData.description.length}/500 characters
              </small>
              {errors.description && (
                <div id="description-error" className="invalid-feedback d-block">
                  {errors.description}
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="goal-form-actions d-flex gap-2 justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating...
                  </>
                ) : (
                  'Create Goal'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default GoalFormModal;
