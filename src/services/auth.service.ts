import { UnauthorizedError } from "../errors/UnauthorizedError";
import User from '../models/User.model';
import jwt from 'jsonwebtoken';
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { ConflictError } from "../errors/ConflictError";
import * as crypto from "node:crypto";

if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET is not defined in your environment variables. Please check your .env file.");

export class AuthService {
    public async login(loginDTO: LoginDTO) {
        const {email, password} = loginDTO;

        const user = await User.findOne({email}).select('+password');

        if (!user || !(await user.comparePassword(password)))
            throw new UnauthorizedError("Invalid email or password. Please try logging in again.");

        const {id, role, isEmailVerified} = user;

        return jwt.sign({id, role, isEmailVerified}, process.env.JWT_SECRET!, {expiresIn : '7d'});
    }

    public async register(registerDTO: RegisterDTO) {
        const {email} = registerDTO;
        const existingUser = await User.findOne({email});

        if (existingUser)
            throw new ConflictError("Email already in use. Please use a different email or log in.");

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
            throw new UnauthorizedError("Invalid or expired verification link. Please try again.");

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
            throw new UnauthorizedError("Invalid or expired verification link. Please try again.");

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        return;
    }
}
