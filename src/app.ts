import express from 'express';
import { globalErrorHandlerMiddleware } from "./middleware/globalErrorHandler.middleware";
import { NotFoundError } from "./errors/NotFoundError";
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import cookieParser from "cookie-parser";

// Initializing express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser())

// Routes
app.use("/api/v1/products", productRouter)
app.use("/api/v1/auth", authRouter)

// Route Catch All
app.use((req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server. Please check the URL.`));
});

// Global Error Handler
app.use(globalErrorHandlerMiddleware);

export default app;