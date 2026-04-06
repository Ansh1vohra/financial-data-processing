const FinancialRecord = require("../models/financial-record.model");
const AppError = require("../utils/app-error");

const buildRecordFilters = (query = {}) => {
  const filters = {};

  if (query.type) {
    filters.type = query.type;
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filters.date = {};

    if (query.startDate) {
      filters.date.$gte = new Date(query.startDate);
    }

    if (query.endDate) {
      filters.date.$lte = new Date(query.endDate);
    }
  }

  return filters;
};

const validateRecordPayload = ({ amount, category, date, type }) => {
  if (amount === undefined || Number(amount) <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  if (!["income", "expense"].includes(type)) {
    throw new AppError("Type must be either income or expense", 400);
  }

  if (!category || !category.trim()) {
    throw new AppError("Category is required", 400);
  }

  if (!date || Number.isNaN(new Date(date).getTime())) {
    throw new AppError("A valid date is required", 400);
  }
};

const createRecord = async (payload, userId) => {
  validateRecordPayload(payload);

  return FinancialRecord.create({
    amount: Number(payload.amount),
    type: payload.type,
    category: payload.category.trim(),
    date: new Date(payload.date),
    description: payload.description?.trim() || "",
    createdBy: userId,
  });
};

const listRecords = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const filters = buildRecordFilters(query);

  const [records, total] = await Promise.all([
    FinancialRecord.find(filters)
      .populate("createdBy", "name email role")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    FinancialRecord.countDocuments(filters),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

const getRecordById = async (recordId) => {
  const record = await FinancialRecord.findById(recordId).populate(
    "createdBy",
    "name email role"
  );

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  return record;
};

const updateRecord = async (recordId, payload) => {
  const record = await FinancialRecord.findById(recordId);

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  const nextPayload = {
    amount: payload.amount ?? record.amount,
    type: payload.type ?? record.type,
    category: payload.category ?? record.category,
    date: payload.date ?? record.date,
  };

  validateRecordPayload(nextPayload);

  record.amount = Number(nextPayload.amount);
  record.type = nextPayload.type;
  record.category = nextPayload.category.trim();
  record.date = new Date(nextPayload.date);

  if (payload.description !== undefined) {
    record.description = payload.description.trim();
  }

  await record.save();

  return record;
};

const deleteRecord = async (recordId) => {
  const record = await FinancialRecord.findById(recordId);

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  await record.deleteOne();
};

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  buildRecordFilters,
};
