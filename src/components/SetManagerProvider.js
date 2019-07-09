import React from "react";

import {
  useManagerProvider,
  useSetManagerProvider,
} from "./ManagerProviderContext";

export default () => {
  const provider = useManagerProvider();
  const setProvider = useSetManagerProvider();

  const handleChange = e => {
    let v = Number(e.target.value);
    if (isNaN(v)) {
      v = 0;
    }
    setProvider(v);
  };
  return (
    <div>
      <span>Provider:</span>
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
