import { AppError } from "./AppError";

export class BadRequestError extends AppError {
    constructor(message: string = "The information provided was invalid. Please check your input and try again.") {
        super(message, 400);
    }
}