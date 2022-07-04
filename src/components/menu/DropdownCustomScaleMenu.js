import React, { useRef, useState } from "react";
import { Tabs, Tab, Form, Button } from "react-bootstrap";
import Overlay from "./Overlay";

import CustomScaleSelector from "./CustomScaleSelector";
import CustomScaleImg from "../../assets/img/CustomScale";

const DropdownCustomScaleMenu = (props) => {
  const { onClickMenuHandler = () => {} } = props;
  const { onClickCloseHandler = () => {} } = props;
  const [show, setShow] = useState(true);

  const handleShow = () => {
    const tempshow = !show;
    setShow(tempshow);
  };

  return (
    <>
      <div className={props.menuTextClassName}>
        <div
          className="label-wrapper"
          onClick={(e) => {
            handleShow();
          }}>
          customize
        </div>
      </div>

      {show && (
        <Overlay visible={false} key="custom_scale" close={handleShow}>
          <div className="tabs-wrapper">
            <Tabs defaultActiveKey="custom_scale" id="controlled-tab-example">
              <Tab eventKey="custom_scale" title="custom scale">
                <div className="navbar__item menu__custom-scale">
                  <CustomScaleSelector //TODO: add initoptions for custom scale, matching current scale, add function handleCustomScale
                    initOptions={props.state.scaleObject} //TODO: fix to customscale creation
                    handleChange={props.handleChangeCustomScale} //TODO: fix this function, it should modifi the customScale in WholeApp
                  />
                </div>
              </Tab>
            </Tabs>
          </div>
        </Overlay>
      )}
    </>
  );
};
export default DropdownCustomScaleMenu;
