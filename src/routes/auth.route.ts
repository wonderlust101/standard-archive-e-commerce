import { Router } from "express";
import { forgotPassword, getMe, login, logout, register, resetPassword, verifyEmail } from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', logout);

authRouter.get('/verify-email/:token', verifyEmail)

authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password/:token', resetPassword);

authRouter.get('/me', getMe);


export default authRouter;