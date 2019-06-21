import React, { Component } from "react";
import Vex from "vexflow";
const { Renderer, Stave, Accidental, StaveNote, Voice, Formatter } = Vex.Flow;

let stave, ctx, renderer;

class MusicalStaff extends Component {
  constructor(props) {
    super(props);
    this.musicalStaff = React.createRef();
  }

  removePrevious() {
    if (this.musicalStaff.current.hasChildNodes()) {
      this.musicalStaff.current.removeChild(
        this.musicalStaff.current.lastChild
      );
    }
  }

  setupStaff() {
    let containerSVG = this.musicalStaff.current;
    renderer = new Renderer(containerSVG, Vex.Flow.Renderer.Backends.SVG);
    renderer.resize(this.props.width, 350);
    ctx = renderer.getContext();
    ctx.setViewBox(0, 0, 70, 70); //size
    //this works for scaling too: ctx.scale(2, 2); // scale X and Y
    stave = new Stave(0, 0, this.props.width);
    stave.setContext(ctx).draw();
  }

  drawNotes() {
    let daNote;
    let match = /[0-9]/.exec(this.props.note);
    if (match) {
      daNote =
        this.props.note.substr(0, match.index) +
        "/" +
        this.props.note.substr(match.index, this.props.note.length - 1);
    }

    let singleNote = [{ keys: [daNote], duration: "w" }];

    let oneNote = singleNote.map(function(note) {
      if (note.keys[0].includes("b")) {
        return new StaveNote(note).addAccidental(0, new Accidental("b"));
      } else if (note.keys[0].includes("#")) {
        return new StaveNote(note).addAccidental(0, new Accidental("#"));
      } else {
        return new StaveNote(note);
      }
    });

    let voice = new Voice({
      num_beats: oneNote.length,
      beat_value: 1
    });

    voice.addTickables(oneNote);

    // Format and justify the notes to window.innerwidth pixels
    new Formatter().joinVoices([voice]).format([voice], window.innerWidth);

    // Render voice
    voice.draw(ctx, stave);
  }

  componentDidMount() {
    this.setupStaff();
    this.drawNotes();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.note !== this.props.note) {
      this.removePrevious();
      this.setupStaff();
      this.drawNotes();
    }
  }

  render() {
    return <div ref={this.musicalStaff} className="musical-staff" />;
  }
}

export default MusicalStaff;
