import MusicScale from "Model/MusicScale";
import scales from "../data/scalesObj";

describe("Relative Notation - Lydian Scale", () => {
  it("Lydian scale with C root shows FI for #4 (not SE)", () => {
    const lydianRecipe = scales.find((s) => s.name === "Lydian");
    const scale = new MusicScale(lydianRecipe, "C", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI",
    ]);
  });

  it("Lydian scale with F root shows FI for #4", () => {
    const lydianRecipe = scales.find((s) => s.name === "Lydian");
    const scale = new MusicScale(lydianRecipe, "F", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI",
    ]);
  });

  it("Lydian scale with Bb root shows FI for #4", () => {
    const lydianRecipe = scales.find((s) => s.name === "Lydian");
    const scale = new MusicScale(lydianRecipe, "Bb", 0, 12);

    expect(scale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI",
    ]);
  });

  it("Switching from Major to Lydian updates display immediately", () => {
    const majorRecipe = scales.find((s) => s.name === "Major (Ionian)");
    const lydianRecipe = scales.find((s) => s.name === "Lydian");

    const majorScale = new MusicScale(majorRecipe, "C", 0, 12);
    expect(majorScale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FA",
      "SO",
      "LA",
      "TI",
    ]);

    const lydianScale = new MusicScale(lydianRecipe, "C", 0, 12);
    expect(lydianScale.ExtendedScaleToneNames.Relative).toEqual([
      "DO",
      "RE",
      "MI",
      "FI",
      "SO",
      "LA",
      "TI",
    ]);
    expect(lydianScale.ExtendedScaleToneNames.Relative[3]).toBe("FI");
  });
});
