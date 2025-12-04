/**
 * ErrorMessage Component
 *
 * Displays validation errors and warnings to users with proper accessibility support.
 * Uses aria-live region to announce errors to screen readers.
 */

import React from 'react';

/**
 * ErrorMessage component for displaying validation errors
 *
 * @param {Object} props
 * @param {string[]} props.errors - Array of error messages to display
 * @param {string} props.className - Optional CSS class name
 * @param {string} props.title - Optional title for the error section
 * @returns {JSX.Element|null} Error message component or null if no errors
 *
 * @example
 * <ErrorMessage
 *   errors={['Invalid octave', 'Invalid video URL']}
 *   title="Configuration Errors"
 * />
 */
const ErrorMessage = ({ errors = [], className = '', title = 'Errors' }) => {
  // Don't render if no errors
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div
      className={`error-message ${className}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {title && <h3 className="error-message-title">{title}</h3>}
      <ul className="error-message-list">
        {errors.map((error, index) => (
          <li key={index} className="error-message-item">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ErrorMessage;
