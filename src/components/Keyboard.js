/* eslint-disable no-fallthrough */

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

let targetArr, activeElementsforKeyboard, scaleSteps;
let onlyScaleIndex = 0;

let threeLowerOctave = new Set();

const pressedKeys = new Set();
const currentActiveNotes = new Set();

class Keyboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: [],
      currentScale: "",
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

    const { scaleSteps } = this.state;

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
      mapKeyDown + 1 <= scaleSteps.steps.length
    ) {
      buttonPressed = activeElementsforKeyboard[mapKeyDown];

      pressedKeys.add(buttonPressed);
      this.highlight(buttonPressed);
      if (!currentActiveNotes.has(buttonPressed.dataset.Note)) {
        currentActiveNotes.add(buttonPressed.dataset.note);
        this.playNote(buttonPressed.dataset.note); //this.synth.triggerAttack(buttonPressed.dataset.note);
      }
      console.log("currentActiveNotes", currentActiveNotes);
    } else {
      let threeLowerOctaveArr = Array.from(threeLowerOctave);
      // TODO:lowernotes are played when clicked QAZ
      ///let currentRoot = rootNote.find(obj => {
      //   return obj.note === baseNote;
      // });
      // let lowerNotes = notes.slice(
      //   currentRoot.index + 9,
      //   currentRoot.index + 12
      // );
      // console.log(lowerNotes);
      // TODO: it's not correct

      let previousOctave = threeLowerOctaveArr.map(function(note) {
        let currentOctave = note.match(/(\d+)/)[0];
        return note.replace(/(\d+)/, currentOctave - 1);
      });

      if (e.code === "KeyQ") {
        this.playNote(previousOctave[previousOctave.length - 2]);
      }
      if (e.code === "KeyA") {
        this.playNote(previousOctave[previousOctave.length - 3]);
      }
      if (e.code === "KeyZ") {
        this.playNote(previousOctave[previousOctave.length - 4]);
      }
    }
  };

  handleKeyUp = e => {
    //e.preventDefault();

    const { scaleSteps } = this.state;

    const mapKeyUp = keycodes.indexOf(e.keyCode);
    if (
      keycodes.includes(e.keyCode) &&
      mapKeyUp + 1 <= scaleSteps.steps.length
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
        //console.log(currentActiveNotes);
      }
    } else {
      //TODO: it's not correct
      let threeLowerOctaveArr = Array.from(threeLowerOctave);
      let previousOctave = threeLowerOctaveArr.map(function(note) {
        let currentOctave = note.match(/(\d+)/)[0];
        return note.replace(/(\d+)/, currentOctave - 1);
      });

      if (e.code === "KeyQ") {
        this.releaseNote(previousOctave[previousOctave.length - 2]);
      }
      if (e.code === "KeyA") {
        this.releaseNote(previousOctave[previousOctave.length - 3]);
      }
      if (e.code === "KeyZ") {
        this.releaseNote(previousOctave[previousOctave.length - 4]);
      }
    }
  };

  playNote = note => {
    console.log("playing " + note);
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

  //this function will generate the notes (english) that will be passed to ToneJs, with Enharmonicss
  generateCurrentScale = scaleFormula => {
    if (
      !this.props.scale.includes("Pentatonic") &&
      !this.props.scale.includes("Blues")
    )
      return makeScaleMajorMinor(scaleFormula, this.props.baseNote, "English");
    else
      return makeScalePentatonicBlues(
        scaleFormula,
        this.props.baseNote,
        this.props.scale,
        "English"
      );
  };

  generateScales = scaleSteps => {
    let theScale = {};
    //this is my scale after applying the formulas for minor and major with the correct name
    //works only for major scales and for harmonic minor, melodic minor and natural minor
    for (let i = 0; i < this.props.notation.length; i++) {
      if (
        this.props.notation[i] === "English" ||
        this.props.notation[i] === "German" ||
        this.props.notation[i] === "Romance"
      ) {
        if (
          !this.props.scale.includes("Pentatonic") &&
          !this.props.scale.includes("Blues")
        ) {
          theScale[this.props.notation[i]] = makeScaleMajorMinor(
            scaleSteps,
            this.props.baseNote,
            this.props.notation[i]
          );
        } else {
          theScale[this.props.notation[i]] = makeScalePentatonicBlues(
            scaleSteps,
            this.props.baseNote,
            this.props.scale,
            this.props.notation[i]
          );
        }
      }
    }
    return theScale;
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    let scaleSteps = scales.find(obj => obj.name === nextProps.scale);
    return {
      scaleSteps: scaleSteps
    };
  }

  componentDidUpdate(prevProps) {
    //refresh the keys every time we update the props
    if (
      this.props.notation !== prevProps.notation ||
      this.props.scale !== prevProps.scale ||
      this.props.baseNote !== prevProps.baseNote
    ) {
      activeElementsforKeyboard = targetArr.filter(key => {
        for (let i = 0; i < key.children.length; i++) {
          if (key.children[i].classList.contains("on")) return key;
        }
        return;
      });
      scaleSteps = scales.find(obj => obj.name === this.props.scale);
      this.setState({
        currentScale: this.generateCurrentScale(scaleSteps.steps)
      });
      threeLowerOctave.clear();
    }
    onlyScaleIndex = 0;
  }

  componentDidMount() {
    scaleSteps = scales.find(obj => obj.name === this.props.scale);
    this.setState({
      currentScale: this.generateCurrentScale(scaleSteps.steps)
    });

    const keyboard = document.querySelector(".Keyboard");

    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    keyboard.addEventListener("mousedown", this.mouseDown, false);
    keyboard.addEventListener("mouseup", this.mouseUp, false);

    let scaleSteps = scales.find(obj => obj.name === this.props.scale);
    this.setState({ scaleSteps: scaleSteps });

    targetArr = Array.from(document.querySelectorAll(".Key"));

    //only count the elements that are in the scale (className= .note .on)
    activeElementsforKeyboard = targetArr.filter(key => {
      for (let i = 0; i < key.children.length; i++) {
        if (key.children[i].classList.contains("on")) return key;
      }
    });
  }

  componentWillUnmount() {
    Tone.context.close();
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  render() {
    const {
      notation,
      scale,
      octave,
      baseNote,
      pianoOn,
      theme,
      trebleStaffOn,
      showOffNotes
    } = this.props;

    const { synth } = this;
    const { mouse_is_down } = this.state;

    let isMajorSeventh = false;

    scaleSteps = scales.find(obj => obj.name === this.props.scale);

    const theScale = this.generateScales(scaleSteps.steps);

    let scaleObj; // get object from scalesObj.js
    scales.forEach(obj => {
      if (obj.name === scale) {
        scaleObj = obj;
      }
    });
    
    let baseScale = this.generateCurrentScale(scaleSteps.steps);

    let currentRoot = rootNote.find(obj => {
      return obj.note === this.props.baseNote;
    });
    const displayNotes = notes.slice(currentRoot.index, currentRoot.index + 13);
    
    //we use relativeCount for Scale Steps
    let relativeCount = 0;
    let relativeCountScale = -1; //should start at 0, but since i am adding +1 at the beginning of the switch...
    let relativeCountChord = relativeCount;

    const noteList = displayNotes.map(function(note, index) {
      let noteName = [];
      const isKeyInScale = scaleSteps.steps.includes(index);

      if (index === scaleSteps.major_seventh) {
        isMajorSeventh = true;
      } else {
        isMajorSeventh = false;
      }
      let alreadyAdded = false; //this variable is to make sure we don't increment our relativeCountScale index double if we have to notations selected

      for (let i = 0; i < notation.length; i++) {
        switch (notation[i]) {
          case "Romance":
          case "English":
          case "German":
            if (!alreadyAdded && isKeyInScale) {
              relativeCountScale++;
            }
            alreadyAdded = true;
          case "Romance":
            if (isKeyInScale) {
              noteName.push(theScale[notation[i]][relativeCountScale]);
            }
            break;
          case "English":
            if (isKeyInScale) {
              noteName.push(theScale[notation[i]][relativeCountScale]);
            }
            break;
          case "German":
            if (isKeyInScale) {
              noteName.push(theScale[notation[i]][relativeCountScale]);
            }
            break;
          case "Relative":
            if (isKeyInScale) {
              noteName.push(notes[index].note_relative);
            }
            break;
          case "Scale Steps":
            if (isKeyInScale) {
              noteName.push(scaleObj.numbers[(relativeCount++) % scaleObj.numbers.length]);
            }
            break;
          case "Chord extensions":
            if (isKeyInScale) {
              // get number (1, b3, #4...)
              let numberString = scaleObj.numbers[(relativeCountChord++) % scaleObj.numbers.length];
              let number, accidential = '';
              if (!isNaN(numberString.substr(0,1))) {
                // only number (no accidential), add one octave to number
                number = parseInt(numberString) + 7
              } else {
                // we got # or b in front of number, preserve that
                number = parseInt(numberString.substr(1)) + 7;
                accidential = numberString.substr(0,1)
              }
              if (number % 2 === 1) { // only show odd numbers (9, 11, 13)
                noteName.push(accidential+number);
              }
            }
            break;
          default:
          //note.note_english;
        }
      }

      let noteThatWillSound;
      let noteOffset = note.octaveOffset;
      if (isKeyInScale) {
        noteThatWillSound = baseScale[onlyScaleIndex];
        //special cases = C enharmonics
        if (noteThatWillSound === "Cb") noteOffset++;
        if (noteThatWillSound === "B#") noteOffset--;
        onlyScaleIndex++;
      } else {
        noteThatWillSound = null;
      }
      // console.log(
      //   "noteThatWillSound",
      //   noteThatWillSound,
      //   "onlyScaleIndex",
      //   onlyScaleIndex
      // );
      const wholeNote = noteThatWillSound + (octave + noteOffset);
      if (typeof wholeNote === "string")
        threeLowerOctave.add(noteThatWillSound + (octave + noteOffset));

      return (
        <Key
          key={index}
          index={index}
          note={`${noteThatWillSound ? noteThatWillSound : note.note_english}${
            octave + noteOffset /*+ Math.floor(index/12)*/
          }`}
          notation={notation}
          noteName={noteName}
          color={colors[index]}
          offColor={note.colorRGBA}
          keyColor={note.pianoColor}
          isOn={isKeyInScale}
          root={baseNote}
          isMajorSeventh={isMajorSeventh}
          synth={synth}
          isMouseDown={mouse_is_down}
          pianoOn={pianoOn}
          theme={theme}
          trebleStaffOn={trebleStaffOn}
          showOffNotes={showOffNotes}
        />
      );
    });

    return <div className="Keyboard">{noteList}</div>;
  }
}

export default Keyboard;
