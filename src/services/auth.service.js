const User = require("../models/user.model");
const { ROLES, roleValues } = require("../constants/roles");
const AppError = require("../utils/app-error");
const {
  buildAccessToken,
  buildRefreshToken,
  compareToken,
  hashToken,
  verifyRefreshToken,
} = require("../utils/token");

const validateAuthInput = ({ email, name, password, role }) => {
  if (name !== undefined && !name.trim()) {
    throw new AppError("Name is required", 400);
  }

  if (!email || !email.trim()) {
    throw new AppError("Email is required", 400);
  }

  if (!password || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  if (role !== undefined && !roleValues.includes(role)) {
    throw new AppError("Invalid role provided", 400);
  }
};

const createAuthPayload = async (user) => {
  const accessToken = buildAccessToken(user);
  const refreshToken = buildRefreshToken(user);
  const refreshTokenHash = await hashToken(refreshToken);

  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  };
};

const registerUser = async ({ name, email, password, role }) => {
  validateAuthInput({ name, email, password, role });

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  if (role === ROLES.ADMIN) {
    throw new AppError("Admin cannot be assigned through public registration", 403);
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role: role || ROLES.VIEWER,
  });

  return createAuthPayload(user);
};

const loginUser = async ({ email, password }) => {
  validateAuthInput({ email, password });

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password +refreshTokenHash"
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return createAuthPayload(user);
};

const refreshUserToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.sub).select("+refreshTokenHash");

  if (!user || !user.refreshTokenHash) {
    throw new AppError("Refresh token is invalid", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  const isTokenValid = await compareToken(refreshToken, user.refreshTokenHash);

  if (!isTokenValid) {
    throw new AppError("Refresh token is invalid", 401);
  }

  return createAuthPayload(user);
};

const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.sub).select("+refreshTokenHash");

  if (user) {
    user.refreshTokenHash = null;
    await user.save();
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
};
