import { AppError } from "./AppError";

export class NotFoundError extends AppError {
    constructor(message: string = "We couldn't find that item. Please check the URL or ID and try again.") {
        super(message, 404);
    }
}