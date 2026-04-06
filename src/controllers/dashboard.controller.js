const catchAsync = require("../utils/catch-async");
const { getDashboardSummary } = require("../services/dashboard.service");

const getSummary = catchAsync(async (request, response) => {
  const summary = await getDashboardSummary(request.query);

  response.status(200).json({
    success: true,
    data: summary,
  });
});

module.exports = {
  getSummary,
};
