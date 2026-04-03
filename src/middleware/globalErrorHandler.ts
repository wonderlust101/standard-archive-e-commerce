import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { APIErrorRequest } from "../@types/APIRequest";

export const globalErrorHandler: ErrorRequestHandler<{}, APIErrorRequest> = (err, req, res, next) => {
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
    // Handle Mongoose errors
    else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid value provided for ${err.path}.`;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val: any) => val.message)
            .join(', ');
    } else if (err.code === 11000) {
        statusCode = 400;
        message = `${Object.keys(err.keyValue).join(', ')} already exists!`;
    }

    // Handle production errors
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Internal Server Error. Please try again later.';
    }

    // Send error response
    res.status(statusCode).json({
        success : false,
        message : message,
        statusCode : statusCode,
        ...(process.env.NODE_ENV === 'development' && {stack : err.stack})
    });
};