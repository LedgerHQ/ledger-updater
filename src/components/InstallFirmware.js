import React, { useEffect, useState } from "react";
import manager from "@ledgerhq/live-common/lib/manager";

import { useDevice } from "./ConnectDevice";
import Button from "./Button";
import DisplayError from "./DisplayError";
import Spaced from "./Spaced";

const NO_FIRMWARE_AVAILABLE = "No latest firmware available";

export default ({ onBack }) => {
  const { infos } = useDevice();
  const [msg, setMsg] = useState("getting latest firmware...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const effect = async () => {
      try {
        const latestFirmware = await manager.getLatestFirmwareForDevice(infos);
        if (!latestFirmware) {
          setMsg(NO_FIRMWARE_AVAILABLE);
          return;
        }
      } catch (err) {
        setError(err);
      }
    };
    effect();
  }, []);

  return (
    <Spaced of={20}>
      {error && <DisplayError error={error} />}
      <div>{msg}</div>
      <Button onClick={onBack}>Go back</Button>
    </Spaced>
  );
};
