import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tabs, Tab } from "react-bootstrap";

import Overlay from "../OverlayPlugins/Overlay";

import CustomScaleSelector from "./CustomScaleSelector";
// import CustomScaleImg from "../../assets/img/CustomScale";

const DropdownCustomScaleMenu = (props) => {
  // const { onClickMenuHandler = () => {} } = props;
  // const { onClickCloseHandler = () => {} } = props;
  const [show, setShow] = useState(false);
  const triggerRef = useRef(null);

  const handleShow = useCallback(() => {
    setShow(prevShow => {
      const newShow = !prevShow;
      // If closing, restore focus to trigger
      if (prevShow) {
        setTimeout(() => {
          triggerRef.current?.focus();
        }, 0);
      }
      return newShow;
    });
  }, []);

  const handleKeyDown = (event) => {
    // Allow arrow keys to bubble up for menu navigation
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape'].includes(event.key)) {
      // Don't handle these - let the menu container handle them
      return;
    }

    // Keyboard accessibility: Activate on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent Space from scrolling page
      handleShow();
    }
  };

  const handleOverlayKeyDown = useCallback((event) => {
    // Escape key closes overlay and returns focus
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      handleShow(); // Close overlay
    }
  }, [handleShow]);

  // Add escape key listener when overlay is open
  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', handleOverlayKeyDown);
      return () => {
        document.removeEventListener('keydown', handleOverlayKeyDown);
      };
    }
  }, [show, handleOverlayKeyDown]);

  return (
    <>
      <div className={props.menuTextClassName}>
        <div
          ref={triggerRef}
          className="label-wrapper"
          onClick={(e) => {
            handleShow();
          }}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          role="menuitem"
          aria-label="Customize scale settings"
          aria-haspopup="dialog"
          aria-expanded={show}>
          Customize
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
