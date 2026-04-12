import { RequestHandler } from "express";
import UserService from "../services/user.service";
import { APIRequest } from "../@types/APIRequest";
import { UserCart, UserRaw } from "../models/User.model";
import { ObjectIdSchema } from "../validation/common/objectID.validation";
import { AddToCartSchema, UpdateUserSchema, UpdateCartSchema, UpdateProfileSchema } from "../validation/user.validation";
import { ProductIDSchema } from "../validation/product.validation";
import { BadRequestError } from "../errors/BadRequestError";

const userService = new UserService();

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/users/cart
export const getCart: RequestHandler<{}, APIRequest<UserCart>> = async (req, res) => {
    const cart = await userService.getUserCart(req.user.id);

    return res.status(200).json({
        success : true,
        message : "Get user's cart",
        data    : cart
    });
};

// GET /api/users
export const getUsers: RequestHandler<{}, APIRequest<UserRaw[]>> = async (req, res) => {
    const users = await userService.getAllUsers();

    return res.status(200).json({
        success : true,
        message : "Get all users",
        data    : users
    });
};

// GET /api/users/:id
export const getUser: RequestHandler<ObjectIdSchema, APIRequest<UserRaw>> = async (req, res) => {
    const user = await userService.getUserById(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Get user",
        data    : user
    });
};

// ── POST ROUTES (Create / Actions) ────────────────────────────────────────────────

// POST /api/users/cart
export const addToCart: RequestHandler<{}, APIRequest<UserCart>, AddToCartSchema> = async (req, res) => {
    const updatedCart = await userService.addItemToCart(req.user.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Add item to cart",
        data    : updatedCart
    });
};

// POST /api/users/wishlist/:productId
export const toggleWishlist: RequestHandler<ProductIDSchema, APIRequest<UserRaw['wishList']>> = async (req, res) => {
    const updatedWishlist = await userService.toggleItemFromWishlist(req.user.id, req.params.productId);

    return res.status(200).json({
        success : true,
        message : "Toggle item in wishlist",
        data    : updatedWishlist
    });
};

// ── PATCH & DELETE ROUTES (Modify) ────────────────────────────────────────────────

// PATCH /api/users/cart/:productId
export const updateCart: RequestHandler<ProductIDSchema, APIRequest<UserCart>, UpdateCartSchema> = async (req, res) => {
    const updatedCart = await userService.updateCart(req.user.id, req.params.productId, req.body.quantity);

    return res.status(200).json({
        success : true,
        message : "Update cart item quantity",
        data    : updatedCart
    });
};

// PATCH /api/users/profile
// Handles user's own data and not other users
export const updateProfile: RequestHandler<{}, APIRequest<UserRaw>, UpdateProfileSchema> = async (req, res) => {
    const profile = await userService.updateProfile(req.user.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Update personal profile details",
        data    : profile
    });
};

// PATCH /api/users/:id
// Admin handles data for other users
export const updateUser: RequestHandler<ObjectIdSchema, APIRequest<UserRaw>, UpdateUserSchema> = async (req, res) => {
    const updateUser = await userService.updateUser(req.params.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Update user details",
        data    : updateUser
    });
};

// DELETE /api/users/cart/:productId
export const removeFromCart: RequestHandler<ProductIDSchema, APIRequest<UserCart>> = async (req, res) => {
    const updatedCart = await userService.removeFromCart(req.user.id, req.params.productId);

    return res.status(200).json({
        success : true,
        message : "Remove item from cart",
        data    : updatedCart
    });
};

// DELETE /api/users/:id
export const deleteUser: RequestHandler<ObjectIdSchema, APIRequest<UserRaw>> = async (req, res) => {
    const deletedUser = await userService.deleteUser(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Delete user",
        data    : deletedUser
    });
};