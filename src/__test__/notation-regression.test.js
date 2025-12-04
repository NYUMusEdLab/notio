import MusicScale from "Model/MusicScale";
import scales from "../data/scalesObj";

describe("Notation Regression - Other Notations Remain Unaffected", () => {
  const lydianRecipe = scales.find((s) => s.name === "Lydian");

  it("English notation unchanged for Lydian scale", () => {
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.English).toEqual([
      "C",
      "D",
      "E",
      "F#",
      "G",
      "A",
      "B",
    ]);
  });

  it("German notation unchanged for Lydian scale", () => {
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.German).toEqual([
      "C",
      "D",
      "E",
      "F#",  // German notation uses F# not Fis in this implementation
      "G",
      "A",
      "H",
    ]);
  });

  it("Romance notation unchanged for Lydian scale", () => {
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Romance).toEqual([
      "Do",
      "Re",
      "Mi",
      "Fa#",
      "Sol",
      "La",
      "Si",
    ]);
  });

  it("Scale Steps notation unchanged for Lydian scale", () => {
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Scale_Steps).toEqual([
      "1",
      "2",
      "3",
      "#4",
      "5",
      "6",
      "△7",
    ]);
  });

  it("Chord extensions notation unchanged for Lydian scale", () => {
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Chord_extensions).toEqual([
      " ",
      "9",
      " ",
      "#11",
      " ",  // 5th degree in Lydian doesn't get a chord extension label
      "13",
      " ",  // 7th degree doesn't get labeled in this context
    ]);
  });

  it("Chromatic scale in Relative notation still shows all 12 syllables correctly", () => {
    const chromaticRecipe = scales.find((s) => s.name === "Chromatic");
    const scale = new MusicScale(chromaticRecipe, "C", 0, 12);

    // OLD implementation: uses notes array which has mix of raised/flattened syllables
    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",  // b2 (flattened)
      "RE",
      "ME",  // b3 (flattened)
      "MI",
      "FA",
      "FI",  // #4 (raised)
      "SO",
      "SI",  // #5 (raised)
      "LA",
      "TE",  // b7 (flattened)
      "TI",
    ]);
  });

  it("All notation types work correctly for Major scale", () => {
    const majorRecipe = scales.find((s) => s.name === "Major (Ionian)");
    const scale = new MusicScale(majorRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.English).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "B",
    ]);
    expect(scale.ExtendedScaleToneNames.German).toEqual([
      "C",
      "D",
      "E",
      "F",
      "G",
      "A",
      "H",
    ]);
    expect(scale.ExtendedScaleToneNames.Romance).toEqual([
      "Do",
      "Re",
      "Mi",
      "Fa",
      "Sol",
      "La",
      "Si",
    ]);
    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FA",
      "SO",
      "LA",
      "TI",
    ]);
    expect(scale.ExtendedScaleToneNames.Scale_Steps).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "△7",
    ]);
    expect(scale.ExtendedScaleToneNames.Chord_extensions).toEqual([
      " ",
      "9",
      " ",
      "11",  // 4th degree = 11th
      " ",  // 5th degree doesn't get labeled
      "13",
      " ",  // 7th degree doesn't get labeled for Major scale
    ]);
  });

  it("All notation types work correctly for Locrian scale", () => {
    const locrianRecipe = scales.find((s) => s.name === "Locrian");
    const scale = new MusicScale(locrianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.English).toEqual([
      "C",
      "Db",
      "Eb",
      "F",
      "Gb",
      "Ab",
      "Bb",
    ]);
    expect(scale.ExtendedScaleToneNames.German).toEqual([
      "C",
      "Db",  // German notation uses Db not Des in this implementation
      "Eb",  // German notation uses Eb not Es
      "F",
      "Gb",  // German notation uses Gb not Ges
      "Ab",  // German notation uses Ab not As
      "B",
    ]);
    expect(scale.ExtendedScaleToneNames.Romance).toEqual([
      "Do",
      "Reb",
      "Mib",
      "Fa",
      "Solb",
      "Lab",
      "Sib",
    ]);
    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",
      "ME",
      "FA",
      "SE",
      "LE",
      "TE",
    ]);
    expect(scale.ExtendedScaleToneNames.Scale_Steps).toEqual([
      "1",
      "b2",
      "b3",
      "4",
      "b5",
      "b6",
      "7",
    ]);
  });
});
