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
    this.soundfont = Soundfont;
    this.instrumentSound = props.instrumentSound;
    this.velocities = props.velocities;
    this.ac = new AudioContext();
    this.synth = this.chooseInstrument();
    this.playingNotes = {};
    this.releaseNotes = [];
  }
  Instruments = SoundFontLibraryNames;

  chooseInstrument() {
    if (this.Instruments.some((inst) => inst.name === this.instrumentSound)) {
      return Soundfont.instrument(this.ac, this.instrumentSound, {
        soundfont: "FluidR3_GM",
        gain: 2.0,
      });
    } else {
      return Soundfont.instrument(this.ac, "acoustic_grand_piano", {
        soundfont: "FluidR3_GM",
        gain: 2.0,
      });
    }
  }
  initInstrument() {
    // this.synth;
  }

  getState(note) {
    return this.ac.state;
  }

  resumeSound(tone) {}

  startSound(note) {
    if (this.playingNotes.hasOwnProperty(note)) {
      return;
    }
    this.synth.then((instrument) => {
      this.playingNotes[note] = instrument.play(note);
    });
  }

  stopSound(note) {
    if (this.playingNotes.hasOwnProperty(note)) {
      // this.playingNotes.delete(note)
      this.synth.then((instrument) => {
        this.playingNotes[note].stop(this.ac.currentTime);
        delete this.playingNotes[note];
      });
    }
  }

  render() {
    return null;
  }
}

export default Adapter_SoundFont_to_SoundMaker;
