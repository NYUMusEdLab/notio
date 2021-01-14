const scales = [
  /*{ 
    name: "CHROMATIC", 
    steps: [0,1,2,3,4,5,6,7,8,9,10,11,12]
  },*/
  {
    name: "Major (Ionian)",
    steps: [0, 2, 4, 5, 7, 9, 11, 12],
    numbers: ['1', '2', '3', '4', '5', '6', '△7'],
    major_seventh: 11,
    default: true
  },
  {
    name: "Mixolydian",
    steps: [0, 2, 4, 5, 7, 9, 10, 12],
    numbers: ['1', '2', '3', '4', '5', '6', '7']
  },
  {
    name: "Lydian",
    steps: [0, 2, 4, 6, 7, 9, 11, 12],
    numbers: ['1', '2', '3', '#4', '5', '6', '△7'],
    major_seventh: 11
  },
  {
    name: "Major Pentatonic",
    steps: [0, 2, 4, 7, 9, 12],
    numbers: ['1', '2', '3', '5', '6']
  },
  {
    name: "Minor Pentatonic",
    steps: [0, 3, 5, 7, 10, 12],
    numbers: ['1', 'b3', '4', '5', '7'],
  },
  {
    name: "Minor Natural/Aeolian",
    steps: [0, 2, 3, 5, 7, 8, 10, 12],
    numbers: ['1', '2', 'b3', '4', '5', 'b6', '7']
  },
  {
    name: "Dorian",
    steps: [0, 2, 3, 5, 7, 9, 10, 12],
    numbers: ['1', '2', 'b3', '4', '5', '6', '7']
  },
  {
    name: "Harmonic Minor",
    steps: [0, 2, 3, 5, 7, 8, 11, 12],
    numbers: ['1', '2', 'b3', '4', '5', 'b6', '△7'],
    major_seventh: 11
  },
  {
    name: "Melodic Minor",
    steps: [0, 2, 3, 5, 7, 9, 11, 12],
    numbers: ['1', '2', 'b3', '4', '5', '6', '△7'],
    major_seventh: 11
  },
  {
    name: "Phrygian",
    steps: [0, 1, 3, 5, 7, 8, 10, 12],
    numbers: ['1', 'b2', 'b3', '4', '5', 'b6', '7']
  },
  {
    name: "Locrian",
    steps: [0, 1, 3, 5, 6, 8, 10, 12],
    numbers: ['1', 'b2', 'b3', '4', 'b5', 'b6', '7']
  },
  {
    name: "Minor Blues",
    steps: [0, 3, 5, 6, 7, 10, 12],
    numbers: ['1', 'b3', '4', '#4', '5', '7'],
  },
  {
    name: "Major Blues",
    steps: [0, 2, 3, 4, 7, 9, 12],
    numbers: ['1', '2', 'b3', '3', '5', '6'],
  }
];

export default scales;