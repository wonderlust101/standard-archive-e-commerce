import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import jwt, {JwtPayload} from "jsonwebtoken";

if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET not defined.");

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.cookies.authToken;

    if (!authToken)
        throw new UnauthorizedError("Your session has expired. Please sign in again to access your account.");

    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET!) as JwtPayload;

    req.user = {
        id: decodedToken.id,
        name: decodedToken.name,
        role: decodedToken.role,
        isEmailVerified: decodedToken.isEmailVerified,
    }

    next();
};