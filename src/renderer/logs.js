import fs from "fs";
import { ipcRenderer } from "electron";
const { dialog } = require("electron").remote;

const globalLogs = [`Ledger Updater - ${new Date().toISOString()}\n`];

export function addGlobalLog(str) {
  globalLogs.push(str);
}

ipcRenderer.on("exportLogs", async () => {
  const p = await dialog.showSaveDialog({
    defaultPath: `ledger-updater_logs_${Date.now()}.txt`,
  });
  if (p) {
    const content = `${globalLogs.join("\n")}\n`;
    fs.writeFile(p, content, () => {
      console.log(`written`);
    });
  }
});
