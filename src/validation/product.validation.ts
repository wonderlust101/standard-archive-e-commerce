import { z } from 'zod';

export const searchProductSchema = z.object({
    keyword : z.coerce.string({
        error : (iss) => iss.input === undefined
            ? "Please enter a search term to explore the archive."
            : "Search terms must be provided in text format."
    })
        .trim()
        .min(1, {error : "Please enter a search term to explore the archive."})
        .max(100, {error : "Search terms are capped at 100 characters."})
});

export const productCategorySchema = z.object({
    category : z.coerce.string({
        error : (iss) => iss.input === undefined
            ? "A category is required."
            : "Category must be provided in text format."
    })
        .trim()
        .min(1, {error : "A category is required."})
        .max(100, {error : "Category must be under 100 characters."})
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, {error : "Category names may only contain letters, spaces, or dashes."})
});

export const productSKUSchema = z.object({
    sku : z.string({error : "SKU must be provided in text format."})
        .trim()
        .length(10, {error : "Standard Archive SKUs must be exactly 10 characters for inventory integrity."})
});

export const createProductSchema = z.object({
    name : z.string({error : "Product name must be provided in text format."})
        .trim()
        .min(1, {error : "Every piece in the archive carries a name. Please enter a product name."})
        .max(100, {error : "Product names are capped at 100 characters."})
        .regex(/^[a-zA-Z0-9\s',\-|]+$/, {error : "Product names may only contain letters, numbers, spaces, apostrophes, commas, pipes, or dashes."}),
    isFeatured : z.boolean({error : "Featured status must be true or false."})
        .default(false),
    status : z.enum(["pending", "draft", "published", "discontinued"], {error : "Status must be Pending, Draft, Published, or Discontinued."})
        .default("pending"),
    description : z.string({error : "Description must be provided in text format."})
        .trim()
        .min(10, {error : "Please provide at least a brief description (10 characters minimum)."})
        .max(5000, {error : "Descriptions are capped at 5000 characters."}),
    price : z.coerce.number({error : "Price must be a valid number."})
        .min(0, {error : "Prices cannot be negative."})
        .max(1000000, {error : "Price exceeds the maximum allowed value."}),
    salePrice : z.coerce.number({error : "Sale price must be a valid number."})
        .min(0, {error : "Sale prices cannot be negative."})
        .max(1000000, {error : "Sale price exceeds the maximum allowed value."}),
    gender : z.enum(["male", "female", "unisex"], {error : "Please select a valid gender option."}),
    category : z.string({error : "Category ID must be provided in text format."})
        .length(24, {error : "The archive uses 24-character identifiers. Please check the Category ID."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            error : "This identifier is not in a recognised format. Please check your selection and try again."
        }),
    materials : z.string({error : "Materials must be provided in text format."})
        .trim()
        .min(1, {error : "Please specify the materials used in this piece."})
        .max(100, {error : "Materials must be under 100 characters."}),
    careInstructions : z.string({error : "Care instructions must be provided in text format."})
        .trim()
        .min(1, {error : "Care instructions are required for each piece in the archive."})
        .max(1000, {error : "Care instructions are capped at 1000 characters."}),
    mainImages : z.array(
        z.url({error : "Main image URL appears to be malformed. Please provide a valid link."})
            .trim()
    ).min(1, {error : "Each piece requires at least one main image."}),
    sku : z.string({error : "SKU must be provided in text format."})
        .trim()
        .length(10, {error : "Standard Archive SKUs must be exactly 10 characters for inventory integrity."}),
    variants : z.array(
        z.object({
            color : z.string({error : "Color must be provided in text format."})
                .trim()
                .min(1, {error : "Color is required."})
                .max(50, {error : "Color must be under 50 characters."}),
            colorCode : z.string({error : "Color code must be provided in text format."})
                .trim()
                .min(1, {error : "Color code is required."})
                .max(10, {error : "Color codes are capped at 10 characters."})
                .regex(/^[a-zA-Z0-9]+$/, {error : "Color codes may only contain letters and numbers."}),
            images : z.array(
                z.url({error : "Image URL appears to be malformed. Please provide a valid link."})
            ).min(1, {error : "Each variant requires at least one image."}),
            sizes : z.array(
                z.object({
                        stock : z.number({error : "Stock must be a valid number."})
                            .int({error : "Stock must be a whole number."})
                            .min(0, {error : "Stock cannot be negative."}),
                        size : z.enum(["XXS", "XS", "S", "M", "L", "XL", "XXL"], {error : "Please select a valid size."}),
                        measurement : z.object({
                            // Default measurements are in cm.

                            // --- Tops, Jackets & Dresses ---
                            chest : z.number({error : "Chest measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            bust : z.number({error : "Bust measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            shoulder : z.number({error : "Shoulder measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            sleeveLength : z.number({error : "Sleeve length must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            backLength : z.number({error : "Back length must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),

                            // --- Bottoms & Skirts ---
                            waist : z.number({error : "Waist measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            hips : z.number({error : "Hips measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            inseam : z.number({error : "Inseam measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            outseam : z.number({error : "Outseam measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            rise : z.number({error : "Rise measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            thigh : z.number({error : "Thigh measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            legOpening : z.number({error : "Leg opening must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),

                            // --- General / Dresses ---
                            totalLength : z.number({error : "Total length must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            hem : z.number({error : "Hem measurement must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),

                            // --- Other ---
                            width : z.number({error : "Width must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            height : z.number({error : "Height must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional(),
                            depth : z.number({error : "Depth must be a valid number."}).min(0, {error : "Measurements cannot be negative."}).optional()
                        })

                    }
                )
            )


        })).min(1, {error : "At least one variant is required to add this piece to the archive."})
}).superRefine((data, ctx) => {
    if (data.salePrice !== undefined && data.price !== undefined && data.salePrice > data.price) {
        ctx.addIssue({
            code : z.ZodIssueCode.custom,
            path : ["salePrice"],
            message : "Sale price cannot exceed the original price."
        });
    }
});

export const updateProductSchema = createProductSchema.partial();

export type SearchProductSchema = z.infer<typeof searchProductSchema>;
export type ProductCategorySchema = z.infer<typeof productCategorySchema>;
export type ProductSKUSchema = z.infer<typeof productSKUSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;