/*
 *  modified color palette from:
 *  https://loading.io/color/feature/Rainbow
 *
 */

const notes = [
  {
    midi_nr:12,
    note_romance: "Do",
    note_english: "C",
    note_german: "C",
    note_relative: "DO",
    pianoColor: "white",
    color: "#ff0000",
    colorRGBA: "rgba(255, 0, 0, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:13,
    note_romance: "Do#",
    note_english: "Db",
    note_german: "Db",
    note_relative: "RA",
    pianoColor: "black",
    color: "#ff8c00",
    colorRGBA: "rgba(255, 140, 0, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:14,
    note_romance: "Re",
    note_english: "D",
    note_german: "D",
    note_relative: "RE",
    pianoColor: "white",
    color: "#ffff00",
    colorRGBA: "rgba(255, 255, 0, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:15,
    note_romance: "Re#",
    note_english: "Eb",
    note_german: "Eb",
    note_relative: "ME",
    pianoColor: "black",
    color: "#c0c0c0",
    colorRGBA: "rgba(192, 192, 192,0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:16,
    note_romance: "Mi",
    note_english: "E",
    note_german: "E",
    note_relative: "MI",
    pianoColor: "white",
    color: "#ffffff",
    colorRGBA: "rgba(255, 255, 255, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:17,
    note_romance: "Fa",
    note_english: "F",
    note_german: "F",
    note_relative: "FA",
    pianoColor: "white",
    color: "#228b22",
    colorRGBA: "rgba(34, 139, 34, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:18,
    note_romance: "Fa#",
    note_english: "Gb",
    note_german: "Gb",
    note_relative: "FI",
    pianoColor: "black",
    color: "#00ff7f",
    colorRGBA: "rgba(0, 255, 127, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:19,
    note_romance: "Sol",
    note_english: "G",
    note_german: "G",
    note_relative: "SO",
    pianoColor: "white",
    color: "#00ffff",
    colorRGBA: "rgba(0, 255, 255, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:20,
    note_romance: "Sol#",
    note_english: "Ab",
    note_german: "Ab",
    note_relative: "SI",
    pianoColor: "black",
    color: "#0000ff",
    colorRGBA: "rgba(0, 0, 255, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:21,
    note_romance: "La",
    note_english: "A",
    note_german: "A",
    note_relative: "LA",
    pianoColor: "white",
    color: "#87cefa",
    colorRGBA: "rgba(135, 206, 250, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:22,
    note_romance: "La#",
    note_english: "Bb",
    note_german: "B",
    note_relative: "TE",
    pianoColor: "black",
    color: "#8a2be2",
    colorRGBA: "rgba(138, 43, 226, 0.2)",
    octaveOffset: 0
  },
  {
    midi_nr:23,
    note_romance: "Si",
    note_english: "B",
    note_german: "H",
    note_relative: "TI",
    pianoColor: "white",
    color: "#ee82ee",
    colorRGBA: "rgba(238, 134, 238, 0.2)",
    octaveOffset: 0
  },
  // {
  //   midi_nr:24,
  //   note_romance: "Do",
  //   note_english: "C",
  //   note_german: "C",
  //   note_relative: "DO",
  //   pianoColor: "white",
  //   color: "#ff0000",
  //   colorRGBA: "rgba(255, 0, 0, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:25,
  //   note_romance: "Do#",
  //   note_english: "Db",
  //   note_german: "Db",
  //   note_relative: "RA",
  //   pianoColor: "black",
  //   color: "#ff8c00",
  //   colorRGBA: "rgba(255, 140, 0, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:26,
  //   note_romance: "Re",
  //   note_english: "D",
  //   note_german: "D",
  //   note_relative: "RE",
  //   pianoColor: "white",
  //   color: "#ffff00",
  //   colorRGBA: "rgba(255, 255, 0, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:27,
  //   note_romance: "Re#",
  //   note_english: "Eb",
  //   note_german: "Eb",
  //   note_relative: "ME",
  //   pianoColor: "black",
  //   color: "#c0c0c0",
  //   colorRGBA: "rgba(192, 192, 192,0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:28,
  //   note_romance: "Mi",
  //   note_english: "E",
  //   note_german: "E",
  //   note_relative: "MI",
  //   pianoColor: "white",
  //   color: "#ffffff",
  //   colorRGBA: "rgba(255, 255, 255, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:29,
  //   note_romance: "Fa",
  //   note_english: "F",
  //   note_german: "F",
  //   note_relative: "FA",
  //   pianoColor: "white",
  //   color: "#228b22",
  //   colorRGBA: "rgba(34, 139, 34, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:30,
  //   note_romance: "Fa#",
  //   note_english: "Gb",
  //   note_german: "Gb",
  //   note_relative: "FI",
  //   pianoColor: "black",
  //   color: "#00ff7f",
  //   colorRGBA: "rgba(0, 255, 127, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:31,
  //   note_romance: "Sol",
  //   note_english: "G",
  //   note_german: "G",
  //   note_relative: "SO",
  //   pianoColor: "white",
  //   color: "#00ffff",
  //   colorRGBA: "rgba(0, 255, 255, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:32,
  //   note_romance: "Sol#",
  //   note_english: "Ab",
  //   note_german: "Ab",
  //   note_relative: "SI",
  //   pianoColor: "black",
  //   color: "#0000ff",
  //   colorRGBA: "rgba(0, 0, 255, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:33,
  //   note_romance: "La",
  //   note_english: "A",
  //   note_german: "A",
  //   note_relative: "LA",
  //   pianoColor: "white",
  //   color: "#87cefa",
  //   colorRGBA: "rgba(135, 206, 250, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:34,
  //   note_romance: "La#",
  //   note_english: "Bb",
  //   note_german: "B",
  //   note_relative: "TE",
  //   pianoColor: "black",
  //   color: "#8a2be2",
  //   colorRGBA: "rgba(138, 43, 226, 0.2)",
  //   octaveOffset: 1
  // },
  // {
  //   midi_nr:35,
  //   note_romance: "Si",
  //   note_english: "B",
  //   note_german: "H",
  //   note_relative: "TI",
  //   pianoColor: "white",
  //   color: "#ee82ee",
  //   colorRGBA: "rgba(238, 134, 238, 0.2)",
  //   octaveOffset: 1
  // }
];

export default notes;
