/* eslint-disable no-fallthrough */

import React, { Component } from "react";
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
        <div className="navbar ">
          {/* Toggle Piano */}
          <div className="navbar-item toggle">
            <Toggle
              title="Show keyboard"
              onChange={this.props.togglePiano}
              checked={this.props.state.pianoOn}
            />
          </div>

          {/* Toggle Extended */}
          <div className="navbar-item toggle">
            <Toggle
              title="Extended Keyboard"
              onChange={this.props.toggleExtendedKeyboard}
              checked={this.props.state.extendedKeyboard}
            />
          </div>

          {/* Sounds */}
          <div className="navbar-item menu-scale">
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

          {/* Notation */}
          <div className="navbar-item menu-notation">
            <SubMenu
              title="Notation"
              selected={""}
              selectedImg= {< NotationImg />}
              content={
                <Notation
                  initOptions={this.props.state.notation}
                  handleChange={this.props.handleChangeNotation}
                />
              }
            />
          </div>

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
          <div className="navbar-item menu-root">
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

          {/* Scale */}
          <div className="navbar-item menu-scale">
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

          {/* Clef */}
          <div className="navbar-item menu-clef">
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

          {/* Video */}
          <div className="navbar-item menu-video">
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

          {/* Share */}
          <div className="navbar-item menu-share">
            <Share
              title="Share this setup"
              label="Share"
              saveSessionToDB={this.props.saveSessionToDB}
              sessionID={this.props.sessionID}
            />
          </div>

          {/* Settings */}
          {/* <div className="navbar-item menu-settings">
            <Settings title="Settings" label="Settings" />
          </div> */}
        </div>
        <div className="side-menu">
          <div className="area1 area"><img src={require('../../img/info.png')} alt="about" /></div>
          <div className="Area2 area"><img src={require('../../img/question_mark.png')} alt="help" /></div>
          <div className="Area3 area"><img src={require('../../img/home.png')} alt="home" /></div>
        </div>
      </div>
    );
  }
}

export default TopMenu;
