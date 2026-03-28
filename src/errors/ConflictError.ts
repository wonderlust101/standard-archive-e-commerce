import { AppError } from "./AppError";

export class ConflictError extends AppError {
    constructor(message: string = "This action couldn't be completed because of a conflict. Please refresh and try again.") {
        super(message, 409);
    }
}