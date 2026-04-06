const FinancialRecord = require("../models/financial-record.model");
const { buildRecordFilters } = require("./record.service");

const getDashboardSummary = async (query) => {
  const filters = buildRecordFilters(query);

  const [summaryResult, categoryTotals, recentTransactions, monthlyTrends] =
    await Promise.all([
      FinancialRecord.aggregate([
        { $match: filters },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      FinancialRecord.aggregate([
        { $match: filters },
        {
          $group: {
            _id: {
              category: "$category",
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id.category",
            type: "$_id.type",
            total: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),
      FinancialRecord.find(filters)
        .populate("createdBy", "name email role")
        .sort({ date: -1, createdAt: -1 })
        .limit(5),
      FinancialRecord.aggregate([
        { $match: filters },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            type: "$_id.type",
            total: 1,
          },
        },
        { $sort: { year: 1, month: 1 } },
      ]),
    ]);

  const totalIncome =
    summaryResult.find((item) => item._id === "income")?.total || 0;
  const totalExpenses =
    summaryResult.find((item) => item._id === "expense")?.total || 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    categoryTotals,
    recentTransactions,
    monthlyTrends,
  };
};

module.exports = {
  getDashboardSummary,
};
