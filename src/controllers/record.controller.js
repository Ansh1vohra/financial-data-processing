const catchAsync = require("../utils/catch-async");
const {
  createRecord,
  deleteRecord,
  getRecordById,
  listRecords,
  updateRecord,
} = require("../services/record.service");

const createFinancialRecord = catchAsync(async (request, response) => {
  const record = await createRecord(request.body, request.user._id);

  response.status(201).json({
    success: true,
    message: "Financial record created successfully",
    data: record,
  });
});

const getFinancialRecords = catchAsync(async (request, response) => {
  const result = await listRecords(request.query);

  response.status(200).json({
    success: true,
    data: result,
  });
});

const getFinancialRecord = catchAsync(async (request, response) => {
  const record = await getRecordById(request.params.recordId);

  response.status(200).json({
    success: true,
    data: record,
  });
});

const updateFinancialRecord = catchAsync(async (request, response) => {
  const record = await updateRecord(request.params.recordId, request.body);

  response.status(200).json({
    success: true,
    message: "Financial record updated successfully",
    data: record,
  });
});

const removeFinancialRecord = catchAsync(async (request, response) => {
  await deleteRecord(request.params.recordId);

  response.status(200).json({
    success: true,
    message: "Financial record deleted successfully",
  });
});

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecord,
  updateFinancialRecord,
  removeFinancialRecord,
};
