import React from "react";
import ShareLink from "./ShareLink";
import Overlay from "./../OverlayPlugins/Overlay";
import { Tabs, Tab } from "react-bootstrap";

const Share = (props) => {
  return (
    <React.Fragment>
      <Overlay key={props.sessionID} close={props.onClickCloseHandler}>
        <div className="tabs-wrapper">
          <Tabs id="controlled-tab-example">
            <Tab eventKey="share" title="Share">
              <div>
                <ShareLink saveSessionToDB={props.saveSessionToDB} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default Share;
