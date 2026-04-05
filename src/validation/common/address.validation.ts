import { z } from "zod";

export const addressValidation = z.object({
    street : z
        .string({error : "Street address must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your street address."})
        .max(255, {error : "Street address exceeds our maximum character limit."}),
    city : z
        .string({error : "City must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide a city for delivery"})
        .max(255, {error : "City exceeds our maximum character limit."}),
    state : z
        .string({error : "Region details must be entered as text."})
        .trim()
        .min(1, {error : "Please provide your state or province."})
        .max(255, {error : "State/Province name is too long."}),
    postalCode : z
        .string({error : "Postal Code must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your postal code."})
        .regex(/^[a-zA-Z0-9\s-]{3,12}$/, { message: "Please enter a valid postal code." })
        .max(20, { message: "Postal code is too long." }),
    country : z
        .string({error : "Country must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your country."})
        .max(255, {error : "Country exceeds our maximum character limit."})
});

export const updateAddressValidation = addressValidation.partial();

export type AddressValidation = z.infer<typeof addressValidation>;
export type UpdateAddressValidation = z.infer<typeof updateAddressValidation>;