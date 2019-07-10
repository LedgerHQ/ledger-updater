import React, { createContext, useState, useContext } from "react";

const INITIAL_VALUE = {
  firmware: "",
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
    <div>
      <h3>App firmware</h3>
      <input
        autoFocus
        type="text"
        value={appSettings.firmware}
        id="app_firmware"
        placeholder="e.g: blue/2.2.3-ee/vault/app_2.0.0"
        onChange={e =>
          setAppSettings({ ...appSettings, firmware: e.target.value })
        }
      />
      <div style={{ opacity: 0.6, marginTop: 10 }}>
        If not set, latest app will be automatically fetched.
      </div>
    </div>
  );
};
