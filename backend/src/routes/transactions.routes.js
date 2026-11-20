import { Router } from "express";

import transactionController from "../controllers/transaction.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionIdSchema,
  listTransactionsSchema,
} from "../validators/transaction.validator.js";

const router = Router();

// ? All transaction endpoints require authentication.
router.use(authenticate);

// * GET /api/transactions
router.get(
  "/",
  validate(listTransactionsSchema),
  transactionController.getTransactions,
);

// * POST /api/transactions
router.post(
  "/",
  validate(createTransactionSchema),
  transactionController.createTransaction,
);

// * GET /api/transactions/:id
router.get(
  "/:id",
  validate(transactionIdSchema),
  transactionController.getTransactionById,
);

// * PATCH /api/transactions/:id
router.patch(
  "/:id",
  validate(updateTransactionSchema),
  transactionController.updateTransaction,
);

// * DELETE /api/transactions/:id
router.delete(
  "/:id",
  validate(transactionIdSchema),
  transactionController.deleteTransaction,
);

export default router;
