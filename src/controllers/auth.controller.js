const {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} = require("../services/auth.service");
const catchAsync = require("../utils/catch-async");
const { refreshCookieOptions } = require("../utils/token");

const register = catchAsync(async (request, response) => {
  const payload = await registerUser(request.body);

  response.cookie("refreshToken", payload.refreshToken, refreshCookieOptions);

  response.status(201).json({
    success: true,
    message: "User registered successfully",
    data: payload,
  });
});

const login = catchAsync(async (request, response) => {
  const payload = await loginUser(request.body);

  response.cookie("refreshToken", payload.refreshToken, refreshCookieOptions);

  response.status(200).json({
    success: true,
    message: "Login successful",
    data: payload,
  });
});

const refresh = catchAsync(async (request, response) => {
  const refreshToken = request.cookies.refreshToken || request.body.refreshToken;
  const payload = await refreshUserToken(refreshToken);

  response.cookie("refreshToken", payload.refreshToken, refreshCookieOptions);

  response.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: payload,
  });
});

const logout = catchAsync(async (request, response) => {
  const refreshToken = request.cookies.refreshToken || request.body.refreshToken;

  await logoutUser(refreshToken);

  response.clearCookie("refreshToken", refreshCookieOptions);
  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = {
  register,
  login,
  refresh,
  logout,
};
