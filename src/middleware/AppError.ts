export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string = "Something went wrong! Please try again later.", statusCode: number = 500, isOperational: boolean = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}