import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
    constructor(message: string = "Please log in to access this. Please check your credentials and try again.") {
        super(message, 401);
    }
}