import React, { createContext, useState, useContext } from "react";
import invariant from "invariant";
import { FaUsb, FaStopCircle } from "react-icons/fa";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import colors from "../colors";
import remapError from "../logic/remapError";
import HidProxy from "../HidProxy";
import Button from "./Button";
import DisplayError from "./DisplayError";
import { addGlobalLog } from "../renderer/logs";

const DeviceContext = createContext(null);

export const useDeviceInfos = () => {
  const deviceContext = useContext(DeviceContext);
  invariant(
    deviceContext,
    "Trying to access device context before initializing it",
  );
  return deviceContext;
};

export default function ConnectDevice({ children }) {
  const [value, setValue] = useState(null);
  const [transport, setTransport] = useState(null);
  const [error, setError] = useState(null);

  const connect = async () => {
    try {
      const t = await HidProxy.open();
      const infos = await getDeviceInfo(t);

      // FIXME * hack * hack * hack *
      // even in OSU mode, the version should containe -eel
      if (infos.version === "2.2-d3") {
        infos.version = "2.2-d3-eel";
      }

      addGlobalLog(`Device connected: ${JSON.stringify(infos)}`);

      // force provider id vault
      Object.assign(infos, { providerId: 5 });
      setError(null);
      setValue(infos);
      setTransport(t);
      await t.close();
    } catch (err) {
      setError(remapError(err));
    }
  };

  const disconnect = async () => {
    if (transport) {
      await transport.close();
      setValue(null);
      setTransport(null);
    }
  };

  if (!value) {
    return (
      <div>
        <Button onClick={connect} Icon={FaUsb}>
          Connect device
        </Button>
        {error && <DisplayError style={{ marginTop: 20 }} error={error} />}
        <style jsx>
          {`
            div {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <DeviceContext.Provider value={value}>
      <div className="header">
        <div style={{ fontSize: 11 }}>{`firmware v${value.version}`}</div>
        <Button Icon={FaStopCircle} onClick={disconnect}>
          Disconnect
        </Button>
      </div>
      <div className="container">{children}</div>
      <style jsx>
        {`
          .container {
            width: 600px;
            border: 1px solid ${colors.border};
            background: white;
            border-radius: 4px;
            padding: 20px;
          }
          .header {
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        `}
      </style>
    </DeviceContext.Provider>
  );
}
