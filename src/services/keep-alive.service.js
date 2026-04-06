const {
  appBaseUrl,
  env,
  keepAliveEnabled,
  keepAliveIntervalMs,
} = require("../config/env");

let keepAliveTimer = null;

const startKeepAlive = () => {
  if (!keepAliveEnabled) {
    return;
  }

  const keepAliveUrl = `${appBaseUrl}/api/v1/health/keep-alive`;

  keepAliveTimer = setInterval(async () => {
    try {
      const response = await fetch(keepAliveUrl);

      if (!response.ok) {
        console.error(`Keep-alive request failed with status ${response.status}`);
        return;
      }

      if (env !== "production") {
        console.log(`Keep-alive ping succeeded at ${new Date().toISOString()}`);
      }
    } catch (error) {
      console.error("Keep-alive request failed", error.message);
    }
  }, keepAliveIntervalMs);

  if (typeof keepAliveTimer.unref === "function") {
    keepAliveTimer.unref();
  }

  console.log(
    `Keep-alive scheduler started. Pinging ${keepAliveUrl} every ${Math.round(
      keepAliveIntervalMs / 60000
    )} minutes`
  );
};

module.exports = {
  startKeepAlive,
};
