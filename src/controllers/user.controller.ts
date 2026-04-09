import { RequestHandler } from "express";

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/users/cart
export const getCart: RequestHandler = (req, res) => {
    return res.status(200).json({message : "Get user's cart"});
};

// GET /api/users
export const getUsers: RequestHandler = (req, res) => {
    return res.status(200).json({message : "Get all users"});
};

// GET /api/users/:id
export const getUser: RequestHandler = (req, res) => {
    return res.status(200).json({message : "Get user"});
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/users/cart
export const addToCart: RequestHandler = async (req, res) => {
    return res.status(200).json({ message : "Add item to cart" });
};

// POST /api/users/wishlist/:productId
export const toggleWishlist: RequestHandler = async (req, res) => {
    return res.status(200).json({ message : "Toggle item in wishlist" });
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/users/cart/:productId
export const updateCart: RequestHandler = async (req, res) => {
    return res.status(200).json({ message : "Update cart item quantity" });
};

// PATCH /api/users/profile
// Handles user's own data and not other users
export const updateProfile: RequestHandler = async (req, res) => {
    return res.status(200).json({ message: "Update personal profile details" });
};

// PATCH /api/users/:id
// Admin handles data for other users
export const updateUser: RequestHandler = (req, res) => {
    return res.status(200).json({message : "Update user"});
}

// DELETE /api/users/cart/:productId
export const removeFromCart: RequestHandler = async (req, res) => {
    return res.status(200).json({ message : "Remove item from cart" });
};

// DELETE /api/users/:id
export const deleteUser: RequestHandler = (req, res) => {
    return res.status(200).json({message : "Delete user"});
}