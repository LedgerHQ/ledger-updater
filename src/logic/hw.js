import manager from "@ledgerhq/live-common/lib/manager";
import { from, of, concat, throwError, combineLatest } from "rxjs";
import { concatMap, tap, delay, catchError } from "rxjs/operators";
import { withDevicePolling } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import firmwareUpdatePrepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import firmwareUpdateMain from "@ledgerhq/live-common/lib/hw/firmwareUpdate-main";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import live_installApp from "@ledgerhq/live-common/lib/hw/installApp";
import live_uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";

const DEV_MODE = false;

const APP_SETTINGS = {
  install: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete_key: "blue/2.2.2-ee/vault/app_del_key",
  },
  uninstall: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete: "blue/2.1.1-ee/vault3/app_del",
    delete_key: "blue/2.1.1-ee/vault3/app_del_key",
  },
};

const withDeviceInfo = withDevicePolling("")(
  transport => from(getDeviceInfo(transport)),
  () => true,
);

const ALREADY_UP_TO_DATE = "Firmware is already up-to-date.";

export function installFirmware({ addLog, setStep, subscribeProgress }) {
  addLog("Fetching latest firmware...");
  const installSub = withDeviceInfo.pipe(
    concatMap(infos =>
      combineLatest(of(infos), from(manager.getLatestFirmwareForDevice(infos))),
    ),
    concatMap(([infos, latestFirmware]) => {
      if (!latestFirmware) {
        return throwError(new Error(ALREADY_UP_TO_DATE));
      }
      console.log(`INFOS`, infos);
      console.log(`LATEST FIRMWARE`, latestFirmware);
      return infos.isOSU
        ? concat(
            of(null).pipe(
              tap(() => {
                setStep("firmware");
                addLog("Installing final firmware...");
              }),
            ),
            firmwareUpdateMain("", latestFirmware).pipe(
              tap(subscribeProgress("firmware-progress")),
            ),
          )
        : concat(
            of(null).pipe(
              tap(() => {
                setStep("osu");
                addLog("Installing OS updater...");
                addLog("Please allow Ledger Manager on your device.");
              }),
            ),
            firmwareUpdatePrepare("", latestFirmware).pipe(
              tap(subscribeProgress("osu-progress")),
            ),
            of(null).pipe(
              tap(() => {
                addLog("Waiting for device to reboot...");
              }),
            ),
            of(delay(2000)),
            installSub,
          );
    }),
  );

  return installSub;
}

export function installApp({ app, addLog, setStep, subscribeProgress }) {
  return withDevicePolling("")(
    transport => {
      return from(getDeviceInfo(transport)).pipe(
        concatMap(infos =>
          concat(
            of(null).pipe(
              tap(() => {
                setStep("uninstall-app");
                addLog("Uninstalling current app...");
              }),
            ),
            live_uninstallApp(
              transport,
              infos.targetId,
              APP_SETTINGS.uninstall,
            ),
            of(null).pipe(
              tap(() => {
                addLog("Uninstalling complete");
                addLog("Installing latest Vault app... please wait...");
              }),
            ),
            live_installApp(transport, infos.targetId, app).pipe(
              tap(subscribeProgress("install-app-progress")),
            ),
            of(null).pipe(
              tap(() => {
                addLog("Installing complete");
              }),
            ),
          ),
        ),
      );
    },
    () => false,
  );
}

export function installEverything({
  appSettings,
  addLog,
  setStep,
  subscribeProgress,
}) {
  return concat(
    installFirmware({ addLog, setStep, subscribeProgress }).pipe(
      catchError(err => {
        if (err.message === ALREADY_UP_TO_DATE) {
          addLog("Firmware is already up-to-date");
          return of(null);
        }
        return throwError(err);
      }),
    ),
    of(delay(2000)).pipe(
      tap(() => {
        addLog("Waiting for device to reboot...");
        addLog("Enter your PIN when asked");
      }),
    ),
    withDeviceInfo,
    (appSettings.firmware
      ? of({
          ...APP_SETTINGS.install,
          firmware: appSettings.firmware,
          firmware_key: `${appSettings.firmware}_key`,
        })
      : withDeviceInfo.pipe(
          tap(() => {
            addLog("Fetching app...");
          }),
          concatMap(deviceInfo =>
            from(
              manager
                .getAppsList(deviceInfo, DEV_MODE, () => Promise.resolve([]))
                .then(results => {
                  if (!results || !results.length) {
                    throw new Error("No apps found.");
                  }
                  return results[0];
                }),
            ),
          ),
        )
    ).pipe(
      tap(app => {
        addLog(`Version ${app.firmware} will be installed`);
      }),
      concatMap(app => installApp({ app, addLog, setStep, subscribeProgress })),
    ),
  );
}
