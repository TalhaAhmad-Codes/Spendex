import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import ApiError from "../utils/api-error.js";

// * Create a new transaction
const createTransaction = async (userId, data) => {
  const transaction = await Transaction.create({
    ...data,
    amount: mongoose.Types.Decimal128.fromString(data.amount),
    userId,
  });

  return transaction;
};

// * Get filtered transaction
const getTransactions = async (userId, filters) => {
  const { type, category, startDate, endDate, page, limit } = filters;

  const query = { userId };

  // * Applying all filters
  if (type) query.type = type;
  if (category) query.category = category;

  if (startDate || endDate) {
    query.date = {};

    if (startDate) {
      query.date.$gte = new Date(`${startDate}T00:00:00.000Z`);
    }

    if (endDate) {
      query.date.$lt = new Date(
        new Date(`${endDate}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000,
      );
    }
  }

  // * Pagination
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query).sort({ date: -1, _id: -1 }).skip(skip).limit(limit),

    Transaction.countDocuments(query),
  ]);

  return {
    transactions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ? Get specific transaction by ID
const getTransactionById = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return transaction;
};

// ? Update an existing transaction
const updateTransaction = async (userId, transactionId, data) => {
  const updateData = { ...data };

  if (updateData.amount !== undefined) {
    updateData.amount = mongoose.Types.Decimal128.fromString(updateData.amount);
  }

  const transaction = await Transaction.findOneAndUpdate(
    {
      _id: transactionId,
      userId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return transaction;
};

// ? Remove a transaction
const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  return transaction;
};

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
