import "@babel/polyfill";
import React from "react";
import { unstable_createRoot as createRoot } from "react-dom";

import '../live-common-setup';
import App from "../components/App";

// disable annoying electron dev warning
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

const root = createRoot(document.getElementById("app"));

root.render(<App />);
