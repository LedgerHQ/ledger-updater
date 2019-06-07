import React from "react";
import { hot } from "react-hot-loader/root";

import GlobalStyle from "./GlobalStyle";
import ConnectDevice from "./ConnectDevice";
import DeviceManager from "./DeviceManager";

const App = () => (
  <>
    <ConnectDevice>
      <DeviceManager />
    </ConnectDevice>
    <GlobalStyle />
  </>
);

export default hot(App);
