import transactionService from "../services/transaction.service.js";

// ? Create a new transaction
const createTransaction = async (req, res) => {
  const transaction = await transactionService.createTransaction(
    req.user.id,
    req.validated.body,
  );

  res.status(201).json({
    success: true,
    message: "Transaction created successfully",
    data: transaction,
  });
};

// ? Get filtered transactions
const getTransactions = async (req, res) => {
  const result = await transactionService.getTransactions(
    req.user.id,
    req.validated.query,
  );

  res.status(200).json({
    success: true,
    data: result.transactions,
    pagination: result.pagination,
  });
};

// ? Get transaction by ID
const getTransactionById = async (req, res) => {
  const transaction = await transactionService.getTransactionById(
    req.user.id,
    req.validated.params.id,
  );

  res.status(200).json({
    success: true,
    data: transaction,
  });
};

// ? Update a transaction
const updateTransaction = async (req, res) => {
  const transaction = await transactionService.updateTransaction(
    req.user.id,
    req.validated.params.id,
    req.validated.body,
  );

  res.status(200).json({
    success: true,
    message: "Transaction updated successfully",
    data: transaction,
  });
};

// ? Remove a transaction
const deleteTransaction = async (req, res) => {
  await transactionService.deleteTransaction(
    req.user.id,
    req.validated.params.id,
  );

  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
};

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
