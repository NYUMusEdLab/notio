import React, { Component } from "react";
import Keyboard from "./components/Keyboard";
import TopMenu from "./components/menu/TopMenu";
import { Octaves, Scale, Theme } from "./components/InputComponents";
import CircleFifthsSVG from "./components/CircleFifthsSVG";
import LoadingScreen from "./components/LoadingScreen";
import "./style.scss";
import db from "./Firebase";

class WholeApp extends Component {
  state = {
    octave: 4,
    scale: "Major (Ionian)",
    baseNote: "C",
    notation: ["Colors"],
    pianoOn: false,
    extendedKeyboard: false,
    trebleStaffOn: true,
    menuOpen: false,
    theme: "light",
    showOffNotes: true,
    sessionID: null,
    sessionError: null,
    loading: true
  };

  constructor(props) {
    super(props);
    this.togglePiano = this.togglePiano.bind(this);
    this.toggleExtendedKeyboard = this.toggleExtendedKeyboard.bind(this);
    this.handleChangeNotation = this.handleChangeNotation.bind(this);
    this.handleSelectScale = this.handleSelectScale.bind(this);

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

  handleChangeNotation = selectedNotation => {
    console.log(selectedNotation + " Notation selected");
    this.setState({ notation: selectedNotation });
  };

  handleSelectTheme = selectedTheme => {
    console.log(selectedTheme + " Theme selected");
    this.setState({ theme: selectedTheme });
  };

  handleChangeRoot = selectedRoot => {
    console.log(selectedRoot + " Root selected");
    this.setState({ baseNote: selectedRoot });
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
      extendedKeyboard,
      trebleStaffOn,
      theme,
      showOffNotes
    } = this.state;
    db.collection("sessions")
      .add({
        octave: octave,
        scale: scale,
        baseNote: baseNote,
        notation: notation,
        pianoOn: pianoOn,
        extendedKeyboard: extendedKeyboard,
        trebleStaffOn: trebleStaffOn,
        theme: theme,
        showOffNotes: showOffNotes
      })
      .then(docRef => {
        console.log("Session written with ID: ", docRef.id);
        this.setState({ sessionID: docRef.id });
      })
      .catch(error => {
        console.error("Error adding document: ", error);
        this.setState({ sessionError: error });
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
          extendedKeyboard: result.extendedKeyboard,
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
    /**
     * disable right click
     */
    document.oncontextmenu = function () {
      return false;
    };

    const { match } = this.props;
    const { params } = match;
    const { sessionId } = params;

    if (sessionId) {
      this.openSavedSession(sessionId);
    } else {
      this.setState({
        loading: false
      });
    }
  }

  toggleMenu = () => {
    this.setState({ menuOpen: !this.state.menuOpen });
  };
  togglePiano = () => {
    this.setState({ pianoOn: !this.state.pianoOn });
  };
  toggleExtendedKeyboard = () => {
    this.setState({ extendedKeyboard: !this.state.extendedKeyboard });
  };
  toggleStaff = () => {
    this.setState({ trebleStaffOn: !this.state.trebleStaffOn });
  };
  toggleShowOffNotes = () => {
    this.setState({ showOffNotes: !this.state.showOffNotes });
  };

  render() {
    const {
      loading,
      showOffNotes,
      menuOpen,
      octave,
      scale,
      notation,
      baseNote,
      pianoOn,
      extendedKeyboard,
      theme,
      trebleStaffOn
    } = this.state;
    console.log("whole app", this.state.notation)
    return loading ? (
      <LoadingScreen />
    ) : (
        <div>
          <TopMenu
            togglePiano={this.togglePiano}
            toggleExtendedKeyboard={this.toggleExtendedKeyboard}
            notationState={this.state.notation}
            handleChangeNotation={this.handleChangeNotation}
            handleChangeScale={this.handleSelectScale}
          />

          <div className={`Piano${showOffNotes === true ? " showOffNotes" : ""}`}>
            <div className="MainMenuDot" onClick={this.toggleMenu}>
              <span>&#9835;</span>
            </div>
            <div className={`MainMenu slide-in-top ${menuOpen ? "open" : ""}`}>
              <div
                className="closeMenu"
                onClick={this.toggleMenu}
                style={{ backgroundColor: "#FFFFFF", cursor: "pointer" }}
              >
                (x)
            </div>
              <div className="Menu-Row">
                <Octaves octave={octave} handleClick={this.handleClickOctave} />
                <Scale scale={scale} handleSelect={this.handleSelectScale} />
                <CircleFifthsSVG
                  rootNote={baseNote}
                  handleChange={this.handleChangeRoot}
                />
              </div>
              <div className="Menu-Row">
                <div className="Menu-label"></div>
                <div className="Menu-label">
                  Musical Staff (Treble){" "}
                  <img height="30" src="/img/treble-clef.png" alt="treble cleff" />
                </div>
                <div className="Menu-label">Show notes that are not in scale</div>
                <div className="Menu-label">Share this setup</div>
              </div>
              <div className="Menu-Row">


                <Theme theme={theme} handleSelect={this.handleSelectTheme} />
                <div className="toggle-switch">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={trebleStaffOn}
                      onChange={this.toggleStaff}
                    />
                    <label />
                  </div>
                </div>
                <div className="toggle-switch">
                  <div className="checkbox">
                    <input
                      type="checkbox"
                      checked={showOffNotes}
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
                    href={`https://notio.pestanias.now.sh/shared/${this.state.sessionID}`}
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
              extendedKeyboard={this.state.extendedKeyboard}
              trebleStaffOn={this.state.trebleStaffOn}
              showOffNotes={this.state.showOffNotes}
              theme={this.state.theme}
            />
          </div>
        </div>
      );
  }
}

export default WholeApp;
