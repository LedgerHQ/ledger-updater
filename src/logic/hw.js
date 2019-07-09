import manager from "@ledgerhq/live-common/lib/manager";
import { from, of, concat, throwError, combineLatest } from "rxjs";
import { concatMap, tap, delay, catchError } from "rxjs/operators";
import { withDevicePolling } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import firmwareUpdatePrepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import firmwareUpdateMain from "@ledgerhq/live-common/lib/hw/firmwareUpdate-main";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import live_installApp from "@ledgerhq/live-common/lib/hw/installApp";
import live_uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";

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

export function installApp({
  appSettings,
  addLog,
  setStep,
  subscribeProgress,
}) {
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
            live_uninstallApp(transport, infos.targetId, appSettings.uninstall),
            of(null).pipe(
              tap(() => {
                addLog("Uninstalling complete");
                addLog("Installing latest Vault app... please wait...");
              }),
            ),
            live_installApp(
              transport,
              infos.targetId,
              appSettings.install,
            ).pipe(tap(subscribeProgress("install-app-progress"))),
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
    of(delay(2000)),
    installApp({ appSettings, addLog, setStep, subscribeProgress }),
  );
}
