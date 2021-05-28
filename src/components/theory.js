import noteMapping from "../data/noteMappingObj";

export function makeScaleMajorMinor(scaleFormula, keyName, whichNotation) {
  const ALPHA_NAMES = {};
  ALPHA_NAMES.English = ["A", "B", "C", "D", "E", "F", "G"];
  ALPHA_NAMES.German = ["A", "H", "C", "D", "E", "F", "G"];
  ALPHA_NAMES.Romance = ["La", "Si", "Do", "Re", "Mi", "Fa", "Sol"];
  let startingName = keyName;
  let offset;
  for (let i = 0; i < ALPHA_NAMES["English"].length; i++) {
    if (startingName.includes(ALPHA_NAMES["English"][i])) {
      offset = i;
      break;
    }
  }
  let startingNote = noteNameToIndex(keyName);
  //console.log(startingName, startingNote);
  // console.log("scaleFormula", scaleFormula)
  // console.log("keyName", keyName)
  // console.log("whichNotation", whichNotation)
  let myScaleFormula = scaleFormula;
  let myScale = [];
  for (let i = 0; i < myScaleFormula.length; i++) {
    //console.log( noteMapping[whichNotation].Sharp_Names[myScaleFormula[i] + startingNote],  );
    // console.log("myScaleFormula[i]", myScaleFormula[i]);
    // console.log('noteMapping["English"].Flat_Names[myScaleFormula[i] + startingNote]', noteMapping["English"].Flat_Names[myScaleFormula[i] + startingNote]);
    // console.log('ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]', ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]);
    // console.log('noteMapping["English"].Flat_Names[myScaleFormula[i] + startingNote].includes(ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length])', noteMapping["English"].Flat_Names[
    //   myScaleFormula[i] + startingNote
    // ].includes(
    //   ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
    // ));

    if (
      noteMapping["English"].Sharp_Names[
        myScaleFormula[i] + startingNote
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      // console.log("push A");
      myScale.push(
        noteMapping[whichNotation].Sharp_Names[myScaleFormula[i] + startingNote]
      );
    } else if (
      noteMapping["English"].Flat_Names[
        myScaleFormula[i] + startingNote
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      // console.log("push B");
      myScale.push(
        noteMapping[whichNotation].Flat_Names[myScaleFormula[i] + startingNote]
      );
    } else if (
      noteMapping["English"].Double_Flat_Names[
        myScaleFormula[i] + startingNote
      ].includes(
        ALPHA_NAMES["English"][(offset + i) % ALPHA_NAMES["English"].length]
      )
    ) {
      // console.log("push C");
      // console.log('noteMapping["English"].Double_Flat_Names[myScaleFormula[i] + startingNote]', noteMapping["English"].Double_Flat_Names[myScaleFormula[i] + startingNote]);
      myScale.push(
        noteMapping[whichNotation].Double_Flat_Names[
        myScaleFormula[i] + startingNote
        ]
      );
      //console.log('includes MIDI_DOUBLE_FLAT_NAMES', ENGLISH_MIDI_DOUBLE_FLAT_NAMES[myScaleFormula[i] + startingNote] );
    } else {
      console.log("push D");

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