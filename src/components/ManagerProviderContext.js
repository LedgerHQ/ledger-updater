import React, { createContext, useState, useEffect, useContext } from "react";
import { setEnv } from "@ledgerhq/live-common/lib/env";

const INITIAL_VALUE = 5;
const ManagerContext = createContext(INITIAL_VALUE);
const SetManagerContext = createContext(null);

export const ManagerContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(INITIAL_VALUE);

  useEffect(() => {
    setEnv("FORCE_PROVIDER", provider);
  }, [provider]);

  return (
    <ManagerContext.Provider value={provider}>
      <SetManagerContext.Provider value={setProvider}>
        {children}
      </SetManagerContext.Provider>
    </ManagerContext.Provider>
  );
};

export const useManagerProvider = () => useContext(ManagerContext);
export const useSetManagerProvider = () => useContext(SetManagerContext);
