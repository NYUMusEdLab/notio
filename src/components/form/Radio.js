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
  'hide notes': <NoNoteClef />,
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
                <label className={`label-wrapper ${this.props.isSelected ? 'active' : ''}`}>
                    {components[this.props.label]}
                    <input
                        type="radio"
                        value={this.props.label}
                        data-testid={"Radio:"+this.props.label}
                        name={this.props.nameField}
                        checked={this.props.isSelected}
                        onChange={this.props.onRadioChange}
                    />
                    <span className="form-radio__label">{this.props.label}</span>
                </label>
            </div>
        )
    }
}

export default Radio;