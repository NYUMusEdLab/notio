import React, { Component } from "react";
import Keyboard from "./components/Keyboard";
import { Octaves, Scale, Notation, Theme } from "./components/InputComponents";
import CircleFifthsSVG from "./components/CircleFifthsSVG";
import LoadingScreen from "./components/LoadingScreen";
import "./style.css";
import db from "./Firebase";

class WholeApp extends Component {
  state = {
    octave: 4,
    scale: "Major (Ionian)",
    baseNote: "C",
    notation: ["Colors"],
    pianoOn: false,
    trebleStaffOn: true,
    menuOpen: false,
    theme: "light",
    showOffNotes: true,
    sessionID: null,
    sessionError: null,
    loading: true
  };
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

  saveSessionToDB = () => {
    const {
      octave,
      scale,
      baseNote,
      notation,
      pianoOn,
      trebleStaffOn,
      theme,
      showOffNotes
    } = this.state;
    const that = this;
    db.collection("sessions")
      .add({
        octave: octave,
        scale: scale,
        baseNote: baseNote,
        notation: notation,
        pianoOn: pianoOn,
        trebleStaffOn: trebleStaffOn,
        theme: theme,
        showOffNotes: showOffNotes
      })
      .then(function(docRef) {
        console.log("Session written with ID: ", docRef.id);
        that.setState({ sessionID: docRef.id });
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
        that.setState({ sessionError: error });
      });
  };

  openSavedSession = sessionId => {
    console.log("openSaved session:", sessionId);
    const ref = db.collection("sessions").doc(sessionId);
    ref.get().then(doc => {
      if (doc.exists) {
        const result = doc.data();
        this.setState({
          octave: result.octave,
          scale: result.scale,
          baseNote: result.baseNote,
          notation: result.notation,
          pianoOn: result.pianoOn,
          trebleStaffOn: result.trebleStaffOn,
          menuOpen: result.menuOpen,
          theme: result.theme,
          showOffNotes: result.showOffNotes,
          loading: false
        });
      } else {
        this.setState({ loading: false });
        console.log("No such document!");
      }
    });
  };

  // connectToDB() {
  //   let sessionRef = db.collection("sessions");
  //   sessionRef
  //     .get()
  //     .then(snapshot => {
  //       snapshot.forEach(doc => {
  //         console.log(doc.id, "=>", doc.data());
  //       });
  //     })
  //     .catch(err => {
  //       console.log("Error getting documents", err);
  //     });
  // }

  componentDidMount() {
    const { match } = this.props;
    const { params } = match;
    const { sessionId } = params;

    if (sessionId) {
      this.openSavedSession(sessionId);
    } else {
      this.setState({ loading: false });
    }

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
        //console.log(e);
        //console.log("rootNode", rootNode.classList);
        //rootNode.classList.remove("active");
        //console.log("noteName", noteName);

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
  toggleStaff = () => {
    this.setState({ trebleStaffOn: !this.state.trebleStaffOn });
  };
  toggleShowOffNotes = () => {
    this.setState({ showOffNotes: !this.state.showOffNotes });
  };

  render() {
    return this.state.loading ? (
      <LoadingScreen />
    ) : (
      <div
        className={`Piano${
          this.state.showOffNotes === true ? " showOffNotes" : ""
        }`}
      >
        <div className="MainMenuDot" onClick={this.toggleMenu}>
          <span>&#9835;</span>
        </div>
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
            <div className="Menu-label">Piano</div>
            <div className="Menu-label" />
            <div className="Menu-label">
              Musical Staff (Treble){" "}
              <img height="30" src="/img/treble-clef.png" alt="treble cleff" />
            </div>
            <div className="Menu-label">Show notes that are not in scale</div>
            <div className="Menu-label">Share this setup</div>
          </div>
          <div className="Menu-Row">
            <div className="toggle-switch">
              <div className="checkbox" /*onClick={this.togglePiano}*/>
                <input
                  type="checkbox"
                  checked={this.state.pianoOn}
                  onChange={this.togglePiano}
                />
                <label />
              </div>
            </div>
            <Theme
              theme={this.state.theme}
              handleSelect={this.handleSelectTheme}
            />
            <div className="toggle-switch">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={this.state.trebleStaffOn}
                  onChange={this.toggleStaff}
                />
                <label />
              </div>
            </div>
            <div className="toggle-switch">
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={this.state.showOffNotes}
                  onChange={this.toggleShowOffNotes}
                />
                <label />
              </div>
            </div>
            <div className="share" onClick={this.saveSessionToDB}>
              <img width="50" src="/img/share.png" alt="Share" />
            </div>
          </div>
          {this.state.sessionID ? (
            <div className="Bottom-Info-Row">
              Your configuration has been saved here:{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://notio.pestanias.now.sh/shared/{this.state.sessionID}"
              >
                https://notio.pestanias.now.sh/shared/{this.state.sessionID}
              </a>
            </div>
          ) : null}
        </div>
        <div className={`modalCover ${this.state.menuOpen ? "open" : ""}`} />
        <Keyboard
          octave={this.state.octave}
          scale={this.state.scale}
          baseNote={this.state.baseNote}
          notation={this.state.notation}
          pianoOn={this.state.pianoOn}
          trebleStaffOn={this.state.trebleStaffOn}
          showOffNotes={this.state.showOffNotes}
          theme={this.state.theme}
        />
      </div>
    );
  }
}

export default WholeApp;
