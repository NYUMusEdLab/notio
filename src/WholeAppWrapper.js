import React from "react";
import { useParams } from "react-router-dom";
import WholeApp from "WholeApp";

function WholeAppWrapper() {
  let { sessionId } = useParams();
  return <WholeApp sessionId={sessionId} />;
}

export default WholeAppWrapper;
