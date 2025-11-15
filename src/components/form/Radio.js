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

    handleKeyDown = (event) => {
        // Allow arrow keys to bubble up for menu navigation
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) {
            // Don't handle these - let the menu container handle them
            return;
        }

        // Activate on Enter or Space
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.props.onRadioChange({
                target: { value: this.props.label }
            });
        }
    };

    render(){
        return(
            <div className="form-radio">
                <div
                    className={`label-wrapper ${this.props.isSelected ? 'active' : ''}`}
                    tabIndex={-1}
                    role="menuitemradio"
                    aria-checked={this.props.isSelected ? 'true' : 'false'}
                    onKeyDown={this.handleKeyDown}
                    onClick={() => this.props.onRadioChange({
                        target: { value: this.props.label }
                    })}
                    data-testid={"Radio:"+this.props.label}>
                    {components[this.props.label]}
                    <span className="form-radio__label">{this.props.label}</span>
                </div>
            </div>
        )
    }
}

export default Radio;