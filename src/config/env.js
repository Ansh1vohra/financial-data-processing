const dotenv = require("dotenv");

dotenv.config();

const requiredEnvVars = ["MONGO_DB_URI"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoDbUri: process.env.MONGO_DB_URI,
  mongoDbName: process.env.MONGO_DB_NAME || "finance_dashboard",
  accessTokenSecret:
    process.env.JWT_ACCESS_SECRET || "development-access-secret",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET || "development-refresh-secret",
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};
