import rootNote from "../data/rootNote";
import noteMapping from "../data/noteMappingObj";
import notes from "../data/notes";
import { notations } from "../components/menu/Notation";
import scales from "../data/scalesObj";
//*A scale consists of 3 parts:
//  prefix                 middle               postfix
//a partial octave   one or more octaves       a partial octave
//The scale has a root and a recipe (steps) which defines what tones are contained in the scale(only one octave)
// StartToneStep defines which chromatic step (0-11)
class MusicScale {

  constructor(scaleRecipe, rootnote, startingFromStep, ambitusInSemitones) {
    this.Name = scaleRecipe.name;
    this.RootNoteName = rootnote;//The scale root
    this.Recipe = scaleRecipe;
    this.SemitoneSteps = scaleRecipe.steps;
    this.ExtensionNumbers = scaleRecipe["numbers"];
    this.StartToneStep = startingFromStep;
    this.AmbitusInSemiNotes = ambitusInSemitones > 12 ? ambitusInSemitones : 12;
    //this.OctaveOffset = octaveOffset;
    this.init()
  }

  Name = "";
  RootNoteName;
  RootNote;
  Recipe;
  SemitoneSteps = [];//Corresponding steps in C chromatic scale
  ExtendedScaleSteps = {};
  ExtendedScaleToneNames = {};
  ExtendedScaleTones = [];
  ExtensionNumbers;//The numbers written on a chord like A(7b9)
  StartToneStep; //select a tone on index 0-11
  BasisScale = []; //one octave of the scale starting at C
  AmbitusInSemiNotes;//How many halftones must the actual scale span
  Transposition; //= () =>  this.RootNote.index;
  Octave = 0;
  Notations = [];

  //#region Public Functions

  init() {
    this.RootNote = rootNote.find(obj => {
      return obj.note === this.RootNoteName;
    });
    this.Transposition = this.RootNote.index//  notes.findIndex(note => note.note_english===this.RootNote)
    this.BasisScale = this.SemitoneSteps.map(step => notes[(step + this.Transposition) % notes.length]) //noteMappingObj["English"].Sharp_Names[(step)%12]);
    //this.addNumberExtensions();
    this.Notations = notations
    this.ExtendedScaleSteps = [...this.BuildExtendedScaleSteps()];
    this.ExtendedScaleToneNames = { ...this.BuildExtendedScaleToneNames(this.Recipe.numbers, this.ExtendedScaleSteps, this.RootNote.note, this.Notations, this.Name) };
    this.ExtendedScaleTones = [...this.BuildExtendedScaleTones(this.ExtendedScaleSteps)];
    //console.log("basis:",this.ExtendedScaleToneNames);
  }


  SetRootNote(toneName) {
    this.RootNote = rootNote.find(obj => {
      return obj.note === toneName;
    });
    this.BuildExtendedScaleSteps();
  }

  SetStartTone(startToneStep) {
    this.StartToneStep = startToneStep;
    this.BuildExtendedScaleSteps();
  }

  SetAmbitusInHalfNotes(Ambitus) {
    this.AmbitusInSemiNotes = Ambitus;
    this.BuildExtendedScaleSteps();
  }
  //#endregion

  //#region ScaleSteps Creators
  BuildExtendedScaleSteps() {
    //console.log("Building new Scale from recipe:" + this.Name)

    //Calculate how long an Ambitus is needed for the different parts of the long scale
    const { AmbitusPrefixHalfNotes, AmbitusFullOctaves, AmbitusPostfixHalfnotes } = this.calculateAmbitusForScaleParts();
    //console.log("the scace is split into 3 parts\n"+"prefixed ambitus: "+AmbitusPrefixHalfNotes+"\nmiddle Octaves Ambitus: "+AmbitusFullOctaves+"\npostfixed ambitus: "+AmbitusPostfixHalfnotes);

    let scale = []
    let octaveOffset = 0;
    // prefixScale add notes for the first partial octave
    if (AmbitusPrefixHalfNotes > 0) {
      //if the ambitus is only a partial octave
      if (this.AmbitusInSemiNotes < 12) {
        scale.push(this.SemitoneSteps.filter(step => step > 11 - AmbitusPrefixHalfNotes && step < (this.StartToneStep + this.AmbitusInSemiNotes)));
      }
      //The ambitus is more than one octave
      else {
        //add all notes before the octave shift
        scale.push(this.SemitoneSteps.filter(step => step > 11 - AmbitusPrefixHalfNotes))
      }
      octaveOffset++;
    }
    //console.log("prefix "+AmbitusPrefixHalfNotes+"scalenumbers",scale);


    //  middleScale add whole octaves
    if (AmbitusFullOctaves > 0) {
      for (let i = 0; i < AmbitusFullOctaves; i++) {
        let nextOctave = this.SemitoneSteps.map(s => s + octaveOffset * 12)
        scale.push(nextOctave)
        octaveOffset++;
      }
    }
    //console.log("middle scalenumbers",scale);

    //  postfixScale add notes for the last partial octave
    if (AmbitusPostfixHalfnotes > 0) {
      //add all notes after the last octave shift
      scale.push(this.SemitoneSteps.filter(step => step < AmbitusPostfixHalfnotes).map(step => step + octaveOffset * 12));
      octaveOffset++
    }
    //Flatten the scale array
    scale = [].concat.apply([], scale)

    //console.log("JAKOB the scalenumbers",scale);


    return scale

  }


  ////convert steps to notes 
  BuildExtendedScaleTones(scaleSteps) {
    let theScale = scaleSteps.map((step, index) => {
      let tempnote = notes[(step + this.Transposition) % notes.length];
      let note = { ...tempnote };
      note.octaveOffset = this.Octave + Math.floor((step + this.Transposition) / 12);
      const tempextensionText = "" + this.Recipe.numbers[index % this.SemitoneSteps.length];

      note.chord_extension = tempextensionText;
      return note;
    });

    return theScale;
  }


  calculateAmbitusForScaleParts() {

    let tempAmbitusInHalfTones = this.AmbitusInSemiNotes;
    const AmbitusPrefixHalfNotes = this.StartToneStep === 0 ? 0 : 12 - this.StartToneStep;
    tempAmbitusInHalfTones -= AmbitusPrefixHalfNotes;

    const AmbitusFullOctaves = Math.floor(tempAmbitusInHalfTones / 12);
    tempAmbitusInHalfTones = tempAmbitusInHalfTones % 12

    const AmbitusPostfixHalfnotes = tempAmbitusInHalfTones
    if ((tempAmbitusInHalfTones -= AmbitusPostfixHalfnotes) !== 0) {
      //console.log("!!!Something went wrong calculating ambitus for scale ")
      throw ("Something went wrong calculating ambitus for scale")
    }

    return { AmbitusPrefixHalfNotes, AmbitusFullOctaves, AmbitusPostfixHalfnotes }
  }
  //#endregion


  //#region Naming Functions

  BuildExtendedScaleToneNames(ScaleStepNumbers, semiToneSteps, rootNoteName, notation, scaleName) {
    //const basicScale =['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] 
    // let toneNames = [];
    let theScale = {};


    let maxdistanceBetweenAdjacentNotes = semiToneSteps.map((step, index) => semiToneSteps[index + 1] - step);
    maxdistanceBetweenAdjacentNotes.pop();
    const maxDist = Math.max(...maxdistanceBetweenAdjacentNotes);

    notation.forEach(whichNotation => {

      switch (whichNotation) {
        case "English":
        case "German":
        case "Romance":

          switch (maxDist) {

            case 2:
              theScale[whichNotation] = this.makeScaleMajorMinor(semiToneSteps, rootNoteName, whichNotation);
              break;
            case 1:
              theScale[whichNotation] = this.MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);   // this.ExtendedScaleSteps.map(step => basicScale[step%12]);
              break;

            default:
              theScale[whichNotation] = this.MakeScaleNotations(semiToneSteps, rootNoteName, scaleName, whichNotation); //this.ExtendedScaleSteps.map(step => basicScale[step%12])};
              break;
          }
          break;

        case "Relative":
          theScale["Relative"] = semiToneSteps.map(step => notes[step % notes.length].note_relative);
          break;

        case "Scale_Steps":
          if (this.Name == "Chromatic") {
            theScale[whichNotation] = this.MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);
          }
          else {
            let length = this.Recipe.numbers.length;
            let relative = this.findScaleStartIndexRelativToRoot(this.ExtendedScaleSteps, ScaleStepNumbers.length);
            theScale["Scale_Steps"] = semiToneSteps.map((step, index) => ScaleStepNumbers[(index + relative) % length]);
          }
          break;

        case "Chord_extensions":

          if (this.Name == "Chromatic") {
            theScale[whichNotation] = this.MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);
          }
          else {
            theScale["Chord_extensions"] = this.makeChordExtensions(semiToneSteps, rootNoteName);
          }
          break;

        default:
          break;
      }
      //console.log(theScale)
      //case "Relative":
      // if(this.Name == "Chromatic"){
      //   theScale[whichNotation] = this.MakeChromatic(semiToneSteps,rootNoteName,"Chromatic",whichNotation)[whichNotation]; 
      // }

    });
    return theScale;
  }

  MakeScaleNotations(scaleFormula, keyName, scaleName, whichNotation) {

    let theScale = {};

    if (scaleName.includes("Chromatic")) {
      theScale = this.MakeChromatic(scaleFormula, keyName, scaleName, whichNotation);
    }
    else if (!scaleName.includes("Pentatonic") && !scaleName.includes("Blues")) {
      theScale = this.makeScaleMajorMinor(scaleFormula, keyName, whichNotation);
    }
    else {
      theScale = this.makeScalePentatonicBlues(scaleFormula, keyName, scaleName, whichNotation);
    }
    return theScale;
  }


  static MakeChromatic(scaleFormula, keyName, scaleName, whichNotation) {
    // const TONENAMES  =  {Romance: ['Do', 'D0#', 'Re','Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'LA', 'LA#', 'Ti'],
    //                   English: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    //                   German:  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']};
    //           const ALPHA_NAMES = {};
    //           ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
    //           ALPHA_NAMES.German = ["A", "H", "C", "D", "E", "F", "G"];
    //           ALPHA_NAMES.Romance = ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"];

    // let root =  keyName; 
    // let offset;
    // let startingNote = this.noteNameToIndex(keyName);
    // let myScaleFormula = scaleFormula;
    // let myScale = [];
    // for (let i = 0; i < myScaleFormula.length; i++) {  
    //   const RelativeToneIndex = (myScaleFormula[i] + startingNote)%12


    //   ////console.log("theScale", myScale);
    //   //return theScale[whichNotation];
    // }
    const TONE_NAMES = {
      English: {
        sharps: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
        flats: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]
      },
      German: {
        sharps: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"],
        flats: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"]
      },
      Romance: {
        sharps: ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"],
        flats: ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"]
      },
      Scale_Steps: {
        sharps: ["1", "b9", "9", "#9", "3", "11", "#11", "5", "#5", "13", "7", "△7"],
        flats: ["1", "b9", "9", "b3", "3", "11", "b5", "5", "b6", "13", "7", "△7"]
      },
      Chord_extensions: {
        sharps: [" ", "b9", "9", "#9", " ", "11", "#11", "5", "#5", "13", "7", "△7"],
        flats: [" ", "b9", "9", "m", " ", "11", "b5", "5", "b13", "13", "7", "△7"]
      }
    }

    let root = keyName;
    let offset;
    let tonenameOffset = this.noteNameToIndex(keyName)
    let startingNote = tonenameOffset;

    if (whichNotation == "Chord_extensions" || whichNotation == "Scale_Steps") {
      let relative = this.findScaleStartIndexRelativToRoot(scaleFormula, this.Recipe.steps.length);
      startingNote = relative
    }


    //console.log(root, startingNote);
    //console.log("scaleFormula", scaleFormula)
    //console.log("keyName", keyName)
    //console.log("whichNotation", whichNotation)
    let myScaleFormula = scaleFormula;
    let myScale = [];

    if (keyName == "F" || keyName.includes("b")) {
      try {
        myScale = myScaleFormula.map((step, index) => TONE_NAMES[whichNotation].flats[(index + startingNote) % 12])
      }
      catch {
        myScale = myScaleFormula.map((step, index) => "err!" + (index + startingNote) % TONE_NAMES.English.sharps.length); // high note used to indicate error
      }
    }
    else if (this.noteNameToIndex(keyName) != -1) {
      try {
        myScale = myScaleFormula.map((step, index) => TONE_NAMES[whichNotation].sharps[(index + startingNote) % 12])
      }
      catch {
        myScale = myScaleFormula.map((step, index) => "err!" + (index + startingNote) % TONE_NAMES.English.sharps.length); // high note used to indicate error
      }
    }
    else {
      myScale = myScaleFormula.map((step, index) => "err!" + (index + startingNote) % TONE_NAMES.English.sharps.length); // high note used to indicate error
    }

    // //console.log("myscale",myScale);
    return myScale;
  }

  static makeScaleMajorMinor(scaleFormula, keyName, whichNotation) {
    const ALPHA_NAMES = {};

    // @Todo : why beginning at A and not Do ?
    ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
    ALPHA_NAMES.German = ["A", "H", "C", "D", "E", "F", "G"];
    ALPHA_NAMES.Romance = ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"];
    let root = keyName;
    let offset;
    for (let i = 0; i < ALPHA_NAMES["English"].length; i++) {
      if (root.includes(ALPHA_NAMES["English"][i])) {
        offset = i + this.findScaleStartIndexRelativToRoot(scaleFormula, 7);
        break;
      }
    }
    let startingNote = this.noteNameToIndex(keyName);
    //console.log(root, startingNote);
    //console.log("scaleFormula", scaleFormula)
    //console.log("keyName", keyName)
    //console.log("whichNotation", whichNotation)
    let myScaleFormula = scaleFormula;
    let myScale = [];
    for (let j = 0; j < myScaleFormula.length; j++) {

      const RelativeToneIndex = (myScaleFormula[j] + startingNote) % 12

      if (
        noteMapping["English"].Sharp_Names[
          RelativeToneIndex
        ].includes(
          ALPHA_NAMES["English"][(offset + j) % ALPHA_NAMES["English"].length]
        )
      ) {
        // //console.log("push A");
        myScale.push(
          noteMapping[whichNotation].Sharp_Names[RelativeToneIndex]
        );
      } else if (
        noteMapping["English"].Flat_Names[
          RelativeToneIndex
        ].includes(
          ALPHA_NAMES["English"][(offset + j) % ALPHA_NAMES["English"].length]
        )
      ) {
        // //console.log("push B");
        myScale.push(
          noteMapping[whichNotation].Flat_Names[RelativeToneIndex]
        );
      } else if (
        noteMapping["English"].Double_Flat_Names[
          RelativeToneIndex
        ].includes(
          ALPHA_NAMES["English"][(offset + j) % ALPHA_NAMES["English"].length]
        )
      ) {
        // //console.log("push C");
        // //console.log('noteMapping["English"].Double_Flat_Names[RelativeToneIndex]', noteMapping["English"].Double_Flat_Names[RelativeToneIndex]);
        myScale.push(
          noteMapping[whichNotation].Double_Flat_Names[RelativeToneIndex]
        );
        ////console.log('includes MIDI_DOUBLE_FLAT_NAMES', ENGLISH_MIDI_DOUBLE_FLAT_NAMES[RelativeToneIndex] );
      } else {
        ////console.log("push D");

        myScale.push("err!" + (offset + j) % ALPHA_NAMES["English"].length); // high note used to indicate error
      }
    }
    // //console.log("myscale",myScale);
    return myScale;
  }

  static makeScalePentatonicBlues(scaleFormula, keyName, scaleName, whichNotation) {

    let ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
    //for the major pentatonic scale, we don't include the name of the 2nd and the 6th note
    let root = keyName;
    let offset;
    for (let i = 0; i < ALPHA_NAMES.length; i++) {
      if (root.includes(ALPHA_NAMES[i])) {
        offset = i
          ;
        break;
      }
    }

    let ALPHA_NAMES_PENTATONIC = [];

    for (let j = 0; j < ALPHA_NAMES.length; j++) {
      if (scaleName.includes("Major")) {
        let removeFourth = (offset + 3) % ALPHA_NAMES.length;
        let removeSeventh = (offset + 6) % ALPHA_NAMES.length;

        if (j !== removeFourth && j !== removeSeventh) {
          ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[(j) % ALPHA_NAMES.length]);
        }
        if (
          scaleName === "Major Blues" &&
          j === (offset + 1) % ALPHA_NAMES.length
        ) {
          ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[(j + 1) % ALPHA_NAMES.length]);
        }
      } else if (scaleName.includes("Minor")) {
        let removeSecond = (offset + 1) % ALPHA_NAMES.length;
        let removeSixth = (offset + 5) % ALPHA_NAMES.length;

        if (j !== removeSecond && j !== removeSixth) {
          ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[j]);
        }

        if (
          scaleName === "Minor Blues" &&
          j === (offset + 3) % ALPHA_NAMES.length
        ) {
          ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[j]);
        }
      }
    }
    for (let j = 0; j < ALPHA_NAMES_PENTATONIC.length; j++) {
      if (root.includes(ALPHA_NAMES_PENTATONIC[j])) {
        let majorscale = scales.find(obj => obj.name === "Major (Ionian)")

        offset = j + this.findScaleStartIndexRelativToRoot(scaleFormula, this.Recipe.steps.length);
        break;
      }
    }
    let startingNote = this.noteNameToIndex(keyName);
    let myScaleFormula = scaleFormula;
    let myScale = [];
    for (let k = 0; k < myScaleFormula.length; k++) {
      const formulaNumber = (myScaleFormula[k] + startingNote) % 12;
      if (
        noteMapping.English.Sharp_Names[
          formulaNumber
        ].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(
          noteMapping[whichNotation].Sharp_Names[formulaNumber]
        );
      } else if (
        noteMapping.English.Flat_Names[formulaNumber].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(
          noteMapping[whichNotation].Flat_Names[formulaNumber]
        );
      } else if (
        noteMapping.English.Double_Flat_Names[
          formulaNumber
        ].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(
          noteMapping[whichNotation].Double_Flat_Names[
          formulaNumber
          ]
        );
      } else {
        myScale.push("err!"); // high note used to indicate error
      }
    }
    return myScale;
  }

  makeChordExtensions(scaleFormula, keyName) {
    let theScale = [];
    let extensions = this.Recipe.numbers;
    let relative = this.findScaleStartIndexRelativToRoot(scaleFormula, this.Recipe.steps.length);
    theScale = scaleFormula.map((step, index) => {

      // get number (1, b3, #4...)
      let relativeToneIndex = (index + relative) % extensions.length
      let numberString = extensions[relativeToneIndex];
      let number, accidential = "";

      if (!isNaN(numberString.substr(0, 1))) {
        // only number (no accidential), add one octave to number
        number = parseInt(numberString) + 7;
      }

      else {
        // we got # or b in front of number, preserve that
        number = parseInt(numberString.substr(1)) + 7;
        accidential = numberString.substr(0, 1);
      }

      if (number % 2 === 1) {
        // only show odd numbers (9, 11, 13)  
        return accidential + number
      }
      else {
        return " ";
      }

    })
    return theScale
  }


  addNumberExtensions() {
    let temp = []

    const { steps, numbers: Chord_extensions } = this.Recipe;
    //TODO: this is crazy I add a string : M7 but it prints a number

    for (let i = 0; i < steps.length; i++) {
      let tempnote = notes[(steps[i] + this.Transposition) % 12];
      const tempdistToRoot = steps[i];
      const tempscale_step = "" + (i + 1);
      const tempextensionText = "" + Chord_extensions[i]
      let note = Object.assign({}, tempnote);
      note.scale_step = tempscale_step;
      note.dist_toRoot = tempdistToRoot;
      note.chord_extension = tempextensionText

      //console.log("extension:",note)

      temp.push(note)
    }

    //this.BasisScale = [...temp];
    return temp;
  }
  //#endregion

  //#region Helpers
  static noteNameToIndex(noteName) {
    let i;
    let IndexNumber = -1; // default if not found
    // check all three arrays for the nameName
    for (i = 0; i < noteMapping.English.Sharp_Names.length; i++) {
      if (
        noteName === noteMapping.English.Sharp_Names[i] ||
        noteName === noteMapping.English.Flat_Names[i]
      ) {
        IndexNumber = i;
        break; // found it
      }
    }
    return Number(IndexNumber); // it should be a number already, but...
  }

  static findScaleStartIndexRelativToRoot(recipe, scaleLength) {
    let i;
    let IndexNumber = -1;
    let firstInScale = recipe.find(e => e % 12 == 0);
    IndexNumber = scaleLength - (recipe.indexOf(firstInScale) % scaleLength);
    return IndexNumber;
  }


}
export default MusicScale;