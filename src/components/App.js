import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import HidProxy from "../HidProxy";
import GlobalStyle from "./GlobalStyle";

const App = () => {
  const [deviceInfos, setDeviceInfos] = useState(null);

  const onClick = async () => {
    const t = await HidProxy.open();
    const infos = await getDeviceInfo(t);
    setDeviceInfos(infos);
    await t.close();
  };
  return (
    <>
      <div>
        <button onClick={onClick}>get device infos</button>
      </div>
      {deviceInfos && <pre>{JSON.stringify(deviceInfos, null, 2)}</pre>}
      <GlobalStyle />
    </>
  );
};

export default hot(App);
