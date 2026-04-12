import User from "../models/User.model";
import { NotFoundError } from "../errors/NotFoundError";
import { AddToCartSchema, UpdateProfileSchema, UpdateUserSchema } from "../validation/user.validation";

export default class UserService {
    public async getUserCart(userID: string) {
        const user = await User.findById(userID).select("cart -_id");

        if (!user)
            throw new NotFoundError("Unable to find user. Please check the ID and try again.");

        return user.cart || [];
    }

    public async getAllUsers() {
        const users = await User.find();

        // TODO: Add filtering logic here if needed

        return users;
    }

    public async getUserById(userID: string) {
        const user = await User.findById(userID);

        if (!user)
            throw new NotFoundError("Unable to find user. Please check the ID and try again.");

        return user;
    }

    public async addItemToCart(userID: string, addedProduct: AddToCartSchema) {
        const user = await User.findById(userID).select("cart");

        if (!user)
            throw new NotFoundError("We couldn't find that account. Please check your login status.");

        const existingItem = user.cart.find(item =>
            item.productId?.toString() === addedProduct.productId &&
            item.sku === addedProduct.sku &&
            item.color === addedProduct.color &&
            item.size === addedProduct.size
        );

        if (existingItem) {
            const total = existingItem.quantity + addedProduct.quantity;
            existingItem.quantity = Math.min(total, 100);
        } else {
            user.cart.push(addedProduct);
        }

        const updatedUser = await user.save();
        return updatedUser.cart;
    }

    public async toggleItemFromWishlist(userID: string, productID: string) {
        const user = await User.findById(userID).select("wishList");

        if (!user)
            throw new NotFoundError("We couldn't find that account. Please check your login status.");

        const isIncluded = user.wishList.some(id => id.toString() === productID);

        const wishList = user.wishList as any;

        if (isIncluded)
            wishList.pull(productID);
        else
            wishList.addToSet(productID);

        const updatedUser = await user.save();
        return updatedUser.wishList;
    }

    // Completed: updates the quantity of a specific cart item by productId
    public async updateCart(userID: string, productID: string, quantity: number) {
        const user = await User.findById(userID).select("cart");

        if (!user)
            throw new NotFoundError("We couldn't find that account. Please check your login status.");

        const cartItem = user.cart.find(item => item.productId?.toString() === productID);

        if (!cartItem)
            throw new NotFoundError("Item not found in cart. Please check the product ID and try again.");

        // Clamp quantity between 1 and 100
        cartItem.quantity = Math.min(Math.max(quantity, 1), 100);

        const updatedUser = await user.save();
        return updatedUser.cart;
    }

    // Added: removes all cart entries matching the given productId
    public async removeFromCart(userID: string, productID: string) {
        const user = await User.findById(userID).select("cart");

        if (!user)
            throw new NotFoundError("We couldn't find that account. Please check your login status.");

        const cartItem = user.cart.find(item => item.productId?.toString() === productID);

        if (!cartItem)
            throw new NotFoundError("Item not found in cart. Please check the product ID and try again.");

        user.cart.pull({_id : cartItem._id});

        const updatedUser = await user.save();
        return updatedUser.cart;
    }

    public async updateProfile(userID: string, updateProfileDTO: UpdateProfileSchema) {
        const user = await User.findByIdAndUpdate(userID, updateProfileDTO, {
            runValidators : true,
            returnDocument : "after"
        });

        if (!user)
            throw new NotFoundError("Unable to find user. Please check the ID and try again.");

        return user;
    }

    public async updateUser(userID: string, updateUserDTO: UpdateUserSchema) {
        const user = await User.findByIdAndUpdate(userID, updateUserDTO, {
            runValidators : true,
            returnDocument : "after"
        });

        if (!user)
            throw new NotFoundError("Unable to find user. Please check the ID and try again.");

        return user;
    }

    public async deleteUser(userID: string) {
        const user = await User.findByIdAndDelete(userID);

        if (!user)
            throw new NotFoundError("Unable to find user. Please check the ID and try again.");

        return user;
    }
}