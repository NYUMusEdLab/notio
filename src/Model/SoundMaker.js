import { Component } from "react";
// import { Piano } from "@tonejs/piano";
import * as Tone from "tone";

class SoundMaker extends Component {
  /* 
        Module handling all making of sounds.
        Made as a Component so it updates when a new instrument is made, but never renders.
        So far only handles the Piano module from tonejs.
    */
  constructor(props) {
    super(props);
    this.sound = Tone;
    this.instrumentSound = props.instrumentSound;
    this.velocities = props.velocities;
    //this.volume = options.volume;
    this.synth = this.chooseInstrument();
    // this.initInstrument();
  }

  //    startSound =(note) =>{};
  //    stopSound = (note) =>{};

  chooseInstrument() {
    var tempSynth = {};
    switch (this.instrumentSound) {
      //TODO: Uncomm and implement some piano sound
      // case "piano":
      //   tempSynth = new Piano({
      //     velocities: this.velocities,
      //   }).toDestination();

      //   tempSynth.load();
      //   break;

      default:
        tempSynth = new Tone.PolySynth(Tone.AMSynth).toDestination();
        break;
    }

    return tempSynth;
  }

  initInstrument() {
    this.synth.load();
  }

  getState() {
    return this.sound.context.state;
  }

  resumeSound() {
    this.sound.context.resume();
  }

  startSound(note) {
    if (this.instrumentSound === "piano") {
      this.synth.keyDown({ note: note });
    } else {
      const now = Tone.now();
      this.synth.triggerAttack(note, now);
    }
  }

  stopSound(note) {
    if (this.instrumentSound === "piano") {
      this.synth.keyUp({ note: note });
    } else {
      const now = Tone.now();
      this.synth.triggerRelease([note], now);
    }
  }

  render() {
    return null;
  }
}

export default SoundMaker;