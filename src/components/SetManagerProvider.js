import React from "react";

import {
  useManagerProvider,
  useSetManagerProvider,
} from "./ManagerProviderContext";

export default () => {
  const provider = useManagerProvider();
  const setProvider = useSetManagerProvider();

  const handleChange = e => setProvider(e.target.value);
  return (
    <div>
      <span>provider:</span>
      <input type="text" value={provider} onChange={handleChange} />
      <style jsx>
        {`
          div {
            display: flex;
            align-items: center;
          }
          div :global(> * + *) {
            margin-left: 10px;
          }
        `}
      </style>
    </div>
  );
};
