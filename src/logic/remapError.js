export default function remapError(err) {
  if (err.name === "DeviceOnDashboardExpected") {
    err.message = "Please allow Ledger Manager on your device";
  }
  if (err.name === "DeviceSocketNoBulkStatus") {
    err.message = "Resource unavailable";
  }
  if (err.name === "TransportError") {
    err.message = "No device found"
  }
  return err;
}
