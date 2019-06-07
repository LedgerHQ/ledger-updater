import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import installApp from "@ledgerhq/live-common/lib/hw/installApp";
import uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";

import GlobalStyle from "./GlobalStyle";
import ConnectDevice from "./ConnectDevice";
import DeviceManager from "./DeviceManager";

const App = () => {
  const [deviceInfos, setDeviceInfos] = useState(null);

  const getDeviceInfos = async () => {
    const t = await HidProxy.open();
    const infos = await getDeviceInfo(t);
    setDeviceInfos(infos);
    await t.close();
  };

  const installVaultApp = async () => {
    const t = await HidProxy.open();
    const appToInstall = {
      targetId: 0x31010004,
      perso: "perso_11",
      delete_key: "blue/2.1.1-ee/vault3/app_del_key",
      firmware: "blue/2.1.1-ee/vault3/app_latest",
      firmware_key: "blue/2.1.1-ee/vault3/app_latest_key",
    };
    const appToUnInstall = {
      targetId: 0x31010004,
      perso: "perso_11",
      delete: "blue/2.1.1-ee/vault3/app_del",
      delete_key: "blue/2.1.1-ee/vault3/app_del_key",
    };
    uninstallApp(t, deviceInfos.targetId, appToUnInstall).subscribe({
      next: evt => {
        console.log(`unistall next`, evt);
      },
      complete: () => {
        console.log(`uninstall complete`);
        installApp(t, deviceInfos.targetId, appToInstall).subscribe({
          next: evt => {
            console.log(`next`, evt);
          },
          complete: () => {
            console.log(`completed`);
          },
          error: err => {
            console.log(err);
          },
        });
      },
      error: err => {
        console.log(`uninstall error`, err);
      },
    });
  };

  return (
    <>
      <ConnectDevice>
        <DeviceManager />
      </ConnectDevice>
      <GlobalStyle />
    </>
  );
};

export default hot(App);
