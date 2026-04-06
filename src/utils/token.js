const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  accessTokenExpiresIn,
  accessTokenSecret,
  bcryptSaltRounds,
  env,
  refreshTokenExpiresIn,
  refreshTokenSecret,
} = require("../config/env");

const buildAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    accessTokenSecret,
    { expiresIn: accessTokenExpiresIn }
  );

const buildRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
    },
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiresIn }
  );

const verifyAccessToken = (token) => jwt.verify(token, accessTokenSecret);

const verifyRefreshToken = (token) => jwt.verify(token, refreshTokenSecret);

const hashToken = async (token) => bcrypt.hash(token, bcryptSaltRounds);

const compareToken = async (plainToken, hashedToken) =>
  bcrypt.compare(plainToken, hashedToken);

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: env === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

module.exports = {
  buildAccessToken,
  buildRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  compareToken,
  refreshCookieOptions,
};
