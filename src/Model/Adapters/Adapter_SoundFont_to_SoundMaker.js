import SoundFontLibraryNames from "data/SoundFontLibraryNames";
import Soundfont from "soundfont-player";
import Adapter_X_to_SoundMaker from "./Adapter_X_to_SoundMaker";

//TODO: make some adaptor pattern to implement different sound libraries: Sounds, Choose instrument, StartSound, StopSound
class Adapter_SoundFont_to_SoundMaker extends Adapter_X_to_SoundMaker {
  /*
    Module handling all making of sounds.
    Made as a Component so it updates when a new instrument is made, but never renders.
    So far only handles the Piano module from tonejs.
  */
  //   constructor(props) {
  //     super(props);
  //     // this.instrumentSound = props.instrumentSound;
  //     // this.velocities = props.velocities;
  //     // this.synth = this.chooseInstrument();
  //   }
  constructor(props) {
    super(props);
    this.instrumentSound = props.instrumentSound;
    this.velocities = props.velocities;
    this.synth = this.chooseInstrument();
  }
  Instruments = SoundFontLibraryNames;

  chooseInstrument() {
    if (this.Instruments.some((inst) => this.instrumentSound === inst.name)) {
      return Soundfont.instrument(new AudioContext(), this.instrumentSound, {
        soundfont: "FluidR3_GM",
        gain: 2.0,
      });
    } else {
      return Soundfont.instrument(new AudioContext(), "acoustic_grand_piano", {
        soundfont: "FluidR3_GM",
        gain: 2.0,
      });
    }
  }
  initInstrument() {
    // this.synth;
  }

  getState(note) {
    return true;
  }

  resumeSound(tone) {}

  startSound(note) {
    this.synth.then((instrument) => {
      instrument.play(note);
    });
  }

  stopSound(note) {
    this.synth.then((instrument) => {
      instrument.stop(note);
    });
  }

  render() {
    return null;
  }
}

export default Adapter_SoundFont_to_SoundMaker;
