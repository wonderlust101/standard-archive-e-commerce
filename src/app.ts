import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { globalErrorHandler } from "./middleware/globalErrorHandler";

// Initializing express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Routes

// Global Error Handler
app.use(globalErrorHandler)

export default app;