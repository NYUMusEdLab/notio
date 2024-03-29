import React from "react";
import Select from "./Select";

import rootNote from "../data/rootNote";
// import scales from "../data/scalesObj";
import themes from "../data/themes";

export const Scale = props => {
  return (
    <Select
      value={props.scale}
      selectName="Scale"
      valueToExtract="name"
      selectEls={props.scales}
      handleSelect={props.handleSelect}
    />
  );
};

export const BaseNote = props => {
  return (
    <Select
      selectName="Root"
      selectEls={rootNote}
      valueToExtract="note"
      handleSelect={props.handleSelect}
    />
  );
};

// export const Notation = props => {
//   const notation = [
//     "Colors",
//     "English",
//     "German",
//     "Romance",
//     "Relative",
//     "Scale Steps",
//     "Chord extensions"
//   ];
//   return (
//     <Select
//       value={props.notation}
//       multiple="true"
//       selectName="Notation"
//       selectEls={notation}
//       handleSelect={props.handleSelect}
//     />
//   );
// };


export const Theme = props => {
  return (
    <Select
      selectName="Theme"
      selectEls={themes}
      valueToExtract="name"
      handleSelect={props.handleSelect}
    />
  );
};
