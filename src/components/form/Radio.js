import React from "react";
import TrebleClef from '../../assets/img/TrebleClef';
import BassClef from '../../assets/img/BassClef';
import TenorClef from '../../assets/img/TenorClef';
import AltoClef from '../../assets/img/AltoClef';
import NoNoteClef from '../../assets/img/NoNoteClef';

const components = {
  'treble': <TrebleClef />,
  'bass': <BassClef />,
  'tenor': <TenorClef />,
  'alto': <AltoClef />,
  'no staff': <NoNoteClef />,
};

class Radio extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            isSelected: props.isSelected,
            label: props.label,
            nameField: props.nameField,
            onRadioChange: props.onRadioChange  
        }
    }

    render(){
        return(
            <div className="form-radio">
                <label className={`label-wrapper ${this.state.isSelected ? 'active' : ''}`}>
                    {components[this.state.label]}
                    <input
                    type="radio"
                    value={this.state.label}
                    data-testid={"Radio:"+this.state.label}
                    name={this.state.nameField}
                    checked={this.state.isSelected}
                    onChange={this.state.onRadioChange}
                    />
                    <span className="form-radio__label">{this.state.label}</span>
                </label>
            </div>
        )
    }
}

export default Radio;