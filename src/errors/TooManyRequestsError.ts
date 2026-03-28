import { AppError } from "./AppError";

export class TooManyRequestsError extends AppError {
    constructor(message: string = "You're making requests a bit too quickly! Please wait a moment and try again.") {
        super(message, 429);
    }
}