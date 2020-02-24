import React, { Component } from "react";
import PropTypes from "prop-types";
import Star from "../assets/img/Star";
import MusicalStaff from "./MusicalStaff";

class ColorKey extends Component {
  constructor(props) {
    super(props);
    this.keyRef = React.createRef();
    this.state = {
      isMouseDown: false
    };
  }
  touchDown = e => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (this.props.isOn) {
      this.playNote(this.props.note);
    }
  };
  touchUp = e => {
    if (e.cancelable) {
      e.preventDefault(); // prevent default calling of mouse event after touch event
    }
    if (this.props.isOn) {
      this.releaseNote(this.props.note);
    }
  };

  clickedMouse = e => {
    if (this.props.isOn) {
      this.playNote(this.props.note);
    }
  };
  unClickedMouse = e => {
    if (this.props.isOn) {
      this.releaseNote(this.props.note);
    }
  };

  mouseEnter = e => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.playNote(this.props.note);
    }
  };

  mouseLeave = e => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.releaseNote(this.props.note);
    }
  };

  playNote = note => {
    this.props.noteOn(note);
  };

  releaseNote = note => {
    this.props.noteOff(note);
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
      isMouseDown: nextProps.isMouseDown
    };
  }

  render() {
    const {
      color,
      isOn,
      pianoOn,
      noteName,
      theme,
      trebleStaffOn,
      keyIndex,
      note,
      showOffNotes,
      isMajorSeventh
    } = this.props;

    let offKeyColorWithTheme;

    switch (theme) {
      case "light":
        offKeyColorWithTheme = ["#eee", "#ddd"]; //offColor;
        break;
      case "dark":
        offKeyColorWithTheme = ["#000", "#333"];
        break;
      default:
        offKeyColorWithTheme = ["#ddd", "#ccc"]; //offColor;
    }

    const noteNames = noteName
      ? noteName.map(function(item, i) {
          item = item.toString();
          if (item.indexOf("b") === 2) {
            //doubleflat
            item = item.replace("bb", "\u1D12B");
          } else if (item.indexOf("b") === 1) {
            //flat
            item = item.replace("b", "\u266D");
          }
          return (
            <div className="noteName" key={i}>
              {item}
            </div>
          );
        })
      : null;

    return (
      <div
        ref={this.keyRef}
        className={`color-key ${this.state.clicked && isOn ? "active" : ""} ${
          isOn ? "on" : "off"
        } ${
          (note.includes("C") && !note.includes("#") && !note.includes("b")) ||
          note.includes("B#")
            ? "" /*"c-mark"*/
            : ""
        }
                    `}
        style={{
          height: pianoOn ? "70%" : "100%",
          background: isOn
            ? color
            : `repeating-linear-gradient(
                            0deg,
                            ${offKeyColorWithTheme[0]},
                            ${offKeyColorWithTheme[0]} 15px,
                            ${offKeyColorWithTheme[1]} 15px,
                            ${offKeyColorWithTheme[1]} 30px
                          )`,
          opacity: theme === "dark" ? "0.7" : null
        }}
        onMouseUp={this.unClickedMouse}
        onMouseDown={this.clickedMouse}
        onTouchStart={this.touchDown}
        onTouchEnd={this.touchUp}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <div
          className={`note ${isOn ? "on" : "off"}`}
          style={{
            backgroundColor: this.state.clicked ? color : null
          }}
        >
          {noteNames}

          {isMajorSeventh ? (
            <div className="seventh">
              <Star style={{ height: 50 }} />
            </div>
          ) : null}
        </div>
        {trebleStaffOn && this.state.myWidth ? (
          <MusicalStaff
            width={this.state.myWidth}
            note={note}
            showOffNotes={showOffNotes}
            keyIndex={keyIndex}
            isOn={isOn}
          />
        ) : null}
      </div>
    );
  }
}

ColorKey.propTypes = {
  note: PropTypes.string,
  notation: PropTypes.array,
  noteName: PropTypes.array,
  color: PropTypes.string,
  //offcolor: PropTypes.string,
  keyColor: PropTypes.string,
  isOn: PropTypes.bool,
  root: PropTypes.string,
  isMajorSeventh: PropTypes.bool,
  keyIndex: PropTypes.number
};

export default ColorKey;
