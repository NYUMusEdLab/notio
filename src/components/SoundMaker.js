import { Piano } from "@tonejs/piano";
import * as Tone from "tone";

class SoundMaker{
    /* 
        Module handling all making of sounds.
        So far only handles the Piano module from tonejs.
    */
    constructor(options){
        this.sound = Tone;
        //this.instrument = options["instrument"];
        this.velocities = options["velocities"];
        //this.volume = options["volumen"];
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

    startSound(note){
        this.synth.keyDown({ note: note });
    }

    stopSound(note){
        this.synth.keyUp({ note: note });
    }
}

export default SoundMaker;