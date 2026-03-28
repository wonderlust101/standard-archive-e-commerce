import express from 'express';
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { NotFoundError } from "./errors/NotFoundError";

// Initializing express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Routes

// Route Catch All
app.use((req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server. Please check the URL.`));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;