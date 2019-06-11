import React, { useEffect, useState, useReducer } from "react";
import manager from "@ledgerhq/live-common/lib/manager";
import moment from "moment";
import firmwareUpdatePrepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import firmwareUpdateMain from "@ledgerhq/live-common/lib/hw/firmwareUpdate-main";

import { useDevice } from "./ConnectDevice";
import Button from "./Button";
import DisplayError from "./DisplayError";
import Spaced from "./Spaced";
import remapError from "../logic/remapError";

let logId = 0;

export default ({ onBack }) => {
  const { infos } = useDevice();
  const [logs, dispatch] = useReducer((logs, action) => {
    switch (action.type) {
      case "ADD":
        return [
          ...logs,
          { id: logId++, date: new Date(), text: action.payload },
        ];
      default:
        return logs;
    }
  }, []);
  const [error, setErrorRaw] = useState(null);
  const [finished, setFinished] = useState(false);

  const setError = err => {
    const remappedError = remapError(err);
    setErrorRaw(remappedError);
    addLog("An error occured. Stopping.");
  };

  const addLog = msg => dispatch({ type: "ADD", payload: msg });

  useEffect(() => {
    let sub;
    const effect = async () => {
      console.log(infos);
      try {
        addLog("Searching for latest firmware...");
        const latestFirmware = await manager.getLatestFirmwareForDevice(infos);
        if (!latestFirmware) {
          throw new Error("No firmware found.");
        }
        addLog("Firmware found :)");
        console.log(latestFirmware);

        addLog("Preparing firmware update... (this could take a while)");
        sub = firmwareUpdatePrepare("blue", latestFirmware).subscribe({
          next: a => {
            console.log(`next`, a);
          },
          complete: () => {
            addLog("Firmware preparation completed");
            setFinished(true);
            // TODO firmwareUpdateMain
            // TODO assign sub
          },
          error: setError,
        });
      } catch (err) {
        setError(err);
      }
    };
    effect();
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, []);

  return (
    <Spaced of={20}>
      <div className="logs">
        {logs.map(log => (
          <div key={log.id}>
            <span style={{ color: "#0ce4bf", userSelect: "none" }}>
              {`${moment(log.date).format("HH:mm:ss")} `}
            </span>
            {log.text}
          </div>
        ))}
      </div>
      {error && <DisplayError error={error} />}
      {(error || finished) && <Button onClick={onBack}>Go back</Button>}
      <style jsx>
        {`
          .logs {
            min-height: 50px;
            max-height: 200px;
            font-family: monospace;
            font-size: 13px;
            line-height: 16px;
            background-color: #444;
            color: white;
            padding: 10px;
            border-radius: 4px;
            overflow: auto;
          }
        `}
      </style>
    </Spaced>
  );
};
