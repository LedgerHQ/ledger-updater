import React from "react";

import { useDevice } from "./ConnectDevice";
import DisplayJSON from "./DisplayJSON";
import Spaced from "./Spaced";
import colors from "../colors";

export default () => {
  const { infos } = useDevice();
  return (
    <Spaced of={20}>
      <DisplayJSON data={infos} />
      <div className="actions">
        <div tabIndex={0} className="action">
          <span>
            Install latest Vault app
          </span>
        </div>
        <div tabIndex={0} className="action">
          <span>
            Install latest firmware
          </span>
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
    </Spaced>
  );
};
