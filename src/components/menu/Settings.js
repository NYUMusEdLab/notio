import React, { Component } from "react";
import SettingsSVG from "../../assets/img/Settings";
import Popup from "./Popup";

class Settings extends Component {
  state = {
    url: null,
    playing: false,
    played: 0,
    loaded: 0,
    duration: 0,
    minimized: false,
    show: false,
  };

  render() {
    // const { url, playing } = this.state;
    //TODO: check what content is pointing to (custom_mode.PNG ????)
    return (
      <div>
        <Popup
          title={this.props.title}
          className="popup-menu popup-Settings"
          draggable={false}
          picto={<SettingsSVG />}
          hasBG={true}
          content={<div className="img--wrapper"><img src={require('../../img/custom_mode.PNG')} alt="settings" /></div>}
        />
      </div>
    );
  }
}

export default Settings;
