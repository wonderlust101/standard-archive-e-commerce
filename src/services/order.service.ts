import Order from "../models/Order.model";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateOrderSchema, UpdateOrderSchema } from "../validation/order.validation";

export class OrderService {
    public async getAllOrders() {
        const orders = await Order.find();

        // TODO: Add filtering logic here if needed

        return orders;
    }

    public async getOrderById(orderID: string) {
        const order = await Order.findById(orderID);

        if (!order)
            throw new NotFoundError("Unable to find order. Please check the ID and try again.");


        return order;
    }

    public async createOrder(createOrderDTO: CreateOrderSchema) {
        return await Order.create(createOrderDTO as any);
    }

    public async updateOrder(orderID: string, updateOrderDTO: UpdateOrderSchema) {
        const updatedOrder = await Order.findByIdAndUpdate(orderID, updateOrderDTO, {
            runValidators : true,
            returnDocument : "after"
        });

        if (!updatedOrder)
            throw new NotFoundError("Unable to find order. Please check the ID and try again.");

        return updatedOrder;
    }

    public async deleteOrder(orderID: string) {
        const deletedOrder = await Order.findByIdAndDelete(orderID);

        if (!deletedOrder)
            throw new NotFoundError("Unable to find order. Please check the ID and try again.");

        return deletedOrder;
    }
}