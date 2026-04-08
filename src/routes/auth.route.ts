import { Router } from "express";
import { forgotPassword, getMe, login, logout, register, resetPassword, verifyEmail } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { forgetPasswordValidation, loginValidation, registerValidation, resetPasswordValidation, tokenParamsValidation } from "../validation/auth.validation";

const authRouter = Router();

authRouter.post('/login', validate({body : loginValidation}), login);
authRouter.post('/register', validate({body : registerValidation}), register);
authRouter.post('/logout', logout);

authRouter.get('/verify-email/:token', validate({params : tokenParamsValidation}), verifyEmail);

authRouter.post('/forgot-password', validate({body : forgetPasswordValidation}), forgotPassword);
authRouter.post('/reset-password/:token', validate({body : resetPasswordValidation, params : tokenParamsValidation}), resetPassword);

authRouter.get('/me', getMe);

export default authRouter;