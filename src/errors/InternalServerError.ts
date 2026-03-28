import { AppError } from "./AppError";

export class InternalServerError extends AppError {
    constructor(message: string = "We're experiencing some technical difficulties on our end. Please try again later.") {
        super(message, 404);
    }
}