import { z } from 'zod';

export const categorySlug = z.object({
    slug : z.string({
        error : (iss) => iss.input === undefined
            ? "A URL slug is required for navigation."
            : "Slug must be provided in text format."
    })
        .trim()
        .toLowerCase()
        .min(3, {error : "A URL slug is required for navigation."})
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, {error : "Slugs may only contain lowercase letters, numbers, hyphens, and forward slashes for sub-categories (e.g. mens/new-arrivals)."})
});

export const createCategorySchema = z.object({
    name : z.string({
        error : (iss) => iss.input === undefined
            ? "Every collection in the archive needs a name."
            : "Category name must be provided in text format."
    })
        .trim()
        .min(1, {error : "Every collection in the archive needs a name."})
        .max(100, {error : "Category names are capped at 100 characters."})
        .regex(/^[a-zA-Z0-9\s',\-|]+$/, {error : "Category names may only contain letters, numbers, spaces, apostrophes, commas, pipes, or dashes."}),
    description : z.string({
        error : (iss) => iss.input === undefined
            ? "A description is required to give this collection context."
            : "Description must be provided in text format."
    })
        .trim()
        .min(10, {error : "Please write at least a brief description (10 characters minimum) to give this collection context."})
        .max(2000, {error : "Descriptions are capped at 2000 characters."}),
    shortDescription : z.string({
        error : (iss) => iss.input === undefined
            ? "A short description is required."
            : "Short description must be provided in text format."
    })
        .trim()
        .min(10, {error : "The short description must be at least 10 characters."})
        .max(100, {error : "Short descriptions are capped at 100 characters."}),
    parentCategory : z.string({error : "The selected parent category is invalid. Please refresh and try again."})
        .transform(val => val === "" ? null : val)
        .nullable()
        .pipe(
            z.string()
                .regex(/^[0-9a-fA-F]{24}$/, {
                    error : "This identifier is not in a recognised format. Please check your selection and try again."
                })
                .length(24, {error : "Parent category identifier must be exactly 24 characters."})
                .nullable()
        )
        .optional(),
    order : z.number({error : "Display order must be a valid number."})
        .int({error : "Display order must be a whole number."})
        .nonnegative({error : "Display order must be zero or greater."})
        .default(0),
    thumbnail : z.url({error : "The thumbnail URL appears to be malformed. Please provide a valid link."})
        .trim(),
    status : z.enum(['active', 'inactive', 'archived'], {error : "Status must be Active, Inactive, or Archived."})
        .default("active")
});

export const updateCategorySchema = createCategorySchema.partial();

export type CategorySlug = z.infer<typeof categorySlug>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;