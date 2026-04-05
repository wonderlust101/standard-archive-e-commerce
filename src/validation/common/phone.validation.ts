import { z } from 'zod';

export const phoneValidation = z.object({
    phoneNumber : z.string()
        .trim()
        .min(1, {error : "Please provide your phone number."})
        .transform(value => value.replace(/[^0-9]/g, ''))
        .pipe(
            z.string()
                .min(10, {error: "Standard contact number must be at least 10 digits long."})
                .max(15, { error: "Phone number exceed the standard limit of 15 digits."})
                .regex(/^\?[0-9]{10,15}$/, {error : "Please provide a valid contact number (e.g., 555 010 0123)."})
        ),
    phoneNumberType : z
        .enum(["mobile", "home", "work"])
        .default("mobile"),
    isPrimary : z
        .boolean({message : "Please provide a valid boolean value"}).default(false)
});

export const updatePhoneValidation = phoneValidation.partial();

export type PhoneValidation = z.infer<typeof phoneValidation>;
export type UpdatePhoneValidation = z.infer<typeof updatePhoneValidation>;