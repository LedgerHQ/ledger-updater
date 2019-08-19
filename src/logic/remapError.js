export default function remapError(err) {
  if (err.name === "DeviceOnDashboardExpected") {
    err.message = "Please allow Ledger Manager on your device";
  } else if (err.name === "DeviceSocketNoBulkStatus") {
    err.message = "Resource unavailable";
  } else if (err.name === "TransportError") {
    err.message = "No device found";
  } else {
    err.message =
      "Unkown error. Make sure the device is opened on the dashboard.";
  }
  return err;
}
