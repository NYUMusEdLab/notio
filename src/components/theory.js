import noteMapping from "../data/noteMappingObj";

export function makeScaleMajorMinor(scaleFormula, root, notation) {

  // scaleFormula : example: [0, 2, 4, 5, 7, 9, 11, 12]
  // root : example : C, D# etc...
  // notation: example :  'English'

  const ALPHA_NAMES = {};
  console.log("msmm notation", notation);
  console.log("msmm scaleFormula", scaleFormula);


  // @Todo : why beginning at A and not Do ?
  // ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
  ALPHA_NAMES.English = ["C", "D", "E", "F", "G", "A", "B"];
  ALPHA_NAMES.German = ["C", "D", "E", "F", "G", "A", "H"];
  ALPHA_NAMES.Romance = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si",];

  // Offset in ALPHA_NAMES.English (no accidental). STARTING at A
  let offset;
  for (let i = 0; i < ALPHA_NAMES["English"].length; i++) {
    if (root.includes(ALPHA_NAMES["English"][i])) {
      offset = i;
      break;
    }
  }
  // startingNote : index of note from 0 (= C). STARTING at B#
  let startingNoteIndex = noteNameToIndex(root);
  console.log("msmm offset", offset, 'startingNoteIndex', startingNoteIndex);

  let myScale = [];
  for (let i = 0; i < scaleFormula.length; i++) {
    // SHARP
    if (
      noteMapping["English"].Sharp_Names[
        scaleFormula[i] + startingNoteIndex
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      console.log("msmm SHARP", noteMapping[notation].Sharp_Names[scaleFormula[i] + startingNoteIndex]);
      myScale.push(
        noteMapping[notation].Sharp_Names[scaleFormula[i] + startingNoteIndex]
      );

      // FLAT
    } else if (

      noteMapping["English"].Flat_Names[
        scaleFormula[i] + startingNoteIndex
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      console.log("msmm FLAT", noteMapping[notation].Flat_Names[scaleFormula[i] + startingNoteIndex]);
      myScale.push(
        noteMapping[notation].Flat_Names[scaleFormula[i] + startingNoteIndex]
      );
      // DOUBLE FLAT
    } else if (
      noteMapping["English"].Double_Flat_Names[
        scaleFormula[i] + startingNoteIndex
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      console.log("msmm DOUBLE FLAT", noteMapping[notation].Double_Flat_Names[
        scaleFormula[i] + startingNoteIndex
      ]);
      myScale.push(
        noteMapping[notation].Double_Flat_Names[
        scaleFormula[i] + startingNoteIndex
        ]
      );
      // OTHER CASES
    } else {

      myScale.push("err!"); // high note used to indicate error
    }
  }
  return myScale;
}

export function makeScalePentatonicBlues(
  scaleFormula,
  keyName,
  scaleName,
  whichNotation
) {
  let ALPHA_NAMES = ["A", "B", "C", "D", "E", "F", "G"];
  //for the major pentatonic scale, we don't include the name of the 2nd and the 6th note
  let startingName = keyName;
  let offset;
  for (let i = 0; i < ALPHA_NAMES.length; i++) {
    if (startingName.includes(ALPHA_NAMES[i])) {
      offset = i;
      break;
    }
  }

  let ALPHA_NAMES_PENTATONIC = [];

  for (let i = 0; i < ALPHA_NAMES.length; i++) {
    if (scaleName.includes("Major")) {
      let removeFourth = (offset + 3) % ALPHA_NAMES.length;
      let removeSeventh = (offset + 6) % ALPHA_NAMES.length;

      if (i !== removeFourth && i !== removeSeventh) {
        ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[i]);
      }
      if (
        scaleName === "Major Blues" &&
        i === (offset + 1) % ALPHA_NAMES.length
      ) {
        ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[(i + 1) % ALPHA_NAMES.length]);
      }
    } else if (scaleName.includes("Minor")) {
      let removeSecond = (offset + 1) % ALPHA_NAMES.length;
      let removeSixth = (offset + 5) % ALPHA_NAMES.length;

      if (i !== removeSecond && i !== removeSixth) {
        ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[i]);
      }

      if (
        scaleName === "Minor Blues" &&
        i === (offset + 3) % ALPHA_NAMES.length
      ) {
        ALPHA_NAMES_PENTATONIC.push(ALPHA_NAMES[i]);
      }
    }
  }
  for (let i = 0; i < ALPHA_NAMES_PENTATONIC.length; i++) {
    if (startingName.includes(ALPHA_NAMES_PENTATONIC[i])) {
      offset = i;
      break;
    }
  }
  let startingNote = noteNameToIndex(keyName);
  let myScaleFormula = scaleFormula;
  let myScale = [];
  for (let i = 0; i < myScaleFormula.length; i++) {
    if (
      noteMapping.English.Sharp_Names[
        myScaleFormula[i] + startingNote
      ].includes(
        ALPHA_NAMES_PENTATONIC[(offset + i) % ALPHA_NAMES_PENTATONIC.length]
      )
    ) {
      myScale.push(
        noteMapping[whichNotation].Sharp_Names[myScaleFormula[i] + startingNote]
      );
    } else if (
      noteMapping.English.Flat_Names[myScaleFormula[i] + startingNote].includes(
        ALPHA_NAMES_PENTATONIC[(offset + i) % ALPHA_NAMES_PENTATONIC.length]
      )
    ) {
      myScale.push(
        noteMapping[whichNotation].Flat_Names[myScaleFormula[i] + startingNote]
      );
    } else if (
      noteMapping.English.Double_Flat_Names[
        myScaleFormula[i] + startingNote
      ].includes(
        ALPHA_NAMES_PENTATONIC[(offset + i) % ALPHA_NAMES_PENTATONIC.length]
      )
    ) {
      myScale.push(
        noteMapping[whichNotation].Double_Flat_Names[
        myScaleFormula[i] + startingNote
        ]
      );
    } else {
      myScale.push("err!"); // high note used to indicate error
    }
  }
  return myScale;
}

function noteNameToIndex(noteName) {
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


export function generateExtendedScale(notes, currentRoot) {

  // Extract from notes data the part of the scale
  // function of root index

  const displayNotesBase = notes.slice(
    currentRoot.index,
    currentRoot.index + 13
  );
  console.log(">> displayNotesBase", displayNotesBase);

  // Get lower notes
  let displayNoteLower = displayNotesBase.slice(7, 12);
  console.log("displayNoteLower", displayNoteLower);

  // Change offset to lower
  displayNoteLower = displayNoteLower.map(obj => {
    let newObj = { ...obj };
    newObj.octaveOffset--;
    return newObj;
  });

  console.log("displayNoteLower offset --", displayNoteLower);


  // Concat NoteLower to original scale
  displayNoteLower = displayNoteLower.concat(
    displayNotesBase.map(obj => {
      return { ...obj };
    })
  );

  console.log("displayNoteLower concat", displayNoteLower);


  // Get the higher notes
  let displayNoteHigher = displayNotesBase.slice(1, 5);
  console.log("displayNoteHigher", displayNoteHigher);

  // Change the offset
  displayNoteHigher = displayNoteHigher.map(obj => {
    let newObj = { ...obj };
    newObj.octaveOffset++;
    return newObj;
  });
  console.log("displayNoteHigher offset ++", displayNoteHigher);

  // Concat higher notes to original scale + lower notes
  return displayNoteLower.concat(displayNoteHigher);
}