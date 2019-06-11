import React, { createContext, useState, useContext } from "react";
import invariant from "invariant";
import { FaUsb, FaStopCircle } from "react-icons/fa";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import colors from "../colors";
import HidProxy from "../HidProxy";
import Button from "./Button";
import DisplayError from "./DisplayError";

const DeviceContext = createContext(null);

export const useDevice = () => {
  const deviceContext = useContext(DeviceContext);
  invariant(
    deviceContext,
    "Trying to access device context before initializing it",
  );
  return deviceContext;
};

export default ({ children }) => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const connect = async () => {
    try {
      const transport = await HidProxy.open();
      const infos = await getDeviceInfo(transport);
      setError(null);
      setValue({ transport, infos });
    } catch (err) {
      setError(err);
    }
  };

  const disconnect = async () => {
    await value.transport.close();
    setValue(null);
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
            justify-content: flex-end;
          }
        `}
      </style>
    </DeviceContext.Provider>
  );
};
