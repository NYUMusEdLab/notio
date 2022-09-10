// TODO:This is using a wrapper function for wholeApp because wholeApp is a class and not a functional component, REWRITE wholeApp to a const wholeApp =()=>{...}
// TODO:to meet the requirements for router-dom v6 useParam hook can not be used in class Components and props.match.params only works in v5:
//This is using a wrapper function for wholeApp because wholeApp is a class and not a functional component, REWRITE wholeApp to a const wholeApp =()=>{...}
//Also fix index.js call to WholeApp
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/style.scss";
import WholeAppWithParams from "./WholeApp";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
//INFO: to learn about react-roue-dom v6 https://reactrouter.com/en/v6.3.0/upgrading/v5
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/shared/:sessionId" element={<WholeAppWithParams />} />
      <Route path="/" element={<WholeAppWithParams />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
