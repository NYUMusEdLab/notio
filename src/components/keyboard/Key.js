import React, { Component } from "react";
import PropTypes from "prop-types";
import ColorKey from "./ColorKey";
import PianoKey from "./PianoKey";

class Key extends Component {
  constructor(props) {
    super(props);
    // Create ref for the container div to enable programmatic focus
    this.divRef = React.createRef();
  }

  // Expose focus() method for parent component to call
  focus() {
    if (this.divRef.current) {
      this.divRef.current.focus();
    }
  }

  handleKeyDown = (event) => {
    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      if (this.props.toneIsInScale) {
        this.props.noteOnHandler(this.props.note);
        // Release note after a short duration (similar to a quick tap)
        setTimeout(() => {
          this.props.noteOffHandler(this.props.note);
        }, 200);
      }
    }
  };

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
        ref={this.divRef}
        className={`Key ${keyColor}
          ${toneIsInScale ? "on" : "off"}`}
        data-testid="test-key"
        data-note={note}
        onKeyDown={this.handleKeyDown}
        tabIndex={-1}
        role="button"
        aria-label={`Play ${note}`}>
        <ColorKey
          data-testid="test-color-key"
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
              data-testid="test-piano-key"
              note={note}
              noteNameEnglish={noteNameEnglish}
              toneIsInScale={toneIsInScale}
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
  toneIsInScale: PropTypes.bool,
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
