import React, { Component } from "react";
import Vex from "vexflow";
import PropTypes from "prop-types";
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
    //renderer.resize(60, 140);
    ctx = renderer.getContext();
    ctx.setViewBox(0, 0, 60, 140); //size
    stave = new Stave(0, 0, 60, { fill_style: 'black' });

    // add clef to first column
    // if (this.props.keyIndex === 0) stave.addClef('bass');
    stave.setContext(ctx).draw();
  }

  drawNotes() {
    console.log("A");
    console.log("this.props.note", this.props.note);
    let daNote;
    // console.log("this.props.note", this.props.note)
    let match = /[0-9]/.exec(this.props.note);
    console.log("match", match);
    if (match) {
      // daNote = B/4 G/5 notation...
      daNote =
        this.props.note.substr(0, match.index) +
        "/" +
        this.props.note.substr(match.index, this.props.note.length - 1);

    }
    console.log("daNote", daNote);


    // console.log("daNote", daNote);
    // Example of singleNote
    // { 0:  {
    //  durations: "w",
    //  keys: ["Cb/5"]
    //}
    console.log("************ B", daNote);

    let singleNote = [{ keys: [daNote], duration: "w", clef: this.props.clef }];
    // adding accidentals : #, b etc...
    let oneNote = singleNote.map(function (note) {
      if (note.keys[0].includes("bb")) {
        console.log("1");
        return new StaveNote(note).addAccidental(0, new Accidental("bb"));
      } else if (note.keys[0].includes("b")) {
        console.log("2");

        return new StaveNote(note).addAccidental(0, new Accidental("b"));
      } else if (note.keys[0].includes("#")) {
        console.log("3");

        return new StaveNote(note).addAccidental(0, new Accidental("#"));
      } else {
        console.log("************ 4", note);

        return new StaveNote(note);
      }
    });
    console.log("C");

    // console.log("oneNote", oneNote);

    let voice = new Voice({
      num_beats: oneNote.length,
      beat_value: 1,
    });
    console.log("D");

    // console.log("D");
    voice.addTickables(oneNote);
    // console.log("voice", voice);
    // Format and justify the notes to window.innerwidth pixels
    console.log("E");

    new Formatter().joinVoices([voice]).format([voice], window.innerWidth);

    // Render voice
    voice.draw(ctx, stave);
    console.log("F");


  }

  componentDidMount() {
    this.setupStaff();
    if (this.props.isOn) this.drawNotes();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.note !== this.props.note ||
      prevProps.showOffNote !== this.props.showOffNotes ||
      prevProps.width !== this.props.width ||
      prevProps.isOn !== this.props.isOn ||
      prevProps.clef !== this.props.clef
    ) {
      this.removePrevious();
      this.setupStaff();
      if (this.props.isOn) this.drawNotes();
    }
  }

  render() {
    const {
      width,
      extendedKeyboard
    } = this.props;

    return <div
      ref={this.musicalStaff}
      className="musical-staff"
      style={{
        width: width,
        top: extendedKeyboard ? "50%" : "40%"
      }}
    />;
  }
}

MusicalStaff.propTypes = {
  note: PropTypes.string,
  showOffNote: PropTypes.bool,
  width: PropTypes.number,
  keyIndex: PropTypes.number,
  isOn: PropTypes.bool,
  clef: PropTypes.string,
}

export default MusicalStaff;
