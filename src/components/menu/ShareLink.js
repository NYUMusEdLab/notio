import React from "react";

const ShareLink = (props) => {
  if (props.sessionID) {
    const url = window.location.host + "/shared/" + props.sessionID;

    return (
      <a href={url} title="" target="_blank">
        {url}
      </a>
    );
  } else {
    return "<div>Could not generate url</div>";
  }
};

export default ShareLink;
