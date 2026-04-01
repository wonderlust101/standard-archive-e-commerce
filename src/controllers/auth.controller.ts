import { RequestHandler } from "express";

// ── BASIC AUTH ROUTES ─────────────────────────────────────────────────────────────

// GET /api/login
export const login: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Login successful!"});
};

// GET /api/register
export const register: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Login successful!"});
};

// GET /api/logout
export const logout: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Login successful!"});
};

// ── ACCOUNT RECOVERY AND VERIFICATION ROUTES ─────────────────────────────────────────

// GET /api/verify-email/:token
export const verifyEmail: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Email verification successful!"});
}

// GET /api/forgot-password
export const forgotPassword: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Password reset email sent!"});
};

// GET /api/reset-password/:token
export const resetPassword: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Password reset successful!"});
}

// ── USER STATES ROUTES ─────────────────────────────────────────────────────────────

// GET /api/getMe
export const getMe: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "This is me."});
};