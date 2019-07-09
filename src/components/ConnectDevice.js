import React, { createContext, useState, useContext } from "react";
import invariant from "invariant";
import { FaUsb, FaStopCircle } from "react-icons/fa";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import colors from "../colors";
import remapError from "../logic/remapError";
import HidProxy from "../HidProxy";
import Button from "./Button";
import Spaced from "./Spaced";
import Collapse from "./Collapse";
import useIsUnmounted from "../hooks/useIsUnmounted";
import DisplayError from "./DisplayError";
import SetManagerProvider from "./SetManagerProvider";
import { SetAppSettings } from "./AppSettingsContext";
import { useManagerProvider } from "./ManagerProviderContext";
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
  const provider = useManagerProvider();
  const [value, setValue] = useState(null);
  const [transport, setTransport] = useState(null);
  const [error, setError] = useState(null);
  const isUnmounted = useIsUnmounted();

  const connect = async () => {
    try {
      const t = await HidProxy.open();
      if (isUnmounted.current) return;
      const infos = await getDeviceInfo(t);
      if (isUnmounted.current) return;

      // FIXME * hack * hack * hack *
      // even in OSU mode, the version should containe -eel
      if (infos.version === "2.2-d3") {
        infos.version = "2.2-d3-eel";
      }

      addGlobalLog(`Device connected: ${JSON.stringify(infos)}`);

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
      if (isUnmounted.current) return;
      setValue(null);
      setTransport(null);
    }
  };

  if (!value) {
    return (
      <Spaced
        of={20}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Button onClick={connect} Icon={FaUsb}>
          Get started
        </Button>
        {error && <DisplayError style={{ marginTop: 20 }} error={error} />}
        <div className="help">
          {
            'Connect the device to your computer, tap your PIN code, then click "Get started".'
          }
        </div>
        <style jsx>
          {`
            .help {
              font-size: 13px;
            }
          `}
        </style>
      </Spaced>
    );
  }

  return (
    <DeviceContext.Provider value={value}>
      <div className="header">
        <div style={{ fontSize: 11 }}>
          {`firmware v${value.version} - provider ${provider}`}
        </div>
        <Button Icon={FaStopCircle} onClick={disconnect}>
          Disconnect
        </Button>
      </div>
      <div className="container">{children}</div>
      <Collapse title="Advanced settings">
        <SetManagerProvider />
        <SetAppSettings />
      </Collapse>
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
