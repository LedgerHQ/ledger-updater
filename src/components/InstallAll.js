import React, { useEffect, useReducer } from "react";

import { useAppSettings } from "./AppSettingsContext";
import ProgressBar from "./ProgressBar";
import DisplayError from "./DisplayError";
import Button from "./Button";
import Spaced from "./Spaced";
import Logs from "./Logs";
import remapError from "../logic/remapError";
import { installEverything } from "../logic/hw";

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
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const appSettings = useAppSettings();
  const { logs, error, step, progress } = state;

  const addLog = msg => dispatch({ type: "ADD_LOG", payload: msg });
  const setStep = step => dispatch({ type: "SET_STEP", payload: step });
  const setProgress = progress =>
    dispatch({ type: "SET_PROGRESS", payload: progress });

  const setError = err => {
    console.error(err);
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

  const run = () => {
    const sub = installEverything({
      addLog,
      setStep,
      subscribeProgress,
      appSettings,
    }).subscribe({
      complete: () => setStep("finished"),
      error: setError,
    });
    return () => {
      sub.unsubscribe();
    };
  };

  const retry = () => {
    dispatch({ type: "RESET" });
    run();
  };

  useEffect(run, []);

  return (
    <Spaced of={20}>
      <Logs logs={logs} />
      {error ? (
        <>
          <DisplayError error={error} />
          <Button onClick={retry}>Retry</Button>
        </>
      ) : step === "osu" ||
        step === "firmware" ||
        step === "install-app" ||
        step === "uninstall-app" ? (
        <ProgressBar indeterminate />
      ) : step === "osu-progress" ||
        step === "firmware-progress" ||
        step === "install-app-progress" ? (
        <ProgressBar progress={progress} />
      ) : step === "finished" ? (
        <Spaced of={10}>
          <div>Install successful. You can safely close the window.</div>
        </Spaced>
      ) : null}
    </Spaced>
  );
};
