import React from "react";

const ShareLink = (props) => {
  if (props.sessionID) {
    const url = "/shared/" + props.sessionID;

    return (
      <a href={url} title="" target="_blank">
        {window.location.host + url}
      </a>
    );
  } else {
    return "<div>Could not generate url</div>";
  }
};

export default ShareLink;
