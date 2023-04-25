import React, { useEffect, useState } from "react";
import ShareLink from "./ShareLink";
import Overlay from "./../OverlayPlugins/Overlay";
import { Tabs, Tab } from "react-bootstrap";

const Share = (props) => {
  // const [activeTab, setActiveTab] = useState("playlist");
  // const activeTab = "share";
  const [sessionId, setSessionId] = useState(props.sessionID);

  useEffect(() => {
    if (sessionId !== props.sessionID) {
      setSessionId(props.sessionID);
    }
  }, [props.sessionID, sessionId]);

  // handleSelectTab = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())
  //   if (key === "share") this.setState({ activeTab: "share" });
  // };

  // console.log("Share");
  // console.log(sessionId);
  // const { url, playing } = this.state;
  return (
    <React.Fragment>
      <Overlay key={props.sessionID} close={props.onClickCloseHandler}>
        <div className="tabs-wrapper">
          {/* <Tabs defaultActiveKey="share" activeTab={activeTab} id="controlled-tab-example"> */}
          <Tabs defaultActiveKey="share" id="controlled-tab-example">
            <Tab eventKey="share" title="Share">
              <div>
                <ShareLink sessionID={props.sessionID} saveSessionToDB={undefined} />
              </div>
            </Tab>

            <Tab eventKey="links" title="create links">
              <div>
                <ShareLink sessionID={undefined} saveSessionToDB={props.saveSessionToDB} />
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default Share;
