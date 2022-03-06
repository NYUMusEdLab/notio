import React, { Component } from "react";
import Keyboard from "./components/Keyboard";
import TopMenu from "./components/menu/TopMenu";
import LoadingScreen from "./components/LoadingScreen";
import "./style.scss";
import db from "./Firebase";
import { notio_tutorial } from "./data/config";
import scales from "./data/scalesObj";


class WholeApp extends Component {
  state = {
    octave: 4,
    scale: "Major (Ionian)",
    scaleObject: {
      name: "Major (Ionian)",
      steps: [0, 2, 4, 5, 7, 9, 11],
      numbers: ["1", "2", "3", "4", "5", "6", "△7"],
    },
    scaleList: [...scales],//new ScaleStore(),
    clef: "treble",
    baseNote: "C",
    notation: ["Colors"],
    pianoOn: true,
    extendedKeyboard: false,
    trebleStaffOn: true,
    menuOpen: false,
    theme: "light",
    showOffNotes: true,
    sessionID: null,
    sessionError: null,
    loading: true,
    // videoUrl: 'https://www.youtube.com/watch?v=g4mHPeMGTJM', // silence test video for coding
    videoUrl: notio_tutorial,
    videoActive : false
  };

  constructor(props) {
    super(props);
    this.togglePiano = this.togglePiano.bind(this);
    this.toggleExtendedKeyboard = this.toggleExtendedKeyboard.bind(this);
    this.handleChangeNotation = this.handleChangeNotation.bind(this);
    this.handleSelectScale = this.handleSelectScale.bind(this);
    this.handleSelectClef = this.handleSelectClef.bind(this);
    this.handleChangeVideoVisibility = this.handleChangeVideoVisibility.bind(this);
  }

  handleChangeSound = (sound) => {};

  handleClickOctave = (action) => {
    switch (action) {
      case "minus":
        if(this.state.octave > 1){
            this.setState({ octave: this.state.octave - 1 });
        }
        break;
      case "plus":
        if(this.state.octave < 8){
            this.setState({ octave: this.state.octave + 1 });
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
    const staff_on = selectedClef === "no staff" ? false : true;
    this.setState({ trebleStaffOn: staff_on });
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

  handleChangeCustomScale = (customScaleName, customsteps, customNumbers,firstRun=false) => {
    // console.log(customScaleName + "Custom Scale Created");
    // this.state.scaleList.Add({name: customScaleName,
    //   steps: customsteps,
    //   numbers: customNumbers,})
    if (!this.state.scaleList.map(element => element.name === customScaleName).includes(true)) 
      {
      this.setState({
        scaleList : [...this.state.scaleList,{name: customScaleName,
          steps: customsteps,
          numbers: customNumbers,}],
        scale: customScaleName,
        scaleObject: {
          name: customScaleName,
          steps: customsteps,
          numbers: customNumbers,
        },
        
      });

       if (!firstRun){
          alert("Custom Scale Created " + customScaleName + customNumbers);
        }
  }
  else if (!firstRun){
    alert("A scale of that name already exists: " + customScaleName + customNumbers);
  }

  };

  handleSelectTheme = (selectedTheme) => {
    // console.log(selectedTheme + " Theme selected");
    this.setState({ theme: selectedTheme });
  };

  handleChangeRoot = (selectedRoot) => {
    // console.log(selectedRoot + " Root selected");
    const convertedRoot = selectedRoot === 'HB' ? 'Bb': selectedRoot === 'Hb' ? 'Bb':selectedRoot  === 'H' ? 'B' : selectedRoot;
    this.setState({ baseNote: convertedRoot });
  };

  handleChangeVideoUrl = (url) => {
    this.setState({ videoUrl: url,
    videoActive : true });
  };

  resetVideoUrl = () => {
    this.setState({ videoUrl: notio_tutorial });
  };
  
  handleChangeVideoVisibility = () => {
    const isActive = !this.state.videoActive
    this.setState({ 
      videoActive : isActive });  };

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
      pianoOn,
      extendedKeyboard,
      trebleStaffOn,
      theme,
      showOffNotes,
      clef,
      videoUrl,
      videoActive,
    } = this.state;
    db.collection("sessions")
      .add({
        octave: octave,
        scale: scale,
        scaleObject: scaleObject,
        baseNote: baseNote,
        notation: notation,
        pianoOn: pianoOn,
        extendedKeyboard: extendedKeyboard,
        trebleStaffOn: trebleStaffOn,
        theme: theme,
        showOffNotes: showOffNotes,
        clef: clef,
        videoUrl: videoUrl,
        videoActive:videoActive,
      })
      .then((docRef) => {
        // console.log("Session written with ID: ", docRef.id);
        this.setState({ sessionID: docRef.id });
      })
      .catch((error) => {
        // console.error("Error adding document: ", error);
        this.setState({ sessionError: error });
      });
  };

  openSavedSession = (sessionId) => {
    // console.log("*********** openSaved session:", sessionId);
    const ref = db.collection("sessions").doc(sessionId);
    ref.get().then((doc) => {
      if (doc.exists) {
        const result = doc.data();
        this.handleChangeCustomScale(result.scaleObject.name, result.scaleObject.steps, result.scaleObject.numbers, true)//true denotes that this is a firstRun
        // console.log("********* result", result);
        this.setState({
          octave: result.octave,
          scale: result.scale,
          scaleObject: result.scaleObject,
          baseNote: result.baseNote,
          notation: result.notation,
          pianoOn: result.pianoOn,
          extendedKeyboard: result.extendedKeyboard,
          trebleStaffOn: result.trebleStaffOn,
          menuOpen: result.menuOpen,
          theme: result.theme,
          showOffNotes: result.showOffNotes,
          clef: result.clef,
          loading: false,
          videoUrl: result.videoUrl,
          videoActive: result.videoActive,
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
    const sessionId = this.props.match.params.sessionId;
    // console.log("********************** componentDidMount sessionId", sessionId);
    if (sessionId) {
      this.openSavedSession(sessionId);
    } else {
      this.setState({
        loading: false,
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

    const { loading, showOffNotes}=this.state;
    // console.log("whole app", this.state.notation);
    return loading ? (
      <LoadingScreen />
    ) : (
      <div>
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
          handleChangeVideoVisibility = {this.handleChangeVideoVisibility}
          handleChangeSound={this.handleChangeSound}
          resetVideoUrl={this.resetVideoUrl}
          videoActive = {this.state.videoActive}
          saveSessionToDB={this.saveSessionToDB}
          sessionID={this.state.sessionID}
          state={this.state}
        />

        <div className={`Piano${showOffNotes === true ? " showOffNotes" : ""}`}>

          <Keyboard
            octave={this.state.octave}
            scale={this.state.scale}
            scaleObject = {this.state.scaleObject}
            scaleList = {this.state.scaleList}
            baseNote={this.state.baseNote}
            notation={this.state.notation}
            pianoOn={this.state.pianoOn}
            extendedKeyboard={this.state.extendedKeyboard}
            trebleStaffOn={this.state.trebleStaffOn}
            showOffNotes={this.state.showOffNotes}
            theme={this.state.theme}
            clef={this.state.clef}
          />
        </div>
      </div>
    );
  }
}

export default WholeApp;
