/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Key from "./Key";
// import scales from "../data/scalesObj";
//import colors from "../data/colors";
import SoundMaker from "./SoundMaker";
import MusicScale from "../Model/MusicScale";

// Using 'code' property for compatibility with AZERTY, QWERTY... keyboards
const keycodes = [
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
];

const keycodesExtended = [
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyG",
  "KeyH",
  "KeyJ",
  "KeyK",
  "KeyL",
  "Semicolon",
  "Quote",
  "BracketLeft",
  "Equal",
];

let targetArr, activeElementsforKeyboard; //, scaleReciepe, keyboardLayoutScaleReciepe;

let threeLowerOctave = new Set();

const pressedKeys = new Set();

/*There are two scales:
 * keyboardlayoutScale- is the scale that represents all the keys on the piano.
 * currentScale       - is the scale the scale that should be shown on the piano (the scale selected by the user)
 *
 */
class Keyboard extends Component {
  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      activeNotes: new Set(),
      mouse_is_down: false,
      scales: this.props.scaleList,
    };

    this.synth = new SoundMaker({
      instrument: "piano",
      velocities: 5,
      volume: 4,
    });
  }

  //#endregion

  //#region Keypress Handlers
  handleKeyDown = (e) => {
    /* this helps us deal with this problem in Chrome:
     *
     * The AudioContext was not allowed to start. It must be resumed (or created)
     * after a user gesture on the page. <URL>
     *
     */
    //e.preventDefault();

    const { extendedKeyboard } = this.props;

    if (this.synth.getState() !== "running") {
        this.synth.resumeSound();
    }

    if (e.repeat) {
      return;
    } // prevent key from firing multiple times when key pressed for a long time

    // if (window.event && "repeat" in window.event) {
    //   if (window.event.repeat) {
    //     return false;
    //   }
    // }

    let buttonPressed;
    const activeKeyCodes = extendedKeyboard ? keycodesExtended : keycodes;
    const mapKeyDown = activeKeyCodes.indexOf(e.code);
    if (
      activeKeyCodes.includes(e.code) &&
      mapKeyDown + 1 <= activeElementsforKeyboard.length
    ) {
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

  handleKeyUp = (e) => {
    //e.preventDefault();

    const { extendedKeyboard } = this.props;

    const activeKeyCodes = extendedKeyboard ? keycodesExtended : keycodes;
    const mapKeyUp = activeKeyCodes.indexOf(e.code);
    if (
      activeKeyCodes.includes(e.code) &&
      mapKeyUp + 1 <= activeElementsforKeyboard.length
    ) {
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
    if (this.synth.getState() !== "running") {
      this.synth.resumeSound();
    }
    this.setState({ mouse_is_down: true });
  };

  mouseUp = () => {
    this.setState({ mouse_is_down: false });
  };

  //#endregion

  //#region Sound Handlers
  playNote = (note) => {
    //TODO: consider implementing doubleSharp in a better way
    if (note&&note.length>3){
        note = this.convertDoubleAccidental(note)
    }
    this.synth.startSound(note);
  };

  releaseNote = (note) => {
    //TODO: consider implementing doubleSharp in a better way
    if (note&&note.length>3){
        note = this.convertDoubleAccidental(note)
    }
    this.synth.stopSound(note);
  };

  noteOn = (note) => {
    const { activeNotes } = this.state;

    if (!activeNotes.has(note)) {
      this.playNote(note);
      this.highlightNote(note);

      let newActiveNotes = new Set(activeNotes);
      newActiveNotes.add(note);
      this.setState({ activeNotes: newActiveNotes });
    }
  };

  noteOff = (note) => {
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
  highlightNote = (note) => {
    // Add press effect animation
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.add("active");
  };

  removeHighlightNote = (note) => {
    const buttonTarget = document.querySelector(`[data-note="${note}"]`);
    buttonTarget.classList.remove("active");
  };

  //#endregion

  convert_ScaleNameTo_ScaleReciepe(scaleName) {
    const scaleReciepe = this.props.scaleList.find((obj) => obj.name === scaleName);
    return scaleReciepe;
  }

  componentDidMount() {
    const keyboard = document.querySelector(".Keyboard");

    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);

    keyboard.addEventListener("mousedown", this.mouseDown, false);
    keyboard.addEventListener("mouseup", this.mouseUp, false);

    // // determine the scale shifting
    // onlyScaleIndex = this.scaleShifting(extendedKeyboard, scaleName);

    targetArr = Array.from(document.querySelectorAll(".Key"));

    //only count the elements that are in the scale (className= .note .on)

    activeElementsforKeyboard = targetArr.filter((key) => {
      for (let i = 0; i < key.children.length; i++) {
        if (key.children[i].classList.contains("on")) return key;
      }
      return null;
    });
  }

  //#region Component Lifecycle functions
  componentDidUpdate(prevProps) {
    //refresh the keys every time we update the props
    const {
      notation,
      scale: scaleName,
      baseNote,
      extendedKeyboard,
    } = this.props;
    if (
      notation !== prevProps.notation ||
      scaleName !== prevProps.scale ||
      baseNote !== prevProps.baseNote ||
      extendedKeyboard !== prevProps.extendedKeyboard
    ) {
      targetArr = Array.from(document.querySelectorAll(".Key"));
      activeElementsforKeyboard = targetArr.filter((key) => {
        for (let i = 0; i < key.children.length; i++) {
          if (key.children[i].classList.contains("on")) return key;
        }
        return null;
      });

      //this.updateScales();
      threeLowerOctave.clear();
    }

    // // scale index on keyboard
    // onlyScaleIndex = this.scaleShifting(extendedKeyboard, scaleName);
    // console.log('CompDidUpdate:currentScale',this.state.currentScale )
    // //console.log('CompDidUpdate:scaleReciepe',this.state.scaleReciepe )
    // console.log('CompDidUpdate:activeNotes',this.state.activeNotes )
  }

  componentWillUnmount() {
    //Tone.context.close();
    document.removeEventListener("keydown", this.handleKeyDown, false);
    document.removeEventListener("keyup", this.handleKeyUp, false);
  }

  //#endregion
  /* 
// the keyboardLayoutScaleReciepe is the layout of the instrument
// if you change the scale you can show what tones from the selected scale matches the availlable tones on the instrument
// the setup as it is always uses a Chromatic scale from same root as the selected scale
// Some extra development may be needed if you want to allow different BaseNotes on the selected scale and the instrument. 
// e.g what tones from D Ionian can be played on a F major pentatonic flute.
*/
  updateScales() {
    const { scale: scaleName, baseNote, extendedKeyboard } = this.props;
    const scaleStart = extendedKeyboard ? 7 : 0; //Decides on what chromatic step  the extended scale start on 7 == starts on the fifth, 2 == starts on the major second. TODO: this should be set elsewhere not as a magic number in a function!!
    const ambitus = extendedKeyboard ? 24 : 13; //Decides How many halftones should be shown on the keyboard, 13 == shows an octave from Root to Root                    TODO: this should be set elsewhere not as a magic number in a function!!
    const keyboardLayoutScaleReciepe =
      this.convert_ScaleNameTo_ScaleReciepe("Chromatic"); // Returns a scaleObj
    const keyboardLayoutScale = new MusicScale(
      keyboardLayoutScaleReciepe,
      baseNote,
      scaleStart,
      ambitus
    );
    const scaleReciepe = this.convert_ScaleNameTo_ScaleReciepe(scaleName);
    const currentScale = new MusicScale(
      scaleReciepe,
      baseNote,
      scaleStart,
      ambitus
    );

    return { keyboardLayoutScale, currentScale };
  }

  getRootInfo(rootNote, baseNote) {
    return rootNote.find((obj) => {
      return obj.note === baseNote;
    });
  }


  //TODO: this crashes when the tone is in either end of ENGLISH_SHARP_NAMES, ...use the functions from musicscale (.previous and .next)
  convertDoubleAccidental=(toneName)=>{
    const ENGLISH_SHARP_NAMES = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];
    const ENGLISH_FLAT_NAMES = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
    let octave = toneName.at(-1);
    toneName = toneName.slice(0, -1)
    let result = "";
    const regexFlat = /[b]/gi;
    const regexSharp = /[#]/gi;

    let flats = toneName.match(regexFlat)
    let sharps = toneName.match(regexSharp)
    if (ENGLISH_FLAT_NAMES.includes(toneName) || ENGLISH_SHARP_NAMES.includes(toneName)){
       result=toneName;
    }
    else if (sharps && sharps.length === 2){
        result = ENGLISH_SHARP_NAMES[ENGLISH_SHARP_NAMES.indexOf(toneName.slice(0, -1))+1]
    }
    else if (flats && flats.length === 2){
      result = ENGLISH_FLAT_NAMES[ENGLISH_FLAT_NAMES.indexOf(toneName.slice(0, -1))-1]
  }
    return result + octave;
  }

  //#region render function
  render() {
    const {
      notation, // : array string notation ["colors", "english", etc...]
      octave,
      baseNote,
      pianoOn,
      theme,
      trebleStaffOn,
      showOffNotes,
      extendedKeyboard,
      clef,
    } = this.props;

    const { synth } = this;
    const { mouse_is_down } = this.state;
    const { keyboardLayoutScale, currentScale } = this.updateScales();

    // Loop on note list
    //creates all keys on the keyboard, their naming, color, and activeness (can they be played or not)
    const noteList = keyboardLayoutScale.ExtendedScaleTones.map(
      (note, index) => {
        let toneColor;
        let noteName = [];
        let isKeyInScale = false; //If this is false , the tone will be grayed out on the keyboard (only layout)
        let toneindex = currentScale.MidiNoteNr.indexOf(
          keyboardLayoutScale.MidiNoteNr[index]
        );
        if (toneindex !== -1) {
          isKeyInScale = true;
          //TODO: decide how to store custom color, should it be in the --import colors from "../data/colors";-- or some other way.
          toneColor = currentScale.Colors[toneindex];
          for (let i = 0; i < notation.length; i++) {
            const notationName = notation[i];
            switch (notationName) {
              case "Romance":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.Romance[toneindex]
                );
                break;

              case "English":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.English[toneindex]
                );
                break;

              case "German":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.German[toneindex]
                );
                break;

              case "Relative":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.Relative[toneindex]
                );
                break;

              case "Scale Steps":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.Scale_Steps[toneindex]
                );
                break;

              case "Chord extensions":
                noteName.push(
                  currentScale.ExtendedScaleToneNames.Chord_extensions[
                    toneindex
                  ]
                );
                break;

              default:
                console.error("This notation is not supported:", notationName);
            }
          }
          //   /* eslint-disable no-duplicate-case */
        }

        //keyboardNote is either a note in the currentScale thus playable and namable or
        //a note not in the scale and thus grayed out, no name and not playable
        const keyboardNote = isKeyInScale
          ? currentScale.ExtendedScaleTones[toneindex]
          : keyboardLayoutScale.ExtendedScaleTones[index];

        return (
          //<p>-| {noteName} |</p>
          <Key
            keyIndex={index} // Index in loop of notes
            index={index} // index on Keyboard
            note={`${
              isKeyInScale
                ? currentScale.ExtendedScaleToneNames.English[toneindex]
                : keyboardNote.note_english
            }${octave + keyboardNote.octaveOffset}`} //sounding note
            noteNameEnglish={keyboardNote.note_english}
            notation={notation}
            noteName={noteName}
            color={toneColor} //{colors[index%colors.length]}
            offColor={keyboardNote.colorRGBA}
            keyColor={keyboardNote.pianoColor}
            isOn={isKeyInScale}
            root={baseNote}
            isMajorSeventh={true} //TODO: I believe that this should be removed!!(JAKOB)
            synth={synth}
            isMouseDown={mouse_is_down}
            pianoOn={pianoOn}
            theme={theme}
            clef={clef}
            trebleStaffOn={trebleStaffOn}
            showOffNotes={showOffNotes}
            isActive={this.state.activeNotes.has(
              `${keyboardNote.note_english}${
                octave + keyboardNote.octaveOffset /*+ Math.floor(index/12)*/
              }`
            )}
            noteOn={this.noteOn}
            noteOff={this.noteOff}
            extendedKeyboard={extendedKeyboard}
          />
        );

        // DEBUG MODE
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
      }
    );

    return <div className="Keyboard">{noteList}</div>;
  }
  //#endregion
}

export default Keyboard;
