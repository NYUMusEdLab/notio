import React from "react";

const Radio = ({ nameField, label, isSelected, onRadioChange }) => (
  <div className="form-radio">
    <label className={`label-wrapper ${isSelected ? 'active' : ''}`}>
      <input
        type="radio"
        value={label}
        name={nameField}
        checked={isSelected}
        onChange={onRadioChange}
      />
      {label}
    </label>
  </div>
);

export default Radio;