import { RequestHandler } from "express";
import { AuthService } from "../services/auth.service";
import { APIRequest } from "../@types/APIRequest";
import { AuthUser } from "../@types/User";

const authService = new AuthService();

// ── BASIC AUTH ROUTES ─────────────────────────────────────────────────────────────

// GET /api/login
// TODO: ADD ZOD SCHEMA
export const login: RequestHandler<{}, APIRequest<string>> = async (req, res) => {
    const {email, password} = req.body;
    const loginToken = await authService.login({email, password});

    res.cookie("authToken", loginToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        success: true,
        message : "Login successful!",
        data: loginToken
    });
};

// GET /api/register
// TODO: ADD ZOD SCHEMA
export const register: RequestHandler<{}, APIRequest<string>> = async (req, res) => {
    const {firstName, lastName, email, password, phoneNumbers, savedAddresses} = req.body;

    const registrationToken = await authService.register({firstName, lastName, email, password, phoneNumbers, savedAddresses});

    res.cookie("authToken", registrationToken, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
        success: true,
        message : "Registration successful!",
        data: registrationToken
    });
};

// GET /api/logout
export const logout: RequestHandler<{}, APIRequest> = async (req, res) => {
    res.clearCookie("authToken");

    return res.status(200).json({
        success: true,
        message : "Logout successful!"
    });
};

// ── ACCOUNT RECOVERY AND VERIFICATION ROUTES ─────────────────────────────────────────

// GET /api/verify-email/:token
export const verifyEmail: RequestHandler<{token: string}, APIRequest> = async (req, res) => {
    const {token} = req.params;

    await authService.verifyEmail(token);

    return res.status(200).json({
        success: true,
        message : "Email verification successful!"
    });
};

// GET /api/forgot-password
export const forgotPassword: RequestHandler<{}, APIRequest> = async (req, res) => {
    const {email} = req.body;
    await authService.forgetPassword(email);

    return res.status(200).json({
        success: true,
        message : "If an account with that email exists, a reset link has been sent."
    });
};

// GET /api/reset-password/:token
export const resetPassword: RequestHandler<{token: string}, APIRequest> = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    await authService.resetPassword(token, password);

    return res.status(200).json({
        success: true,
        message : "Password reset successful!"
    });
};

// ── USER STATES ROUTES ─────────────────────────────────────────────────────────────

// GET /api/getMe
export const getMe: RequestHandler<{}, APIRequest<AuthUser>> = async (req, res) => {
    return res.status(200).json({
        success: true,
        message : "User data retrieved successfully.",
        data: req.user
    });
};