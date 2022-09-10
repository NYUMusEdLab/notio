import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/style.scss";
import WholeApp from "./WholeApp";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/shared/:sessionId" element={<WholeApp />} />
      <Route path="/" element={<WholeApp />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
