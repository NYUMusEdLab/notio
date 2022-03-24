import React, { useState } from "react";

const ShareLink = (props) => {
  const [hasCopied, setHasCopied] = useState(false);
  console.log("ShareLink");
  console.log(props.sessionID);

  if (props.sessionID) {
    const url = "/shared/" + props.sessionID;
    const fullUrl = window.location.host + url;

    const copyToClipBoard = () => {
      navigator.clipboard.writeText(fullUrl);
    };
    // console.log("hasCopied", hasCopied);

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
  } else {
    return (
      <div className="share-link">
        <h2>Share</h2>
        <p>Share your current setup:</p>
        <p>Could not generate url</p>
        <span className={`message ${hasCopied ? "show" : ""}`}>The link has been copied</span>
      </div>
    );
    // return <div>Could not generate url</div>;
  }
};

export default ShareLink;
