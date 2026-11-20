import { z } from "zod";

const amountSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Amount must have at most 2 decimal places")
  .refine((value) => Number(value) > 0, {
    message: "Amount must be greater than zero",
  });

const transactionFields = {
  type: z.enum(["income", "expense"]),
  amount: amountSchema,
  category: z.string().trim().min(1).max(50),
  description: z.string().trim().min(1).max(200),
  date: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
  notes: z.string().trim().max(1000).optional(),
};

export const createTransactionSchema = z.object({
  body: z.object(transactionFields).strict(),
});

export const updateTransactionSchema = z.object({
  body: z
    .object(transactionFields)
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid transaction ID"),
  }),
});

export const transactionIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid transaction ID"),
  }),
});

export const listTransactionsSchema = z.object({
  query: z
    .object({
      type: z.enum(["income", "expense"]).optional(),
      category: z.string().trim().min(1).max(50).optional(),
      startDate: z.iso.date().optional(),
      endDate: z.iso.date().optional(),
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(20),
    })
    .refine(
      (data) =>
        !data.startDate || !data.endDate || data.startDate <= data.endDate,
      {
        message: "Start date must not be later than end date",
        path: ["endDate"],
      },
    ),
});
