import React, { useState } from "react";

const ShareLink = (props) => {
  const [url, setUrl] = useState("");
  const [fullUrl, setFullUrl] = useState("");

  const copyToClipBoard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="share-link">
      <h2>Share</h2>
      <p>Share your current setup:</p>
      <a
        href={url}
        className={`message ${url !== "" ? "show" : ""}`}
        title=""
        target="_blank"
        rel="noopener noreferrer">
        {fullUrl}
      </a>
      <br></br>
      <button
        onClick={async () => {
          if (url === "") {
            let dbId = await props.saveSessionToDB();
            let url = "/shared/" + dbId;
            setUrl(url);
            setFullUrl(window.location.host + url);
          }
          copyToClipBoard(fullUrl);
        }}>
        {url ? "Copy to clipboard" : "Create Share Link"}
      </button>
      <span className={`message ${url !== "" ? "" : "show"}`}>
        Store your current setup and share it with a link.
      </span>
      <span className={`message ${url !== "" ? "show" : ""}`}>
        The link is copied to your clipboard and can be sent to others to open the same setup
      </span>
    </div>
  );
};

export default ShareLink;
