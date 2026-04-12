import { RequestHandler } from "express";
import { APIRequest } from "../@types/APIRequest";
import { CategoryRaw } from "../models/Category.model";
import CategoryService, { CategoryTreeNode } from "../services/category.service";
import { CategorySlug, CreateCategorySchema, UpdateCategorySchema } from "../validation/category.validation";
import { ObjectIdSchema } from "../validation/common/objectID.validation";

const categoryService = new CategoryService();

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories
export const getCategories: RequestHandler<{}, APIRequest<CategoryRaw[]>> = async (req, res) => {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
        success : true,
        message : "Categories retrieved successfully.",
        data : categories
    });
};

// GET /api/categories/tree
export const getCategoryTree: RequestHandler<{}, APIRequest<CategoryTreeNode[]>> = async (req, res) => {
    const categories = await categoryService.getCategoryTree();

    return res.status(200).json({
        success : true,
        message : "Category hierarchy generated successfully.",
        data : categories
    });
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/categories/:id
export const getCategory: RequestHandler<ObjectIdSchema, APIRequest<CategoryRaw>> = async (req, res) => {
    const category = await categoryService.getCategoryByID(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Category details retrieved.",
        data : category
    });
};

// GET /api/categories/slug/:slug
export const getCategoryBySlug: RequestHandler<CategorySlug, APIRequest<CategoryRaw>> = async (req, res) => {
    const fullPath = (req.params.slug as unknown as string[]).join('/');
    const category = await categoryService.getCategoryBySlug(fullPath);

    return res.status(200).json({
        success : true,
        message : "Category found.",
        data : category
    });
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/categories
export const createCategory: RequestHandler<{}, APIRequest<CategoryRaw>, CreateCategorySchema> = async (req, res) => {
    const newCategory = await categoryService.createCategory(req.body);

    return res.status(201).json({
        success : true,
        message : "Category created successfully.",
        data : newCategory
    });
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/categories/:id
export const updateCategory: RequestHandler<ObjectIdSchema, APIRequest<CategoryRaw>, UpdateCategorySchema> = async (req, res) => {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Category updated successfully.",
        data : updatedCategory
    });
};

// DELETE /api/categories/:id
export const deleteCategory: RequestHandler<ObjectIdSchema, APIRequest<CategoryRaw>> = async (req, res) => {
    const deletedCategory = await categoryService.deleteCategory(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Category has been deleted.",
        data : deletedCategory
    });
};