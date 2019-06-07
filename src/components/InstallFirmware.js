import React, { useEffect, useState } from "react";
import manager from "@ledgerhq/live-common/lib/manager";

import { useDevice } from "./ConnectDevice";
import Button from "./Button";
import Spaced from "./Spaced";

const NO_FIRMWARE_AVAILABLE = "No latest firmware available";

export default ({ onBack }) => {
  const { infos } = useDevice();
  const [msg, setMsg] = useState("getting latest firmware...");

  useEffect(() => {
    const effect = async () => {
      try {
        const latestFirmware = await manager.getLatestFirmwareForDevice(infos);
        if (!latestFirmware) {
          setMsg(NO_FIRMWARE_AVAILABLE);
          return;
        }
        console.log(latestFirmware);
      } catch (err) {
        console.log(err);
      }
    };
    effect();
  }, []);

  if (msg === NO_FIRMWARE_AVAILABLE) {
    return (
      <Spaced of={20}>
        <div>{msg}</div>
        <Button onClick={onBack}>Go back</Button>
      </Spaced>
    );
  }

  return <div>{msg}</div>;
};
