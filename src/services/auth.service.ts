import { UnauthorizedError } from "../errors/UnauthorizedError";
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import { ConflictError } from "../errors/ConflictError";
import * as crypto from "node:crypto";

// TODO: Replace any with zod schema

if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not defined in your environment variables. Please check your .env file.");

export default class AuthService {
    public async login(loginDTO: any) {
        const {email, password} = loginDTO;

        const user = await User.findOne({email}).select('+password');

        if (!user || !(await user.comparePassword(password)))
            throw new UnauthorizedError("The email or password you entered is incorrect. Please try again or reset your password.");

        const {id, role, isEmailVerified} = user;

        return jwt.sign({id, role, isEmailVerified}, process.env.JWT_SECRET!, {expiresIn : '7d'});
    }

    public async register(registerDTO: any) {
        const {email} = registerDTO;
        const existingUser = await User.findOne({email});

        if (existingUser)
            throw new ConflictError("An account with this email address already exists. Please sign in or use a different email.");

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        const newUser = await User.create({
            ...registerDTO,
            verificationCode : hashedToken,
            verificationCodeExpiry : new Date(Date.now() + 3600000)
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        // TODO: Create email service here
        console.log(verificationLink);

        const {id, role, isEmailVerified} = newUser;
        return jwt.sign({id, role, isEmailVerified}, process.env.JWT_SECRET!, {expiresIn : '7d'});
    }

    public async verifyEmail(token: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            verificationCode : hashedToken,
            verificationCodeExpiry : {$gt : Date.now()}
        });

        if (!user)
            throw new UnauthorizedError("This verification link is invalid or has expired. Please request a new verification email from your account settings.");

        user.isEmailVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpiry = null;

        await user.save();

        return;
    }

    public async forgetPassword(email: string) {
        const user = await User.findOne({email});

        if (user) {
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

            const tokenExpires = Date.now() + 3600000;

            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = new Date(tokenExpires);

            await user.save();

            const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            // TODO: Create email service here
            console.log(resetURL);
        }

        return;
    }

    public async resetPassword(token: string, newPassword: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken : hashedToken,
            resetPasswordExpires : {$gt : Date.now()}
        });

        if (!user)
            throw new UnauthorizedError("The password reset link has expired. Please request a new link to continue.");

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return;
    }
}
