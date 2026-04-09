import { z } from 'zod';

export const objectIdValidation = z.object({
    id : z.string()
        .length(24, {message : "A standard identifier must be exactly 24 characters."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            message : "The provided entry does not match our standard format. Please check your selection and try again."
        })
});

export type ObjectIdSchema = z.infer<typeof objectIdValidation>;