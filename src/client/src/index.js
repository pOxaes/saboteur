import React from "react";
import ReactDOM from "react-dom";
import App from "./scripts/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

registerServiceWorker();
