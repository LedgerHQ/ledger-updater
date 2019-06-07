import React, { useState } from "react";

import { useDevice } from "./ConnectDevice";
import DisplayJSON from "./DisplayJSON";
import InstallApp from "./InstallApp";
import InstallFirmware from "./InstallFirmware";
import Spaced from "./Spaced";
import colors from "../colors";

export default () => {
  const [action, setAction] = useState(null);
  const { infos } = useDevice();

  const onBack = () => setAction(null);

  if (!action) {
    return (
      <Spaced of={20}>
        <DisplayJSON data={infos} />
        <Actions
          onInstallFirmware={() => setAction("install-firmware")}
          onInstallApp={() => setAction("install-app")}
        />
      </Spaced>
    );
  }

  if (action === "install-app") {
    return <InstallApp onBack={onBack} />;
  }

  if (action === "install-firmware") {
    return <InstallFirmware onBack={onBack} />;
  }

  throw new Error("no defined action");
};

const Actions = ({ onInstallFirmware, onInstallApp }) => (
  <>
    <div className="actions">
      <div tabIndex={0} className="action" onClick={onInstallApp}>
        <span>Install latest Vault app</span>
      </div>
      <div tabIndex={0} className="action" onClick={onInstallFirmware}>
        <span>Install latest firmware</span>
      </div>
    </div>
    <style jsx>
      {`
        .actions {
          display: flex;
        }
        .actions :global(> *) {
          flex: 1;
        }
        .actions :global(> * + *) {
          margin-left: 10px;
        }
        .action {
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${colors.base03};
          border: 2px solid hsla(0, 0%, 100%, 0.1);
          padding: 20px;
          height: 150px;
          border-radius: 4px;
        }
      `}
    </style>
  </>
);
