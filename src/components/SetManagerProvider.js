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
      <h3>Provider</h3>
      <input type="text" value={provider} onChange={handleChange} />
    </div>
  );
};
