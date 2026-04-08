import { RequestHandler } from "express";
import { APIRequest } from "../@types/APIRequest";
import { CategoryRaw } from "../models/Category";
import CategoryService, { CategoryTreeNode } from "../services/category.service";

const categoryService = new CategoryService();

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories
// TODO: Add zod types
export const getCategories: RequestHandler<{}, APIRequest<CategoryRaw[]>> = async (req, res) => {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
        success : true,
        message : "Collection categories retrieved successfully.",
        data : categories
    });
};

// GET /api/categories/tree
export const getCategoryTree: RequestHandler<{}, APIRequest<CategoryTreeNode[]>> = async (req, res) => {
    const categories = await categoryService.getCategoryTree();

    return res.status(200).json({
        success : true,
        message : "Navigation structure generated.",
        data : categories
    });
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories/:id
export const getCategory: RequestHandler<{id: string}, APIRequest<CategoryRaw>> = async (req, res) => {
    const category = await categoryService.getCategoryByID(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Category details loaded.",
        data : category
    });
};

// GET /api/categories/slug/:slug
export const getCategoryBySlug: RequestHandler<{slug: string}, APIRequest<CategoryRaw>> = async (req, res) => {
    const fullPath = (req.params.slug as unknown as string[]).join('/');
    const category = await categoryService.getCategoryBySlug(req.params.slug);

    return res.status(200).json({
        success : true,
        message : "Category details loaded.",
        data : category
    });
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/categories
// TODO: Add zod schema
export const createCategory: RequestHandler<{}, APIRequest<CategoryRaw>> = async (req, res) => {
    const newCategory = await categoryService.createCategory(req.body);

    return res.status(201).json({
        success : true,
        message : "Create a new category",
        data : newCategory
    });
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/categories/:id
export const updateCategory: RequestHandler<{id: string}, APIRequest<CategoryRaw>> = async (req, res) => {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Update an existing category",
        data : updatedCategory
    });
};

// DELETE /api/categories/:id
export const deleteCategory: RequestHandler<{id: string}, APIRequest<CategoryRaw>> = async (req, res) => {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Delete/Archive a category",
        data : deletedCategory
    });
};