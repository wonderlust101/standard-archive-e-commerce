import { Router } from "express";
import { createOrder, deleteOrder, getOrder, getOrders, stripeWebhook, updateOrder } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.route('/')
    .get(getOrders)
    .post(createOrder);

orderRouter.route('/webhook').post(stripeWebhook);

orderRouter.route('/:id')
    .get(getOrder)
    .patch(updateOrder)
    .delete(deleteOrder);

export default orderRouter;