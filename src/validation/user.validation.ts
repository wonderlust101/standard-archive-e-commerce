import { z } from 'zod';
import { objectIdValidation } from "./common/objectID.validation";
import { updateAddressValidation } from "./common/address.validation";
import { updatePhoneValidation } from "./common/phone.validation";

export const updateProfileValidation = z.object({
    firstName : z
        .string({error : "Names must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your first name."})
        .max(100, {error : "First name exceeds our character limit."})
        .optional(),
    lastName : z
        .string({error : "Names must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your last name."})
        .max(100, {error : "Last name exceeds our character limit."})
        .optional(),
    dateOfBirth : z.coerce.date({ error: "Please enter a valid date of birth." }).nullable().optional(),
    gender : z.enum(["male", "female", "other"], {error : "Please select a recognized gender option."}).optional(),
    savedAddress : updateAddressValidation.optional(),
    phoneNumber : updatePhoneValidation.optional(),
    newsletterSubscription : z.boolean({error : "Newsletter Subscription status must be a simple true or false."}).optional()
});

export const updateUserValidation = updateProfileValidation.extend({
    role : z.enum(["user", "admin"], {error : "Please provide a valid role."}).optional(),
    isEmailVerified : z.boolean({error : "Verification status must be a simple true or false."}).optional(),
    stripeCustomerId : z.string({error : "Stripe Customer ID must be provided in text format."})
        .trim()
        .optional(),
    status : z.enum(["active", "inactive"], {error : "Please provide a valid status."}).optional()
});

export const addToCartValidation = z.object({
    productId : objectIdValidation,
    quantity : z.number({error : "Quantity must provided a valid number."})
        .int({message : "Items must be added in whole quantities."})
        .positive({message : "Please select a quantity of one or more."})
        .max(100, {message : "The maximum quantity allowed is 100."})
        .default(1),
    sku : z.string({error : "SKU must be provided in text format."})
        .trim()
        .min(1, {message : "A product reference is required to add this item."})
        .max(255, {message : "The product reference provided is not recognized."}),
    color : z.string({error : "Color must be provided in text format."})
        .trim()
        .min(1, {message : "Please choose a color for your selection."})
        .max(255, {message : "The selected color is currently unavailable"}),
    size : z.string({error : "Size must be provided in text format."})
        .trim()
        .min(1, {message : "Please choose a size to continue."})
        .max(255, {message : "The selected size is currently unavailable"})
});

export const updateCartValidation = addToCartValidation.partial();

