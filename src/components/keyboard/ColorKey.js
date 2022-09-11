import React, { Component } from "react";
import PropTypes from "prop-types";
import Star from "../../assets/img/Star";
import MusicalStaff from "../musicScore/MusicalStaff";
import Color from "color";

class ColorKey extends Component {
  constructor(props) {
    super(props);
    this.keyRef = React.createRef();
    this.initColor(props.color);
    this.state = {
      isMouseDown: false,
      _color: this._colorInit,
    };
  }
  touchDown = (e) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    if (this.props.isOn) {
      this.playNote(this.props.note);
    }
  };
  touchUp = (e) => {
    if (e.cancelable) {
      e.preventDefault(); // prevent default calling of mouse event after touch event
    }
    if (this.props.isOn) {
      this.releaseNote(this.props.note);
    }
  };

  //TODO: check if this is used or can be used to fix the unresponsive keys color when pressed
  onMouseOver = (e) => {
    if (this.props.isOn) {
      // this.setState((state) => {
      //   return { _color: this._colorActive, }
      // })
    }
  };

  //TODO: check if this is used or can be used to fix the unresponsive keys color when pressed
  onMouseOut = (e) => {
    if (this.props.isOn) {
      // this.setState((state) => {
      //   return { _color: this._colorInit, }
      // })
    }
  };

  clickedMouse = (e) => {
    if (this.props.isOn) {
      this.setState((state) => {
        return {
          _color:
            "linear-gradient(180deg, rgba(255,255,255,0) 20%, " +
            this._colorActive +
            " 100%, " +
            this._colorActive +
            " 100%)",
        };
      });
      this.playNote(this.props.note);
    }
  };
  unClickedMouse = (e) => {
    if (this.props.isOn) {
      this.setState((state) => {
        return { _color: this._colorInit };
      });
      this.releaseNote(this.props.note);
    }
  };

  mouseEnter = (e) => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.playNote(this.props.note);
    }
  };

  mouseLeave = (e) => {
    if (this.props.isOn && this.props.isMouseDown === true) {
      this.releaseNote(this.props.note);
    }
  };

  playNote = (note) => {
    this.props.noteOn(note);
  };

  releaseNote = (note) => {
    this.props.noteOff(note);
  };

  updateDimensions = () => {
    const myWidth = this.keyRef.current.clientWidth;
    this.setState({ myWidth: myWidth });
  };

  initColor = (color) => {
    this._colorInit = Color(color);
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.showOffNotes !== prevProps.showOffNotes ||
      this.props.noteName !== prevProps.noteName
    ) {
      this.updateDimensions();
    }

    if (this.props.color !== prevProps.color) {
      this.initColor(this.props.color);
      this.setState({ _color: this._colorInit });
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
      isMajorSeventh,
      extendedKeyboard,
      clef,
    } = this.props;

    // console.log("ColorKey note", note);

    const noteNames = noteName
      ? noteName.map(function (item, i) {
          var name = item.value.toString();
          const regexFlat = /[b]/gi;
          const regexSharp = /[#]/gi;

          let flats = name.match(regexFlat);
          let sharps = name.match(regexSharp);
          if (flats && flats.length === 2) {
            //doubleflat
            name = name.replace("bb", "𝄫");
            //item = item.replace("bb", "\u1D12B");
          } else if (flats && flats.length === 1) {
            //flat
            name = name.replace("b", "\u266D");
          } else if (sharps && sharps.length === 2) {
            //doubleSharp
            name = name.replace("##", "×"); //𝄪
          }

          return (
            <div className={`noteName noteWrapper--${item.key}`} key={i}>
              {name}
            </div>
          );
        })
      : null;
    // console.log("this.state.myWidth", this.state.myWidth);
    // console.log("-- note", note);

    return (
      <div
        ref={this.keyRef}
        data-testid={"ColorKey:" + note}
        className={`color-key ${this.state.clicked && isOn ? "active" : ""} ${
          isOn ? "on" : "off"
        } ${
          (note.includes("C") && !note.includes("#") && !note.includes("b")) || note.includes("B#")
            ? "" /*"c-mark"*/
            : ""
        }
        `}
        style={{
          height: pianoOn ? "70%" : "100%",
          background: isOn
            ? this.state._color
            : "linear-gradient(356deg, rgba(249,247,223,1) 0%, rgba(235,227,245,1) 100%)",
          opacity: theme === "dark" ? "0.7" : null,
        }}
        onMouseUp={this.unClickedMouse}
        onMouseDown={this.clickedMouse}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        onTouchStart={this.touchDown}
        onTouchEnd={this.touchUp}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}>
        <div
          className={`noteWrapper note ${isOn ? "on" : "off"}`}
          style={{
            backgroundColor: this.state.clicked ? color : null,
            top: extendedKeyboard ? "17%" : "10%",
          }}>
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
            extendedKeyboard={extendedKeyboard}
            clef={clef}
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
  keyColor: PropTypes.string,
  isOn: PropTypes.bool,
  root: PropTypes.string,
  isMajorSeventh: PropTypes.bool,
  keyIndex: PropTypes.number,
  extendedKeyboard: PropTypes.bool,
};

export default ColorKey;