/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Toggle from "./Toggle";
import SubMenu from "./SubMenu";
import Notation from "./Notation";
import ListRadio from "../form/ListRadio";
import scales from "../../data/scalesObj";
import NotationImg from "../../assets/img/Notation";

class TopMenu extends Component {

  title = 'coucou'

  constructor(props) {
    super(props);
    //notationState = props.notationState;
    console.log("notation", this.props.notationState);
    this.state = {
      title: "coucouc encore",
    };
  }


  setScaleTitle = title => {
    this.setState({
      title: title,
    })
  };


  render() {
    console.log("scales", scales)
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
          selected={this.state.title}
          content={
            <ListRadio
              nameField='scale'
              options={scales}
              radioState={this.props.radioState}
              handleChange={this.props.handleChangeScale}
              setTitle={this.setScaleTitle}
            />
          } />
      </div>



    </div>;
  };
}

export default TopMenu;
