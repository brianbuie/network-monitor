import { promisify } from "util";
import http from "http";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import ping from "ping";
import network from "network";
import log from "./log";

const getActiveInterface = promisify(network.get_active_interface);

const networkDb = low(
  new FileSync("./output/tests.json", {
    defaultValue: { tests: [] },
  })
);

async function testNetworkConnection() {
  let data = {
    time: Date.now(),
    external: false,
    internal: false,
  };

  // Internal Connection
  try {
    const activeInterface = await getActiveInterface();
    if (activeInterface) data.internal = true;
  } catch (e) {}

  // External Connection
  try {
    const result = await ping.promise.probe("google.com", {
      timeout: 30,
    });
    if (result.alive) data.external = true;
  } catch (e) {}

  networkDb.get("tests").push(data).write();

  if (!data.internal) return log.danger("Network down");
  if (!data.external) return log.danger("Internet down");

  return log.success("Internet up");
}

testNetworkConnection();

setInterval(testNetworkConnection, 60 * 1000);

// Keep alive
http.createServer(() => {}).listen(8080);
