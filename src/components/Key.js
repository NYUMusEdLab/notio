import React, { Component } from "react";
import PropTypes from "prop-types";
import ColorKey from "./ColorKey";
import PianoKey from "./PianoKey";

class Key extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {
      keyColor,
      isOn,
      color,
      theme
    } = this.props;

    //console.log('mouseDown?', this.props.isMouseDown);
    
    return (
      <div 
        className={`Key ${keyColor}
          ${isOn ? "on" : "off"}`}

          data-note={this.props.note}
      >
      <ColorKey
        color={this.props.color}
        keyColor={this.props.keyColor}
        isOn={this.props.isOn}
        noteName={this.props.noteName}
        theme={this.props.theme}
        trebleStaffOn={this.props.trebleStaffOn}
        note={this.props.note}
        synth={this.props.synth}
        pianoOn={this.props.pianoOn}
        isMouseDown={this.props.isMouseDown}
        keyIndex={this.props.keyIndex}
      />
        {/*toggle Piano */
        this.props.pianoOn ? (
          <PianoKey 
            note={this.props.note}
            isOn={this.props.isOn}
            keyColor={this.props.keyColor}
            index={this.props.index}
            root={this.props.root}
            synth={this.props.synth}
            isMouseDown={this.props.isMouseDown}
          />
        ) : null}
      </div>
    );
  }
}

Key.propTypes = {
  note: PropTypes.string,
  notation: PropTypes.array,
  noteName: PropTypes.array,
  color: PropTypes.string,
  offcolor: PropTypes.string,
  keyColor: PropTypes.string,
  isOn: PropTypes.bool,
  root: PropTypes.string,
  isMajorSeventh: PropTypes.bool
  //add the rest
};

export default Key;
