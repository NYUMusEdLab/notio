import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/style.scss";
import WholeApp from "./WholeApp";
import reportWebVitals from "./reportWebVitals";
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  // <React.StrictMode>
  <>
    <WholeApp />
    <div>called wholeApp</div>
  </>
  // <div>createRoot works</div>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
