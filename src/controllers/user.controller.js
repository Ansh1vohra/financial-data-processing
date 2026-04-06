const catchAsync = require("../utils/catch-async");
const { getUserById, listUsers, updateUser } = require("../services/user.service");

const getAllUsers = catchAsync(async (_request, response) => {
  const users = await listUsers();

  response.status(200).json({
    success: true,
    data: users,
  });
});

const getUser = catchAsync(async (request, response) => {
  const user = await getUserById(request.params.userId);

  response.status(200).json({
    success: true,
    data: user,
  });
});

const updateUserDetails = catchAsync(async (request, response) => {
  const user = await updateUser(request.params.userId, request.body);

  response.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUserDetails,
};
