import { z } from 'zod';
import { updateAddressValidation } from "./common/address.validation";
import { updatePhoneValidation } from "./common/phone.validation";

export const updateProfileValidation = z.object({
    firstName : z
        .string({error : "First name must be provided in text format."})
        .trim()
        .min(1, {error : "First name required."})
        .max(100, {error : "First names are capped at 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "First names may only contain letters, hyphens, or apostrophes."})
        .optional(),
    lastName : z
        .string({error : "Last name must be provided in text format."})
        .trim()
        .min(1, {error : "Last name required."})
        .max(100, {error : "Last names are capped at 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "Last names may only contain letters, hyphens, or apostrophes."})
        .optional(),
    dateOfBirth : z.coerce.date({error : "Please enter a valid date of birth."})
        .refine((date) => date <= new Date(), {
            error : "Date of birth cannot be in the future."
        })
        .refine((date) => {
            const minimumAge = new Date();
            minimumAge.setFullYear(minimumAge.getFullYear() - 13);
            return date <= minimumAge;
        }, {error : "You must be at least 13 years old to hold an account."})
        .nullable()
        .optional(),
    gender : z
        .enum(["male", "female", "other"], {error : "Please select a valid gender option."})
        .optional(),
    savedAddress : updateAddressValidation.optional(),
    phoneNumber : updatePhoneValidation.optional(),
    newsletterSubscription : z
        .boolean({error : "Newsletter preference must be true or false."})
        .optional()
});

export const updateUserValidation = updateProfileValidation.extend({
    role : z
        .enum(["user", "admin"], {error : "Role must be User or Admin."})
        .optional(),
    isEmailVerified : z
        .boolean({error : "Email verification status must be true or false."})
        .optional(),
    stripeCustomerId : z
        .string({error : "Stripe customer ID must be provided in text format."})
        .trim()
        .regex(/^cus_[a-zA-Z0-9]+$/, {error : "Stripe customer IDs must begin with 'cus_' followed by alphanumeric characters."})
        .optional(),
    status : z
        .enum(["active", "inactive"], {error : "Status must be Active or Inactive."})
        .optional()
});

export const addToCartValidation = z.object({
    productId : z.string({error : "Product ID must be provided in text format."})
        .length(24, {error : "The archive uses 24-character identifiers. Please check the Product ID."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            error : "This identifier is not in a recognised format. Please check your selection and try again."
        }),
    quantity : z.number({error : "Quantity must be a valid number."})
        .int({error : "Quantity must be a whole number."})
        .positive({error : "Quantity must be at least 1."})
        .max(100, {error : "The maximum quantity per item is 100."})
        .default(1),
    sku : z.string({error : "SKU must be provided in text format."})
        .trim()
        .length(10, {error : "Standard Archive SKUs must be exactly 10 characters for inventory integrity."}),
    color : z.string({error : "Color must be provided in text format."})
        .trim()
        .min(1, {error : "Please select a color to continue."})
        .max(50, {error : "Color must be under 50 characters."}),
    size : z.enum(["XXS", "XS", "S", "M", "L", "XL", "XXL"], {error : "Please select a valid size."})
});

export const updateCartValidation = addToCartValidation.partial().extend({
    quantity : z.number({error : "Quantity must be a valid number."})
        .int({error : "Quantity must be a whole number."})
        .positive({error : "Quantity must be at least 1."})
        .max(100, {error : "The maximum quantity per item is 100."})
        .default(1)
});

export const deleteCartValidation = addToCartValidation.partial();

export type UpdateProfileSchema = z.infer<typeof updateProfileValidation>;
export type UpdateUserSchema = z.infer<typeof updateUserValidation>;
export type AddToCartSchema = z.infer<typeof addToCartValidation>;
export type UpdateCartSchema = z.infer<typeof updateCartValidation>;