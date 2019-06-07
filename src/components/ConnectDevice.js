import React, { createContext, useState, useContext } from "react";
import invariant from "invariant";
import { FaUsb, FaStopCircle } from "react-icons/fa";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import colors from "../colors";
import HidProxy from "../HidProxy";
import Button from "./Button";

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

  const connect = async () => {
    const transport = await HidProxy.open();
    const infos = await getDeviceInfo(transport);
    setValue({ transport, infos });
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
            border: 2px solid ${colors.base03};
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
