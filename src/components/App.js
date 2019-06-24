import React from "react";
import { hot } from "react-hot-loader/root";

import GlobalStyle from "./GlobalStyle";
import ConnectDevice from "./ConnectDevice";
import DeviceManager from "./DeviceManager";
import { ManagerContextProvider } from "./ManagerProviderContext";
import { AppSettingsProvider } from "./AppSettingsContext";

const App = () => (
  <ManagerContextProvider>
    <AppSettingsProvider>
      <ConnectDevice>
        <DeviceManager />
      </ConnectDevice>
      <GlobalStyle />
    </AppSettingsProvider>
  </ManagerContextProvider>
);

export default hot(App);
