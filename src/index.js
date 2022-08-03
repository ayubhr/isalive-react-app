import React from "react";
import ReactDOM from "react-dom/client";
import { AppProviders } from "./context";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"), HTMLElement);

root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
