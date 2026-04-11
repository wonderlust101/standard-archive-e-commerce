import { z } from 'zod';

export const createOrderSchema = z.object({
    userId : z.string({error : "User ID must be provided in text format."})
        .length(24, {error : "The archive uses 24-character identifiers. Please check the User ID."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            error : "This identifier is not in a recognised format. Please check your selection and try again."
        }),
    orderNumber : z.string({error : "Order number must be provided in text format."})
        .trim()
        .length(10, {error : "Order numbers must be exactly 10 characters."})
        .regex(/^[a-zA-Z0-9]+$/, {error : "Order numbers may only contain letters and numbers."}),
    orderType : z.enum(["online", "instore"], {error : "Order type must be Online or In-store."}),
    storeNumber : z.string({error : "Store number must be provided in text format."})
        .trim()
        .max(20, {error : "Store numbers are capped at 20 characters."})
        .regex(/^[a-zA-Z0-9\-]+$/, {error : "Store numbers may only contain letters, numbers, or hyphens."})
        .optional(),
    products : z.array(z.object({
        productId : z.string({error : "Product ID must be provided in text format."})
            .length(24, {error : "The archive uses 24-character identifiers. Please check the Product ID."})
            .regex(/^[0-9a-fA-F]{24}$/, {
                error : "This identifier is not in a recognised format. Please check your selection and try again."
            }),
        name : z.string({error : "Product name must be provided in text format."})
            .trim()
            .min(1, {error : "Every item in the archive carries a name. Please enter a product name."})
            .max(100, {error : "Product names are capped at 100 characters."})
            .regex(/^[a-zA-Z0-9\s'\-]+$/, {error : "Product names may only contain letters, numbers, spaces, hyphens, or apostrophes."}),
        sku : z.string({error : "SKU must be provided in text format."})
            .trim()
            .length(10, {error : "Standard Archive SKUs must be exactly 10 characters for inventory integrity."}),
        color : z.string({error : "Color must be provided in text format."})
            .trim()
            .min(1, {error : "Color is required."})
            .max(50, {error : "Color must be under 50 characters."}),
        size : z.string({error : "Size must be provided in text format."})
            .trim()
            .min(1, {error : "Size is required."})
            .max(20, {error : "Size must be under 20 characters."}),
        image : z.url({error : "Product image URL appears to be malformed. Please provide a valid link."})
            .trim(),
        quantity : z.number({error : "Quantity must be a valid number."})
            .int({error : "Quantity must be a whole number."})
            .positive({error : "Quantity must be at least 1."})
            .max(10, {error : "The maximum quantity per line item is 10."})
            .default(1),
        originalPrice : z.number({error : "Price must be a valid number."})
            .min(0, {error : "Prices cannot be negative."})
    })).min(1, {error : "Every order must contain at least one piece."})
}).superRefine((data, ctx) => {
    if (data.orderType === "instore" && !data.storeNumber?.trim()) {
        ctx.addIssue({
            code : z.ZodIssueCode.custom,
            path : ["storeNumber"],
            message : "A store number is required for in-store orders."
        });
    }
});

export const updateOrderSchema = createOrderSchema.partial();

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;