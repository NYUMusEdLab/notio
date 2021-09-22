import React from "react";
// import logo from '../../img/alto_clef.svg'

import TrebleClef from '../../assets/img/TrebleClef';
import BassClef from '../../assets/img/BassClef';
import TenorClef from '../../assets/img/TenorClef';
import AltoClef from '../../assets/img/AltoClef';

const components = {
  'treble': <TrebleClef />,
  'bass': <BassClef />,
  'tenor': <TenorClef />,
  'alto': <AltoClef />,
};

const Radio = ({ nameField, label, isSelected, onRadioChange }) => (
  <div className="form-radio">
    <label className={`label-wrapper ${isSelected ? 'active' : ''}`}>
      {components[label]}
      <input
        type="radio"
        value={label}
        data-testid={"Radio:"+label}
        name={nameField}
        checked={isSelected}
        onChange={onRadioChange}
      />
      <span className="form-radio__label">{label}</span>
    </label>
  </div>
);

export default Radio;