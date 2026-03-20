import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import FreeApp from "./FreeApp";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("root element not found");
}

const path = window.location.pathname;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {path === "/free" ? <FreeApp /> : <App />}
  </React.StrictMode>
);
