/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import _ from "lodash";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";
import VideoTutorial from "./VideoTutorial";
import Share from "./Share";
import Root from "./Root";


import ListRadio from "../form/ListRadio";
import scales from "../../data/scalesObj";
import NotationImg from "../../assets/img/Notation";
import clefs from "../../data/clefs";

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleNotation: "",
      clefTitle: "",
      clefImage: "",
    };
  }

  setScaleTitle = (title) => {
    this.setState({
      titleNotation: title,
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
  render() {
    return (
      <div className="navbar">
        {/* Toggle Piano */}
        <div className="navbar-item">
          <Toggle
            title="Show keyboard"
            onChange={this.props.togglePiano}
            checked={this.props.state.pianoOn}
          />
        </div>

        {/* Toggle Extended */}
        <div className="navbar-item">
          <Toggle
            title="Extended Instrument"
            onChange={this.props.toggleExtendedKeyboard}
            checked={this.props.state.extendedKeyboard}
          />
        </div>

        {/* Notation */}
        <div className="navbar-item">
          <SubMenu
            title="Notation"
            selected=<NotationImg />
            content={
            <Notation
              initOptions={this.props.state.notation}
              handleChange={this.props.handleChangeNotation}
            />
          }
          />
        </div>

        {/* Root */}
        <div className="navbar-item menu-root">
          <SubMenu
            title="Root"
            content={
              <Root
                label="Root"
                handleChangeRoot={this.props.handleChangeRoot}
              />
            }
          />
        </div>

        {/* Scale */}
        <div className="navbar-item menu-scale">
          <SubMenu
            title="Scale"
            selected={this.state.titleNotation}
            content={
              <ListRadio
                nameField="scale"
                data={scales}
                handleChange={this.props.handleChangeScale}
                setTitle={this.setScaleTitle}
                initOption={this.props.state.scale}
              />
            }
          />
        </div>

        {/* Clef */}
        <div className="navbar-item menu-clef">
          <SubMenu
            title="Clefs"
            selected={this.state.clefTitle}
            selectedImg={this.state.clefImage}
            displayPicto={true}
            content={
              <ListRadio
                nameField="clef"
                data={clefs}
                handleChange={this.props.handleSelectClef}
                setTitle={this.setClefTitle}
                setImage={this.setClefImage}
                initOption={this.props.state.clef}
              />
            }
          />
        </div>

        {/* Video */}
        <div className="navbar-item menu-clef">
          <VideoTutorial label="video" />
        </div>

        {/* Share */}
        <div className="navbar-item menu-clef">
          <Share
            label="Share"
            saveSessionToDB={this.props.saveSessionToDB}
            sessionID={this.props.sessionID}
          />
        </div>
      </div>
    );
  }
}

export default TopMenu;
