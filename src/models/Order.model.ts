import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import { UserDocument } from "./User.model";

const orderSchema = new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        product : [
            {
                productId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product"
                },
                quantity : {
                    type : Number
                },
                priceAtPurchase : {
                    type : Number
                }
            }
        ],
        totalAmount : {
            type : Number
        },
        status : {
            type : String,
            default : "pending"
        }
    }, {
        timestamps : true
    }
);

export type OrderRaw = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderRaw>;

export default mongoose.model<UserDocument>('Order', orderSchema)