/* eslint-disable no-fallthrough */

import React, { Component } from "react";
import Popup from "reactjs-popup";
import CustomScaleSelector from "./CustomScaleSelector";
import SubMenu from "./SubMenu";
import CustomScaleImg from "../../assets/img/CustomScale";
// import Overlay from "./Overlay";

export class DropdownCustomScaleMenu extends Component {
  render() {
    return (
      <div className={this.props.menuTextClassName}>
        <Popup
          className="popup-root"
          trigger={<div className="label-wrapper">Customize</div>}
          position="left top"
          on="hover"
          repositionOnResize={true}
          offsetY={-400}
          closeOnEscape={true}
          closeOnDocumentClick
          mouseLeaveDelay={300}
          mouseEnterDelay={0}
          contentStyle={{ padding: "2px", border: "none" }}
          arrow={true}>
          <div className="sub-menu">
            <div className="navbar__item menu-custom-scale">
              {/* <Overlay></Overlay> TODO: refactor the popup to use the Overlay class instead*/}

              <SubMenu
                className={this.props.menuTextClassName}
                active={true}
                title=""
                selected={"CustomScale"}
                selectedImg={<CustomScaleImg />}
                content={
                  <CustomScaleSelector //TODO: add initoptions for custom scale, matching current scale, add function handleCustomScale
                    initOptions={this.props.state.scaleObject} //TODO: fix to customscale creation
                    handleChange={this.props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                  />
                }
              />
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}
