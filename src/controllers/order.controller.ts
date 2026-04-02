import { RequestHandler } from "express";

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/orders
export const getOrders: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get all orders"});
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/orders/:id
export const getOrder: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Get order"});
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/orders
export const createOrder: RequestHandler = async (req, res) => {
    return res.status(201).json({message : "Create order"});
};

// POST /api/orders/webhook
export const stripeWebhook: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Handle Stripe payment success/failure"});
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/orders/:id
export const updateOrder: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Update order"});
};

// DELETE /api/orders/:id
export const deleteOrder: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Delete order"});
};
