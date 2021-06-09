import React, { Component } from "react";
import SettingsSVG from "../../assets/img/Settings";
import ShareLink from "./ShareLink";
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
    return (
      <div>
        <Popup
          title={this.props.title}
          class="popup-menu popup-Settings"
          draggable={false}
          picto=<SettingsSVG />
          hasBG={true}
          content=<div className="img--wrapper"><img src={require('../../img/custom_mode.PNG')} /></div>
        />
      </div>
    );
  }
}

export default Settings;
