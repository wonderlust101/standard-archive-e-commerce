import { RequestHandler } from "express";

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories
export const getCategories: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get all categories"});
};

// GET /api/categories/tree
export const getCategoryTree: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get categories formatted as a nested tree/hierarchy"});
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories/:id
export const getCategory: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get category"});
};

// GET /api/categories/slug/:slug
export const getCategoryBySlug: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get category by slug"});
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/categories
export const createCategory: RequestHandler = async (req, res) => {
    return res.status(201).json({message : "Create a new category"});
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/categories/:id
export const updateCategory: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Update an existing category"});
};

// DELETE /api/categories/:id
export const deleteCategory: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Delete/Archive a category"});
};