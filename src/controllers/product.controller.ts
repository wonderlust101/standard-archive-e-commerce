import { RequestHandler } from "express";

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/products
export const getProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get all products (with pagination)"});
};

// GET /api/products/search?q=keyword
export const searchProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Search and filter products"});
};

// GET /api/products/featured
export const getFeaturedProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get featured products for homepage carousel"});
};

// GET /api/products/new-arrivals
export const getNewArrivals: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get most recently added products"});
};

// GET /api/products/category/:category
export const getProductsByCategory: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get Products by Category slug"});
};

// GET /api/products/check-stock/:sku
export const checkProductStock: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Check live stock for a specific SKU"});
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/products/:id/related
export const getRelatedProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get products related to the current one"});
};

// GET /api/products/:id
export const getProduct: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get a single Product by ID"});
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/products
export const createProduct: RequestHandler = async (req, res) => {
    return res.status(201).json({message : "Create a new Product"});
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/products/:id
// Note: We use PATCH for partial updates (like changing a price), PUT is for full replacement.
export const updateProduct: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Update an existing Product"});
};

// DELETE /api/products/:id
export const deleteProduct: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Delete/Archive a Product"});
};