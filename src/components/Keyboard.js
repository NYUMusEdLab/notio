/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Key from "./Key";
import * as Tone from 'tone';
import scales from "../data/scalesObj";
import rootNote from "../data/rootNote";
import notes from "../data/notes";
import colors from "../data/colors";
import { makeScaleMajorMinor, makeScalePentatonicBlues } from "./theory";
import { Piano } from '@tonejs/piano'


// Using 'code' property for compatibility with AZERTY, QWERTY... keyboards 
const keycodes = ['KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
  'KeyL', 'Semicolon', 'Quote'];

const keycodesExtended = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
  'KeyL', 'Semicolon', 'Quote', 'BracketLeft', 'Equal'];

let targetArr, activeElementsforKeyboard, scaleSteps;
let onlyScaleIndex = 0;

let threeLowerOctave = new Set();

const pressedKeys = new Set();
//const currentActiveNotes = new Set();

class Keyboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: new Set(),
      currentScale: "",
      scaleSteps: {},
      mouse_is_down: false
    };

    this.synth = new Piano({
      velocities: 5
    }).toDestination()
    this.vol = new Tone.Volume(4);

    this.synth.load().then(() => {
      console.log('--------------- Piano loaded!');
    });
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

    const { extendedKeyboard } = this.props;

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
    const activeKeyCodes = extendedKeyboard ? keycodesExtended : keycodes;
    const mapKeyDown = activeKeyCodes.indexOf(e.code);
    console.log(activeKeyCodes, e.code)
    console.log(activeKeyCodes.includes(e.code), mapKeyDown + 1 <= activeElementsforKeyboard.length)
    if (
      activeKeyCodes.includes(e.code) &&
      mapKeyDown + 1 <= activeElementsforKeyboard.length
    ) {
      console.log("note on");
      buttonPressed = activeElementsforKeyboard[mapKeyDown];

      pressedKeys.add(buttonPressed);
      /*this.highlightNote(buttonPressed.dataset.note) //.querySelector('.on'));
      if (!currentActiveNotes.has(buttonPressed.dataset.note)) {
        currentActiveNotes.add(buttonPressed.dataset.note);
        this.playNote(buttonPressed.dataset.note); //this.synth.triggerAttack(buttonPressed.dataset.note);
      }*/
      this.noteOn(buttonPressed.dataset.note);
    } else if (!extendedKeyboard) {
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

      let previousOctave = threeLowerOctaveArr.map(function (note) {
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

    const { extendedKeyboard } = this.props;

    const activeKeyCodes = extendedKeyboard ? keycodesExtended : keycodes;
    const mapKeyUp = activeKeyCodes.indexOf(e.code);
    if (
      activeKeyCodes.includes(e.code) &&
      mapKeyUp + 1 <= activeElementsforKeyboard.length
    ) {
      console.log('note off')
      let buttonReleased;
      buttonReleased = activeElementsforKeyboard[mapKeyUp];

      if (pressedKeys.has(buttonReleased)) {
        pressedKeys.delete(buttonReleased);
      }
      this.noteOff(buttonReleased.dataset.note);
    } else if (!extendedKeyboard) {
      //TODO: it's not correct
      let threeLowerOctaveArr = Array.from(threeLowerOctave);
      let previousOctave = threeLowerOctaveArr.map(function (note) {
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
    // this.synth.keyDown(note);
    this.synth.keyDown({ note: note })
  };

  releaseNote = note => {
    this.synth.keyUp({ note: note });
  };

  noteOn = note => {
    const { activeNotes } = this.state;

    if (!activeNotes.has(note)) {
      this.playNote(note);
      this.highlightNote(note);

      let newActiveNotes = new Set(activeNotes);
      newActiveNotes.add(note);
      this.setState({ activeNotes: newActiveNotes });
    }
  };

  noteOff = note => {
    const { activeNotes } = this.state;

    if (activeNotes.has(note)) {
      this.releaseNote(note);
      this.removeHighlightNote(note);

      let newActiveNotes = new Set(activeNotes);
      newActiveNotes.delete(note);
      this.setState({ activeNotes: newActiveNotes });
    }
  };

  mouseDown = () => {
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

  mouseUp = () => {
    this.setState({ mouse_is_down: false });
  };

  highlightNote = note => {
    // Add press effect animation
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.add("active");
  };

  removeHighlightNote = note => {
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.remove("active");
  };

  //this function will generate the notes (english) that will be passed to ToneJs, with Enharmonicss
  generateCurrentScale = scaleFormula => {
    const { scale, baseNote } = this.props;
    if (scale.includes("Chromatic")) {
      return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }
    else if (!scale.includes("Pentatonic") && !scale.includes("Blues")) {
      return makeScaleMajorMinor(scaleFormula, baseNote, "English");
    }
    else {
      return makeScalePentatonicBlues(scaleFormula, baseNote, scale, "English");
    }

  };

  generateScales = scaleSteps => {
    let theScale = {};

    const { notation, scale, baseNote } = this.props;

    console.log("generateScales notation", notation);
    console.log("generateScales scale", scale);
    console.log("generateScales baseNote", baseNote);
    //this is my scale after applying the formulas for minor and major with the correct name
    //works only for major scales and for harmonic minor, melodic minor and natural minor
    for (let i = 0; i < notation.length; i++) {
      if (
        notation[i] === "English" ||
        notation[i] === "German" ||
        notation[i] === "Romance"
      ) {
        if (scale.includes("Chromatic")) {
          return { Romance: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] };
        }
        else if (!scale.includes("Pentatonic") && !scale.includes("Blues")) {
          theScale[notation[i]] = makeScaleMajorMinor(
            scaleSteps,
            baseNote,
            notation[i]
          );
        } else {
          theScale[notation[i]] = makeScalePentatonicBlues(
            scaleSteps,
            baseNote,
            scale,
            notation[i]
          );
        }
      }
    }

    console.log("theScale", theScale);
    return theScale;
  };

  static getDerivedStateFromProps(nextProps) {
    let scaleSteps = scales.find(obj => obj.name === nextProps.scale);
    return {
      scaleSteps: scaleSteps
    };
  }

  componentDidUpdate(prevProps) {
    //refresh the keys every time we update the props
    const { notation, scale, baseNote, extendedKeyboard } = this.props;
    if (
      notation !== prevProps.notation ||
      scale !== prevProps.scale ||
      baseNote !== prevProps.baseNote ||
      extendedKeyboard !== prevProps.extendedKeyboard
    ) {
      targetArr = Array.from(document.querySelectorAll(".Key"));
      activeElementsforKeyboard = targetArr.filter(key => {
        for (let i = 0; i < key.children.length; i++) {
          if (key.children[i].classList.contains("on")) return key;
        }
        return null;
      });
      scaleSteps = scales.find(obj => obj.name === scale);
      console.log("Keyboard componentDidUpdate scaleSteps", scaleSteps);
      this.setState({
        currentScale: this.generateCurrentScale(scaleSteps.steps)
      });
      threeLowerOctave.clear();
    }
    onlyScaleIndex = extendedKeyboard
      ? scale.includes("Pentatonic")
        ? 3
        : 4
      : 0;
  }

  componentDidMount() {

    scaleSteps = scales.find(
      obj => obj.name === this.props.scale
    );
    this.setState({
      scaleSteps,
      currentScale: this.generateCurrentScale(
        scaleSteps.steps
      )
    });

    const keyboard = document.querySelector(".Keyboard");

    document.addEventListener(
      "keydown",
      this.handleKeyDown,
      false
    );
    document.addEventListener(
      "keyup",
      this.handleKeyUp,
      false
    );

    keyboard.addEventListener(
      "mousedown",
      this.mouseDown,
      false
    );
    keyboard.addEventListener(
      "mouseup",
      this.mouseUp,
      false
    );

    onlyScaleIndex = this.props.extendedKeyboard
      ? this.props.scale.includes("Pentatonic")
        ? 3
        : 4
      : 0;

    targetArr = Array.from(
      document.querySelectorAll(".Key")
    );

    //only count the elements that are in the scale (className= .note .on)

    activeElementsforKeyboard = targetArr.filter(key => {
      for (let i = 0; i < key.children.length; i++) {
        if (key.children[i].classList.contains("on"))
          return key;
      }
      return null;
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
      showOffNotes,
      extendedKeyboard,
      clef
    } = this.props;

    const { synth } = this;
    const { mouse_is_down } = this.state;

    let isMajorSeventh = false;

    scaleSteps = scales.find(obj => obj.name === scale);

    const theScale = this.generateScales(scaleSteps.steps);

    let scaleObj; // get object from scalesObj.js
    scales.forEach(obj => {
      if (obj.name === scale) {
        scaleObj = obj;
      }
    });

    let baseScale = this.generateCurrentScale(scaleSteps.steps);
    console.log("Keyboard baseScale", baseScale)
    let currentRoot = rootNote.find(obj => {
      console.log('obj.note - baseNote', obj.note, baseNote, obj.index);
      return obj.note === baseNote;
    });
    console.log("currentRoot", currentRoot);

    let displayNotesBuilder;
    let scaleStart = 0;
    if (extendedKeyboard) {
      // show notes 5-3 (octave+sixth)
      scaleStart = 7;
      const displayNotesBase = notes.slice(
        currentRoot.index,
        currentRoot.index + 13
      );
      displayNotesBuilder = displayNotesBase.slice(7, 12);
      displayNotesBuilder = displayNotesBuilder.map(obj => {
        let newObj = { ...obj };
        newObj.octaveOffset--;
        return newObj;
      });
      displayNotesBuilder = displayNotesBuilder.concat(
        displayNotesBase.map(obj => {
          return { ...obj };
        })
      );

      let displayNotesBuilder2 = displayNotesBase.slice(1, 5);
      displayNotesBuilder2 = displayNotesBuilder2.map(obj => {
        let newObj = { ...obj };
        newObj.octaveOffset++;
        return newObj;
      });
      displayNotesBuilder = displayNotesBuilder.concat(displayNotesBuilder2);
    } else {
      console.log("currentRoot.index", currentRoot.index);
      displayNotesBuilder = notes.slice(
        currentRoot.index,
        currentRoot.index + 13
      );
    }
    const displayNotes = displayNotesBuilder;
    console.log("displayNotes", displayNotes);
    //we use relativeCount for Scale Steps
    let relativeCount = extendedKeyboard
      ? scale.includes("Pentatonic")
        ? 3
        : 4
      : 0; //0;
    let relativeCountScale = extendedKeyboard
      ? scale.includes("Pentatonic")
        ? 2
        : 3
      : -1; //-1; //should start at 0, but since i am adding +1 at the beginning of the switch...
    let relativeCountChord = relativeCount;
    console.log("relativeCountChord", relativeCountChord);
    const noteList = displayNotes.map((note, arrayIndex) => {
      const index = (arrayIndex + scaleStart) % 12;
      let noteName = [];
      const isKeyInScale = scaleSteps.steps.includes(index);

      if (index === scaleSteps.major_seventh) {
        isMajorSeventh = true;
      } else {
        isMajorSeventh = false;
      }
      let alreadyAdded = false; //this variable is to make sure we don't increment our relativeCountScale index double if we have to notations selected

      for (let i = 0; i < notation.length; i++) {
        /* eslint-disable no-duplicate-case */
        switch (notation[i]) {
          case "Romance":
          case "English":
          case "German":
            if (
              !alreadyAdded &&
              isKeyInScale
            ) {
              relativeCountScale++;
            }
            alreadyAdded = true;
          case "Romance":
            if (isKeyInScale) {
              console.log("Romance isKeyInScale", isKeyInScale, theScale[notation[i]][
                relativeCountScale %
                (theScale[
                  notation[i]
                ].length -
                  1)
              ]);
              noteName.push(
                theScale[notation[i]][
                relativeCountScale %
                (theScale[
                  notation[i]
                ].length -
                  1)
                ]
              );
            }
            break;
          case "English":
            if (isKeyInScale) {
              noteName.push(
                theScale[notation[i]][
                relativeCountScale %
                (theScale[
                  notation[i]
                ].length -
                  1)
                ]
              );
            }
            break;
          case "German":
            if (isKeyInScale) {
              noteName.push(
                theScale[notation[i]][
                relativeCountScale %
                (theScale[
                  notation[i]
                ].length -
                  1)
                ]
              );
            }
            break;
          case "Relative":
            if (isKeyInScale) {
              noteName.push(
                notes[index]
                  .note_relative
              );
            }
            break;
          case "Scale Steps":
            if (isKeyInScale) {
              noteName.push(
                scaleObj.numbers[
                relativeCount++ %
                scaleObj.numbers
                  .length
                ]
              );
            }
            break;
          case "Chord extensions":
            if (isKeyInScale) {
              // get number (1, b3, #4...)
              let numberString =
                scaleObj.numbers[
                relativeCountChord++ %
                scaleObj.numbers
                  .length
                ];
              let number,
                accidential = "";
              if (
                !isNaN(
                  numberString.substr(
                    0,
                    1
                  )
                )
              ) {
                // only number (no accidential), add one octave to number
                number =
                  parseInt(
                    numberString
                  ) + 7;
              } else {
                // we got # or b in front of number, preserve that
                number =
                  parseInt(
                    numberString.substr(
                      1
                    )
                  ) + 7;
                accidential = numberString.substr(
                  0,
                  1
                );
              }
              if (number % 2 === 1) {
                // only show odd numbers (9, 11, 13)
                noteName.push(
                  accidential + number
                );
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
        console.log("note", note);

        // console.log("onlyScaleIndex", onlyScaleIndex);
        // console.log("baseScale.length", baseScale.length);
        // console.log("baseScale", baseScale);
        // console.log("onlyScaleIndex % (baseScale.length - 1)", onlyScaleIndex % (baseScale.length - 1))

        if (scale.includes("Chromatic")) {
          noteThatWillSound = baseScale[onlyScaleIndex % (baseScale.length)];

        } else {
          noteThatWillSound = baseScale[onlyScaleIndex % (baseScale.length - 1)];

        }
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


      console.log("notation", notation);
      console.log("--------------------------------------");
      return (
        <Key
          key={arrayIndex}
          keyIndex={arrayIndex}
          index={index}
          note={`${note.note_english}${octave + noteOffset /*+ Math.floor(index/12)*/
            }`}
          noteNameEnglish={note.note_english}
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
          clef={clef}
          trebleStaffOn={trebleStaffOn}
          showOffNotes={showOffNotes}
          isActive={this.state.activeNotes.has(
            `${noteThatWillSound ? noteThatWillSound : note.note_english}${octave + noteOffset /*+ Math.floor(index/12)*/
            }`
          )}
          noteOn={this.noteOn}
          noteOff={this.noteOff}
          extendedKeyboard={extendedKeyboard}
        />
      );
    });

    return <div className="Keyboard">{noteList}</div>;
  }
}

export default Keyboard;
