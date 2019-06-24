import React, { useEffect, useState } from "react";
import installApp from "@ledgerhq/live-common/lib/hw/installApp";
import uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";

import { useDeviceInfos } from "./ConnectDevice";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import DisplayError from "./DisplayError";
import { useAppSettings } from "./AppSettingsContext";
import Spaced from "./Spaced";
import HidProxy from "../HidProxy";
import remapError from "../logic/remapError";

export default ({ onBack }) => {
  const infos = useDeviceInfos();
  const appSettings = useAppSettings();
  const [msg, setMsg] = useState("uninstalling current app...");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let sub;
    async function effect() {
      const transport = await HidProxy.open();
      const handleError = err => setError(remapError(err));
      sub = uninstallApp(transport, infos.targetId, appSettings.uninstall).subscribe({
        complete: () => {
          setMsg("installing latest app...");
          installApp(transport, infos.targetId, appSettings.install).subscribe({
            next: evt => {
              setMsg(`installing latest app...`);
              setProgress(evt.progress);
            },
            complete: () => setCompleted(true),
            error: handleError,
          });
        },
        error: handleError,
      });
    }
    effect();
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, []);

  const Back = () => <Button onClick={onBack}>Go back</Button>;

  if (completed) {
    return (
      <Spaced of={20}>
        <div>Install successful.</div>
        <Back />
      </Spaced>
    );
  }

  if (error) {
    return (
      <Spaced of={20}>
        <DisplayError error={error} />
        <Back />
      </Spaced>
    );
  }

  return (
    <Spaced of={20}>
      <div>{msg}</div>
      {progress ? (
        <ProgressBar progress={progress} />
      ) : (
        <ProgressBar indeterminate />
      )}
    </Spaced>
  );
};
