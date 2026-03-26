import dotenv from 'dotenv';

dotenv.config();

import express from 'express';

// Initializing express
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// Routes

// Global Error Handler

export default app;