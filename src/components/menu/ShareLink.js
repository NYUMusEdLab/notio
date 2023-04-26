import React, { useState } from "react";

const ShareLink = (props) => {
  const [url, setUrl] = useState("");

  const copyToClipBoard = (fullUrl) => {
    console.log("COPY");
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <div className="share-link">
      <h2>Share</h2>
      <p>Share your current setup:</p>
      <button onClick={ async () => {
        console.log("HERE");
        let dbId = await props.saveSessionToDB();
        console.log("AFTER WITH ", dbId);
        console.log(dbId);
        let url = "/shared/" + dbId;
        let fullUrl = window.location.host + url;
        copyToClipBoard(fullUrl);
        setUrl(url)}}>Create Share Link</button>
      <span className={`message ${url !== "" ? "" : "show"}`}>Store your current setup and share it with a link.</span>
      <span className={`message ${url !== "" ? "show" : ""}`}>The link is copied to your clipboard and can be sent to others to open the same setup</span>
      <a href={url} className={`message ${url !== "" ? "show" : ""}`} title="" target="_blank" rel="noopener noreferrer">
          { window.location.host + url}
        </a>
    </div>
  )
};
  
export default ShareLink;
