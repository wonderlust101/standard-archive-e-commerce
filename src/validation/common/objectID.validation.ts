import { z } from 'zod';

export const objectIdValidation = z.object({
    id : z.string()
        .length(24, {error : "The archive uses 24-character identifiers. Please check your selection."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            error : "This identifier is not in a recognised format. Please check your selection and try again."
        })
});

export type ObjectIdSchema = z.infer<typeof objectIdValidation>;