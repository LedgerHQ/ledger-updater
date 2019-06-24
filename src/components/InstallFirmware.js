import React, { useEffect, useReducer } from "react";
import manager from "@ledgerhq/live-common/lib/manager";
import firmwareUpdatePrepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import firmwareUpdateMain from "@ledgerhq/live-common/lib/hw/firmwareUpdate-main";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import HidProxy from "../HidProxy";
import ProgressBar from "./ProgressBar";
import DisplayError from "./DisplayError";
import Spaced from "./Spaced";
import Logs from "./Logs";
import remapError from "../logic/remapError";

let logId = 0;

const INITIAL_STATE = {
  logs: [],
  error: null,
  step: "start",
  progress: 0,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "ADD_LOG":
      const log = { id: logId++, date: new Date(), text: payload };
      return { ...state, logs: [...state.logs, log] };
    case "SET_ERROR":
      return { ...state, error: payload };
    case "SET_STEP":
      return { ...state, step: payload };
    case "SET_PROGRESS":
      return { ...state, progress: payload };
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { logs, error, step, progress } = state;

  const addLog = msg => dispatch({ type: "ADD_LOG", payload: msg });
  const setStep = step => dispatch({ type: "SET_STEP", payload: step });
  const setProgress = progress =>
    dispatch({ type: "SET_PROGRESS", payload: progress });

  const setError = err => {
    console.error(err)
    const remappedError = remapError(err);
    dispatch({ type: "SET_ERROR", payload: remappedError });
    addLog("An error occured. Stopping.");
  };

  const subscribeProgress = stepName => e => {
    if (e.progress === 0) {
      setStep(stepName);
    }
    setProgress(e.progress);
  };

  useEffect(() => {
    let sub;
    const effect = async () => {
      try {
        const t = await HidProxy.open();
        const infos = await getDeviceInfo(t);
        addLog("Searching for latest firmware...");
        const latestFirmware = await manager.getLatestFirmwareForDevice(infos);
        if (!latestFirmware) {
          throw new Error("No firmware found.");
        }

        addLog("Firmware found");
        console.log(latestFirmware);

        addLog("Preparing firmware update...");

        const installOSU = () => {
          addLog("Installing OS updater...");
          setStep("osu");
          sub = firmwareUpdatePrepare("", latestFirmware).subscribe({
            next: subscribeProgress("osu-progress"),
            complete: () => {
              addLog("Waiting for device to reboot...");
              installMain();
            },
            error: setError,
          });
        };

        const installMain = async () => {
          addLog("Installing firmware...");
          setStep("firmware");
          sub = firmwareUpdateMain("", latestFirmware).subscribe({
            next: subscribeProgress("firmware-progress"),
            error: setError,
            complete: () => {
              addLog("Install finished");
            },
          });
        };

        if (!infos.isOSU) {
          installOSU();
        } else {
          installMain();
        }
      } catch (err) {
        console.log(err);
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
      <Logs logs={logs} />
      {error ? (
        <DisplayError error={error} />
      ) : step === "osu" || step === "firmware" ? (
        <ProgressBar indeterminate />
      ) : step === "osu-progress" || step === "firmware-progress" ? (
        <ProgressBar progress={progress} />
      ) : null}
    </Spaced>
  );
};
