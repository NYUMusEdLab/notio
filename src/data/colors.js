//Test colorblindness pallettes with the folowing simulators:
// Here are some color blindness simulators that you can use:

// Coblis: https://www.color-blindness.com/coblis-color-blindness-simulator/
// Color Oracle: https://colororacle.org/
// Sim Daltonism: https://michelf.ca/projects/sim-daltonism/
const colors = {
  // grayscale
  standard: [
    "#cd0223",
    "#C8C8C8",
    "#C0C0C0",
    "#696969",
    "#808080",
    "#696969",
    "#A9A9A9",
    "#B2BEB5",
    "#989898",
    "#868686",
    "#737373",
    "#E6E8FA",
  ],
  colorBlindProtanopia: [
    "#cd0223", // red
    "#AA4499",
    "#6E6BB8",
    "#117733",
    "#44AA99",
    "#88CCEE",
    "#A8B8EF",
    "#D3F3B8",
    "#DDCC77",
    "#9BB34D",
    "#4035FF",
    "#CC6677",
  ],

  colorBlindDeuteranopia: [
    "#cd0223", // red
    "#44AA99",
    "#A8B8EF",
    "#117733",
    "#6E6BB8",
    "#AA4499",
    "#9BB34D",
    "#4035FF",
    "#D3F3B8",
    "#88CCEE",
    "#CC6677",
    "#DDCC77",
  ],

  colorBlindTritanopia: [
    "#cd0223", // red
    "#AA4499",
    "#CC6677",
    "#88CCEE",
    "#44AA99",
    "#117733",
    "#A8B8EF",
    "#6E6BB8",
    "#D3F3B8",
    "#9BB34D",
    "#5C5C81",
    "#DDCC77",
  ],
  colorBlind2: [
    "#cd0223",
    "#924900",
    "#db6d00",
    "#24ff24",
    "#ffff6d",
    "#ff6db6",
    "#ffb6db",
    "#9D7AFF",
    "#006ddb",
    "#b66dff",
    "#6db6ff",
    "#b6dbff",
  ],
  pastel: [
    "#cd0223",
    "#E1BEE7",
    "#D1C4E9",
    "#C5CAE9",
    "#BBDEFB",
    "#B2EBF2",
    "#B2DFDB",
    "#C8E6C9",
    "#DCEDC8",
    "#FFF9C4",
    "#FFECB3",
    "#FFE0B2",
  ],
  greenis: [
    "#cd0223",
    "#CCFFFF",
    "#FFFFCC",
    "#99CCCC",
    "#66CC99",
    "#9999CC",
    "#CC6699",
    "#FF9900",
    "#CC99CC",
    "#FFCC99",
    "#CCCCFF",
    "#CCCCCC",
  ],
  bright: [
    "#cd0223",
    "#ff8c00",
    "#ffff00",
    "#c0c0c0",
    "#dddddd",
    "#228b22",
    "#00ff7f",
    "#00ffff",
    "#4d4dff",
    "#87cefa",
    "#8a2be2",
    "#ee82ee",
  ],
  other: [
    "#cd0223",
    "#d45331",
    "#e39255",
    "#ecbb10",
    "#e3d98a",
    "#47e643",
    "#28cbb9",
    "#049496",
    "#2f7ecc",
    "#674ed8",
    "#a059ed",
    "#ba04ff",
  ],
};

export default colors;
