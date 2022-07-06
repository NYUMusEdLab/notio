import { Component } from "react";
import { Piano } from "@tonejs/piano";
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
    const tempSynth = new Tone.PolySynth(Tone.AMSynth).toDestination();

    // new Piano({
    //   velocities: this.velocities,
    // }).toDestination();

    // tempSynth.load();
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
      this.synth.triggerAttack(note);
    }
  }

  stopSound(note) {
    if (this.instrumentSound === "piano") {
      this.synth.keyUp({ note: note });
    } else {
      this.synth.triggerRelease([note], 4);
    }
  }

  render() {
    return null;
  }
}

export default SoundMaker;
