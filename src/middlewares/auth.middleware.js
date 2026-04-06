const User = require("../models/user.model");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");
const { verifyAccessToken } = require("../utils/token");

const protect = catchAsync(async (request, _response, next) => {
  const authorization = request.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authorization.split(" ")[1];
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.sub).select("-password");

  if (!user) {
    throw new AppError("User not found", 401);
  }

  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  request.user = user;
  next();
});

const authorize = (...allowedRoles) => (request, _response, next) => {
  if (!request.user) {
    return next(new AppError("Authentication required", 401));
  }

  if (!allowedRoles.includes(request.user.role)) {
    return next(new AppError("You do not have permission to access this resource", 403));
  }

  return next();
};

module.exports = {
  protect,
  authorize,
};
