"use strict";

import "@babel/polyfill";
import { app, BrowserWindow } from "electron";
import * as path from "path";
import { format as formatUrl } from "url";

import colors from "../colors";
import setupHIDBridge from "./setup-hid-bridge";
import setupMenu from "./menu";

const isDevelopment = process.env.NODE_ENV !== "production";

let mainWindow;

function createMainWindow() {
  const window = new BrowserWindow({
    backgroundColor: colors.bg,
    width: 700,
    height: 500,
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      }),
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  setupMenu(window);
  setupHIDBridge();

  return window;
}

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

app.on("ready", () => {
  mainWindow = createMainWindow();
});
