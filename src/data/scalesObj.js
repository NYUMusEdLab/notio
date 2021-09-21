const scales = [
  {
    name: "Major (Ionian)",
    steps: [0, 2, 4, 5, 7, 9, 11],
    numbers: ["1", "2", "3", "4", "5", "6", "△7"],
    major_seventh: 11,
    default: true,
  },
  {
    name: "Chromatic",
    steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  },
  {
    name: "Mixolydian",
    steps: [0, 2, 4, 5, 7, 9, 10],
    numbers: ["1", "2", "3", "4", "5", "6", "7"],
  },
  {
    name: "Lydian",
    steps: [0, 2, 4, 6, 7, 9, 11],
    numbers: ["1", "2", "3", "#4", "5", "6", "△7"],
    major_seventh: 11,
  },
  {
    name: "Major Pentatonic",
    steps: [0, 2, 4, 7, 9],
    numbers: ["1", "2", "3", "5", "6"],
  },
  {
    name: "Minor Pentatonic",
    steps: [0, 3, 5, 7, 10],
    numbers: ["1", "b3", "4", "5", "7"],
  },
  {
    name: "Natural Minor/Aeolian",
    steps: [0, 2, 3, 5, 7, 8, 10],
    numbers: ["1", "2", "b3", "4", "5", "b6", "7"],
  },
  {
    name: "Dorian",
    steps: [0, 2, 3, 5, 7, 9, 10],
    numbers: ["1", "2", "b3", "4", "5", "6", "7"],
  },
  {
    name: "Harmonic Minor",
    steps: [0, 2, 3, 5, 7, 8, 11],
    numbers: ["1", "2", "b3", "4", "5", "b6", "△7"],
    major_seventh: 11,
  },
  {
    name: "Melodic Minor",
    steps: [0, 2, 3, 5, 7, 9, 11],
    numbers: ["1", "2", "b3", "4", "5", "6", "△7"],
    major_seventh: 11,
  },
  {
    name: "Phrygian",
    steps: [0, 1, 3, 5, 7, 8, 10],
    numbers: ["1", "b2", "b3", "4", "5", "b6", "7"],
  },
  {
    name: "Locrian",
    steps: [0, 1, 3, 5, 6, 8, 10],
    numbers: ["1", "b2", "b3", "4", "b5", "b6", "7"],
  },
  {
    name: "Minor Blues",
    steps: [0, 3, 5, 6, 7, 10],
    numbers: ["1", "b3", "4", "b5", "5", "7"],
  },
  {
    name: "Major Blues",
    steps: [0, 2, 3, 4, 7, 9],
    numbers: ["1", "2", "b3", "3", "5", "6"],
  },
  // {
  //   name: "Whole tone",
  //   steps: [0, 2, 4, 6, 8, 10],
  //   numbers: ["1", "2", "3", "#4", "#5", "7"],
  //   // steps: [0, 1, 2, 3, 6, 11],
  //   // numbers: ['1', 'b2', '2', 'b3', 'b5', '△7'],
  // },
  // {
  //   name: "Dim scale major7",
  //   steps: [0, 2, 3, 5, 6, 8, 9, 11],
  //   numbers: ["1", "2", "b3", "4", "b5", "#5", "6", "△7"],
  //   // steps: [0, 1, 2, 3, 6, 11],
  //   // numbers: ['1', 'b2', '2', 'b3', 'b5', '△7'],
  // },
  // {
  //   name: "Dim scale minor7",
  //   steps: [0, 1, 3, 4, 6, 7, 9, 10],
  //   numbers: ["1", "b2", "b3", "3", "#4", "5", "6", "7"],
  //   // steps: [0, 1, 2, 3, 6, 11],
  //   // numbers: ['1', 'b2', '2', 'b3', 'b5', '△7'],
  // },

  // {
  //   name: "Mixolydian b9b13",
  //   steps: [0, 1, 4, 5, 7, 8, 10],
  //   numbers: ["1", "b2", "3", "4", "5", "b6", "7"],
  // },
];

export default scales;
