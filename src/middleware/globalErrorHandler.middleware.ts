import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { APIErrorRequest } from "../@types/APIRequest";
import mongoose from "mongoose";

export const globalErrorHandlerMiddleware: ErrorRequestHandler<{}, APIErrorRequest> = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "We're experiencing some technical difficulties on our end. Please try again later.";

    // Log the error
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
    console.error(err.stack);

    // Handle specific error types
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Handle Validation errors (Zod & Mongoose)
    else if (err.name === 'ZodError') {
        statusCode = 400;

        const fieldErrors = err.issues.map((issue: any) => issue.message);
        message = fieldErrors.length === 1 ? fieldErrors[0] : "Please review your details. Some entries do not match our standard requirements.";
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    }
    // Handle Mongoose errors
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = `The information provided for ${err.path} is not in a recognized format. Please check your entry and try again`;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        const errorValues = Object.values(err.errors) as mongoose.Error.ValidatorError[];
        message = Object.values(err.errors).length > 1 ? "Multiple details require your attention. Please review the highlighted fields." : errorValues[0]?.message || "Please check your details and try again.";
    } else if (err.code === 11000) {
        statusCode = 400;

        const duplicateField = Object.keys(err.keyValue)[0];
        message = `This ${duplicateField} is already in use. Please check your details and try again.`;
    }
    // Handle JWT errors
    else if (err.name === 'JsonWebTokenError') {
        message = 'We were unable to verify your session. Please sign in to access your account.';
        statusCode = 401;
    } else if (err.name === 'TokenExpiredError') {
        message = 'Your session has timed out for security. Please sign in again to continue.';
        statusCode = 401;
    }

    // Handle production errors
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'We\'re experiencing some technical difficulties on our end. Please try again later.';
    }

    // Send error response
    res.status(statusCode).json({
        success : false,
        message : message,
        statusCode : statusCode,
        ...(err.issues && {issues : err.issues}),
        ...(process.env.NODE_ENV === 'development' && {stack : err.stack})
    });
};