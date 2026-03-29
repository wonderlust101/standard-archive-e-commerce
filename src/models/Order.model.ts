import { bsonType } from 'bson';
import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import { addressSchema } from "./common/Address.schema";

const orderSchema = new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : [true, "User ID is missing. Please provide a user ID for the order."]
        },
        orderNumber : {
            type : String,
            unique : true
        },
        orderType : {
            type : String,
            enum : ['online', 'in-store'],
            required : [true, "Order type is missing. Please provide a order type for the order."]
        },
        storeNumber : {
            type : String,
            required : [function (this: any) { return this.orderType === 'in-store'; },
                "Store number is missing. Please provide a store number for the order."]
        },
        products : [
            {
                productId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product"
                },
                name : {
                    type : String,
                    required : [true, "Product name is missing. Please provide a name for the product."]
                },
                sku : {
                    type : String,
                    required : [true, "Product SKU is missing. Please provide a SKU for the product."]
                },
                color : {
                    type : String,
                    required : [true, "Product color is missing. Please provide a color for the product."]
                },
                size : {
                    type : String,
                    required : [true, "Product size is missing. Please provide a size for the product."]
                },
                image : {
                    type : String,
                    required : [true, "Product image is missing. Please provide a image for the product."]
                },
                quantity : {
                    type : Number,
                    required : [true, "Product quantity is missing. Please provide a quantity for the product."],
                    min : [1, "Product quantity cannot be less than 1."]
                },
                priceAtPurchase : {
                    type : Schema.Types.Decimal128,
                    required : [true, "Product price at purchase is missing. Please provide a price at purchase for the product."],
                    get : (val: Schema.Types.Decimal128) => parseFloat(val.toString()).toFixed(2)
                }
            }
        ],
        totalAmount : {
            type : Schema.Types.Decimal128,
            required : [true, "Total amount is missing. Please provide a total amount for the order."],
            get : (val: Schema.Types.Decimal128) => parseFloat(val.toString()).toFixed(2)
        },
        status : {
            type : String,
            enum : ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
            default : "pending"
        },
        shippingAddress : {
            type : addressSchema,
            required : [
                function (this: any) { return this.orderType === 'online'; },
                "Shipping address is missing. Please provide a shipping address for the order."
            ]
        },
        paymentMethod : {
            type : String,
            enum : ['credit_card', 'paypal', 'bank_transfer', "cash"],
            required : [true, "Payment method is missing. Please provide a payment method for the order."]
        },
        paymentIntentId : {
            type : String,
            required : [
                function (this: any) { return this.orderType === 'online'; },
                "Payment intent ID is missing. Please provide a payment intent ID for the order."
            ]
        }
    }, {
        timestamps : true,
        toJSON : {
            virtuals : true,
            getters : true
        },
        toObject : {
            virtuals : true,
            getters : true
        }
    }
);

// Indexes
orderSchema.index({userId : 1, createdAt : -1});
orderSchema.index({status : 1});
orderSchema.index({orderType : 1});

// Virtuals
orderSchema.virtual("totalItems").get(function () {
    if (!this.products) return 0;

    return this.products.reduce((total, item) => total + item.quantity, 0);
});

// Pre-save hook
orderSchema.pre("save", function () {
    if (this.isNew) {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.orderNumber = `UNQ-${randomString}`;
    }

    return;
});

// Pre-validate hook
orderSchema.pre("validate", function () {
    if (this.products && this.products.length > 0) {
        const calculatedTotal = this.products.reduce((acc, item) => {
            const itemPrice = parseFloat(item.priceAtPurchase.toString());
            return acc + (itemPrice * item.quantity);
        }, 0);

        this.totalAmount = mongoose.Types.Decimal128.fromString(calculatedTotal.toFixed(2));
    }

    return;
});

export type OrderRaw = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderRaw>;

export default mongoose.model<OrderDocument>('Order', orderSchema);