const User = require("../models/user.model");
const AppError = require("../utils/app-error");
const { roleValues } = require("../constants/roles");

const listUsers = async () =>
  User.find().select("-password -refreshTokenHash").sort({ createdAt: -1 });

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password -refreshTokenHash");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

const updateUser = async (userId, payload) => {
  const { name, role, isActive } = payload;
  const updates = {};
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  if (role && !roleValues.includes(role)) {
    throw new AppError("Invalid role provided", 400);
  }

  if (name !== undefined) {
    if (!name.trim()) {
      throw new AppError("Name cannot be empty", 400);
    }

    updates.name = name.trim();
  }

  if (role !== undefined) {
    updates.role = role;
  }

  if (isActive !== undefined) {
    updates.isActive = Boolean(isActive);
  }

  return User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
    select: "-password -refreshTokenHash",
  });
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
};
