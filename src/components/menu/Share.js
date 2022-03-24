import React, { Component, useEffect, useRef, useState } from "react";
import ShareSVG from "../../assets/img/Share";
import ShareLink from "./ShareLink";
import Popup from "./Popup";
import Overlay from "./Overlay";
import { Tabs, Tab, Button, Form, FormLabel } from "react-bootstrap";

const Share = (props) => {
  const urlInputRef = useRef();
  const [activeTab, setActiveTab] = useState("playlist");
  const [sessionId, setSessionId] = useState(props.sessionID);

  useEffect(() => {
    if (sessionId !== props.sessionID) {
      setSessionId(props.sessionID);
    }
  }, [props.sessionID]);

  if (props.sessionID) {
    const url = "/shared/" + props.sessionID;
    const fullUrl = window.location.host + url;
  }

  // handleSelectTab = (key) => {
  //   // A bit dummy but need to control tabs after submit (cf handleSumbit())
  //   if (key === "share") this.setState({ activeTab: "share" });
  // };

  console.log("Share");
  console.log(sessionId);
  // const { url, playing } = this.state;
  return (
    <React.Fragment>
      <Overlay key={props.sessionID}>
        <div className="tabs-wrapper">
          <Tabs defaultActiveKey="share" activeTab={activeTab} id="controlled-tab-example">
            <Tab eventKey="share" title="Share">
              <div>
                <ShareLink sessionID={props.sessionID} saveSessionToDB={props.saveSessionToDB} />
                {/* <Button variant="primary" onClick={props.saveSessionToDB}> 
                  create share link
  </Button>*/}
              </div>
            </Tab>
          </Tabs>
        </div>
      </Overlay>
    </React.Fragment>
  );
};

export default Share;
