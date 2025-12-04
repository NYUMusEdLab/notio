import MusicScale from "Model/MusicScale";
import scales from "../data/scalesObj";

describe("Relative Notation - Locrian Scale", () => {
  it("Locrian scale with C root shows SE for b5 (not FI)", () => {
    const locrianRecipe = scales.find((s) => s.name === "Locrian");
    const scale = new MusicScale(locrianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",
      "ME",
      "FA",
      "SE",
      "LE",
      "TE",  // "7" in numbers array = minor 7th = TE
    ]);
  });

  it("Locrian scale with D root shows SE at fifth position", () => {
    const locrianRecipe = scales.find((s) => s.name === "Locrian");
    const scale = new MusicScale(locrianRecipe, "D", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",
      "ME",
      "FA",
      "SE",
      "LE",
      "TE",
    ]);
  });

  it("Locrian scale with F# root shows SE at fifth position", () => {
    const locrianRecipe = scales.find((s) => s.name === "Locrian");
    const scale = new MusicScale(locrianRecipe, "F#", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RA",
      "ME",
      "FA",
      "SE",
      "LE",
      "TE",
    ]);
  });

  it("Minor Blues scale shows SE for b5 and SO for natural 5", () => {
    const minorBluesRecipe = scales.find((s) => s.name === "Minor Blues");
    const scale = new MusicScale(minorBluesRecipe, "C", 0, 12);

    // Minor Blues has: 1, b3, 4, b5, 5, 7 (where 7 = minor 7th = TE)
    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "ME",
      "FA",
      "SE",
      "SO",
      "TE",
    ]);
    // Verify b5 is SE (position 3) and natural 5 is SO (position 4)
    expect(scale.ExtendedScaleToneNames.Relative[3]).toBe("SE");
    expect(scale.ExtendedScaleToneNames.Relative[4]).toBe("SO");
  });
});
