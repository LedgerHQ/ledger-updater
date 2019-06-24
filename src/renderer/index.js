import "@babel/polyfill";
import React from "react";
import { unstable_createRoot as createRoot } from "react-dom";
import { ipcRenderer, shell } from "electron";

import "../live-common-setup";
import App from "../components/App";

// disable annoying electron dev warning
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const root = createRoot(document.getElementById("app"));

root.render(<App />);

const HELP_CENTER_URL = "http://help.vault.ledger.com/administrator";

ipcRenderer.on("helpCenter", async () => {
  shell.openExternal(HELP_CENTER_URL);
});
