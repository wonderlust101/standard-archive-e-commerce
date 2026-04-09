import { z } from 'zod';

export const categorySlug = z.object({
    slug : z.string()
        .trim()
        .toLowerCase()
        .min(1, {error : "A unique URL slug is required for navigation."})
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {error : "Slugs may only contain lowercase letters, numbers, and dashes."})
});

export const createCategorySchema = z.object({
    name : z.string()
        .trim()
        .min(1, {message : 'Please enter a category name'})
        .max(100, {message : 'Category name is too long.'})
        .regex(/^[a-zA-Z\s-]+$/, {message : 'Category must contain only letters, spaces, or dashes.'}),
    description : z.string()
        .trim()
        .min(1, {message : 'Please enter a category description'})
        .max(5000, {message : 'Category description is too long.'}),
    shortDescription : z.string()
        .trim()
        .min(1, {message : 'Please enter a category short description'})
        .max(255, {message : 'Category short description is too long.'}),
    parentCategory : z.string()
        .length(24, {message : "A standard identifier must be exactly 24 characters."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            message : "The provided entry does not match our standard format. Please check your selection and try again."
        }),
    order : z.number()
        .int()
        .positive()
        .default(0),
    thumbnail : z.url({message : 'Please provide a valid URL for the category thumbnail.'})
        .trim(),
    status : z.enum(['active', 'inactive', 'archived'], {message : "Please provide a valid status."})
        .default("active")
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategorySlug = z.infer<typeof categorySlug>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
