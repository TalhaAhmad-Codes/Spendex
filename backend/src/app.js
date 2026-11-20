import express from "express";
import cors from "cors";

import transactionRoutes from "./routes/transaction.routes.js";
import notFound from "./middlewares/not-found.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

// ? Building Express.js Application
const app = express();

// * Using CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

// * Use JSON responses
app.use(express.json());

// * Testing API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "expense-tracker-api",
  });
});

// * Resource routes
app.use("/api/transactions", transactionRoutes);

// * Error handling must come after the routes.
app.use(notFound);
app.use(errorHandler);

export default app;
