import { z } from "zod";

export const loginValidation = z.object({
    email : z
        .email({
            error : (iss) => iss.input === undefined
                ? "Entry requires an email address."
                : "That doesn't look like a valid email. Please use the format name@example.com."
        })
        .trim()
        .toLowerCase()
        .min(1, {error : "Entry requires an email address."})
        .max(255, {error : "That email address exceeds the standard character limit."}),
    password : z
        .string({
            error : (iss) => iss.input === undefined
                ? "Access requires a password."
                : "Password must be provided in text format."
        })
        .trim()
        .min(8, {error : "Passwords must be at least 8 characters."})
        .max(100, {error : "Passwords are capped at 100 characters."})
});

export const registerValidation = z.object({
    firstName : z
        .string({
            error : (iss) => iss.input === undefined
                ? "Every record in the archive carries a name. Please enter your first name."
                : "First name must be provided in text format."
        })
        .trim()
        .min(1, {error : "Every record in the archive carries a name. Please enter your first name."})
        .max(100, {error : "First names are capped at 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "First names may only contain letters, hyphens, or apostrophes (e.g. O'Brien, Mary-Jane)."}),
    lastName : z
        .string({
            error : (iss) => iss.input === undefined
                ? "A last name is required to complete your profile."
                : "Last name must be provided in text format."
        })
        .trim()
        .min(1, {error : "A last name is required to complete your profile."})
        .max(100, {error : "Last names are capped at 100 characters."})
        .regex(/^[a-zA-Z\s'\-]+$/, {error : "Last names may only contain letters, hyphens, or apostrophes (e.g. O'Brien, Mary-Jane)."}),
    email : z
        .email({
            error : (iss) => iss.input === undefined
                ? "An email address is required to join the archive."
                : "That doesn't look like a valid email. Please use the format name@example.com."
        })
        .trim()
        .toLowerCase()
        .min(1, {error : "An email address is required to join the archive."})
        .max(255, {error : "That email address exceeds the standard character limit."}),
    password : z
        .string({
            error : (iss) => iss.input === undefined
                ? "A password is required to secure your account."
                : "Password must be provided in text format."
        })
        .trim()
        .min(8, {error : "For your security, passwords must be at least 8 characters."})
        .regex(/[A-Z]/, {error : "Include at least one uppercase letter."})
        .regex(/[a-z]/, {error : "Include at least one lowercase letter."})
        .regex(/[0-9]/, {error : "Include at least one number."})
        .regex(/[^a-zA-Z0-9]/, {error : "Include at least one symbol (e.g. ! @ # $) for stronger protection."})
        .max(100, {error : "Passwords are capped at 100 characters."}),
    gender : z
        .enum(["male", "female", "other"], {error : "Please select a valid gender."})
        .default("other"),
    dateOfBirth : z.coerce.date()
        .nullable()
        .default(null)
        .refine((date) => {
            if (!date) return true;
            return !isNaN(date.getTime());
        }, {error : "Please enter a valid date of birth."})
        .refine((date) => {
            if (!date) return true;
            return date <= new Date();
        }, {error : "Date of birth cannot be in the future."})
        .refine((date) => {
            if (!date) return true;
            const minimumAge = new Date();
            minimumAge.setFullYear(minimumAge.getFullYear() - 13);
            return date <= minimumAge;
        }, {error : "You must be at least 13 years old to create an account."}),
    newsletterSubscription : z
        .boolean({
            error : (iss) => iss.input === undefined
                ? "Please indicate your newsletter preference."
                : "Newsletter preference must be true or false."
        })
        .default(true)
});

export const forgetPasswordValidation = registerValidation.pick({email : true});
export const resetPasswordValidation = registerValidation.pick({password : true});

export const tokenParamsValidation = z.object({
    token : z
        .string({error : "This link has expired or is no longer valid. Please request a new one."})
        .trim()
        .min(1, {error : "This link has expired or is no longer valid. Please request a new one."})
        .max(255, {error : "This link has expired or is no longer valid. Please request a new one."})
});

export type LoginValidation = z.infer<typeof loginValidation>;
export type RegisterValidation = z.infer<typeof registerValidation>;
export type ForgetPasswordValidation = z.infer<typeof forgetPasswordValidation>;
export type ResetPasswordValidation = z.infer<typeof resetPasswordValidation>;
export type TokenParamValidation = z.infer<typeof tokenParamsValidation>;