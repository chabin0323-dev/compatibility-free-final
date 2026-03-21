import React from "react";
import ReactDOM from "react-dom/client";
import FreeApp from "./FreeApp";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <FreeApp />
  </React.StrictMode>
);
