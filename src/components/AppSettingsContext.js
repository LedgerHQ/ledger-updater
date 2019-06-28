import React, { createContext, useState, useContext } from "react";

import colors from "../colors";

import JSONTextarea from "./JSONTextArea";

const INITIAL_VALUE = {
  install: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete_key: "blue/2.2.1-ee/vault/app_del_key",
    firmware: "blue/2.2.1-ee/vault/vault-2.0.0-dev_sdk-2.2-ee",
    firmware_key: "blue/2.2.1-ee/vault/vault-2.0.0-dev_sdk-2.2-ee_key",
  },
  uninstall: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete: "blue/2.1.1-ee/vault3/app_del",
    delete_key: "blue/2.1.1-ee/vault3/app_del_key",
    // delete: "blue/2.2.1-ee/vault/app_del",
    // delete_key: "blue/2.2.1-ee/vault/app_del",
  },
};

const AppSettingsContext = createContext();
const SetAppSettingsContext = createContext();

export const AppSettingsProvider = ({ children }) => {
  const [appSettings, setAppSettings] = useState(INITIAL_VALUE);
  return (
    <AppSettingsContext.Provider value={appSettings}>
      <SetAppSettingsContext.Provider value={setAppSettings}>
        {children}
      </SetAppSettingsContext.Provider>
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => useContext(AppSettingsContext);
export const useSetAppSettings = () => useContext(SetAppSettingsContext);

export const SetAppSettings = () => {
  const appSettings = useAppSettings();
  const setAppSettings = useSetAppSettings();
  return (
    <div className="container">
      <h3>App settings</h3>
      <div>uninstall:</div>
      <JSONTextarea
        rows={6}
        value={appSettings.uninstall}
        onChange={v => setAppSettings({ ...appSettings, uninstall: v })}
      />
      <div>install:</div>
      <JSONTextarea
        rows={7}
        value={appSettings.install}
        onChange={v => setAppSettings({ ...appSettings, install: v })}
      />
      <style jsx>
        {`
          .container {
            border: 1px solid ${colors.border};
            border-radius: 4px;
            padding: 20px;
          }
          h3 {
            font-size: 12px;
            text-transform: uppercase;
          }
        `}
      </style>
    </div>
  );
};
