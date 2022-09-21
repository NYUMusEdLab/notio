import React, { Component } from "react";
import PropTypes from "prop-types";
import ColorKey from "./ColorKey";
import PianoKey from "./PianoKey";

class Key extends Component {
  render() {
    const {
      keyColor,
      color,
      theme,
      noteName,
      note,
      synth,
      trebleStaffOn,
      pianoOn,
      toneIsInScale,
      isMouseDown,
      isActive,
      keyIndex,
      noteOnHandler,
      noteOffHandler,
      index,
      noteNameEnglish,
      root,
      extendedKeyboard,
      clef,
    } = this.props;
    // console.log("Key note", note, noteName);
    return (
      <div
        className={`Key ${keyColor}
          ${toneIsInScale ? "on" : "off"}`}
        data-note={note}>
        <ColorKey
          color={color}
          keyColor={keyColor}
          toneIsInScale={toneIsInScale}
          noteName={noteName}
          theme={theme}
          trebleStaffOn={trebleStaffOn}
          note={note}
          synth={synth}
          pianoOn={pianoOn}
          isMouseDown={isMouseDown}
          keyIndex={keyIndex}
          noteOnHandler={noteOnHandler}
          noteOffHandler={noteOffHandler}
          extendedKeyboard={extendedKeyboard}
          clef={clef}
        />
        {
          /*toggle Piano */
          pianoOn ? (
            <PianoKey
              note={note}
              noteNameEnglish={noteNameEnglish}
              isOn={toneIsInScale}
              color={color}
              keyColor={keyColor}
              index={index}
              root={root}
              synth={synth}
              isMouseDown={isMouseDown}
              isActive={isActive}
              noteOnHandler={noteOnHandler}
              noteOffHandler={noteOffHandler}
            />
          ) : null
        }
      </div>
    );
  }
}

Key.propTypes = {
  note: PropTypes.string,
  notation: PropTypes.array,
  noteName: PropTypes.array,
  color: PropTypes.string,
  // offcolor: PropTypes.string,
  keyColor: PropTypes.string,
  isOn: PropTypes.bool,
  root: PropTypes.string,
  isMajorSeventh: PropTypes.bool,
  isActive: PropTypes.bool,
  isMouseDown: PropTypes.bool,
  noteNameEnglish: PropTypes.string,
  noteOn: PropTypes.func,
  noteOff: PropTypes.func,
  synth: PropTypes.object,
  extendedKeyboard: PropTypes.bool,
  clef: PropTypes.string,
  //add the rest
};

export default Key;
