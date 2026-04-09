import { z } from "zod";

export const loginValidation = z.object({
    email : z
        .email({error : "Names must be provided in text format."})
        .trim()
        .toLowerCase()
        .min(1, {error : "Please provide your email address."}),
    password : z
        .string({error : "Names must be provided in text format."})
        .min(6, {error : "Password must be at least 6 characters long."})
        .max(100, {error : "Password exceeds our maximum character limit."})
});

export const registerValidation = z.object({
    firstName : z
        .string({error : "Names must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your first name."})
        .max(100, {error : "First name exceeds our character limit."}),
    lastName : z
        .string({error : "Names must be provided in text format."})
        .trim()
        .min(1, {error : "Please provide your last name."})
        .max(100, {error : "Last name exceeds our character limit."}),
    email : z
        .email({error : "Email must be provided in text format."})
        .trim()
        .toLowerCase()
        .min(1, {error : "Please provide your email address."}),
    password : z
        .string({error : "Password must be provided in text format."})
        .trim()
        .min(1, {error : "Please create a password to secure your account."})
        .min(8, {error : "For your security, please use at least 8 characters."})
        .regex(/[A-Z]/, {error : "Please include at least one uppercase letter."})
        .regex(/[a-z]/, {error : "Please include at least one lowercase letter."})
        .regex(/[0-9]/, {error : "Please include at least one number."})
        .regex(/[^a-zA-Z0-9]/, {error : "Please include a symbol (e.g., ! @ # $) for stronger protection."})
        .max(100, {error : "Password exceeds our maximum character limit."}),
    gender : z.enum(["male", "female", "other"], {error : "Please provide a valid gender."}),
    dateOfBirth: z.coerce.date().nullable().default(null),
    newsletterSubscription : z.boolean({error : "Newsletter Subscription status must be a simple true or false."}).default(true),
});

export const forgetPasswordValidation = registerValidation.pick({email : true})
export const resetPasswordValidation = registerValidation.pick({password : true})

export const tokenParamsValidation = z.object({
    token: z
        .string()
        .trim()
        .min(1, { message: "Please provide a valid verification token." })
        .max(255, { message: "The provided token is invalid." })
});

export type LoginValidation = z.infer<typeof loginValidation>;
export type RegisterValidation = z.infer<typeof registerValidation>;
export type ForgetPasswordValidation = z.infer<typeof forgetPasswordValidation>;
export type ResetPasswordValidation = z.infer<typeof resetPasswordValidation>;

export type TokenParamValidation = z.infer<typeof tokenParamsValidation>;