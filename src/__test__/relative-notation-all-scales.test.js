import MusicScale from "Model/MusicScale";
import scales from "../data/scalesObj";

describe("Relative Notation - All Scales", () => {
  it("Phrygian scale (b2) shows RA at second position", () => {
    const phrygianRecipe = scales.find((s) => s.name === "Phrygian");
    const scale = new MusicScale(phrygianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",
      "ME",
      "FA",
      "SO",
      "LE",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
    expect(scale.ExtendedScaleToneNames.Relative[1]).toBe("RA");
  });

  it("Dorian scale (b3, b7) shows ME and TE", () => {
    const dorianRecipe = scales.find((s) => s.name === "Dorian");
    const scale = new MusicScale(dorianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "ME",
      "FA",
      "SO",
      "LA",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
    expect(scale.ExtendedScaleToneNames.Relative[2]).toBe("ME");
    expect(scale.ExtendedScaleToneNames.Relative[6]).toBe("TE");
  });

  it("Natural Minor/Aeolian (b3, b6, b7) shows correct flat syllables", () => {
    const aeolianRecipe = scales.find((s) => s.name === "Natural Minor/Aeolian");
    const scale = new MusicScale(aeolianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "ME",
      "FA",
      "SO",
      "LE",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
    expect(scale.ExtendedScaleToneNames.Relative[2]).toBe("ME"); // b3
    expect(scale.ExtendedScaleToneNames.Relative[5]).toBe("LE"); // b6
    expect(scale.ExtendedScaleToneNames.Relative[6]).toBe("TE"); // b7 (labeled as "7" in data)
  });

  it("Major Pentatonic shows correct syllables", () => {
    const majorPentatonicRecipe = scales.find(
      (s) => s.name === "Major Pentatonic"
    );
    const scale = new MusicScale(majorPentatonicRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "SO",
      "LA",
    ]);
  });

  it("Minor Pentatonic shows correct syllables", () => {
    const minorPentatonicRecipe = scales.find(
      (s) => s.name === "Minor Pentatonic"
    );
    const scale = new MusicScale(minorPentatonicRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "ME",
      "FA",
      "SO",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
  });

  it("Harmonic Minor shows correct syllables", () => {
    const harmonicMinorRecipe = scales.find((s) => s.name === "Harmonic Minor");
    const scale = new MusicScale(harmonicMinorRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "ME",
      "FA",
      "SO",
      "LE",
      "TI",
    ]);
  });

  it("Melodic Minor shows correct syllables", () => {
    const melodicMinorRecipe = scales.find((s) => s.name === "Melodic Minor");
    const scale = new MusicScale(melodicMinorRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "ME",
      "FA",
      "SO",
      "LA",
      "TI",
    ]);
  });

  it("Major Blues shows correct syllables", () => {
    const majorBluesRecipe = scales.find((s) => s.name === "Major Blues");
    const scale = new MusicScale(majorBluesRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "ME",
      "MI",
      "SO",
      "LA",
    ]);
  });

  it("Mixolydian (b7) shows TE at seventh position", () => {
    const mixolydianRecipe = scales.find((s) => s.name === "Mixolydian");
    const scale = new MusicScale(mixolydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FA",
      "SO",
      "LA",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
    expect(scale.ExtendedScaleToneNames.Relative[6]).toBe("TE");
  });

  it("Extended scales (2 octaves) repeat syllable pattern correctly", () => {
    const majorRecipe = scales.find((s) => s.name === "Major (Ionian)");
    const scale = new MusicScale(majorRecipe, "C", 0, 24); // 2 octaves

    const expected = [
      "DO",
      "RE",
      "MI",
      "FA",
      "SO",
      "LA",
      "TI", // First octave
      "DO",
      "RE",
      "MI",
      "FA",
      "SO",
      "LA",
      "TI", // Second octave
    ];
    expect(scale.ExtendedScaleToneNames.Relative).toEqual(expected);
  });

  it("Extended Lydian scale (2 octaves) repeats FI correctly", () => {
    const lydianRecipe = scales.find((s) => s.name === "Lydian");
    const scale = new MusicScale(lydianRecipe, "C", 0, 24); // 2 octaves

    const expected = [
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI", // First octave
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI", // Second octave
    ];
    expect(scale.ExtendedScaleToneNames.Relative).toEqual(expected);
    expect(scale.ExtendedScaleToneNames.Relative[3]).toBe("FI");
    expect(scale.ExtendedScaleToneNames.Relative[10]).toBe("FI");
  });
});
