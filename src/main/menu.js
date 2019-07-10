import { Menu } from "electron";

export default win => {
  const template = [
    {
      label: "Ledger Updater",
      submenu: [{ role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:",
        },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "Help center",
          click() {
            win.webContents.send("helpCenter");
          },
        },
        {
          label: "Export logs",
          click() {
            win.webContents.send("exportLogs");
          },
        },
        { role: "reload" },
        { role: "toggledevtools" },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
