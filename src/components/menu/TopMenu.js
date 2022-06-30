/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import _ from "lodash";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";
// import VideoTutorial from "./VideoTutorial";
// import Share from "./Share";
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
import tooltipText from "../../data/tooltipText";
// import CustomScaleSelector from "./CustomScaleSelector";
import { DropdownCustomScaleMenu } from "./DropdownCustomScaleMenu";
import VideoButton from "./VideoButton";
import ShareButton from "./ShareButton";
import InfoButton from "./InfoButton";

const sounds = [{ name: "piano" }, { name: "xylo" }];

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleNotation: "",
      clefTitle: "",
      clefImage: "",
      titleRoot: this.props.state.baseNote,
      windowWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
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
    switch (note) {
      case "HB":
        convertedNote = "B";
        break;
      case "SI\nB":
        convertedNote = "SIb";
        break;
      default:
        break;
    }
    this.setState({
      titleRoot: convertedNote,
    });
  };

  handleShow = () => {
    console.log("Should Display an overlay with program info");
  };

  render() {
    // console.log(this.props.sessionID);
    // console.log("topmenu scales", scales);
    return (
      <div>
        <div
          className="navbar "
          data-tip="custom"
          data-for="keyboardTooltip"
          data-event="null"
          ref={(ref) => this.props.setRef(ref, "keyboard")}
          // The tooltip text for the keyboard is placed at the bottom of this div, due to how ReactTooltip works!
        >
          {/* Toggle Piano */}
          <div
            className="navbar__item toggle"
            data-tip="custom"
            data-for="showKeyboardTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "showKeyboard")}>
            <Toggle
              title="Show keyboard"
              onChange={this.props.togglePiano}
              checked={this.props.state.pianoOn}
            />
          </div>
          <ReactTooltip
            id="showKeyboardTooltip"
            place="right"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            overridePosition={() => {
              return { top: 120, left: -10 };
            }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["showKeyboard"]}
          </ReactTooltip>

          {/* Toggle Extended */}
          <div
            className="navbar__item toggle"
            data-tip="custom"
            data-for="extendedKeyboardTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "extendedKeyboard")}>
            <Toggle
              title="Extended Keyboard"
              onChange={this.props.toggleExtendedKeyboard}
              checked={this.props.state.extendedKeyboard}
            />
          </div>
          <ReactTooltip
            id="extendedKeyboardTooltip"
            place="right"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            overridePosition={() => {
              return { top: 220, left: -10 };
            }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["extendKeyboard"]}
          </ReactTooltip>

          {/* Sounds */}
          <div
            className="navbar__item menu-scale"
            data-tip="custom"
            data-for="soundTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "sound")}>
            <SubMenu
              title="Sound"
              selected={this.state.titleSound}
              content={
                <div className="items-list">
                <ListRadio
                  nameField="scale"
                  data={sounds}
                  handleChange={this.props.handleChangeSound}
                  setTitle={this.setSoundTitle}
                  initOption="piano"
                />
                </div>
              }
            />
          </div>
          <ReactTooltip
            id="soundTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            offset={{ bottom: 60 }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["sound"]}
          </ReactTooltip>

          {/* Notation */}
          <div
            className="navbar__item menu-notation"
            data-tip="custom"
            data-for="notationTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "notation")}>
            <SubMenu
              title="Notation"
              selected={""}
              selectedImg={<NotationImg />}
              content={
                <>
                  <Notation
                    initOptions={this.props.state.notation}
                    handleChange={this.props.handleChangeNotation}
                  />
                </>
              }
            />
          </div>
          <ReactTooltip
            id="notationTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            offset={{ bottom: 60 }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["notation"]}
          </ReactTooltip>

          {/* Root */}
          <div
            className="navbar__item menu-root"
            data-tip="custom"
            data-for="rootTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "root")}>
            <SubMenu
              title="Root"
              selected={this.state.titleRoot}
              selectedImg={<RootMenu color={"#ff0000"} />}
              //selectedImg=<RootMenu color={findColor(this.props.state.baseNote.charAt(0))} />
              content={
                <div className="items-list">
                  <Root
                    label="Root"
                    baseNote={this.props.state.baseNote}
                    handleChangeRoot={this.props.handleChangeRoot}
                    handleChangeTitle={this.handleChangeTitle}
                  />
                 
                  <Octaves
                    octave={this.props.state.octave}
                    handleClick={this.props.handleClickOctave}
                  />
                  </div>
              }
            />
            {/* <div className="half-circle"></div> */}
          </div>
          <ReactTooltip
            id="rootTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            offset={{ bottom: 40 }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["root"]}
          </ReactTooltip>

          {/* Scale */}
          <div
            className="navbar__item menu-scale"
            data-tip="custom"
            data-for="scaleTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "scale")}>
            <SubMenu
              title="Scale"
              selected={this.state.titleNotation}
              content={
                <div className="items-list">
                  <ListRadio
                    nameField="scale"
                    data={this.props.state.scaleList}
                    handleChange={this.props.handleChangeScale}
                    setTitle={this.setScaleTitle}
                    initOption={this.props.state.scale}
                  />
                  <DropdownCustomScaleMenu
                    menuTextClassName="form-radio"
                    state={this.props.state}
                    scaleObject={this.props.state.scaleObject} //TODO: fix to customscale creation
                    handleChangeCustomScale={this.props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                  />
                </div>
              }
            />
          </div>
          <ReactTooltip
            id="scaleTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            offset={{ bottom: 60 }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["scale"]}
          </ReactTooltip>

          {/* Clef */}
          <div
            className="navbar__item menu-clef"
            data-tip="custom"
            data-for="clefsTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "clefs")}>
            <SubMenu
              title="Clefs"
              selected={this.state.clefTitle}
              displayClef={true}
              content={
                <div className="items-list">
                <ListRadio
                  nameField="clef"
                  data={clefs}
                  handleChange={this.props.handleSelectClef}
                  setTitle={this.setClefTitle}
                  setImage={this.setClefImage}
                  initOption={this.props.state.clef}
                  displayPicto={true}
                />
                </div>
              }
            />
          </div>
          <ReactTooltip
            id="clefsTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            offset={{ bottom: 60 }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["clefs"]}
          </ReactTooltip>

          {/* Video */}
          <div
            className="navbar__item menu-video"
            data-tip="custom"
            data-for="videoPlayerTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "videoPlayer")}>
            <VideoButton
              title="Video Player"
              label="video"
              handleChangeVideoVisibility={this.props.handleChangeVideoVisibility}
              active={this.props.videoActive}
              active_video_tab="Player"
              handleChangeVideoUrl={this.props.handleChangeVideoUrl}
              videoUrl={this.props.state.videoUrl}
              resetVideoUrl={this.props.resetVideoUrl}
              handleResetVideoUrl={this.props.handleResetVideoUrl}
            />
          </div>
          <ReactTooltip
            id="videoPlayerTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            overridePosition={() => {
              return { top: 280, left: this.state.windowWidth - 170 };
            }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["videoPlayer"]}
          </ReactTooltip>

          {/* Share */}
          <div
            className="navbar__item menu-share"
            data-tip="custom"
            data-for="shareThisSetupTooltip"
            data-event="null"
            ref={(ref) => this.props.setRef(ref, "shareThisSetup")}>
            <ShareButton
              title="Share this setup"
              label="share"
              saveSessionToDB={this.props.saveSessionToDB}
              sessionID={this.props.sessionID}
            />
          </div>
          <ReactTooltip
            id="shareThisSetupTooltip"
            place="bottom"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            overridePosition={() => {
              return { top: 120, left: this.state.windowWidth - 170 };
            }}
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["shareThisSetup"]}
          </ReactTooltip>

          {/* Settings */}
          {/* <div className="navbar__item menu-settings">
            <Settings title="Settings" label="Settings" />
          </div> */}
        </div>
        <div className="side-menu">
          <div className="area1 area">
            <InfoButton
              className="overlay__header__buttonContainer__button--close"
              onClick={(e) => {
                this.handleShow();
              }}>
              <img src={require("../../img/info.png")} alt="about" />
            </InfoButton>
          </div>
          <div className="Area2 area">
            <img
              src={require("../../img/question_mark.png")}
              alt="help"
              data-tip="custom"
              data-for="helpTooltip"
              data-event="null"
              ref={(ref) => this.props.setRef(ref, "help")}
              onClick={() => this.props.handleChangeTooltip()}
            />
          </div>
          <ReactTooltip
            id="helpTooltip"
            place="left"
            effect="solid"
            scrollHide={false}
            resizeHide={false}
            type="info"
            className="tooltip-topmenu"
            html={true}>
            {tooltipText["help"]}
          </ReactTooltip>

          {/* <div className="Area3 area">
            <img src={require("../../img/home.png")} alt="home" />
          </div> */}
        </div>

        <ReactTooltip
          id="keyboardTooltip"
          place="bottom"
          effect="solid"
          scrollHide={false}
          resizeHide={false}
          offset={{ bottom: 250 }}
          className="tooltip-keyboard"
          html={true}>
          {tooltipText["keyboard"]}
        </ReactTooltip>
      </div>
    );
  }
}

export default TopMenu;
