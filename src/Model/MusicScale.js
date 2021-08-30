import rootNote from "../data/rootNote";
import noteMapping from "../data/noteMappingObj";
import notes from "../data/notes";
import { notations } from "../components/menu/Notation";
import sc from "../data/scalesObj";
import absoluteMajorScales from "../data/absoluteMajorScales";

//*A scale consists of 3 parts:
//  prefix                 middle               postfix
//a partial octave   one or more octaves       a partial octave
//The scale has a root and a recipe (steps) which defines what tones are contained in the scale(only one octave)
// StartToneStep defines which chromatic step (0-11)
class MusicScale {
  constructor(
    scaleRecipe = null,
    rootnote = "C",
    startingFromStep = 0,
    ambitusInSemitones = 36,
    colors = [
      "#ff0000",
      "#ff8c00",
      "#ffff00",
      "#c0c0c0",
      "#ffffff",
      "#228b22",
      "#00ff7f",
      "#00ffff",
      "#0000ff",
      "#87cefa",
      "#8a2be2",
      "#ee82ee",
    ],
    scales = [...sc]
  ) {
    this.scales = scales
    if (scaleRecipe !== null) {
      this.Recipe = { ...scaleRecipe };
      this.Name = scaleRecipe.name;
      this.SemitoneSteps = scaleRecipe.steps;
      this.ExtensionNumbers = scaleRecipe["numbers"];
      this.RootNoteName = rootnote; //The scale root
      this.StartToneStep = startingFromStep;
      this.AmbitusInSemiNotes =
        ambitusInSemitones > 12 ? ambitusInSemitones : 12;
      //this.OctaveOffset = octaveOffset;
      this.Colors = colors;
      this.init();
    } else {
      this.RootNoteName = rootnote; //The scale root
      this.StartToneStep = startingFromStep;
      this.AmbitusInSemiNotes =
        ambitusInSemitones > 12 ? ambitusInSemitones : 12;
    }
  }
  scales = []
  Name = "";
  RootNoteName = "";
  RootNote = {};
  Recipe = {};
  SemitoneSteps = []; //Corresponding steps in C chromatic scale
  ExtendedScaleSteps = {};
  ExtendedScaleStepsRelativeToC = [];
  MidiNoteNr = [];
  ExtendedScaleToneNames = {};
  ExtendedScaleTones = [];
  ExtensionNumbers = []; //The numbers written on a chord like A(7b9)
  StartToneStep = 0; //select a tone on index 0-11
  BasisScale = []; //one octave of the scale starting at C
  AmbitusInSemiNotes = 24; //How many halftones must the actual scale span
  Transposition = 0; //= () =>  this.RootNote.index;
  Octave = 0;
  Notations = [];
  Colors = [];

  //#region Public Functions

  init() {
    // //Testing
    // let test = this.addAccidental("Cb","bb")//A
    // test = this.addAccidental("C#","##")//D#
    // test = this.addAccidental("Cx","##")//E
    // test = this.addAccidental("Bb","bb")//Ab
    // test = this.addAccidental("B#","bb")//Bb
    // test = this.addAccidental("Bbb","bb")//G

    this.Name = this.Recipe.name;
    this.SemitoneSteps = [...this.Recipe.steps];
    this.ExtensionNumbers = [...this.Recipe["numbers"]];
    this.RootNote = rootNote.find((obj) => {
      return obj.note === this.RootNoteName;
    });
    this.Transposition = this.RootNote.index; //  notes.findIndex(note => note.note_english===this.RootNote)
    this.BasisScale = this.SemitoneSteps.map(
      (step) => notes[(step + this.Transposition) % notes.length]
    ); //noteMappingObj["English"].Sharp_Names[(step)%12]);
    //this.addNumberExtensions();
    this.Notations = notations;
    this.ExtendedScaleSteps = [...this.BuildExtendedScaleSteps()];
    this.Octave =
      this.ExtendedScaleSteps[0] % 12 === 0 ? this.Octave : this.Octave - 1;

    // this.ExtendedScaleStepsRelativeToC = this.ExtendedScaleSteps.map((step=>(step - this.Transposition+12)))
    this.ExtendedScaleToneNames = {
      ...this.BuildExtendedScaleToneNames(
        this.Recipe.numbers,
        this.ExtendedScaleSteps,
        this.RootNote.note,
        this.Notations,
        this.Name
      ),
    };
    this.ExtendedScaleTones = [
      ...this.BuildExtendedScaleTones(
        this.ExtendedScaleSteps,
        this.ExtendedScaleToneNames
      ),
    ];
    this.MidiNoteNr = this.MakeMidinumbering(
      this.ExtendedScaleTones,
      this.ExtendedScaleSteps
    );
    this.Colors = this.MakeColors(this.ExtendedScaleSteps, this.Colors);
    console.log("basis:", this.ExtendedScaleToneNames);
  }
  MakeColors(ExtendedScaleSteps, Colors) {
    return ExtendedScaleSteps.map((step) => Colors[step % Colors.length]);
  }

  // SetRootNote(toneName) {
  //   this.RootNote = rootNote.find(obj => {
  //     return obj.note === toneName;
  //   });
  //   this.BuildExtendedScaleSteps();
  // }

  // SetStartTone(startToneStep) {
  //   this.StartToneStep = startToneStep;
  //   this.BuildExtendedScaleSteps();
  // }

  // SetAmbitusInHalfNotes(Ambitus) {
  //   this.AmbitusInSemiNotes = Ambitus;
  //   this.BuildExtendedScaleSteps();
  // }
  //#endregion

  //#region ScaleSteps Creators
  BuildExtendedScaleSteps() {
    //console.log("Building new Scale from recipe:" + this.Name)

    //Calculate how long an Ambitus is needed for the different parts of the long scale
    const {
      AmbitusPrefixHalfNotes,
      AmbitusFullOctaves,
      AmbitusPostfixHalfnotes,
    } = this.calculateAmbitusForScaleParts();
    //console.log("the scace is split into 3 parts\n"+"prefixed ambitus: "+AmbitusPrefixHalfNotes+"\nmiddle Octaves Ambitus: "+AmbitusFullOctaves+"\npostfixed ambitus: "+AmbitusPostfixHalfnotes);

    let scale = [];
    let octaveOffset = 0;
    // prefixScale add notes for the first partial octave
    if (AmbitusPrefixHalfNotes > 0) {
      //if the ambitus is only a partial octave
      if (this.AmbitusInSemiNotes < 12) {
        scale.push(
          this.SemitoneSteps.filter(
            (step) =>
              step > 11 - AmbitusPrefixHalfNotes &&
              step < this.StartToneStep + this.AmbitusInSemiNotes
          )
        );
      }
      //The ambitus is more than one octave
      else {
        //add all notes before the octave shift
        scale.push(
          this.SemitoneSteps.filter(
            (step) => step > 11 - AmbitusPrefixHalfNotes
          )
        );
      }
      octaveOffset++;
    }
    //console.log("prefix "+AmbitusPrefixHalfNotes+"scalenumbers",scale);

    //  middleScale add whole octaves
    if (AmbitusFullOctaves > 0) {
      let calculateSemitoneWithOffset = (semitone) =>
        semitone + octaveOffset * 12;
      for (let i = 0; i < AmbitusFullOctaves; i++) {
        let nextOctave = this.SemitoneSteps.map(calculateSemitoneWithOffset);
        scale.push(nextOctave);
        octaveOffset++;
      }
    }
    //console.log("middle scalenumbers",scale);

    //  postfixScale add notes for the last partial octave
    if (AmbitusPostfixHalfnotes > 0) {
      //add all notes after the last octave shift
      scale.push(
        this.SemitoneSteps.filter((step) => step < AmbitusPostfixHalfnotes).map(
          (step) => step + octaveOffset * 12
        )
      );
      octaveOffset++;
    }
    //Flatten the scale array
    scale = [].concat.apply([], scale);

    return scale;
  }

  ////convert steps to notes
  BuildExtendedScaleTones(scaleSteps, toneNames) {
    let theScale = scaleSteps.map((step, index) => {
      let tempnote = notes[(step + this.Transposition) % notes.length];
      const tempextensionText = toneNames.Chord_extensions[index];
      const tempStepText = toneNames.Scale_Steps[index];

      //const tempextensionText = "" + this.Recipe.numbers[index % this.SemitoneSteps.length];

      let octaveOffset =
        this.Octave + Math.floor((step + this.Transposition) / 12);
      //special case when displaying B# and Cb
      if (toneNames.English[index] === "Cb") {
        octaveOffset++;
      }
      if (toneNames.English[index] === "B#") {
        octaveOffset--;
      }

      let note = {
        ...tempnote,
        scale_step: tempStepText,
        chord_extension: tempextensionText,
        octaveOffset: octaveOffset,
      };
      return note;
    });

    return theScale;
  }

  calculateAmbitusForScaleParts() {
    let tempAmbitusInHalfTones = this.AmbitusInSemiNotes;
    const AmbitusPrefixHalfNotes =
      this.StartToneStep === 0 ? 0 : 12 - this.StartToneStep;
    tempAmbitusInHalfTones -= AmbitusPrefixHalfNotes;

    const AmbitusFullOctaves = Math.floor(tempAmbitusInHalfTones / 12);
    tempAmbitusInHalfTones = tempAmbitusInHalfTones % 12;

    const AmbitusPostfixHalfnotes = tempAmbitusInHalfTones;
    if ((tempAmbitusInHalfTones -= AmbitusPostfixHalfnotes) !== 0) {
      console.log("!!!Something went wrong calculating ambitus for scale ");
      //throw "Something went wrong calculating ambitus for scale";
    }

    return {
      AmbitusPrefixHalfNotes,
      AmbitusFullOctaves,
      AmbitusPostfixHalfnotes,
    };
  }
  //#endregion

  //#region Naming Functions

  /* Creates an array of strings containing different noteNames based on scale name and
   *  notation.
   * params:
   *   ScaleStepNumbers: the numbers from a scaleObj
   *   semiToneSteps: an array containing All the relative steps in the scale
   *   rootNoteName: string
   *   notation: string (German, or Chord extensions ....)
   *   scaleName:
   */
  //TODO: splice this function with MakeScaleNotations() function. Maybe use a scaleObj as param to replace ScaleStepNumbers and scaleName
  BuildExtendedScaleToneNames(
    ScaleStepNumbers,
    semiToneSteps,
    rootNoteName,
    notation,
    scaleName
  ) {
    //const basicScale =['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    // let toneNames = [];
    let theScale = {};

    let maxdistanceBetweenAdjacentNotes = semiToneSteps.map(
      (step, index) => semiToneSteps[index + 1] - step
    );
    maxdistanceBetweenAdjacentNotes.pop(); //removes the last note in the list, since it has no dist to next note
    const maxDist = Math.max(...maxdistanceBetweenAdjacentNotes);

    notation.forEach((whichNotation) => {
      switch (whichNotation) {
        case "English":
        case "German":
        case "Romance":
          switch (maxDist) {
            case 2: //All scales with a max distance of 2 , is expected to contain one of each letter (ABCDEFG), if that is not the intention add "Custom" to the name"
              if (scaleName.includes("Custom"))
                theScale[whichNotation] = this.MakeScaleNotations(
                  semiToneSteps,
                  rootNoteName,
                  scaleName,
                  whichNotation
                );
              //this.ExtendedScaleSteps.map(step => basicScale[step%12])};
              // theScale[whichNotation] = this.MakeCustomScale(//this.makeScaleMajorMinor(
              //   semiToneSteps,
              //   rootNoteName,
              //   whichNotation,
              //   this.Recipe
              // );
              else {
                theScale[whichNotation] = this.makeScaleMajorMinor(
                  semiToneSteps,
                  rootNoteName,
                  whichNotation
                );
              }
              break;
            case 1:
              theScale[whichNotation] = this.MakeChromatic(
                semiToneSteps,
                rootNoteName,
                whichNotation
              ); // this.ExtendedScaleSteps.map(step => basicScale[step%12]);
              break;

            default:
              theScale[whichNotation] = this.MakeScaleNotations(
                semiToneSteps,
                rootNoteName,
                scaleName,
                whichNotation
              ); //this.ExtendedScaleSteps.map(step => basicScale[step%12])};
              break;
          }
          break;

        case "Relative":
          theScale["Relative"] = semiToneSteps.map(
            (step) => notes[step % notes.length].note_relative
          );
          break;

        case "Scale Steps":
          if (this.Name === "Chromatic") {
            theScale["Scale_Steps"] = this.MakeChromatic(
              semiToneSteps,
              rootNoteName,
              "Scale_Steps"
            );
          } else {
            let length = this.Recipe.numbers.length;
            let relative = this.findScaleStartIndexRelativToRoot(
              this.ExtendedScaleSteps,
              ScaleStepNumbers.length
            );
            theScale["Scale_Steps"] = semiToneSteps.map(
              (step, index) => ScaleStepNumbers[(index + relative) % length]
            );
          }
          break;

        case "Chord extensions":
          if (this.Name === "Chromatic") {
            theScale["Chord_extensions"] = this.MakeChromatic(
              semiToneSteps,
              rootNoteName,
              "Chord_extensions"
            );
          } else {
            theScale["Chord_extensions"] = this.makeChordExtensions(
              this.Recipe,
              semiToneSteps,
              rootNoteName
            );
          }
          break;

        default:
          break;
      }
    });
    return theScale;
  }

  /* Creates an array of strings containing different noteNames based on scale name and
   *  notation.
   */
  //TODO: splice this function with BuildExtendedScaleToneNames() function.
  MakeScaleNotations(scaleFormula, keyName, scaleName, whichNotation) {
    let theScale = {};

    if (scaleName.includes("Chromatic")) {
      theScale = this.MakeChromatic(
        scaleFormula,
        keyName,
        //scaleName,
        whichNotation
      );
    } 
    else //(scaleName.includes("Custom")) 
    {
      switch (whichNotation) {
        case "English":
        case "German":
          theScale = this.MakeCustomScale(
            scaleFormula,
            keyName,
            whichNotation,
            this.Recipe
          );
          break;
        default:
          theScale = this.MakeChromatic(
            scaleFormula,
            keyName,
            //scaleName,
            whichNotation
          );
      }
    } 
    // else if (
    //   !scaleName.includes("Pentatonic") &&
    //   !scaleName.includes("Blues")
    // ) {
    //   theScale = this.makeScaleMajorMinor(scaleFormula, keyName, whichNotation);
    // } 
    // else {
    //   theScale = this.makeScalePentatonicBlues(
    //     scaleFormula,
    //     keyName,
    //     scaleName,
    //     whichNotation
    //   );
    // }
    return theScale;
  }

  /*
   *  Used for creating complete scale description, based on major scale like 1,2,b3,#11,5,13
   */
  //TODO: remove keyName param
  makeScaleNumbers(recipe, scaleFormula, keyName) {
    let extendedNumbers = [];
    let extensions = recipe.numbers;
    let relative = this.findScaleStartIndexRelativToRoot(
      scaleFormula,
      recipe.steps.length
    );
    extendedNumbers = scaleFormula.map((step, index) => {
      // get number (1, b3, #4...)
      let relativeToneIndex = (index + relative) % extensions.length;
      let numberString = extensions[relativeToneIndex];
      return numberString;
    });
    return extendedNumbers;
  }

  //TODO: remove keyName param
  makeChordExtensions(recipe, scaleFormula, keyName) {
    let theScale = [];
    let extensions = recipe.numbers;
    let relative = this.findScaleStartIndexRelativToRoot(
      scaleFormula,
      recipe.steps.length
    );
    theScale = scaleFormula.map((step, index) => {
      // get number (1, b3, #4...)
      let relativeToneIndex = (index + relative) % extensions.length;
      let numberString = extensions[relativeToneIndex];
      let number,
        accidential = "";

      if (!isNaN(numberString.substr(0, 1))) {
        // only number (no accidential), add one octave to number
        number = parseInt(numberString) + 7;
      } else {
        // we got # or b in front of number, preserve that
        number = parseInt(numberString.substr(1)) + 7;
        accidential = numberString.substr(0, 1);
      }

      if (number % 2 === 1) {
        // only show odd numbers (9, 11, 13)
        return accidential + number;
      } else {
        return " ";
      }
    });
    return theScale;
  }

  /*This function creates an array of midi-numbers making the first C === midi_nr 12
   * params:
   *   extendedScaleTones: a list of note Objects
   *   extendedScaleSteps: an array containing All the relative steps in the scale
   */
  MakeMidinumbering(extendedScaleTones, extendedScaleSteps) {
    const indexOfRoot = extendedScaleSteps.map((t) => t % 12).indexOf(0); //find index of the first root in the scale steps
    const distanceFrom_C0_Midi_Nr12 = this.noteNameToIndex(
      extendedScaleTones[indexOfRoot].note_english
    );
    const midinumbers = extendedScaleSteps.map(
      (step) => step + distanceFrom_C0_Midi_Nr12
    );
    return midinumbers;
  }
  //#endregion

  //#region scaleFactories

  /* Produces an array of toneNames with added accidentals.
   * the basis scale is based on a chromatic scale, this can be changed to
   * using a major scale by changing the first line to use MakeScaleMajorMinor()
   * params:
   *   scaleFormula:  array of all relative scalesteps
   *   keyName: string with the name of the root
   *   whichNotation:  string
   *   scaleRecipe: scaleObj
   */
  //TODO: fix majorscale, this function should produce a correct major scale
  MakeCustomScale(scaleFormula, keyName, whichNotation, scaleRecipe) {
    const majorScale = this.getMajorScale(keyName, whichNotation); //this.MakeChromatic([0,2,4,5,7,9,11], keyName, whichNotation)//this.MakeScaleMajorMinor([0,2,4,5,7,9,11], keyName, whichNotation)
    let tempScale = [];
    let numbers = this.makeScaleNumbers(scaleRecipe, scaleFormula, keyName);
    if (whichNotation === "Chord extensions") {
      tempScale = [...numbers];
    } else {
      tempScale = numbers.map((number) => {
        let accidental = "";
        let basisToneNumber = number;
        if (number.includes("b")) {
          basisToneNumber = number.replace("b", "");
          accidental = "b";
        } else if (number.includes("#")) {
          basisToneNumber = number.replace("#", "");
          accidental = "#";
        } else if (number === "7") {
          basisToneNumber = 7;
          accidental = "b";
        } else if (number === "△7") {
          basisToneNumber = 7;
          accidental = "";
        }
        const index = Number(basisToneNumber) - 1;
        const temp = this.addAccidental(majorScale[index % 7], accidental);
        return temp;
      });
    }
    return tempScale;
  }

  MakeChromatic(scaleFormula, keyName, whichNotation) {
    const TONE_NAMES = {
      English: {
        sharps: [
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
        ],
        flats: [
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
        ],
      },
      German: {
        sharps: [
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
          "H",
        ],
        flats: [
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
          "Hb",
          "H",
        ],
      },
      Romance: {
        sharps: [
          "Do",
          "Do#",
          "Re",
          "Re#",
          "Mi",
          "Fa",
          "Fa#",
          "Sol",
          "Sol#",
          "La",
          "La#",
          "Si",
        ],
        flats: [
          "Do",
          "Reb",
          "Re",
          "Mib",
          "Mi",
          "Fa",
          "Solb",
          "Sol",
          "Lab",
          "La",
          "Sib",
          "Si",
        ],
      },
      Scale_Steps: {
        sharps: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        flats: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      },
      Chord_extensions: {
        sharps: [
          " ",
          "b9",
          "9",
          "#9",
          " ",
          "11",
          "#11",
          "5",
          "#5",
          "13",
          "7",
          "△7",
        ],
        flats: [
          " ",
          "b9",
          "9",
          "m",
          " ",
          "11",
          "b5",
          "5",
          "b13",
          "13",
          "7",
          "△7",
        ],
      },
    };

    // let root = keyName;
    // let offset;
    let tonenameOffset = this.noteNameToIndex(keyName);
    let startingNote = tonenameOffset;

    if (
      whichNotation === "Chord_extensions" ||
      whichNotation === "Scale_Steps"
    ) {
      // let relative = this.findScaleStartIndexRelativToRoot(
      //   scaleFormula,
      //   this.Recipe.steps.length
      // );
      startingNote = 0; //relative;
    }

    //console.log(root, startingNote);
    //console.log("scaleFormula",scaleFormula)
    //console.log("keyName", keyName)
    //console.log("whichNotation", whichNotation)
    let myScaleFormula = scaleFormula;
    let myScale = [];

    if (keyName === "F" || keyName.includes("b")) {
      try {
        myScale = myScaleFormula.map(
          (step, index) =>
            TONE_NAMES[whichNotation].flats[(step + startingNote) % 12]
        );
      } catch {
        myScale = myScaleFormula.map(
          (step, index) =>
            "err!" + ((step + startingNote) % TONE_NAMES.English.sharps.length)
        ); // high note used to indicate error
      }
    } else if (this.noteNameToIndex(keyName) !== -1) {
      try {
        myScale = myScaleFormula.map(
          (step, index) =>
            TONE_NAMES[whichNotation].sharps[(step + startingNote) % 12]
        );
      } catch {
        myScale = myScaleFormula.map(
          (step, index) =>
            "err!" + ((step + startingNote) % TONE_NAMES.English.sharps.length)
        ); // high note used to indicate error
      }
    } else {
      myScale = myScaleFormula.map(
        (step, index) =>
          "err!" + ((step + startingNote) % TONE_NAMES.English.sharps.length)
      ); // high note used to indicate error
    }

    // //console.log("myscale",myScale);
    return myScale;
  }

  //TODO: must be fixed to handle C# major, G# major and D# major, now it repeats tones in steadt of producing Fx and Gx
  makeScaleMajorMinor(scaleFormula, keyName, whichNotation) {
    const ALPHA_NAMES = {};
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
      const RelativeToneIndex = (myScaleFormula[j] + startingNote) % 12;

      if (
        noteMapping["English"].Sharp_Names[RelativeToneIndex].includes(
          ALPHA_NAMES["English"][(offset + j) % ALPHA_NAMES["English"].length]
        )
      ) {
        // //console.log("push A");
        myScale.push(noteMapping[whichNotation].Sharp_Names[RelativeToneIndex]);
      } else if (
        noteMapping["English"].Flat_Names[RelativeToneIndex].includes(
          ALPHA_NAMES["English"][(offset + j) % ALPHA_NAMES["English"].length]
        )
      ) {
        // //console.log("push B");
        myScale.push(noteMapping[whichNotation].Flat_Names[RelativeToneIndex]);
      } else if (
        noteMapping["English"].Double_Flat_Names[RelativeToneIndex].includes(
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

        myScale.push("err!" + ((offset + j) % ALPHA_NAMES["English"].length)); // high note used to indicate error
      }
    }
    // //console.log("myscale",myScale);
    return myScale;
  }

  makeScalePentatonicBlues(scaleFormula, keyName, scaleName, whichNotation) {
    let ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
    //for the major pentatonic scale, we don't include the name of the 2nd and the 6th note
    let root = keyName;
    let offset;
    for (let i = 0; i < ALPHA_NAMES.length; i++) {
      if (root.includes(ALPHA_NAMES[i])) {
        offset = i;
        break;
      }
    }

    let ALPHA_NAMES_PENTATONIC = [];

    for (let j = 0; j < ALPHA_NAMES.length; j++) {
      if (scaleName.includes("Major")) {
        let removeFourth = (offset + 3) % ALPHA_NAMES.length;
        let removeSeventh = (offset + 6) % ALPHA_NAMES.length;

        if (j !== removeFourth && j !== removeSeventh) {
          ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[j % ALPHA_NAMES.length]);
        }
        if (
          scaleName === "Major Blues" &&
          j === (offset + 1) % ALPHA_NAMES.length
        ) {
          ALPHA_NAMES_PENTATONIC.push(
            ALPHA_NAMES[(j + 1) % ALPHA_NAMES.length]
          );
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
        //let majorscale = scales.find((obj) => obj.name === "Major (Ionian)");

        offset =
          j +
          this.findScaleStartIndexRelativToRoot(
            scaleFormula,
            this.Recipe.steps.length
          );
        break;
      }
    }
    let startingNote = this.noteNameToIndex(keyName);
    let myScaleFormula = scaleFormula;
    let myScale = [];
    for (let k = 0; k < myScaleFormula.length; k++) {
      const formulaNumber = (myScaleFormula[k] + startingNote) % 12;
      if (
        noteMapping.English.Sharp_Names[formulaNumber].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(noteMapping[whichNotation].Sharp_Names[formulaNumber]);
      } else if (
        noteMapping.English.Flat_Names[formulaNumber].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(noteMapping[whichNotation].Flat_Names[formulaNumber]);
      } else if (
        noteMapping.English.Double_Flat_Names[formulaNumber].includes(
          ALPHA_NAMES_PENTATONIC[(offset + k) % ALPHA_NAMES_PENTATONIC.length]
        )
      ) {
        myScale.push(
          noteMapping[whichNotation].Double_Flat_Names[formulaNumber]
        );
      } else {
        myScale.push("err!"); // high note used to indicate error
      }
    }
    return myScale;
  }
  ////#endregion

  //#region Helpers
  noteNameToIndex(noteName) {
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

  //Calculates what index in scale contains the root
  findScaleStartIndexRelativToRoot(recipe, scaleLength) {
    let IndexNumber = -1;
    let firstInScale = recipe.find((e) => e % 12 === 0);
    IndexNumber =
      firstInScale !== 0
        ? scaleLength - (recipe.indexOf(firstInScale) % scaleLength)
        : 0;
    return IndexNumber;
  }

  /* Returns the next element in an array, making it circular
   */
  next(recipe, index) {
    return index === recipe.length - 1 ? 0 : index + 1;
  }
  /* Returns the previous element in an array, making it circular
   */
  previous(recipe, index) {
    return index === 0 ? recipe.length - 1 : index - 1;
  }

  //TODO: !!!!!!!!this is closely coupled to the scales array , where the first element has to be the major Ionian scale, this is not good!!
  createMajorScale(basetone, notation) {
    const formula = this.scales[0];
    return this.makeScaleMajorMinor(formula, basetone, notation);
  }

  getMajorScale(basetone, notation) {
    let foneticTonename = "";
    switch (basetone) {
      case "C":
        foneticTonename = "C";
        break;
      case "C#":
        foneticTonename = "Cis";
        break;
      case "Db":
        foneticTonename = "Db";
        break;
      case "D":
        foneticTonename = "D";
        break;
      case "D#":
        foneticTonename = "Dis";
        break;
      case "Eb":
        foneticTonename = "Eb";
        break;
      case "E":
        foneticTonename = "E";
        break;
      case "F":
        foneticTonename = "F";
        break;
      case "F#":
        foneticTonename = "Fis";
        break;
      case "Gb":
        foneticTonename = "Gb";
        break;
      case "G":
        foneticTonename = "G";
        break;
      case "G#":
        foneticTonename = "Gis";
        break;
      case "Ab":
        foneticTonename = "Ab";
        break;
      case "A":
        foneticTonename = "A";
        break;
      case "A#":
        foneticTonename = "Ais";
        break;
      case "Bb":
        foneticTonename = "Bb";
        break;
      case "B":
        foneticTonename = "B";
        break;
      default:
        break;
    }

    return absoluteMajorScales[notation][foneticTonename];
  }
  /*
   *  adds accidentals to toneName, replacing several accidentals with the corresponding toneName
   * A### == C
   * only handles single letter names like (ABCDEFG)
   */
  addAccidental(toneName, accidental) {
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
    let result = "";
    toneName = toneName + accidental;
    let deconstructedToneName = toneName.split("");
    let basistoneName = deconstructedToneName.shift();
    let Accidentals = [...deconstructedToneName];
    //Accidentals.push(Accidental)
    const convertAccidentalToStep = (accid) =>
      accid === "b" ? -1 : accid === "#" ? 1 : accid === "x" ? 2 : 0;
    //Accidentals = Accidentals.map(accidental => accidental === 'b' ? -1 : accidental === '#' ? 1 : 0)
    const stepsFromToneName = Accidentals.reduce(
      (accumulator, accid) => convertAccidentalToStep(accid) + accumulator,
      0
    );
    switch (stepsFromToneName) {
      case 0:
        result = basistoneName;
        break;
      case 1:
        result = basistoneName + "#";
        break;
      case 2:
        result = basistoneName + "##"; //"x"; //
        break;
      case -1:
        result = basistoneName + "b";
        break;
      case -2:
        result = basistoneName + "bb";
        break;

      default:
        if (stepsFromToneName < -2) {
          let indexFlats = this.previous(
            ENGLISH_FLAT_NAMES,
            ENGLISH_FLAT_NAMES.indexOf(basistoneName)
          );
          indexFlats = this.previous(ENGLISH_FLAT_NAMES, indexFlats);

          const tempb = ENGLISH_FLAT_NAMES[indexFlats];

          accidental = "b".repeat(-1 * stepsFromToneName - 2);
          result = this.addAccidental(tempb + accidental);
        } else if (stepsFromToneName > 2) {
          let indexSharps = this.next(
            ENGLISH_SHARP_NAMES,
            ENGLISH_SHARP_NAMES.indexOf(basistoneName)
          );
          indexSharps = this.next(ENGLISH_SHARP_NAMES, indexSharps);

          const temp = ENGLISH_SHARP_NAMES[indexSharps];
          accidental = "#".repeat(stepsFromToneName - 2);
          result = this.addAccidental(temp + accidental);
        } else {
          result = basistoneName + Accidentals.join("");
          console.error(
            "something went wrong trying to add " +
              Accidentals +
              " \n Not implemented in  addAccidental() in MusicScale"
          );
        }
        break;
    }
    return result;
  }
}

export default MusicScale;
