/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Key from "./Key";
import * as Tone from 'tone';
import scales from "../data/scalesObj";
import rootNote from "../data/rootNote";
import notes from "../data/notes";
import colors from "../data/colors";
import {
  makeScaleMajorMinor,
  makeScalePentatonicBlues,
  generateExtendedScale
} from "./theory";
import { Piano } from '@tonejs/piano'
// import MusicScale from "../Model/MusicScale"; // Can't import, lots of errors



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

  //#region Constructor
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

  //#endregion

  //#region Keypress Handlers
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

  //#endregion


  //#region Mouse Click Handlers
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

  //#endregion


  //#region Sound Handlers
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

  //#endregion

  //#region  Highlighting Handlers
  highlightNote = note => {
    // Add press effect animation
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.add("active");
  };

  removeHighlightNote = note => {
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.remove("active");
  };

  //#endregion


  //#region Scale Generation
  //this function will generate the notes (english) that will be passed to ToneJs, with Enharmonicss
  generateCurrentScale = scaleFormula => {
    console.log("scaleFormula", scaleFormula);
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

    //TODO: NOTE that this creates a full scale with all naming and numbering and tones embedded.
    // I believe this can replace a lot of the code in keyboard
    // let fromstep = this.props.extendedKeyboard === true ? 7 : 0;
    // let ambitus = this.props.extendedKeyboard === true ? 21 : 13;
    // let recipe = scales.find(obj => obj.name === this.props.scale);
    // let root = this.props.baseNote;
    // let myScale = new MusicScale(recipe, root, fromstep, ambitus).ExtendedScaleToneNames

    // return myScale;
    // console.log("jakob scale", myScale);

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
          // Todo : has to be replaced by Jakob's function
          return {
            Romance: ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'],
            German: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'],
            English: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
          };
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

    return theScale;
  };

  //#endregion


  static getDerivedStateFromProps(nextProps) {
    let scaleSteps = scales.find(obj => obj.name === nextProps.scale);
    return {
      scaleSteps: scaleSteps
    };
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

    // determine the scale shifting
    onlyScaleIndex = this.scaleShifting(this.props.extendedKeyboard, this.props.scale);


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


  //#region Component Lifecycle functions
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

    // scale index on keyboard
    onlyScaleIndex = this.scaleShifting(extendedKeyboard, scale);

  }

  componentWillUnmount() {
    Tone.context.close();
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  //#endregion

  // TODO : Maybe can be improved and determine dynamically by a formula
  scaleShifting(isExtendedKeyboard, scale, shifting = 0) {
    let currentRoot = this.getRootInfo(rootNote, this.props.baseNote);

    let r = isExtendedKeyboard
      ? scale.includes("Pentatonic")
        ? 3
        : scale.includes("Chromatic")
          ? 7 + currentRoot.index
          : scale.includes("Locrian")
            ? 5
            : 4
      : scale.includes("Chromatic")
        ? currentRoot.index
        : 0;
    return r + shifting;
  }

  getRootInfo(rootNote, baseNote) {
    return rootNote.find(obj => {
      console.log('obj.note - baseNote', obj.note, baseNote, obj.index);
      return obj.note === baseNote;
    });
  }

  //#region render function
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

    //TODO NOTE!!!!!!!!!!!!!!!!!    MusicScale should be used for ALL naming in keyboard.js

    // let fromstep = this.props.extendedKeyboard === true ? 7 : 0;
    // let ambitus = this.props.extendedKeyboard === true ? 21 : 13;
    // let recipe = scales.find(obj => obj.name === this.props.scale);
    // let root = this.props.baseNote;
    // let myScale = new MusicScale(recipe, root, fromstep, ambitus).ExtendedScaleToneNames


    // console.log("Jakob render", myScale)

    let isMajorSeventh = false;

    scaleSteps = scales.find(obj => obj.name === scale);

    const theScale = this.generateScales(scaleSteps.steps);

    let scaleObj; // get object from scalesObj.js
    scales.forEach(obj => {
      if (obj.name === scale) {
        scaleObj = obj;
      }
    });

    let baseScale = this.state.currentScale;//this.generateCurrentScale(scaleSteps.steps);
    console.log("baseScale", baseScale, scaleSteps.steps);
    // ROOT : Get the root and its index
    let currentRoot = this.getRootInfo(rootNote, baseNote);
    console.log("currentRoot", currentRoot);
    let displayNotesBuilder;
    let scaleStart = 0;

    // EXTENDED KEYBOARD : notes when extendedKeyboard is on  
    if (extendedKeyboard) {
      scaleStart = 7;
      // build extended scale
      displayNotesBuilder = generateExtendedScale(notes, currentRoot);

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
    let relativeCount = this.scaleShifting(extendedKeyboard, scale);
    let relativeCountScale = this.scaleShifting(extendedKeyboard, scale, -1);
    let relativeCountChord = relativeCount;

    // Loop on note list
    console.log("indexindex --------------------");
    const noteList = displayNotes.map((note, arrayIndex) => {
      // index : influence on color position
      const index = (arrayIndex + scaleStart) % 12;
      let noteName = [];
      const isKeyInScale = scaleSteps.steps.includes(index);

      if (index === scaleSteps.major_seventh) {
        isMajorSeventh = true;
      } else {
        isMajorSeventh = false;
      }
      let alreadyAdded = false; //this variable is to make sure we don't increment our relativeCountScale index double if we have to notations selected
      console.log("theScale", theScale);
      for (let i = 0; i < notation.length; i++) {
        /* eslint-disable no-duplicate-case */

        console.log("emilie notation", theScale, theScale[
          notation[i]
        ], notation[i], i);
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
          // alreadyAdded = true;
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
      console.log("noteOffset", noteOffset);
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


      // WholeNote represent the format Ab4 which is used to display
      // notes on musical staff
      const wholeNote = noteThatWillSound + (octave + noteOffset);
      if (typeof wholeNote === "string")
        threeLowerOctave.add(noteThatWillSound + (octave + noteOffset));

      console.log(
        "ntws",
        noteThatWillSound,
        "onlyScaleIndex",
        onlyScaleIndex,
        "wholeNote",
        wholeNote,
        "octave",
        octave,
        "noteOffset",
        noteOffset
      );

      console.log("Keyboardnote", note);

      console.log("--------------------------------------");
      return (
        <Key
          // key={arrayIndex}
          keyIndex={arrayIndex} // Index in loop of notes
          index={index} // index on Keyboard
          note={`${noteThatWillSound ? noteThatWillSound : note.note_english}${octave + noteOffset /*+ Math.floor(index/12)*/
            }`} //ok
          noteNameEnglish={note.note_english} //ok
          notation={notation}  //ok
          noteName={noteName}  //ok
          color={colors[index]}  //ok
          offColor={note.colorRGBA}
          keyColor={note.pianoColor}    //ok
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

      // const _color = colors[index];
      // const _keyColor = note.pianoColor;
      // console.log("noteThatWillSound", noteThatWillSound, note.note_english);
      // const _note = `${noteThatWillSound ? noteThatWillSound : note.note_english}${octave + noteOffset}`
      // const _isActive = this.state.activeNotes.has(
      //   `${noteThatWillSound ? noteThatWillSound : note.note_english}${octave + noteOffset /*+ Math.floor(index/12)*/
      //   }`
      // )



      // return (
      //   <div>
      //     keyIndex = { arrayIndex}<br /><hr />
      //       index = { index}<br /><hr />
      //       note = {_note} - {noteThatWillSound}<br /><hr />
      //       noteNameEnglish = { note.note_english}<br /><hr />
      //       notation = { notation}<br /><hr />
      //       noteName = { noteName}<br /><hr />
      //       color = {_color}<br /><hr />
      //       keyColor = {_keyColor}<br /><hr />
      //       isOn = { isKeyInScale.toString()}<br /><hr />
      //       root = { baseNote}<br /><hr />
      //       isMajorSeventh = { isMajorSeventh.toString()}<br /><hr />
      //     {/* synth = { synth} */}
      //       isMouseDown = { mouse_is_down}<br /><hr />
      //       pianoOn = { pianoOn.toString()}<br /><hr />
      //       theme = { theme}<br /><hr />
      //       clef = { clef}<br /><hr />
      //       trebleStaffOn = { trebleStaffOn.toString()}<br /><hr />
      //       showOffNotes = { showOffNotes.toString()}<br /><hr />
      //       isActive = {_isActive.toString()}<br /><hr />
      //       noteOn = { this.noteOn}<br /><hr />
      //       noteOff = { this.noteOff}<br /><hr />
      //       extendedKeyboard = { extendedKeyboard.toString()}<br /><hr />
      //   </div>
      // );
    });


    return <div className="Keyboard">{noteList}</div>;
  }
  //#endregion
}

export default Keyboard;
