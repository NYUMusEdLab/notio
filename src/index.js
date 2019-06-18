import React, { Component } from "react";
import { render } from "react-dom";
import Keyboard from "./components/Keyboard";
import MusicalStaff from "./components/MusicalStaff";
import { Octaves, Scale, Notation, Theme } from "./components/InputComponents";
import CircleFifthsSVG from "./components/CircleFifthsSVG";
import "./style.css";

class Piano extends Component {
  constructor(props) {
    super(props);

    this.state = {
      octave: 3,
      scale: "Major (Ionian)",
      baseNote: "C",
      notation: ["Colors"],
      pianoOn: true,
      menuOpen: false,
      theme: "light"
    };
  }
  handleClickOctave = action => {
    switch (action) {
      case "minus":
        this.setState({ octave: this.state.octave - 1 });
        break;
      case "plus":
        this.setState({ octave: this.state.octave + 1 });
        break;
      default:
        this.setState({ octave: 3 });
        break;
    }
  };
  handleSelectScale = selectedScale => {
    console.log(selectedScale + " SCALE selected");
    this.setState({ scale: selectedScale });
  };

  /** 
   * 
   * USED WITH 
   * <BaseNote baseNote={this.state.baseNote} notation={this.state.notation} handleSelect={this.handleSelectBaseNote}/>

  handleSelectBaseNote = (selectedNote) => {
    console.log(selectedNote + ' Note selected');
    this.setState({baseNote: selectedNote});
	}

  */

  handleSelectNotation = selectedNotation => {
    console.log(selectedNotation + " Notation selected");
    this.setState({ notation: selectedNotation });
  };

  handleSelectTheme = selectedTheme => {
    console.log(selectedTheme + " Theme selected");
    this.setState({ theme: selectedTheme });
  };

  // TODO: make generic handleSelect
  // handleSelect = (selectedElement, selectedValue) => {
  //   console.log(selectedValue + ' '+ selectedElement+ ' selected');
  //   //this.setState({ [selectedElement]: selectedValue });
  // }

  componentDidMount() {
    /**
     * disable right click
     */
    document.oncontextmenu = function() {
      return false;
    };

    /**manage selection of Root from CircleFifthsSVG */
    const selectRoot = Array.from(
      document.querySelectorAll(".circleFifths .note")
    );

    const that = this;

    selectRoot.map(function(rootNode, index) {
      let noteName = rootNode.textContent;
      if (noteName.includes("♭")) {
        noteName = noteName.substr(0, 1) + "b";
      }

      //TODO: remove active Root
      //remove current active root note class
      //console.log('rootNode', rootNode.classList);
      //rootNode.classList.remove('active');
      //console.log('rootNode', rootNode.classList);
      //console.log(rootNode.classList.remove('active'));

      rootNode.addEventListener("click", e => {
        console.log(e);
        //   console.log('rootNode', rootNode.classList);
        //  rootNode.classList.remove('active');
        e.path[1].classList.add("active");
        that.setState({ baseNote: noteName });
      });
    });
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };
  togglePiano = () => {
    this.setState({ pianoOn: !this.state.pianoOn });
  };

  render() {
    return (
      <div className="Piano">
        <div className="MainMenuDot" onClick={this.toggleMenu} />
        <div className={`MainMenu ${this.state.menuOpen ? "open" : ""}`}>
          <div
            className="closeMenu"
            onClick={this.toggleMenu}
            style={{ backgroundColor: "#FFFFFF", cursor: "pointer" }}
          >
            (x)
          </div>
          <div className="Menu-Row">
            <Octaves
              octave={this.state.octave}
              handleClick={this.handleClickOctave}
            />
            <Scale
              scale={this.state.scale}
              handleSelect={this.handleSelectScale}
            />
            <Notation
              notation={this.state.notation}
              handleSelect={this.handleSelectNotation}
            />
            <CircleFifthsSVG />
          </div>
          <div className="Menu-Row">
            <button onClick={this.togglePiano}>
              Piano {this.state.pianoOn ? "ON" : "OFF"}
            </button>
            <Theme
              theme={this.state.theme}
              handleSelect={this.handleSelectTheme}
            />
          </div>
        </div>
        <div className={`modalCover ${this.state.menuOpen ? "open" : ""}`} />
        {/* {<MusicalStaff />} */}
        <Keyboard
          octave={this.state.octave}
          scale={this.state.scale}
          baseNote={this.state.baseNote}
          notation={this.state.notation}
          pianoOn={this.state.pianoOn}
          theme={this.state.theme}
        />
      </div>
    );
  }
}

render(<Piano />, document.getElementById("root"));
