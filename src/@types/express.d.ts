import "express";
import { AuthUser } from "./User";

declare global {
    namespace Express {
        interface Request {
            user: AuthUser;
        }
    }
}