import React from "react";

const Checkbox = ({ className = "", label, isSelected, onCheckboxChange }) => {
  const handleKeyDown = (event) => {
    // Allow arrow keys to bubble up for menu navigation
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) {
      // Don't handle these - let the menu container handle them
      return;
    }

    // Activate on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCheckboxChange({ target: { name: label } });
    }
  };

  return (
    <div className={`form-check ${className}`}>
      <div
        className="label-wrapper"
        tabIndex={-1}
        role="menuitemcheckbox"
        aria-checked={isSelected ? 'true' : 'false'}
        onKeyDown={handleKeyDown}
        onClick={() => onCheckboxChange({ target: { name: label } })}>
        <span className="checkmark"></span>
        {label}
      </div>
    </div>
  );
};

export default Checkbox;
