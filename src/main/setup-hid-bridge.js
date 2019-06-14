import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-noevents";
import invariant from "invariant";
import { serializeError } from "@ledgerhq/errors";
import { ipcMain } from "electron";

let transport = null;

const handleCmd = async (cmd, ...args) => {
  let hex, response;

  switch (cmd) {
    case "open":
      if (transport) {
        console.warn("transport was already opened"); // eslint-disable-line no-console
        return transport
      }
      transport = await TransportNodeHid.open("");
      transport.on("disconnect", () => {
        transport = null;
      });
      return;

    case "close":
      if (!transport) {
        console.warn("No transport to close");
        break;
      }
      try {
        await transport.close();
      } finally {
        transport = null;
      }
      return true;

    case "exchange":
      invariant(transport, "HID was not opened");
      hex = args[0];
      response = await transport.exchange(Buffer.from(hex, "hex"));
      return response.toString("hex");
  }
};

export default () => {
  ipcMain.on("hid-bridge:msg", async (e, msgID, cmd, ...args) => {
    try {
      const data = await handleCmd(cmd, ...args);
      e.sender.send(`hid-bridge:reply:${msgID}`, {
        type: "result",
        data: data || null,
      });
    } catch (err) {
      e.sender.send(`hid-bridge:reply:${msgID}`, {
        type: "error",
        data: serializeError(err),
      });
    }
  });
};
