import { z } from "zod";

export const addressValidation = z.object({
    street : z
        .string({error : "Street address must be provided in text format."})
        .trim()
        .min(1, {error : "A street address is required for delivery."})
        .max(255, {error : "Street address must be under 255 characters."})
        .regex(/^[a-zA-Z0-9\s,.'#\-\/]+$/, {error : "Street address may only contain letters, numbers, spaces, and standard punctuation (e.g. 12 Arch St, Apt #3)."}),
    city : z
        .string({error : "City must be provided in text format."})
        .trim()
        .min(1, {error : "A city is required for delivery."})
        .max(100, {error : "City must be under 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "City names may only contain letters, spaces, hyphens, or apostrophes."}),
    state : z
        .string({error : "State or province must be provided in text format."})
        .trim()
        .min(1, {error : "A state or province is required."})
        .max(100, {error : "State or province must be under 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "State or province may only contain letters, spaces, hyphens, or apostrophes."}),
    postalCode : z
        .string({error : "Postal code must be provided in text format."})
        .trim()
        .min(1, {error : "A postal code is required."})
        .regex(/^[a-zA-Z0-9\s\-]{3,12}$/, {error : "Please enter a valid postal code (3–12 alphanumeric characters)."})
        .max(20, {error : "Postal code must be under 20 characters."}),
    country : z
        .string({error : "Country must be provided in text format."})
        .trim()
        .min(1, {error : "A country is required."})
        .max(100, {error : "Country must be under 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "Country names may only contain letters, spaces, hyphens, or apostrophes."})
});

export const updateAddressValidation = addressValidation.partial();

export type AddressValidation = z.infer<typeof addressValidation>;
export type UpdateAddressValidation = z.infer<typeof updateAddressValidation>;