import { RequestHandler } from "express";
import { ProductService } from "../services/product.service";
import { APIRequest } from "../@types/APIRequest";
import { ProductRaw } from "../models/Product.model";
import { ObjectIdSchema } from "../validation/common/objectID.validation";
import { CreateProductSchema, ProductSKUSchema, UpdateProductSchema } from "../validation/product.validation";

const productService = new ProductService();

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/products
export const getProducts: RequestHandler<{}, APIRequest<ProductRaw[]>> = async (req, res) => {
    const products = await productService.getAllProducts();

    return res.status(200).json({
        success : true,
        message : "Get all products (with pagination)",
        data : products
    });
};

// GET /api/products/search?q=keyword
export const searchProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Search and filter products"});
};

// GET /api/products/featured
export const getFeaturedProducts: RequestHandler<{}, APIRequest<ProductRaw[]>> = async (req, res) => {
    const featuredProducts = await productService.getAllFeaturedProducts();

    return res.status(200).json({
        success : true,
        message : "Search and filter products",
        data : featuredProducts
    });
};

// GET /api/products/new-arrivals
export const getNewArrivals: RequestHandler<{}, APIRequest<ProductRaw[]>> = async (req, res) => {
    const newArrivalProducts = await productService.getNewArrivalProducts();

    return res.status(200).json({
        success : true,
        message : "Get most recently added products",
        data : newArrivalProducts
    });
};

// GET /api/products/category/:slug
export const getProductsByCategory: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get Products by Category slug"});
};

// GET /api/products/check-stock/:sku
export const checkProductStock: RequestHandler<ProductSKUSchema, APIRequest<Number>> = async (req, res) => {
    const productStock = await productService.checkProductStock(req.params.sku);

    return res.status(200).json({
        success : true,
        message : "Check live stock for a specific SKU",
        data : productStock
    });
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/products/:id/related
export const getRelatedProducts: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get products related to the current one"});
};

// GET /api/products/:id
export const getProduct: RequestHandler<ObjectIdSchema, APIRequest<ProductRaw>> = async (req, res) => {
    const product = await productService.getProduct(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Get a single Product by ID",
        data : product
    });
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/products
export const createProduct: RequestHandler<{}, APIRequest<ProductRaw>, CreateProductSchema> = async (req, res) => {
    const newProduct = await productService.createProduct(req.body);

    return res.status(201).json({
        success : true,
        message : "Create a new Product",
        data : newProduct
    });
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/products/:id
export const updateProduct: RequestHandler<ObjectIdSchema, APIRequest<ProductRaw>, UpdateProductSchema> = async (req, res) => {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Update an existing Product",
        data : updatedProduct
    });
};

// DELETE /api/products/:id
export const deleteProduct: RequestHandler<ObjectIdSchema, APIRequest<ProductRaw>> = async (req, res) => {
    const deletedProduct = await productService.deleteProduct(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Delete/Archive a Product",
        data : deletedProduct
    });
};