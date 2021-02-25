/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import _ from "lodash";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";
import CircledButton from "./CircledButton";
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

  setScaleTitle = title => {
    this.setState({
      titleNotation: title,
    })
  };


  setClefTitle = title => {
    this.setState({
      clefTitle: title,
    })
  };

  setClefImage = img => {
    this.setState({
      clefImage: _.startCase(img) + 'Clef',
    })
  };
  render() {
    return <div className="navbar">

      {/* Toggle Piano */}
      <div className="navbar-item">
        <Toggle
          title="Show keyboard"
          onChange={this.props.togglePiano} />
      </div>

      {/* Toggle Extended */}
      <div className="navbar-item">
        <Toggle
          title="Extended Instrument"
          onChange={this.props.toggleExtendedKeyboard}
        />
      </div>

      {/* Notation */}
      <div className="navbar-item">
        <SubMenu
          title='Notation'
          selected=<NotationImg />
          content={
          <Notation
            notationState={this.props.notationState}
            handleChange={this.props.handleChangeNotation}
          />
        } />
      </div>

      {/* Scale */}
      <div className="navbar-item menu-scale">
        <SubMenu
          title='Scale'
          selected={this.state.titleNotation}
          content={
            <ListRadio
              nameField='scale'
              data={scales}
              handleChange={this.props.handleChangeScale}
              setTitle={this.setScaleTitle}
            />
          } />
      </div>


      {/* Clef */}
      <div className="navbar-item menu-clef">
        <SubMenu
          title='Clefs'
          selected={this.state.clefTitle}
          selectedImg={this.state.clefImage}
          displayPicto={true}
          content={
            <ListRadio
              nameField='clef'
              data={clefs}
              handleChange={this.props.handleSelectClef}
              setTitle={this.setClefTitle}
              setImage={this.setClefImage}
            />
          } />
      </div>

      {/* Video */}
      <div className="navbar-item menu-clef">
        <CircledButton
          label="video"
        />
      </div>


    </div>;
  };
}

export default TopMenu;
