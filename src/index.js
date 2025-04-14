import React from "react";
import ReactDOM from "react-dom";

import { App } from "./containers";
import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));

document.addEventListener("contextmenu", function (e) {
  if (e.target.tagName === "CANVAS") e.preventDefault();
});
