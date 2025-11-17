import React, { Component } from "react";
import PropTypes from "prop-types";

class PianoKey extends Component {
  constructor(props) {
    super(props);
    this.keyRef = React.createRef();
    this.state = {
      isMouseDown: false,
    };
  }
  touchDown = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (this.props.toneIsInScale) {
      this.playNote(this.props.note);
    }
  };
  touchUp = (e) => {
    if (e.cancelable) {
      e.preventDefault(); // prevent default calling of mouse event after touch event
    }
    if (this.props.toneIsInScale) {
      this.releaseNote(this.props.note);
    }
  };

  clickedMouse = (e) => {
    if (this.props.toneIsInScale) {
      this.playNote(this.props.note);
    }
  };
  unClickedMouse = (e) => {
    if (this.props.toneIsInScale) {
      this.releaseNote(this.props.note);
    }
  };

  mouseEnter = (e) => {
    if (this.props.toneIsInScale && this.props.isMouseDown === true) {
      this.playNote(this.props.note);
    }
  };

  mouseLeave = (e) => {
    if (this.props.toneIsInScale && this.props.isMouseDown === true) {
      this.releaseNote(this.props.note);
    }
  };

  playNote = (note) => {
    this.props.noteOnHandler(note);
  };

  releaseNote = (note) => {
    this.props.noteOffHandler(note);
  };

  updateDimensions = () => {
    const myWidth = this.keyRef.current.clientWidth;
    this.setState({ myWidth: myWidth });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.showOffNotes !== prevProps.showOffNotes ||
      this.props.noteName !== prevProps.noteName
    ) {
      this.updateDimensions();
    }
  }

  componentDidMount() {
    this.keyRef.current.addEventListener("mouseenter", this.mouseEnter);
    this.keyRef.current.addEventListener("mouseleave", this.mouseLeave);
    //run it the first time
    this.updateDimensions();
    // and then run it on resize
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    this.keyRef.current.removeEventListener("mouseenter", this.mouseEnter);
    this.keyRef.current.removeEventListener("mouseleave", this.mouseLeave);
    window.removeEventListener("resize", this.updateDimensions);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isMouseDown: nextProps.isMouseDown,
    };
  }

  render() {
    const { keyColor, color, isActive, noteNameEnglish } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={this.keyRef}
        className={`piano-key ${keyColor} ${noteNameEnglish.toLowerCase()}`}
        style={{
          backgroundColor: isActive && keyColor === "white" ? color : "",
        }}
        onMouseUp={this.unClickedMouse}
        onMouseDown={this.clickedMouse}
        onTouchStart={this.touchDown}
        onTouchEnd={this.touchUp}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}>
        {keyColor === "black" ? (
          <div className="blackPianoKeyContainer">
            <div className="blackPianoKey" style={{ backgroundColor: isActive ? color : "" }}></div>
            <div className="blackPianoKeyFiller"></div>
          </div>
        ) : null}
        {noteNameEnglish === "C" ? "C" : null}
      </div>
    );
  }
}

PianoKey.propTypes = {
  note: PropTypes.string,
  toneIsInScale: PropTypes.bool,
  color: PropTypes.string,
  keyColor: PropTypes.string,
  index: PropTypes.number,
  root: PropTypes.string,
  isActive: PropTypes.bool,
};

export default PianoKey;
