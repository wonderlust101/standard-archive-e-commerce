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

