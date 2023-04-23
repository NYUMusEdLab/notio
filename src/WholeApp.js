import React, { Component } from "react";
import db from "./Firebase";
import "./styles/style.scss";
import ReactTooltip from "react-tooltip";
import Keyboard from "./components/keyboard/Keyboard";
import TopMenu from "./components/menu/TopMenu";
import LoadingScreen from "./components/LoadingScreen";
import { notio_tutorial } from "./data/config";
import scales from "./data/scalesObj";
// import SoundLibraryNames from "data/SoundFontLibraryNames";
import SoundLibraryNames from "data/TonejsSoundNames";

// TODO:to meet the requirements for router-dom v6 useParam hook can not be used in class Components and props.match.params only works in v5:
//This is using a wrapper function for wholeApp because wholeApp is a class and not a functional component, REWRITE wholeApp to a const wholeApp =()=>{...}
//Also fix index.js call to WholeApp

class WholeApp extends Component {
  state = {
    octave: 4,
    octaveDist: 0,
    scale: "Major (Ionian)",
    scaleObject: {
      name: "Major (Ionian)",
      steps: [0, 2, 4, 5, 7, 9, 11],
      numbers: ["1", "2", "3", "4", "5", "6", "△7"],
    },
    scaleList: [...scales], //new ScaleStore(),
    clef: "treble",
    baseNote: "C",
    notation: ["Colors"],
    soundNames: SoundLibraryNames,
    instrumentSound: "piano", //"piano" or "AMSynth"
    pianoOn: true,
    extendedKeyboard: false,
    trebleStaffOn: true,
    menuOpen: false,
    theme: "light",
    showOffNotes: true,
    sessionID: null,
    sessionError: null,
    loading: true,
    // videoUrl: "https://www.youtube.com/watch?v=g4mHPeMGTJM", // silence test video for coding
    videoUrl: notio_tutorial,
    resetVideoUrl: notio_tutorial,
    videoActive: false,
    activeVideoTab: "Enter_url", //Player or Enter_url
    showTooltip: true,
    keyboardTooltipRef: null,
    showKeyboardTooltipRef: null,
    extendedKeyboardTooltipRef: null,
    soundTooltipRef: null,
    notationTooltipRef: null,
    rootTooltipRef: null,
    scaleTooltipRef: null,
    clefsTooltipRef: null,
    videoPlayerTooltipRef: null,
    shareThisSetupTooltipRef: null,
    helpTooltipRef: null,
  };

  constructor(props) {
    super(props);
    this.togglePiano = this.togglePiano.bind(this);
    this.toggleExtendedKeyboard = this.toggleExtendedKeyboard.bind(this);
    this.handleChangeNotation = this.handleChangeNotation.bind(this);
    this.handleSelectScale = this.handleSelectScale.bind(this);
    this.handleSelectClef = this.handleSelectClef.bind(this);
    this.handleChangeVideoVisibility = this.handleChangeVideoVisibility.bind(this);
    this.handleChangeTooltip = this.handleChangeTooltip.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  setRef = (ref, menu) => {
    if (menu === "keyboard" && this.state.keyboardTooltipRef === null) {
      this.setState({ keyboardTooltipRef: ref });
    } else if (menu === "showKeyboard" && this.state.showKeyboardTooltipRef === null) {
      this.setState({ showKeyboardTooltipRef: ref });
    } else if (menu === "extendedKeyboard" && this.state.extendedKeyboardTooltipRef === null) {
      this.setState({ extendedKeyboardTooltipRef: ref });
    } else if (menu === "sound" && this.state.soundTooltipRef === null) {
      this.setState({ soundTooltipRef: ref });
    } else if (menu === "notation" && this.state.notationTooltipRef === null) {
      this.setState({ notationTooltipRef: ref });
    } else if (menu === "root" && this.state.rootTooltipRef === null) {
      this.setState({ rootTooltipRef: ref });
    } else if (menu === "scale" && this.state.scaleTooltipRef === null) {
      this.setState({ scaleTooltipRef: ref });
    } else if (menu === "clefs" && this.state.clefsTooltipRef === null) {
      this.setState({ clefsTooltipRef: ref });
    } else if (menu === "videoPlayer" && this.state.videoPlayerTooltipRef === null) {
      this.setState({ videoPlayerTooltipRef: ref });
    } else if (menu === "shareThisSetup" && this.state.shareThisSetupTooltipRef === null) {
      this.setState({ shareThisSetupTooltipRef: ref });
    } else if (menu === "help" && this.state.helpTooltipRef === null) {
      this.setState({ helpTooltipRef: ref });
    }
  };

  handleSoundsAreLoaded = (sounds) => {
    this.setState({ soundNames: sounds });
  };

  handleChangeSound = (sound) => {
    this.setState({ instrumentSound: sound });
  };

  handleClickOctave = (action) => {
    const { octave, octaveDist } = this.state;

    switch (action) {
      case "minus":
        if (octave > 1) {
          this.setState({ octave: octave - 1 });
        }
        break;
      case "plus":
        if (octave < 8) {
          this.setState({ octave: octave + 1 });
        }
        break;
      case "ArrowDown":
        if (octave + octaveDist > 1) {
          this.setState({ octaveDist: octaveDist - 1 });
        }
        break;
      case "ArrowUp":
        if (octave + octaveDist < 8) {
          this.setState({ octaveDist: octaveDist + 1 });
        }
        break;
      default:
        this.setState({ octave: 3 });
        break;
    }
  };

  handleSelectScale = (selectedScale) => {
    // console.log(selectedScale + " SCALE selected");
    const newScaleObject = this.state.scaleList.find((obj) => obj.name === selectedScale);
    this.setState({
      scale: selectedScale,
      scaleObject: newScaleObject,
    });
  };

  handleSelectClef = (selectedClef) => {
    // console.log(selectedClef + " clef selected");
    const staff_on = selectedClef === "hide notes" ? false : true;
    this.setState({ clef: selectedClef, trebleStaffOn: staff_on });
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

  handleChangeNotation = (selectedNotation) => {
    // console.log(selectedNotation + " Notation selected");
    this.setState({ notation: selectedNotation });
  };

  handleChangeCustomScale = (customScaleName, customsteps, customNumbers, firstRun = false) => {
    // console.log(customScaleName + "Custom Scale Created");
    // this.state.scaleList.Add({name: customScaleName,
    //   steps: customsteps,
    //   numbers: customNumbers,})
    if (!this.state.scaleList.map((element) => element.name === customScaleName).includes(true)) {
      this.setState({
        scaleList: [
          ...this.state.scaleList,
          { name: customScaleName, steps: customsteps, numbers: customNumbers },
        ],
        scale: customScaleName,
        scaleObject: {
          name: customScaleName,
          steps: customsteps,
          numbers: customNumbers,
        },
      });

      if (!firstRun) {
        alert("Custom Scale Created " + customScaleName + customNumbers);
      }
    } else if (!firstRun) {
      alert("A scale of that name already exists: " + customScaleName + customNumbers);
    }
  };

  handleSelectTheme = (selectedTheme) => {
    // console.log(selectedTheme + " Theme selected");
    this.setState({ theme: selectedTheme });
  };

  handleChangeRoot = (selectedRoot) => {
    // console.log(selectedRoot + " Root selected");
    const convertedRoot =
      selectedRoot === "HB"
        ? "Bb"
        : selectedRoot === "Hb"
        ? "Bb"
        : selectedRoot === "H"
        ? "B"
        : selectedRoot;
    this.setState({ baseNote: convertedRoot });
  };

  handleChangeVideoUrl = (url) => {
    this.setState({ videoUrl: url, videoActive: true });
  };

  handleResetVideoUrl = () => {
    // console.log("resetting video url")
    // console.log(this.state.resetVideoUrl);
    this.setState({ videoUrl: this.state.resetVideoUrl });
  };

  handleChangeVideoVisibility = () => {
    const isActive = !this.state.videoActive;
    this.setState({
      videoActive: isActive,
    });
  };

  handleChangeActiveVideoTab = (tabTitle) => {
    this.setState({
      activeVideoTab: tabTitle,
    });
  };

  handleChangeTooltip = () => {
    const tooltip = !this.state.showTooltip;
    this.setState({
      showTooltip: tooltip,
    });
    if (tooltip === true) {
      // console.log("GOTTA SHOW!");
      ReactTooltip.show(this.state.keyboardTooltipRef);
      ReactTooltip.show(this.state.showKeyboardTooltipRef);
      ReactTooltip.show(this.state.extendedKeyboardTooltipRef);
      ReactTooltip.show(this.state.soundTooltipRef);
      ReactTooltip.show(this.state.notationTooltipRef);
      ReactTooltip.show(this.state.rootTooltipRef);
      ReactTooltip.show(this.state.scaleTooltipRef);
      ReactTooltip.show(this.state.clefsTooltipRef);
      ReactTooltip.show(this.state.videoPlayerTooltipRef);
      ReactTooltip.show(this.state.shareThisSetupTooltipRef);
      ReactTooltip.show(this.state.helpTooltipRef);
    } else {
      ReactTooltip.hide();
    }
  };

  // TODO: make generic handleSelect
  // handleSelect = (selectedElement, selectedValue) => {
  //   console.log(selectedValue + ' '+ selectedElement+ ' selected');
  //   //this.setState({ [selectedElement]: selectedValue });
  // }

  saveSessionToDB = () => {
    // console.log("saveSessionToDB");
    const {
      octave,
      scale,
      scaleObject,
      baseNote,
      notation,
      instrumentSound,
      pianoOn,
      extendedKeyboard,
      trebleStaffOn,
      theme,
      showOffNotes,
      clef,
      videoUrl,
      videoActive,
      activeVideoTab,
    } = this.state;
    db.collection("sessions")
      .add({
        octave: octave,
        scale: scale,
        scaleObject: scaleObject,
        baseNote: baseNote,
        notation: notation,
        instrumentSound: instrumentSound,
        pianoOn: pianoOn,
        extendedKeyboard: extendedKeyboard,
        trebleStaffOn: trebleStaffOn,
        theme: theme,
        showOffNotes: showOffNotes,
        clef: clef,
        videoUrl: videoUrl,
        videoActive: videoActive,
        activeVideoTab: activeVideoTab,
      })
      .then((docRef) => {
        // console.log("Session written with ID: ", docRef.id);
        this.setState({ sessionID: docRef.id });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.setState({ sessionError: error });
      });
  };

  openSavedSession = (sessionId) => {
    // console.log("*********** openSaved session:", sessionId);
    const ref = db.collection("sessions").doc(sessionId);
    ref.get().then((doc) => {
      if (doc.exists) {
        const result = doc.data();
        this.handleChangeCustomScale(
          result.scaleObject.name,
          result.scaleObject.steps,
          result.scaleObject.numbers,
          true
        ); //true denotes that this is a firstRun
        // console.log("********* result", result);
        this.setState({
          octave: result.octave,
          scale: result.scale,
          scaleObject: result.scaleObject,
          baseNote: result.baseNote,
          notation: result.notation,
          instrumentSound: result.instrumentSound,
          pianoOn: result.pianoOn,
          extendedKeyboard: result.extendedKeyboard,
          trebleStaffOn: result.trebleStaffOn,
          menuOpen: result.menuOpen,
          theme: result.theme,
          showOffNotes: result.showOffNotes,
          clef: result.clef,
          loading: false,
          videoUrl: result.videoUrl,
          resetVideoUrl: result.videoUrl,
          videoActive: result.videoActive,
          activeVideoTab: result.activeVideoTab,
        });
      } else {
        this.setState({ loading: false });
        // console.log("No such document!");
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

    // const { match } = this.props;
    // const { params } = match;

    // TODO: when rewriting to use functional component this should read: = useParams()
    const sessionId = this.props.sessionId === undefined ? null : this.props.sessionId;
    console.log("********************** componentDidMount sessionId", sessionId);
    if (sessionId !== null) {
      this.openSavedSession(sessionId);
    } else {
      this.setState({
        loading: false,
      });
    }

    //Initialze the tooltip
    /* TODO: MOMENTARILY TURNED OFF DUE TO REQUEST BY CECILIA
    new Promise(r => setTimeout(r, 1500)).then((resolve, reject) => {
        const tooltip = !this.state.showTooltip;
        this.setState({
            showTooltip: tooltip
        })
        this.handleChangeTooltip();
    })
    */
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
    const { loading, showOffNotes } = this.state;

    // console.log("whole app", this.state.notation);
    return loading ? (
      <LoadingScreen />
    ) : (
      <>
        <div className="topmenu">
          <TopMenu
            togglePiano={this.togglePiano}
            toggleExtendedKeyboard={this.toggleExtendedKeyboard}
            handleChangeNotation={this.handleChangeNotation}
            handleChangeScale={this.handleSelectScale}
            handleChangeCustomScale={this.handleChangeCustomScale}
            handleSelectClef={this.handleSelectClef}
            handleHideStaff={this.toggleStaff}
            handleClickOctave={this.handleClickOctave}
            handleChangeRoot={this.handleChangeRoot}
            handleChangeVideoUrl={this.handleChangeVideoUrl}
            handleChangeVideoVisibility={this.handleChangeVideoVisibility}
            handleChangeActiveVideoTab={this.handleChangeActiveVideoTab}
            handleChangeSound={this.handleChangeSound}
            instrumentSound={this.state.instrumentSound}
            soundNames={this.state.soundNames}
            handleChangeTooltip={this.handleChangeTooltip}
            handleResetVideoUrl={this.handleResetVideoUrl}
            resetVideoUrl={this.state.resetVideoUrl}
            videoActive={this.state.videoActive}
            activeVideoTab={this.state.activeVideoTab}
            saveSessionToDB={this.saveSessionToDB}
            sessionID={this.state.sessionID}
            state={this.state}
            setRef={this.setRef}
          />
        </div>

        <div className={`content-body Piano${showOffNotes === true ? " showOffNotes" : ""}`}>
          <Keyboard
            octave={this.state.octave}
            octaveDist={this.state.octaveDist}
            handleClickOctave={this.handleClickOctave}
            scale={this.state.scale}
            scaleObject={this.state.scaleObject}
            scaleList={this.state.scaleList}
            baseNote={this.state.baseNote}
            notation={this.state.notation}
            instrumentSound={this.state.instrumentSound}
            // handleSoundsAreLoaded={this.handleSoundsAreLoaded}
            pianoOn={this.state.pianoOn}
            extendedKeyboard={this.state.extendedKeyboard}
            trebleStaffOn={this.state.trebleStaffOn}
            showOffNotes={this.state.showOffNotes}
            theme={this.state.theme}
            clef={this.state.clef}
          />
        </div>
      </>
    );
  }
}

// TODO:to meet the requirements for router-dom v6 useParam hook can not be used in class Components and props.match.params only works in v5:
//This is using a wrapper function for wholeApp because wholeApp is a class and not a functional component, REWRITE wholeApp to a const wholeApp =()=>{...}
//Also fix index.js call to WholeApp
export default WholeApp;
