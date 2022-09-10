import React from "react";
import { useParams } from "react-router-dom";
import WholeApp from "WholeApp";

function WholeAppWrapper() {
  let { sessionId } = useParams();
  // alert(sessionId);
  return (
    <div>
      <WholeApp sessionId={sessionId} />
      {sessionId}
    </div>
  );
  // return (props) => <Component {...props} sessionId={sessionId} />;
}

export default WholeAppWrapper;
