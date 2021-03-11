import React from "react";

const ShareLink = (props) => {
  if (props.sessionID) {
    const url = "/shared/" + props.sessionID;
    const fullUrl = window.location.host + url;

    function copyToClipBoard() {
      navigator.clipboard.writeText(fullUrl);
    }

    return (
      <div>
        <a href={url} title="" target="_blank" rel="noopener noreferrer">
          {fullUrl}
        </a>
        <button onClick={copyToClipBoard}>copy</button>
      </div>
    );
  } else {
    return "<div>Could not generate url</div>";
  }
};

export default ShareLink;
