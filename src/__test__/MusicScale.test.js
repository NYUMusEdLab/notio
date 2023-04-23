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

  it("C Major should return Do, Re, Mi, Fa, Sol, La, Si", () => {
    const englishScale = ["C", "D", "E", "F", "G", "A", "B"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"]);
  });

  it("C# Major should return Do#, Re#, Mi#, Fa#, Sol#, La#, Si#", () => {
    const englishScale = ["C#", "D#", "E#", "F#", "G#", "A#", "B#"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Do#", "Re#", "Mi#", "Fa#", "Sol#", "La#", "Si#"]);
  });

  it("Cb Major should return Dob, Reb, Mib, Fab, Solb, Lab, Sib", () => {
    const englishScale = ["Cb", "Db", "Eb", "Fb", "Gb", "Ab", "Bb"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Dob", "Reb", "Mib", "Fab", "Solb", "Lab", "Sib"]);
  });

  it("G# Lydian should return Sol# La# Si# Do## Re# Mi# Fa##", () => {
    const englishScale = ["G#", "A#", "B#", "C##", "D#", "E#", "F##"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Sol#", "La#", "Si#", "Do##", "Re#", "Mi#", "Fa##"]);
  });

  it("Ab Phrygian should return Lab Sibb Dob Reb Mib Fab Solb", () => {
    const englishScale = ["Ab", "Bbb", "Cb", "Db", "Eb", "Fb", "Gb"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Lab", "Sibb", "Dob", "Reb", "Mib", "Fab", "Solb"]);
  });

  it("C Custom should return Mi, Fab, Sol#, Lab, Si", () => {
    const englishScale = ["C", "D#", "E", "Fb", "G#", "Ab", "B"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Do", "Re#", "Mi", "Fab", "Sol#", "Lab", "Si"]);
  });

  it("E Custom should return Do, Re#, Mi, Fab, Sol#, Lab, Si", () => {
    const englishScale = ["E", "Fb", "G#", "Ab", "B"];
    const DoReMiList = scaleObjectUnderTest.convertToRomance(englishScale);
    expect(DoReMiList).toEqual(["Mi", "Fab", "Sol#", "Lab", "Si"]);
  });
});