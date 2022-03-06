/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import _ from "lodash";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";
import VideoTutorial from "./VideoTutorial";
import Share from "./Share";
// import Settings from "./Settings";
import Root from "./Root";
import RootMenu from "../../assets/img/RootMenu";
import Octaves from "./Octaves";
// import { findColor } from '../utils.js';

import ListRadio from "../form/ListRadio";
// import scales from "../../data/scalesObj";
import NotationImg from "../../assets/img/Notation";
// import CustomScaleImg from "../../assets/img/CustomScale";

import clefs from "../../data/clefs";
// import CustomScaleSelector from "./CustomScaleSelector";
import { DropdownCustomScaleMenu } from "./DropdownCustomScaleMenu";


const sounds = [{ name: "piano" }, { name: "xylo" }];

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleNotation: "",
      clefTitle: "",
      clefImage: "",
      titleRoot: this.props.state.baseNote,
    };
  }

  setScaleTitle = (title) => {
    this.setState({
      titleNotation: title,
    });
  };

  setSoundTitle = (title) => {
    this.setState({
      titleSound: title,
    });
  };

  setClefTitle = (title) => {
    this.setState({
      clefTitle: title,
    });
  };

  setClefImage = (img) => {
    this.setState({
      clefImage: _.startCase(img) + "Clef",
    });
  };
 //special cases: when the rootpicker returns HB we want to display a B for the german notation, when it returns a SI B we want a SIb
  handleChangeTitle = (note) => {
    let convertedNote = note;
    switch (note){
      case 'HB':
        convertedNote = 'B'
        break;
      case 'SI\nB':
        convertedNote = 'SIb'
        break;
        default:
          break;
    }
    this.setState({
      titleRoot: convertedNote,
    });
  };

  render() {
    // console.log("topmenu scales", scales);
    return (
      <div>
        <div className="navbar "
            data-tip="custom" data-for="keyboardTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "keyboard")}
            // The tooltip text for the keyboard is placed at the bottom of this div, due to how ReactTooltip works!
        >
          {/* Toggle Piano */}
          <div className="navbar-item toggle"
            data-tip="custom" data-for="showKeyboardTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "showKeyboard")}
          >
            <Toggle
              title="Show keyboard"
              onChange={this.props.togglePiano}
              checked={this.props.state.pianoOn}
            />
          </div>
          <ReactTooltip id="showKeyboardTooltip" place="right" effect="solid" scrollHide={false} resizeHide={false}
            overridePosition={() => { return {top:120, left:-10}; }} className="tooltip-topmenu"
          >
                <p>
                    Show Keyboard<br/>
                    Toggles the keyboard on/off at the bottom of the screen
                </p>
          </ReactTooltip>

          {/* Toggle Extended */}
          <div className="navbar-item toggle"
            data-tip="custom" data-for="extendedKeyboardTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "extendedKeyboard")}
          >
            <Toggle
              title="Extended Keyboard"
              onChange={this.props.toggleExtendedKeyboard}
              checked={this.props.state.extendedKeyboard}
            />
          </div>
          <ReactTooltip id="extendedKeyboardTooltip" place="right" effect="solid" scrollHide={false} resizeHide={false}
            overridePosition={() => { return {top:220, left:-10}; }} className="tooltip-topmenu"
          >
                <p>
                    Extend Keyboard<br/>
                    Toggles the keyboard between only showing 1 octave 
                    and the 3 extra notes surrounding the octave on top and bottom
                </p>
          </ReactTooltip>

          {/* Sounds */}
          <div className="navbar-item menu-scale"
            data-tip="custom" data-for="soundTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "sound")}
          >
            <SubMenu
              title="Sound"
              selected={this.state.titleSound}
              content={
                <ListRadio
                  nameField="scale"
                  data={sounds}
                  handleChange={this.props.handleChangeSound}
                  setTitle={this.setSoundTitle}
                  initOption="piano"
                />
              }
            />
          </div>
          <ReactTooltip id="soundTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            offset={{'bottom':60}} className="tooltip-topmenu"
          >
                <p>
                    Sound<br/>
                    Chooses what sound the keyboard should make<br/>
                    Presently only supports a piano sound
                </p>
          </ReactTooltip>

          {/* Notation */}
          <div className="navbar-item menu-notation"
            data-tip="custom" data-for="notationTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "notation")}
          >
            <SubMenu
              title="Notation"
              selected={""}
              selectedImg= {< NotationImg />}
              content={
                <>
                <Notation
                  initOptions={this.props.state.notation}
                  handleChange={this.props.handleChangeNotation} />
                </>
              }
            />
          </div>
          <ReactTooltip id="notationTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            offset={{'bottom':60}} className="tooltip-topmenu"
          >
                <p>
                    Notation<br/>
                    Chooses the type of notations you want to be shown
                </p>
          </ReactTooltip>

          {/* CustomScaleSelector */}
          {/* <div className="navbar-item menu-custom-scale">
            <SubMenu
              title="CustomScale"
              selected={this.props.state.scaleObject.name}
              selectedImg=< CustomScaleImg />
              content={
                <CustomScaleSelector //TODO: add initoptions for custom scale, matching current scale, add function handleCustomScale
                  initOptions={this.props.state.scaleObject} //TODO: fix to customscale creation
                  handleChange={this.props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                />
              }
            />
          </div> */}
              
          {/* Root */}
          <div className="navbar-item menu-root"
            data-tip="custom" data-for="rootTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "root")}
          >
            <SubMenu
              title="Root"
              selected={this.state.titleRoot}
              selectedImg= {<RootMenu color={"#ff0000"} />}
              //selectedImg=<RootMenu color={findColor(this.props.state.baseNote.charAt(0))} />
              content={
                <div>
                <Root
                  label="Root"
                  baseNote={this.props.state.baseNote}
                  handleChangeRoot={this.props.handleChangeRoot}
                  handleChangeTitle={this.handleChangeTitle}
                />
                <Octaves octave={this.props.state.octave} handleClick={this.props.handleClickOctave} />
                </div>
              }
            />
            {/* <div className="half-circle"></div> */}
          </div>
          <ReactTooltip id="rootTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            offset={{'bottom':40}} className="tooltip-topmenu"
          >
                <p>
                    Root<br/>
                    Chooses what the root note is, and what octave it is in<br/>
                </p>
          </ReactTooltip>

          {/* Scale */}
          <div className="navbar-item menu-scale"
            data-tip="custom" data-for="scaleTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "scale")}
          >
            <SubMenu
              title="Scale"
              selected={this.state.titleNotation}
              content={
                <>
                <ListRadio
                  nameField="scale"
                  data={this.props.state.scaleList}
                  handleChange={this.props.handleChangeScale}
                  setTitle={this.setScaleTitle}
                  initOption={this.props.state.scale} />
                  <DropdownCustomScaleMenu 
                  menuTextClassName="form-radio"
                  state = {this.props.state}
                  scaleObject={this.props.state.scaleObject} //TODO: fix to customscale creation
                  handleChangeCustomScale={this.props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                    />
                  </>

              }
            />
          </div>
          <ReactTooltip id="scaleTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false} 
            offset={{'bottom':60}} className="tooltip-topmenu"
          >
                <p>
                    Scale<br/>
                    Chooses the scale being used on the keyboard<br/>
                    Only notes in the scale are possible to play on<br/>
                    It is possible to create a custom scale<br/>
                </p>
          </ReactTooltip>

          {/* Clef */}
          <div className="navbar-item menu-clef"
            data-tip="custom" data-for="clefsTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "clefs")}
          >
            <SubMenu
              title="Clefs"
              selected={this.state.clefTitle}
              displayClef={true}
              content={
                <ListRadio
                  nameField="clef"
                  data={clefs}
                  handleChange={this.props.handleSelectClef}
                  setTitle={this.setClefTitle}
                  setImage={this.setClefImage}
                  initOption={this.props.state.clef}
                  displayPicto={true}
                />
              }
            />
          </div>
          <ReactTooltip id="clefsTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            offset={{'bottom':60}} className="tooltip-topmenu"
          >
                <p>
                    Clefs<br/>
                    Chooses what clef will be used when showing the notes<br/>
                    It is also possible to turn off showing the notes
                </p>
          </ReactTooltip>

          {/* Video */}
          <div className="navbar-item menu-video"
            data-tip="custom" data-for="videoPlayerTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "videoPlayer")}
          >
            <VideoTutorial
              active = {this.props.videoActive}
              title="Video Player"
              label="video"
              handleChangeVideoUrl={this.props.handleChangeVideoUrl}
              handleChangeVideoVisibility = {this.props.handleChangeVideoVisibility}
              videoUrl={this.props.state.videoUrl}
              resetVideoUrl={this.props.resetVideoUrl}
            />
          </div>
          <ReactTooltip id="videoPlayerTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            overridePosition={() => { return {top:280, left:1370}; }} className="tooltip-topmenu"
          >
                <p>
                    Video Player<br/>
                    Shows a popup with a Youtube Video Player<br/>
                    You can play any video by copy-pasting the url into the Customize tab<br/>
                    The popup can also be moved and resized by dragging it
                </p>
          </ReactTooltip>

          {/* Share */}
          <div className="navbar-item menu-share"
            data-tip="custom" data-for="shareThisSetupTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "shareThisSetup")}
          >
            <Share
              title="Share this setup"
              label="Share"
              saveSessionToDB={this.props.saveSessionToDB}
              sessionID={this.props.sessionID}
            />
          </div>
          <ReactTooltip id="shareThisSetupTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false} 
            overridePosition={() => { return {top:120, left:1370}; }} className="tooltip-topmenu"// Needs manual overriding, since it doesn't work like the rest (for some reason)
          >
                <p>
                    Share This Setup<br/>
                    Crates a url you can share, so that others receive an identical setup to the one you currently have 
                </p>
          </ReactTooltip>

          {/* Settings */}
          {/* <div className="navbar-item menu-settings">
            <Settings title="Settings" label="Settings" />
          </div> */}
        </div>
        <div className="side-menu">
          <div className="area1 area"><img src={require('../../img/info.png')} alt="about" /></div>
          <div className="Area2 area">
              <img src={require('../../img/question_mark.png')} alt="help"
              data-tip="custom" data-for="helpTooltip" data-event="null" ref={(ref) => this.props.setRef(ref, "help")}
              onClick={() => this.props.handleChangeTooltip()}
              />
        </div>
        <ReactTooltip id="helpTooltip" place="left" effect="solid" scrollHide={false} resizeHide={false} type="info" className="tooltip-topmenu">
            <p>
                ? Button<br/>
                Toggles these tooltips on and off
            </p>
        </ReactTooltip>

        <div className="Area3 area"><img src={require('../../img/home.png')} alt="home"/></div>
        </div>
        <ReactTooltip id="keyboardTooltip" place="bottom" effect="solid" scrollHide={false} resizeHide={false}
            offset={{'bottom':250}} className="tooltip-keyboard"
        >
                <p>
                    Keyboard<br/>
                    The Keyboard can be played by using the mouse<br/>
                    The Keyboard can also be played by using the middle of the keyboard (ASDFGHJKL) where F is the root note<br/>
                    ZXC also plays the three notes below the root note<br/>
                    The colouring of the keyboard can be changed on 1-5
                </p>
          </ReactTooltip>
      </div>
    );
  }
}

export default TopMenu;
