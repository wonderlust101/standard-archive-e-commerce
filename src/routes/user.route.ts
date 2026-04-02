import { Router } from "express";
import {
    getCart,
    getUsers,
    getUser,
    addToCart,
    toggleWishlist,
    createUser,
    updateCart,
    updateProfile,
    updateUser,
    removeFromCart,
    deleteUser
} from "../controllers/user.controller";

const userRouter = Router();

// Cart routes
userRouter.route('/cart')
    .get(getCart)
    .post(addToCart);

userRouter.route('/cart/:productId')
    .patch(updateCart)
    .delete(removeFromCart);

// Wishlist
userRouter.route('/wishlist/:productId')
    .post(toggleWishlist);

// Personal Profile
userRouter.route('/profile')
    .patch(updateProfile);

// Base User Routes
userRouter.route('/')
    .get(getUsers)
    .post(createUser);

// Specific User ID Routes
userRouter.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

export default userRouter;