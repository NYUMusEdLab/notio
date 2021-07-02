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
import {makeScale} from "./MusicScaleFactory";
import { Piano } from '@tonejs/piano'
import MusicScale from "../Model/MusicScale";

// Using 'code' property for compatibility with AZERTY, QWERTY... keyboards 
const keycodes = ['KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
  'KeyL', 'Semicolon', 'Quote'];

const keycodesExtended = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK',
  'KeyL', 'Semicolon', 'Quote', 'BracketLeft', 'Equal'];

let targetArr, activeElementsforKeyboard, scaleReciepe, keyboardLayoutScaleReciepe;
let onlyScaleIndex = 0;

let threeLowerOctave = new Set();

const pressedKeys = new Set();

class Keyboard extends Component {

  //#region Constructor
  constructor(props) {
    super(props);
    this.state = {
      activeNotes: new Set(),
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

  handleKeyUp = e => {
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
  

  // //this function will generate the notes (english) that will be passed to ToneJs, with Enharmonicss
  // generateCurrentScale = scaleFormula => {
  //   const { scale, baseNote } = this.props;
  //   if (scale.includes("Chromatic")) {
  //     return ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  //   }
  //   else if (!scale.includes("Pentatonic") && !scale.includes("Blues")) {
  //     return makeScaleMajorMinor(scaleFormula, baseNote, "English");
  //   }
  //   else {
  //     return makeScalePentatonicBlues(scaleFormula, baseNote, scale, "English");
  //   }

  // };

  // generateScales = scaleReciepe => {

  //   //TODO: NOTE that this creates a full scale with all naming and numbering and tones embedded.
  //   // I believe this can replace a lot of the code in keyboard
  //   // let fromstep = this.props.extendedKeyboard === true ? 7 : 0;
  //   // let ambitus = this.props.extendedKeyboard === true ? 21 : 13;
  //   // let recipe = scales.find(obj => obj.name === this.props.scale);
  //   // let root = this.props.baseNote;
  //   // let myScale = new MusicScale(recipe, root, fromstep, ambitus).ExtendedScaleToneNames

  //   // return myScale;
  //   // console.log("jakob scale", myScale);

  //   let theScale = {};

  //   const { notation, scale, baseNote } = this.props;

  //   //this is my scale after applying the formulas for minor and major with the correct name
  //   //works only for major scales and for harmonic minor, melodic minor and natural minor
  //   for (let i = 0; i < notation.length; i++) {
  //     if (
  //       notation[i] === "English" ||
  //       notation[i] === "German" ||
  //       notation[i] === "Romance"
  //     ) {
  //       if (scale.includes("Chromatic")) {
  //         // Todo : has to be replaced by Jakob's function
  //         return {
  //           Romance: ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'],
  //           German: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'],
  //           English: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  //         };
  //       }
  //       else if (!scale.includes("Pentatonic") && !scale.includes("Blues")) {
  //         theScale[notation[i]] = makeScaleMajorMinor(
  //           scaleReciepe,
  //           baseNote,
  //           notation[i]
  //         );
  //       } else {
  //         theScale[notation[i]] = makeScalePentatonicBlues(
  //           scaleReciepe,
  //           baseNote,
  //           scale,
  //           notation[i]
  //         );
  //       }
  //     }
  //   }

  //   return theScale;
  // };

  //#endregion


  convert_ScaleNameTo_ScaleReciepe(scaleName) {
    return scaleReciepe = scales.find(obj => obj.name === scaleName);
  }


  componentDidMount() {
    const { notation, scale:scaleName, baseNote, extendedKeyboard } = this.props;
    
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

    // // determine the scale shifting
    // onlyScaleIndex = this.scaleShifting(extendedKeyboard, scaleName);

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
    const { notation, scale: scaleName, baseNote, extendedKeyboard } = this.props;
    if (
      notation !== prevProps.notation ||
      scaleName !== prevProps.scale ||
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

  // // TODO : Maybe can be improved and determine dynamically by a formula
  // scaleShifting(isExtendedKeyboard, scale, shifting = 0) {
  //   let currentRoot = this.getRootInfo(rootNote, this.props.baseNote);

  //   let r = isExtendedKeyboard
  //     ? scale.includes("Pentatonic")
  //       ? 3
  //       : scale.includes("Chromatic")
  //         ? 7 + currentRoot.index
  //         : scale.includes("Locrian")
  //           ? 5
  //           : 4
  //     : scale.includes("Chromatic")
  //       ? currentRoot.index
  //       : 0;
  //   return r + shifting;
  // }

  updateScales(){
      const { notation, scale: scaleName, baseNote, extendedKeyboard } = this.props;
      const scaleStart  = extendedKeyboard ?  7:0
      const ambitus     = extendedKeyboard ? 24:13 
      keyboardLayoutScaleReciepe = this.convert_ScaleNameTo_ScaleReciepe("Chromatic");
      let keyboardLayoutScale= new MusicScale(keyboardLayoutScaleReciepe,baseNote,scaleStart, ambitus)
    //let keyboardLayoutScale= makeScale(keyboardLayoutScaleReciepe,"C",0,24)
      scaleReciepe = this.convert_ScaleNameTo_ScaleReciepe(scaleName); 
      let currentScale = new MusicScale(scaleReciepe,baseNote,scaleStart,ambitus)
      
      return {keyboardLayoutScale,currentScale}
  }

  getRootInfo(rootNote, baseNote) {
    return rootNote.find(obj => {
      return obj.note === baseNote;
    });
  }

  //#region render function
  render() {
    const {
      notation, // : array string notation ["colors", "english", etc...]
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

    
    
    const {keyboardLayoutScale,currentScale} = this.updateScales();
    
    let displayNotesBuilder = currentScale.ExtendedScaleTones;
    let scaleStart = 0;

    
    const displayNotes = currentScale;
    console.log("----JAKOB:dispNotesB",displayNotes)
    console.log("----JAKOB:currentScale",this.state.currentScale)


    //we use relativeCount for Scale Steps
    let relativeCount = this.scaleShifting(extendedKeyboard, scale);
    let relativeCountScale = this.scaleShifting(extendedKeyboard, scale, -1);
    let relativeCountChord = relativeCount;
    let currentScaleIndex = 0
    
    // Loop on note list
    const noteList =  keyboardLayoutScale.ExtendedScaleTones.map((note,index) => {
     

      let noteName = []
      let isKeyInScale = false
      let toneindex = displayNotes.MidiNoteNr.indexOf(note.midi_nr)%12
      if (toneindex !== -1){
        isKeyInScale = true
        for (let i = 0; i < notation.length; i++) {
          //   /* eslint-disable no-duplicate-case */
            const notationName = notation[i]
            switch (notationName) {
              case "Romance":
                noteName.push(displayNotes.ExtendedScaleToneNames.Romance[toneindex])
                break;

              case "English":
                noteName.push(displayNotes.ExtendedScaleToneNames.English[toneindex])
                break;

              case "German":
                noteName.push(displayNotes.ExtendedScaleToneNames.German[toneindex])
                break;

              case "Relative":
                noteName.push(displayNotes.ExtendedScaleToneNames.Relative[toneindex])
                break;

              case "Scale Steps":
                noteName.push(displayNotes.ExtendedScaleToneNames.Scale_Steps[toneindex])
                break;
                
              case "Chord extensions":
                noteName.push(displayNotes.ExtendedScaleToneNames.Chord_extensions[toneindex])
                break;
               
              default:
            }
          }
          //   /* eslint-disable no-duplicate-case */
      }


      const currentNote = keyboardLayoutScale.ExtendedScaleTones[index]
      return (
        //<p>-| {noteName} |</p> 
        <Key
          keyIndex={index} // Index in loop of notes
          index={index} // index on Keyboard
          note={`${ currentNote.note_english}${octave + currentNote.octaveOffset}`} //sounding note
          noteNameEnglish={currentNote.note_english}
          notation={notation}
          noteName={noteName}
          color={colors[index%colors.length]}
          offColor={currentNote.colorRGBA}
          keyColor={currentNote.pianoColor}
          isOn={isKeyInScale}
          root={baseNote}
          isMajorSeventh={true}
          synth={synth}
          isMouseDown={mouse_is_down}
          pianoOn={pianoOn}
          theme={theme}
          clef={clef}
          trebleStaffOn={trebleStaffOn}
          showOffNotes={showOffNotes}
          isActive={this.state.activeNotes.has(
            `${currentNote.note_english}${octave + currentNote.octaveOffset /*+ Math.floor(index/12)*/
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
    });


    return <div className="Keyboard">{noteList}</div>;
  }
  //#endregion
}

export default Keyboard;
