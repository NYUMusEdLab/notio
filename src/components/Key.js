import React, { Component } from "react";
import PropTypes from "prop-types";
import Star from "../assets/img/Star";
import MusicalStaff from "./MusicalStaff";

class Key extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
  }

  touchDown = e => {
    if (e.cancelable) {
      e.preventDefault();
    }
    this.setState({ clicked: true });
    if (this.props.isOn) {
      this.playNote(this.props.note);
    }
  };
  touchUp = e => {
    if (e.cancelable) {
      e.preventDefault(); // prevent default calling of mouse event after touch event
    }
    this.setState({ clicked: false });
    if (this.props.isOn) {
      this.releaseNote(this.props.note);
    }
  };

  clickedMouse = e => {
    //console.log('mouse clicked', e);
    this.setState({ clicked: true });
    if (this.props.isOn) {
      this.playNote(this.props.note);
    }
  };
  unClickedMouse = e => {
    this.setState({ clicked: false });
    if (this.props.isOn) {
      this.releaseNote(this.props.note);
    }
  };

  mouseEnter = e => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.setState({ clicked: true });
      this.playNote(this.props.note);
    }
  };

  mouseLeave = e => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.setState({ clicked: false });
      this.releaseNote(this.props.note);
    }
  };

  playNote = note => {
    this.props.synth.triggerAttack(note);
  };

  releaseNote = note => {
    this.props.synth.triggerRelease(note);
  };

  componentDidMount() {
    this.keyRef.addEventListener("mouseenter", this.mouseEnter);
    this.keyRef.addEventListener("mouseleave", this.mouseLeave);
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    this.keyRef.removeEventListener("mouseenter", this.mouseEnter);
    this.keyRef.removeEventListener("mouseleave", this.mouseLeave);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isMouseDown: nextProps.isMouseDown
    };
  }

  render() {
    const { keyColor, color, offColor, isOn, noteName, theme } = this.props;

    let offKeyColorWithTheme;

    switch (theme) {
      case "light":
        offKeyColorWithTheme = offColor;
        break;
      case "dark":
        offKeyColorWithTheme = "#000";
        break;
      default:
        offKeyColorWithTheme = offColor;
    }

    const noteNames = noteName
      ? noteName.map(function(item, i) {
          item = item.toString();
          if (item.indexOf("b") > -1) {
            item = item.replace("b", "\u266D");
          }
          return (
            <div className="noteName" key={i}>
              {item}
            </div>
          );
        })
      : null;

    //console.log('mouseDown?', this.props.isMouseDown);

    return (
      <div
        ref={elem => (this.keyRef = elem)}
        className={`Key ${keyColor} ${
          this.state.clicked && isOn ? "active" : ""
        } ${isOn ? "on" : "off"} ${
          this.props.note.includes("C") ? "c-mark" : ""
        }`}
        style={{
          backgroundColor: isOn ? color : offKeyColorWithTheme,
          opacity: theme === "dark" ? "0.7" : null
        }}
        data-note={this.props.note}
        onMouseUp={this.unClickedMouse}
        onMouseDown={this.clickedMouse}
        onTouchStart={this.touchDown}
        onTouchEnd={this.touchUp}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        {/*toggle Piano */
        this.props.pianoOn ? (
          <div className={`piano-key ${keyColor}`}>
            {this.props.index === 0 ? this.props.root : null}
          </div>
        ) : null}
        <div
          className={`note ${isOn ? "on" : "off"}`}
          style={{
            backgroundColor: this.state.clicked ? color : null,
            height: this.props.pianoOn ? null : 0
          }}
        >
          {this.props.index === 0 ? null : noteNames}

          {this.props.isMajorSeventh ? (
            <div className="seventh">
              <Star style={{ height: 50 }} />
            </div>
          ) : null}
        </div>
        {isOn ? <MusicalStaff width={118} note={this.props.note} /> : null}
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
