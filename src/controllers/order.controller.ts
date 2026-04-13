import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { APIRequest } from "../@types/APIRequest";
import { OrderRaw } from "../models/Order.model";
import { ObjectIdSchema } from "../validation/common/objectID.validation";
import { CreateOrderSchema, UpdateOrderSchema } from "../validation/order.validation";

const orderService = new OrderService();

// ── STATIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/orders
export const getOrders: RequestHandler<{}, APIRequest<OrderRaw[]>> = async (req, res) => {
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
        success : true,
        message : "Get all orders",
        data : orders
    });
};

// ── DYNAMIC GET ROUTES ─────────────────────────────────────────────────────────────

// GET /api/orders/:id
export const getOrder: RequestHandler<ObjectIdSchema, APIRequest<OrderRaw>> = async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Get order",
        data : order
    });
};

// ── POST ROUTES (Create / Actions) ─────────────────────────────────────────────────────────────

// POST /api/orders
export const createOrder: RequestHandler<{}, APIRequest<OrderRaw>, CreateOrderSchema> = async (req, res) => {
    const newOrder = await orderService.createOrder(req.body);

    return res.status(200).json({
        success : true,
        message : "Create order",
        data : newOrder
    });
};

// POST /api/orders/webhook
export const stripeWebhook: RequestHandler = async (req, res) => {
    return res.status(200).json({message : "Handle Stripe payment success/failure"});
};

// ── PATCH & DELETE ROUTES (Modify) ─────────────────────────────────────────────────────────────

// PATCH /api/orders/:id
export const updateOrder: RequestHandler<ObjectIdSchema, APIRequest<OrderRaw>, UpdateOrderSchema> = async (req, res) => {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body);

    return res.status(200).json({
        success : true,
        message : "Update order",
        data : updatedOrder
    });
};

// DELETE /api/orders/:id
export const deleteOrder: RequestHandler<ObjectIdSchema, APIRequest<OrderRaw>> = async (req, res) => {
    const deletedOrder = await orderService.deleteOrder(req.params.id);

    return res.status(200).json({
        success : true,
        message : "Update order",
        data : deletedOrder
    });
};
