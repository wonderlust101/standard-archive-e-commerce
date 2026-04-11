import { z } from 'zod';

export const phoneValidation = z.object({
    phoneNumber : z
        .string({
            error : (iss) => iss.input === undefined
                ? "A contact number is required."
                : "Phone number must be provided in text format."
        })
        .trim()
        .transform(value => value.replace(/[^0-9]/g, ''))
        .pipe(
            z.string()
                .regex(/^[0-9]{10,15}$/, {error : "Please enter a valid phone number between 10 and 15 digits (e.g. 555 010 0123)."})
        ),
    phoneNumberType : z
        .enum(["mobile", "home", "work"], {error : "Phone type must be Mobile, Home, or Work."})
        .default("mobile"),
    isPrimary : z
        .boolean({error : "Please confirm whether this is your primary contact number."})
        .default(false)
});

export const updatePhoneValidation = phoneValidation.partial();

export type PhoneValidation = z.infer<typeof phoneValidation>;
export type UpdatePhoneValidation = z.infer<typeof updatePhoneValidation>;