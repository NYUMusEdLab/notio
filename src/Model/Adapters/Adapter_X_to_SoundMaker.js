import { Component } from "react";
//TODO: make some adaptor pattern to implement different sound libraries: Sounds, Choose instrument, StartSound, StopSound
class Adapter_X_to_SoundMaker extends Component {
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
  Instruments = [{ name: "Not Implemented" }];

  chooseInstrument() {
    throw new Error("Not implemented");
  }
  initInstrument() {
    throw new Error("Not implemented");
  }

  getState(note) {
    throw new Error("Not implemented");
  }

  resumeSound(tone) {
    throw new Error("Not implemented");
  }

  startSound(note) {
    throw new Error("Not implemented");
  }

  stopSound(note) {
    throw new Error("Not implemented");
  }

  render() {
    return null;
  }
}

export default Adapter_X_to_SoundMaker;
