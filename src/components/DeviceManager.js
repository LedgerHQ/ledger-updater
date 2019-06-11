import React, { useState } from "react";
import { GoFileBinary, GoVersions } from "react-icons/go";

import InstallApp from "./InstallApp";
import InstallFirmware from "./InstallFirmware";
import Spaced from "./Spaced";
import colors, { darken } from "../colors";

export default function DeviceManager() {
  const [action, setAction] = useState(null);

  const onBack = () => setAction(null);

  if (!action) {
    return (
      <Spaced of={20}>
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
}

const Actions = ({ onInstallFirmware, onInstallApp }) => (
  <>
    <div className="actions">
      <div tabIndex={0} className="action" onClick={onInstallApp}>
        <GoVersions size={40} />
        <span>Install Vault app</span>
      </div>
      <div tabIndex={0} className="action" onClick={onInstallFirmware}>
        <GoFileBinary size={40} />
        <span>Install firmware</span>
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
          flex-direction: column;
          background: ${colors.bg};
          border: 1px solid ${colors.border};
          font-size: 13px;
          font-weight: bold;
          padding: 20px;
          height: 150px;
          border-radius: 4px;
          user-select: none;
          outline: none;
          cursor: pointer;
          box-shadow: hsla(0, 0%, 100%, 0.9) 0 1px 0 inset,
            hsla(0, 0%, 0%, 0.05) 0 2px 3px;
        }
        .action:hover {
          background: ${darken(colors.bg, 0.015)};
        }
        .action:active {
          background: ${darken(colors.bg, 0.03)};
        }
        .action :global(> * + *) {
          margin-top: 10px;
        }
      `}
    </style>
  </>
);
