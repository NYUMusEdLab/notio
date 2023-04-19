import MusicScale from "Model/MusicScale";

const testProps = {
  scaleObject: {
    name: "Major (Ionian)",
    steps: [0, 2, 4, 5, 7, 9, 11],
    numbers: ["1", "2", "3", "4", "5", "6", "△7"],
  },
  baseNote: "C",
  scaleStart: 0,
  ambitus: 8,
};

describe("Music Scale component", () => {
  //Setup
  //const scaleObjectUnderTest = new MusicScale({ ...testProps });
  const scaleObjectUnderTest = new MusicScale(
    testProps.scaleObject,
    testProps.baseNote,
    testProps.scaleStart,
    testProps.ambitus
  );

  it("C Major should return Do, Re, Mi, Fa, So, La, Si", () => {
    const englishScale = ["C", "D", "E", "F", "G", "A", "B"];
    const DoReMiList = scaleObjectUnderTest.GenerateRomanceNames(englishScale);
    expect(DoReMiList).toEqual(["Do", "Re", "Mi", "Fa", "So", "La", "Si"]);
  });

  it("C# Major should return Do#, Re#, Mi#, Fa#, So#, La#, Si#", () => {
    const englishScale = ["C#", "D#", "E#", "F#", "G#", "A#", "B#"];
    const DoReMiList = scaleObjectUnderTest.GenerateRomanceNames(englishScale);
    expect(DoReMiList).toEqual(["Do#", "Re#", "Mi#", "Fa#", "So#", "La#", "Si#"]);
  });

  it("Cb Major should return Dob, Reb, Mib, Fab, Sob, Lab, Sib", () => {
    const englishScale = ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"];
    const DoReMiList = scaleObjectUnderTest.GenerateRomanceNames(englishScale);
    expect(DoReMiList).toEqual(["Dob", "Reb", "Mib", "Fab", "Sob", "Lab", "Sib"]);
  });

  it("C Custom should return Do, Re#, Mi, Fab, So#, Lab, Si", () => {
    const englishScale = ["C", "D#", "E", "Fb", "G#", "Ab", "B"];
    const DoReMiList = scaleObjectUnderTest.GenerateRomanceNames(englishScale);
    expect(DoReMiList).toEqual(["Do", "Re#", "Mi", "Fab", "So#", "Lab", "Si"]);
  });

  it("C Custom should return Do", () => {
    const romancename = scaleObjectUnderTest.toRomanceNotation("C");
    expect(romancename).toEqual("Do");
  });
  it("C# Custom should return Do#", () => {
    const romancename = scaleObjectUnderTest.toRomanceNotation("C#");
    expect(romancename).toEqual("Do#");
  });
  it("C## Custom should return Re", () => {
    const romancename = scaleObjectUnderTest.toRomanceNotation("C##");
    expect(romancename).toEqual("Re");
  });
  it("Cb Custom should return Dob", () => {
    const romancename = scaleObjectUnderTest.toRomanceNotation("Cb");
    expect(romancename).toEqual("Dob");
  });
  it("Cbb Custom should return Sib", () => {
    const romancename = scaleObjectUnderTest.toRomanceNotation("Cbb");
    expect(romancename).toEqual("Sib");
  });
});
