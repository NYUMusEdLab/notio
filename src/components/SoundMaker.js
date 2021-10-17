import { Component } from "react";
import { Piano } from "@tonejs/piano";
import * as Tone from "tone";

class SoundMaker extends Component{
    /* 
        Module handling all making of sounds.
        Made as a Component so it updates when a new instrument is made, but never renders.
        So far only handles the Piano module from tonejs.
    */
    constructor(props){
        super(props)
        this.sound = Tone;
        //this.instrument = options.instrument;
        this.velocities = props.velocities;
        //this.volume = options.volume;
        this.synth = this.chooseInstrument();
        this.initInstrument();
    }

    chooseInstrument(){
        return new Piano({
            velocities: this.velocities,
        }).toDestination();
    }

    initInstrument(){
        this.synth.load();
    }

    getState(){
        return this.sound.context.state;
    }

    resumeSound(){
        this.sound.context.resume();
    }

    startSound(note){
        this.synth.keyDown({ note: note });
    }

    stopSound(note){
        this.synth.keyUp({ note: note });
    }

    render(){
        return null;
    }
}

export default SoundMaker;