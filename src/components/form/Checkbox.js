import React from "react";

const Checkbox = ({ className = "", label, isSelected, onCheckboxChange }) => (
  <div className={`form-check ${className}`}>
    <label className="label-wrapper">
      <input type="checkbox" name={label} checked={isSelected} onChange={onCheckboxChange} />
      <span className="checkmark"></span>
      <h4>{label}</h4>
    </label>
  </div>
);

export default Checkbox;
