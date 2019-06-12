import { Menu } from "electron";

export default win => {
  const template = [
    {
      label: "Ledger Updater",
      submenu: [{ role: "quit" }],
    },
    {
      label: "Help",
      submenu: [
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
