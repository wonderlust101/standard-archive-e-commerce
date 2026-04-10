import { z } from 'zod';

export const searchProductSchema = z.object({
    keyword : z.coerce.string()
        .trim()
        .min(1, {message : 'Please enter a search term'})
        .max(100, {message : 'Search term is too long.'})
});

export const productCategorySchema = z.object({
    category : z.coerce.string()
        .trim()
        .min(1, {message : 'Please select a category.'})
        .max(100, {message : 'Category is too long.'})
        .regex(/^[a-zA-Z\s-]+$/, {message : 'Category must contain only letters, spaces, or dashes.'})
});

export const productSKUSchema = z.object({
    sku : z.string()
        .trim()
        .min(10, {message : 'Please enter a product SKU.'})
        .max(10, {message : 'Product SKU is too long.'})
});

export const createProductSchema = z.object({
    name : z.string()
        .trim()
        .min(1, {message : 'Please enter a product name.'})
        .max(100, {message : 'Product name is too long.'})
        .regex(/^[a-zA-Z\s-]+$/, {message : 'Product name must contain only letters, spaces, or dashes.'}),
    isFeatured : z.boolean({message : "Please provide a valid boolean value"})
        .default(false),
    status : z.enum(['active', 'inactive', 'archived'], {message : "Please select a recognized product status."})
        .default("active"),
    description : z.string()
        .trim()
        .min(1, {message : 'Please enter a product description.'})
        .max(5000, {message : 'Product description is too long.'}),
    price : z.coerce.number({message : "Please enter a valid price."})
        .min(0, {message : "Price must be a positive number."})
        .max(1000000, {message : "Price exceeds our maximum limit."}),
    salePrice : z.coerce.number({message : "Please enter a valid discount."})
        .min(0, {message : "Discount must be a positive number."})
        .max(1000000, {message : "Discount exceeds our maximum limit."}),
    gender : z.enum(["male", "female", "other"], {message : "Please select a recognized gender option."}),
    category : z.string({error : "Category ID must be provided as text."})
        .length(24, {message : "Category ID must be exactly 24 characters."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            message : "The provided entry does not match our standard format. Please check your selection and try again."
        })
        .optional()
        .nullable(),
    materials : z.string()
        .trim()
        .min(1, {message : 'Please enter a product material.'})
        .max(100, {message : 'Product material is too long.'}),
    careInstructions : z.string()
        .trim()
        .min(1, {message : 'Please enter care instructions.'})
        .max(1000, {message : 'Care instructions are too long.'}),
    mainImage : z.url({message : 'The main image link appears to be malformed or invalid.'})
        .trim(),
    variants : z.array(z.object({
        color : z.string(),
        colorCode : z.string(),
        images : z.array(z.string()),
        stock : z.number({message : "Please enter a valid stock quantity."}),
        sku : z.string(),
        size : z.string(),
        measurementUnit : z.array(z.object({
            // Default measurements are cm
            // --- Tops, Jackets & Dresses ---
            chest : z.number({message : "Please enter a valid chest measurement."}),
            bust : z.number({message : "Please enter a valid bust measurement."}),
            shoulder : z.number({message : "Please enter a valid shoulder measurement."}),
            sleeveLength : z.number({message : "Please enter a valid sleeve length measurement."}),
            backLength : z.number({message : "Please enter a valid back length measurement."}),

            // --- Bottoms & Skirts ---
            waist : z.number({message : "Please enter a valid waist measurement."}),
            hips : z.number({message : "Please enter a valid hips measurement."}),
            inseam : z.number({message : "Please enter a valid inseam measurement."}),
            outseam : z.number({message : "Please enter a valid outseam measurement."}),
            rise : z.number({message : "Please enter a valid rise measurement."}),
            thigh : z.number({message : "Please enter a valid thigh measurement."}),
            legOpening : z.number({message : "Please enter a valid leg opening measurement."}),

            // --- General/Dresses ---
            totalLength : z.number({message : "Please enter a valid total length measurement."}),
            hem : z.number({message : "Please enter a valid hem measurement."}),

            // --- Other Measurements ---
            width : z.number({message : "Please enter a valid width measurement."}),
            height : z.number({message : "Please enter a valid height measurement."}),
            depth : z.number({message : "Please enter a valid depth measurement."})
        }))
    }))
});

export const updateProductSchema = createProductSchema.partial();

export type SearchProductSchema = z.infer<typeof searchProductSchema>;
export type ProductCategorySchema = z.infer<typeof productCategorySchema>;
export type ProductSKUSchema = z.infer<typeof productSKUSchema>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;