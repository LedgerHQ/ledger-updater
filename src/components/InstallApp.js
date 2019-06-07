import React, { useEffect, useState } from "react";
import installApp from "@ledgerhq/live-common/lib/hw/installApp";
import uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";

import { useDevice } from "./ConnectDevice";
import Button from "./Button";
import Spaced from "./Spaced";
import colors from "../colors";

const appToInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  delete_key: "blue/2.1.1-ee/vault3/app_del_key",
  firmware: "blue/2.1.1-ee/vault3/app_latest",
  firmware_key: "blue/2.1.1-ee/vault3/app_latest_key",
};

const appToUnInstall = {
  targetId: 0x31010004,
  perso: "perso_11",
  delete: "blue/2.1.1-ee/vault3/app_del",
  delete_key: "blue/2.1.1-ee/vault3/app_del_key",
};

export default ({ onBack }) => {
  const { transport, infos } = useDevice();
  const [msg, setMsg] = useState("uninstalling current app...");
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function effect() {
      uninstallApp(transport, infos.targetId, appToUnInstall).subscribe({
        complete: () => {
          setMsg("installing latest app...");
          installApp(transport, infos.targetId, appToInstall).subscribe({
            next: evt => {
              setMsg(
                `installing latest app... ${Math.round(evt.progress * 100)}%`,
              );
            },
            complete: () => setCompleted(true),
            error: err => setError(err),
          });
        },
        error: err => setError(err),
      });
    }
    effect();
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
        <div className="error">
          {error.name && <div>{error.name}</div>}
          {error.message && <div>{error.message}</div>}
        </div>
        <Back />
        <style jsx>
          {`
            .error {
              color: ${colors.base08};
            }
          `}
        </style>
      </Spaced>
    );
  }

  return msg;
};
