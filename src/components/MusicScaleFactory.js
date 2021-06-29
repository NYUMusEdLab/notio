import scalesobj from "../data/scalesObj";
import notes from "../data/notes";
import rootNote from "../data/rootNote";
import noteMapping from "../data/noteMappingObj";

import { notations } from "./menu/Notation";




export function makeScale(scaleRecipe,rootnoteName,startingFromStep,ambitusInSemitones){
  console.log("----MAKESCALE----")
  console.log(scaleRecipe)
  console.log(scaleRecipe.name)
  console.log(scaleRecipe.steps)
  console.log(scaleRecipe.numbers)


  
  const {name:Name,steps:SemitoneSteps,numbers:ExtensionNumbers} = scaleRecipe;
  let StartToneStep = startingFromStep;
  let AmbitusInSemiNotes = ambitusInSemitones > 12 ? ambitusInSemitones : 12;
  const RootNote = rootNote.find(obj => {
    return obj.note === rootnoteName;
  });
  const Transposition = RootNote.index;
  let BasisScale = SemitoneSteps.map(step => notes[(step + Transposition) % notes.length]) //noteMappingObj["English"].Sharp_Names[(step)%12]); //one octave of the scale starting at C
  let Notations = notations;
  let Octave = 0;
    //OctaveOffset = octaveOffset;

  const {ExtendedScaleSteps, ExtendedScaleToneNames, ExtendedScaleTones} = calculateScale();

  
 //#region Public Functions

 


// // const SetRootNote = (toneName) => {
// //   RootNote = rootNote.find(obj => {
// //     return obj.note === toneName;
// //   });
// //   BuildExtendedScaleSteps();
// // }

// const SetStartTone = (startToneStep) => {
//   StartToneStep = startToneStep;
//   BuildExtendedScaleSteps();
// }

// const SetAmbitusInHalfNotes = (Ambitus) => {
//   AmbitusInSemiNotes = Ambitus;
//   BuildExtendedScaleSteps();
// }

//#endregion

//#region ScaleSteps Creators
const BuildExtendedScaleSteps=() => {
  //console.log("Building new Scale from recipe:" + Name)

  //Calculate how long an Ambitus is needed for the different parts of the long scale
  const { AmbitusPrefixHalfNotes, AmbitusFullOctaves, AmbitusPostfixHalfnotes } = calculateAmbitusForScaleParts();
  //console.log("the scace is split into 3 parts\n"+"prefixed ambitus: "+AmbitusPrefixHalfNotes+"\nmiddle Octaves Ambitus: "+AmbitusFullOctaves+"\npostfixed ambitus: "+AmbitusPostfixHalfnotes);

  let scale = []
  let octaveOffset = 0;
  // prefixScale add notes for the first partial octave
  if (AmbitusPrefixHalfNotes > 0) {
    //if the ambitus is only a partial octave
    if (AmbitusInSemiNotes < 12) {
      scale.push(SemitoneSteps.filter(step => step > 11 - AmbitusPrefixHalfNotes && step < (StartToneStep + AmbitusInSemiNotes)));
    }
    //The ambitus is more than one octave
    else {
      //add all notes before the octave shift
      scale.push(SemitoneSteps.filter(step => step > 11 - AmbitusPrefixHalfNotes))
    }
    octaveOffset++;
  }
  //console.log("prefix "+AmbitusPrefixHalfNotes+"scalenumbers",scale);


  //  middleScale add whole octaves
  if (AmbitusFullOctaves > 0) {
    let calculateSemitoneWithOffset = semitone => semitone + octaveOffset * 12;
    for (let i = 0; i < AmbitusFullOctaves; i++) {
      let nextOctave = SemitoneSteps.map(calculateSemitoneWithOffset);
      scale.push(nextOctave);
      octaveOffset++;
    }
  }
  //console.log("middle scalenumbers",scale);

  //  postfixScale add notes for the last partial octave
  if (AmbitusPostfixHalfnotes > 0) {
    //add all notes after the last octave shift
    scale.push(SemitoneSteps.filter(step => step < AmbitusPostfixHalfnotes).map(step => step + octaveOffset * 12));
    octaveOffset++
  }
  //Flatten the scale array
  scale = [].concat.apply([], scale)

  //console.log("JAKOB the scalenumbers",scale);


  return scale

}


////convert steps to notes 
const BuildExtendedScaleTones = (scaleSteps) => {
  let theScale = scaleSteps.map((step, index) => {
    let tempnote = notes[(step + Transposition) % notes.length];
    const tempextensionText = "" + ExtensionNumbers[index % SemitoneSteps.length];
    const octaveOffset = Octave + Math.floor((step + Transposition) / 12);

    let note = { ...tempnote, chord_extension: tempextensionText, octaveOffset:octaveOffset };
    return note;
  });

  return theScale;
}


const calculateAmbitusForScaleParts = () =>{

  let tempAmbitusInHalfTones = AmbitusInSemiNotes;
  const AmbitusPrefixHalfNotes = StartToneStep === 0 ? 0 : 12 - StartToneStep;
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

const BuildExtendedScaleToneNames = (scaleStepNumbers, semiToneSteps, rootNoteName, notation, scaleName) => {
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
            theScale[whichNotation] = makeScaleMajorMinor(semiToneSteps, rootNoteName, whichNotation);
            break;
          case 1:
            theScale[whichNotation] = MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);   // ExtendedScaleSteps.map(step => basicScale[step%12]);
            break;

          default:
            theScale[whichNotation] = MakeScaleNotations(semiToneSteps, rootNoteName, scaleName, whichNotation); //ExtendedScaleSteps.map(step => basicScale[step%12])};
            break;
        }
        break;

      case "Relative":
        theScale["Relative"] = semiToneSteps.map(step => notes[step % notes.length].note_relative);
        break;

      case "Scale_Steps":
        if (Name === "Chromatic") {
          theScale[whichNotation] = MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);
        }
        else {
          let length = ExtensionNumbers.length;
          let relative = findScaleStartIndexRelativToRoot(semiToneSteps, scaleStepNumbers.length);
          theScale["Scale_Steps"] = semiToneSteps.map((step, index) => scaleStepNumbers[(index + relative) % length]);
        }
        break;

      case "Chord_extensions":

        if (Name === "Chromatic") {
          theScale[whichNotation] = MakeChromatic(semiToneSteps, rootNoteName, "Chromatic", whichNotation);
        }
        else {
          theScale["Chord_extensions"] = makeChordExtensions(semiToneSteps, rootNoteName);
        }
        break;

      default:
        break;
    }
    //console.log(theScale)
    //case "Relative":
    // if(Name === "Chromatic"){
    //   theScale[whichNotation] = MakeChromatic(semiToneSteps,rootNoteName,"Chromatic",whichNotation)[whichNotation]; 
    // }

  });
  return theScale;
}

const MakeScaleNotations = (scaleFormula, keyName, scaleName, whichNotation) => {

  let theScale = {};

  if (scaleName.includes("Chromatic")) {
    theScale = MakeChromatic(scaleFormula, keyName, scaleName, whichNotation);
  }
  else if (!scaleName.includes("Pentatonic") && !scaleName.includes("Blues")) {
    theScale = makeScaleMajorMinor(scaleFormula, keyName, whichNotation);
  }
  else {
    theScale = makeScalePentatonicBlues(scaleFormula, keyName, scaleName, whichNotation);
  }
  return theScale;
}


const MakeChromatic = (scaleFormula, keyName, scaleName, whichNotation) =>{
  // const TONENAMES  =  {Romance: ['Do', 'D0#', 'Re','Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'LA', 'LA#', 'Ti'],
  //                   English: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  //                   German:  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']};
  //           const ALPHA_NAMES = {};
  //           ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
  //           ALPHA_NAMES.German = ["A", "H", "C", "D", "E", "F", "G"];
  //           ALPHA_NAMES.Romance = ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"];

  // let root =  keyName; 
  // let offset;
  // let startingNote = noteNameToIndex(keyName);
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
  let tonenameOffset = noteNameToIndex(keyName)
  let startingNote = tonenameOffset;

  if (whichNotation === "Chord_extensions" || whichNotation === "Scale_Steps") {
    let relative = findScaleStartIndexRelativToRoot(scaleFormula, SemitoneSteps.length);
    startingNote = relative
  }


  //console.log(root, startingNote);
  //console.log("scaleFormula", scaleFormula)
  //console.log("keyName", keyName)
  //console.log("whichNotation", whichNotation)
  let myScaleFormula = scaleFormula;
  let myScale = [];

  if (keyName === "F" || keyName.includes("b")) {
    try {
      myScale = myScaleFormula.map((step, index) => TONE_NAMES[whichNotation].flats[(index + startingNote) % 12])
    }
    catch {
      myScale = myScaleFormula.map((step, index) => "err!" + (index + startingNote) % TONE_NAMES.English.sharps.length); // high note used to indicate error
    }
  }
  else if (noteNameToIndex(keyName) !== -1) {
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

const makeScaleMajorMinor = (scaleFormula, keyName, whichNotation) => {
  const ALPHA_NAMES = {};
  ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
  ALPHA_NAMES.German = ["A", "H", "C", "D", "E", "F", "G"];
  ALPHA_NAMES.Romance = ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"];
  let root = keyName;
  let offset;
  for (let i = 0; i < ALPHA_NAMES["English"].length; i++) {
    if (root.includes(ALPHA_NAMES["English"][i])) {
      offset = i + findScaleStartIndexRelativToRoot(scaleFormula, 7);
      break;
    }
  }
  let startingNote = noteNameToIndex(keyName);
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

const makeScalePentatonicBlues = (scaleFormula, keyName, scaleName, whichNotation) => {

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
      let majorscale = scalesobj.find(obj => obj.name === "Major (Ionian)")

      offset = j + findScaleStartIndexRelativToRoot(scaleFormula, SemitoneSteps.length);
      break;
    }
  }
  let startingNote = noteNameToIndex(keyName);
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

const makeChordExtensions = (scaleFormula, keyName) => {
  let theScale = [];
  let extensions = ExtensionNumbers;
  let relative = findScaleStartIndexRelativToRoot(scaleFormula, SemitoneSteps.length);
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

const addNumberExtensions = () => {
  let temp = []

  const { steps, numbers: Chord_extensions } = scaleRecipe;
  //TODO: this is crazy I add a string : M7 but it prints a number

  for (let i = 0; i < steps.length; i++) {
    let tempnote = notes[(steps[i] + Transposition) % 12];
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

  //BasisScale = [...temp];
  return temp;
}
//#endregion

//#region Helpers
const noteNameToIndex = (noteName)=> {
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

const findScaleStartIndexRelativToRoot = (recipe, scaleLength) => {
  let IndexNumber = -1;
  let firstInScale = recipe.find(e => e % 12 === 0);
  IndexNumber = scaleLength - (recipe.indexOf(firstInScale) % scaleLength);
  return IndexNumber;
}


function calculateScale(){
  let ExtendedScaleSteps = BuildExtendedScaleSteps();
  let ExtendedScaleToneNames = { ...BuildExtendedScaleToneNames(ExtensionNumbers, ExtendedScaleSteps, RootNote.note, Notations, Name) };;
  let ExtendedScaleTones = [...BuildExtendedScaleTones(ExtendedScaleSteps)];
  return  { ExtendedScaleSteps, ExtendedScaleToneNames, ExtendedScaleTones}
}



return {ExtendedScaleSteps, ExtendedScaleToneNames, ExtendedScaleTones};
}

