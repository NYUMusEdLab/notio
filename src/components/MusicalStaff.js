import React, { Component } from "react";
import Vex from "vexflow";
const { Renderer, Stave, Accidental, StaveNote, Voice, Formatter } = Vex.Flow;

let octave = 4;

//TODO: update

class MusicalStaff extends Component {
  componentDidMount() {
    this.setupStaff();
  }
  setupStaff() {
    //var containerSVG = document.getElementById("musical-staff");
    var containerSVG = document.getElementsByClassName("musical-staff")[
      this.props.testIndex
    ];
    console.log(
      document.getElementsByClassName("musical-staff"),
      this.props.testIndex
    );
    var renderer = new Renderer(containerSVG, Vex.Flow.Renderer.Backends.SVG);
    //renderer.resize(window.innerWidth, 200);
    renderer.resize(this.props.width, 200);
    var ctx = renderer.getContext();
    // const stave = new Stave(0, 0, window.innerWidth);
    const stave = new Stave(0, 0, this.props.width);
    stave.setContext(ctx).draw();

    let daNote = this.props.note[0] + "/" + octave;

    var singleNote = [{ keys: [daNote], duration: "w" }];

    var oneNote = singleNote.map(function(note) {
      return new StaveNote(note);
    });

    var voice = new Voice({
      num_beats: oneNote.length, //was notes.length
      beat_value: 1
    });

    voice.addTickables(oneNote);
    //voice.addTickables(notes);

    // Format and justify the notes to window.innerwidth pixels
    var formatter = new Formatter()
      .joinVoices([voice])
      .format([voice], window.innerWidth);

    // Render voice
    voice.draw(ctx, stave);
  }
  render() {
    return <div className="musical-staff" />;
  }
}

export default MusicalStaff;
