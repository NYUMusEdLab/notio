import React from "react";

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
  <div className="form-check">
    <label className="label-wrapper">
      <input
        type="checkbox"
        name={label}
        checked={isSelected}
        onChange={onCheckboxChange}
      />
      <span className="checkmark"></span>
      {label}
    </label>
  </div>
);

export default Checkbox;