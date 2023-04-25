import React, { useState } from "react";

const ShareLink = (props) => {
  const [hasCopied, setHasCopied] = useState(false);

  if (props.sessionID) {
    const url = "/shared/" + props.sessionID;
    const fullUrl = window.location.host + url;

    const copyToClipBoard = () => {
      navigator.clipboard.writeText(fullUrl);
    };

    return (
      <div className="share-link">
        <h2>Share</h2>
        <p>Share your current setup:</p>
        <a href={url} title="" target="_blank" rel="noopener noreferrer">
          {fullUrl}
        </a>
        <button
          onClick={() => {
            copyToClipBoard();
            setHasCopied(!hasCopied);
          }}>
          copy
        </button>
        <span className={`message ${hasCopied ? "show" : ""}`}>The link has been copied</span>
      </div>
    );
  } else if (props.saveSessionToDB) {
    return (
      <div className="share-link">
        <h2>Share</h2>
        <p>Share your current setup:</p>
        <button onClick={props.saveSessionToDB}>create share link</button>
        <span className={`message ${hasCopied ? "show" : ""}`}>The link has been copied</span>
      </div>
    );
  } else {
    return (
      <div className="share-link">
        <h2>Share</h2>
        <p>Create a Share link on the create links tab</p>
      </div>
    );
  }
};

export default ShareLink;
