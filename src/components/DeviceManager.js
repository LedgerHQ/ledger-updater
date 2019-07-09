import React, { useState } from "react";
import { IoMdFastforward } from "react-icons/io";

import InstallAll from "./InstallAll";
import Spaced from "./Spaced";
import colors, { darken } from "../colors";

export default function DeviceManager() {
  const [action, setAction] = useState(null);

  const onBack = () => setAction(null);

  if (!action) {
    return (
      <Spaced of={10}>
        <Actions onInstallAll={() => setAction("install-all")} />
      </Spaced>
    );
  }

  if (action === "install-all") {
    return <InstallAll onBack={onBack} />;
  }

  throw new Error("no defined action");
}

const Actions = ({ onInstallAll }) => (
  <>
    <div className="actions">
      <div tabIndex={0} className="action" onClick={onInstallAll}>
        <IoMdFastforward size={40} />
        <span>{"Update the Ledger Vault app & firmware"}</span>
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
