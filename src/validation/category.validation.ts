import { z } from 'zod';

export const categorySlug = z.object({
    slug : z.string()
        .trim()
        .toLowerCase()
        .min(1, {error : "A URL slug is required for navigation."})
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {error : "Slugs may only contain lowercase letters, numbers, and dashes."})
});

export const createCategorySchema = z.object({
    name : z.string({error : "Category names must be provided as text."})
        .trim()
        .min(1, {message : 'Please name this category to proceed.'})
        .max(100, {message : 'The category name exceeds our standard character limit.'})
        .regex(/^[a-zA-Z0-9\s\-|]+$/, {message : 'Category must contain only letters, spaces, or dashes.'}),
    description : z.string({error : "Description must be provided as text."})
        .trim()
        .min(1, {message : 'Please provide a description for this category.'})
        .max(2000, {message : 'The description is longer than our standard allows.'}),
    shortDescription : z.string({error : "Short Description must be provided as text."})
        .trim()
        .min(1, {message : 'Please provide a brief summary for the category.'})
        .max(100, {message : 'The summary exceeds our standard character limit.'}),
    parentCategory : z.string({error : "Parent Category ID must be provided as text."})
        .length(24, {message : "Parent Category ID must be exactly 24 characters."})
        .regex(/^[0-9a-fA-F]{24}$/, {
            message : "The provided entry does not match our standard format. Please check your selection and try again."
        })
        .optional()
        .nullable(),
    order : z.number({error : "Please provide a valid display order."})
        .int({error : "The display order must be a whole number."})
        .nonnegative({error : "The display order cannot be negative."})
        .default(0),
    thumbnail : z.url({message : 'The thumbnail link appears to be malformed or invalid.'})
        .trim(),
    status : z.enum(['active', 'inactive', 'archived'], {message : "Please select a recognized category status."})
        .default("active")
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategorySlug = z.infer<typeof categorySlug>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
