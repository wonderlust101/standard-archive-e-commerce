import { RequestHandler } from "express";
import { APIRequest } from "../@types/APIRequest";
import { AuthUser } from "../@types/User";
import AuthService from "../services/auth.service";

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
        success : true,
        message : "Welcome back. You have successfully signed into your Standard Archive account.",
        data : loginToken
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
        success : true,
        message : "Welcome to Standard Archive. Your account has been created successfully.",
        data : registrationToken
    });
};

// GET /api/logout
export const logout: RequestHandler<{}, APIRequest> = async (req, res) => {
    res.clearCookie("authToken");

    return res.status(200).json({
        success : true,
        message : "You have been successfully signed out. We hope to see you again soon."
    });
};

// ── ACCOUNT RECOVERY AND VERIFICATION ROUTES ─────────────────────────────────────────

// GET /api/verify-email/:token
export const verifyEmail: RequestHandler<{token: string}, APIRequest> = async (req, res) => {
    await authService.verifyEmail(req.params.token);

    return res.status(200).json({
        success : true,
        message : "Your email has been successfully verified. You now have full access to your account."
    });
};

// GET /api/forgot-password
export const forgotPassword: RequestHandler<{}, APIRequest> = async (req, res) => {
    await authService.forgetPassword(req.body.email);

    return res.status(200).json({
        success : true,
        message : "If an account is associated with this email, you will receive a password reset link shortly. Please check your inbox and spam folder."
    });
};

// GET /api/reset-password/:token
export const resetPassword: RequestHandler<{token: string}, APIRequest> = async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password);

    return res.status(200).json({
        success : true,
        message : "Your password has been successfully updated. You can now sign in with your new credentials."
    });
};

// ── USER STATES ROUTES ─────────────────────────────────────────────────────────────

// GET /api/getMe
export const getMe: RequestHandler<{}, APIRequest<AuthUser>> = async (req, res) => {
    return res.status(200).json({
        success : true,
        message : "User data retrieved successfully.",
        data : req.user
    });
};