import SoundFontLibraryNames from "data/SoundFontLibraryNames";
import { Component } from "react";
import Adapter_to_SoundMaker from "./Adapters/Adapter_SoundFont_to_SoundMaker";

// import Adapter_to_SoundMaker from "./Adapters/Adapter_Tonejs_to_SoundMaker";
//TODO: make some adaptor pattern to implement different sound libraries: Sounds, Choose instrument, StartSound, StopSound
class SoundMaker extends Component {
  /*
    Module handling all making of sounds.
    Made as a Component so it updates when a new instrument is made, but never renders.
    So far only handles the Piano module from tonejs.
  */
  constructor(props) {
    super(props);
    // this.instrumentSound = props.instrumentSound;
    // this.velocities = props.velocities;
    // this.synth = this.chooseInstrument();
    this.soundMakerAdapter = new Adapter_to_SoundMaker(props);
  }

  Instruments = () => SoundFontLibraryNames; //this.soundMakerAdapter.Instruments;

  chooseInstrument() {
    this.soundMakerAdapter.chooseInstrument();
  }
  initInstrument() {
    this.soundMakerAdapter.initInstrument();
  }

  getState(note) {
    return this.soundMakerAdapter.getState(note);
  }

  resumeSound(tone) {
    this.soundMakerAdapter.resumeSound(tone);
  }

  startSound(note) {
    this.soundMakerAdapter.startSound(note);
  }

  stopSound(note) {
    this.soundMakerAdapter.stopSound(note);
  }

  render() {
    return this.soundMakerAdapter.render();
  }
}

export default SoundMaker;
