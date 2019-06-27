import React, { Component } from "react";
import Key from "./Key";
import Tone from "tone";
import scales from "../data/scalesObj";
import rootNote from "../data/rootNote";
import notes from "../data/notes";
import colors from "../data/colors";
import { makeScaleMajorMinor, makeScalePentatonicBlues } from "./theory";

//keys 1 to 0
const keycodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48];

let targetArr, activeElementsforKeyboard;

const pressedKeys = new Set();
const currentActiveNotes = new Set();

class Keyboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: [],
      scale: "",
      scaleSteps: {},
      mouse_is_down: false
    };

    this.synth = new Tone.PolySynth(6).toMaster(); // PolyPhonic Synth with 6 voices
    this.vol = new Tone.Volume(0);
    //this.synth.chain(this.vol, Tone.Master);
  }

  handleKeyDown = e => {
    /* this helps us deal with this problem in Chrome:
     *
     * The AudioContext was not allowed to start. It must be resumed (or created)
     * after a user gesture on the page. <URL>
     *
     */
    //e.preventDefault();

    if (Tone.context.state !== "running") {
      Tone.context.resume();
    }

    if (e.repeat) {
      console.log("repeat");
      return;
    } // prevent key from firing multiple times when key pressed for a long time

    if (window.event && "repeat" in window.event) {
      if (window.event.repeat) {
        console.log("repeat");
        return false;
      }
    }

    let buttonPressed;
    const mapKeyDown = keycodes.indexOf(e.keyCode);

    if (
      keycodes.includes(e.keyCode) &&
      mapKeyDown + 1 <= this.state.scaleSteps.steps.length
    ) {
      buttonPressed = activeElementsforKeyboard[mapKeyDown];

      pressedKeys.add(buttonPressed);
      this.highlight(buttonPressed);
      if (!currentActiveNotes.has(buttonPressed.dataset.Note)) {
        currentActiveNotes.add(buttonPressed.dataset.note);
        this.playNote(buttonPressed.dataset.note); //this.synth.triggerAttack(buttonPressed.dataset.note);
      }
      console.log("currentActiveNotes", currentActiveNotes);
    }
  };

  handleKeyUp = e => {
    //e.preventDefault();
    const mapKeyUp = keycodes.indexOf(e.keyCode);
    if (
      keycodes.includes(e.keyCode) &&
      mapKeyUp + 1 <= this.state.scaleSteps.steps.length
    ) {
      let buttonReleased;
      buttonReleased = activeElementsforKeyboard[mapKeyUp];

      // here the logic of the ui is separated from the one of the synth for clarity
      if (pressedKeys.has(buttonReleased)) {
        this.removeHighlight(buttonReleased);
        pressedKeys.delete(buttonReleased);
      }
      if (currentActiveNotes.has(buttonReleased.dataset.note)) {
        this.releaseNote(buttonReleased.dataset.note); //this.synth.triggerRelease(buttonReleased.dataset.note);
        currentActiveNotes.delete(buttonReleased.dataset.note);
        console.log(currentActiveNotes);
      }
    }
  };

  playNote = note => {
    this.synth.triggerAttack(note);
  };

  releaseNote = note => {
    this.synth.triggerRelease(note);
  };

  mouseDown = note => {
    /* this helps us deal with this problem in Chrome:
     *
     * The AudioContext was not allowed to start. It must be resumed (or created)
     * after a user gesture on the page. <URL>
     *
     */
    if (Tone.context.state !== "running") {
      Tone.context.resume();
    }
    this.setState({ mouse_is_down: true });
  };

  mouseUp = note => {
    this.setState({ mouse_is_down: false });
  };

  highlight = buttonTarget => {
    // Add press effect animation
    //console.log(buttonTarget);
    buttonTarget.classList.add("active");
  };

  removeHighlight = buttonTarget => {
    buttonTarget.classList.remove("active");
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let scaleSteps = scales.find(obj => obj.name === nextProps.scale);
    return {
      scaleSteps: scaleSteps
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.notation !== prevProps.notation ||
      this.props.scale !== prevProps.scale ||
      this.props.baseNote !== prevProps.baseNote
    ) {
      activeElementsforKeyboard = targetArr.filter(key => {
        for (let i = 0; i < key.children.length; i++) {
          if (key.children[i].classList.contains("on")) return key;
        }
      });
    }
  }

  componentDidMount() {
    const keyboard = document.querySelector(".Keyboard");

    targetArr = Array.from(document.querySelectorAll(".Key"));

    //only count the elements that are in the scale (className= .note .on)
    activeElementsforKeyboard = targetArr.filter(key => {
      for (let i = 0; i < key.children.length; i++) {
        if (key.children[i].classList.contains("on")) return key;
      }
    });

    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    keyboard.addEventListener("mousedown", this.mouseDown, false);
    keyboard.addEventListener("mouseup", this.mouseUp, false);

    let scaleSteps = scales.find(obj => obj.name === this.props.scale);
    this.setState({ scaleSteps: scaleSteps });
  }

  componentWillUnmount() {
    Tone.context.close();
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  render() {
    const that = this;

    let isMajorSeventh = false;

    const scaleSteps = scales.find(obj => obj.name === this.props.scale);

    const theScale = {};

    //this is my scale after applying the formulas for minor and major with the correct name
    //works only for major scales and for harmonic minor, melodic minor and natural minor
    for (let i = 0; i < that.props.notation.length; i++) {
      if (
        that.props.notation[i] === "English" ||
        that.props.notation[i] === "German" ||
        that.props.notation[i] === "Romance"
      ) {
        if (
          !this.props.scale.includes("Pentatonic") &&
          !this.props.scale.includes("Blues")
        ) {
          theScale[that.props.notation[i]] = makeScaleMajorMinor(
            scaleSteps.steps,
            that.props.baseNote,
            that.props.notation[i]
          );
        } else {
          theScale[that.props.notation[i]] = makeScalePentatonicBlues(
            scaleSteps.steps,
            that.props.baseNote,
            this.props.scale,
            that.props.notation[i]
          );
        }
      }
    }

    let currentRoot = rootNote.find(obj => {
      return obj.note === this.props.baseNote;
    });
    let displayNotes = notes.slice(currentRoot.index, currentRoot.index + 13);

    //we use relativeCount for Scale Steps
    let relativeCount = 1;
    let relativeCountScale = -1; //should start at 0, but since i am adding +1 at the beginning of the switch...
    let relativeCountChord = relativeCount;

    let noteList = displayNotes.map(function(note, index) {
      let noteName = [];
      let isKeyInScale = scaleSteps.steps.includes(index);

      if (index === scaleSteps.major_seventh) {
        isMajorSeventh = true;
      } else {
        isMajorSeventh = false;
      }
      let alreadyAdded = false; //this variable is to make sure we don't increment our relativeCountScale index double if we have to notations selected

      for (let i = 0; i < that.props.notation.length; i++) {
        switch (that.props.notation[i]) {
          case "Romance":
          case "English":
          case "German":
            if (!alreadyAdded && isKeyInScale) {
              relativeCountScale++;
            }
            alreadyAdded = true;
          case "Romance":
            if (isKeyInScale) {
              noteName.push(
                theScale[that.props.notation[i]][relativeCountScale]
              );
            }
            break;
          case "English":
            if (isKeyInScale) {
              noteName.push(
                theScale[that.props.notation[i]][relativeCountScale]
              );
            }
            break;
          case "German":
            if (isKeyInScale) {
              noteName.push(
                theScale[that.props.notation[i]][relativeCountScale]
              );
            }
            break;
          case "Relative":
            if (isKeyInScale) {
              noteName.push(notes[index].note_relative);
            }
            break;
          case "Scale Steps":
            if (isKeyInScale) {
              if (
                (that.props.scale !== "Major Pentatonic" &&
                  relativeCount !== 8) ||
                (that.props.scale === "Major Pentatonic" && relativeCount !== 7)
              ) {
                noteName.push(relativeCount);
              }
              relativeCount++;
              if (
                that.props.scale === "Major Pentatonic" &&
                relativeCount === 4
              ) {
                relativeCount++; // add one more, this scale doesn't have the number 4
              }
              if (
                that.props.scale === "Minor Pentatonic" &&
                (relativeCount === 2 || relativeCount === 6)
              ) {
                relativeCount++; // add one more, this scale doesn't have 2 or 6
              }
            }
            break;
          case "Chord extensions":
            if (isKeyInScale) {
              if (
                that.props.scale === "Major Pentatonic" &&
                relativeCountChord === 4
              ) {
                relativeCountChord++; // add one more, this scale doesn't have the number 4
              }
              if (
                that.props.scale === "Minor Pentatonic" &&
                (relativeCountChord === 2 || relativeCountChord === 6)
              ) {
                relativeCountChord++; // add one more, this scale doesn't have 2 or 6
              }
              if (
                relativeCountChord === 2 ||
                relativeCountChord === 4 ||
                relativeCountChord === 6
              ) {
                noteName.push(relativeCountChord + 7);
              }
              relativeCountChord++;
            }
            break;
          default:
          //note.note_english;
        }
      }
      return (
        <Key
          key={index}
          index={index}
          note={`${note.note_english}${
            that.props.octave + note.octaveOffset /*+ Math.floor(index/12)*/
          }`}
          notation={that.props.notation}
          noteName={noteName}
          color={colors[index]}
          offColor={note.colorRGBA}
          keyColor={note.pianoColor}
          isOn={isKeyInScale}
          root={that.props.baseNote}
          isMajorSeventh={isMajorSeventh}
          synth={that.synth}
          isMouseDown={that.state.mouse_is_down}
          pianoOn={that.props.pianoOn}
          theme={that.props.theme}
          trebleStaffOn={that.props.trebleStaffOn}
          showOffNotes={that.props.showOffNotes}
        />
      );
    });

    return <div className="Keyboard">{noteList}</div>;
  }
}

export default Keyboard;
