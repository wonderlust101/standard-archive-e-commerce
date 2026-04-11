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
            unique : true,
            minlength : [10, "Order number must be at least 10 characters long."],
            maxlength : [10, "Order number cannot exceed 10 characters."],
            match : [/^[a-zA-Z0-9\-]+$/, "Order numbers may only contain letters, numbers, and hyphens."]
        },
        orderType : {
            type : String,
            enum : ['online', 'instore'],
            required : [true, "Order type is missing. Please provide a order type for the order."]
        },
        storeNumber : {
            type : String,
            required : [function (this: any) { return this.orderType === 'instore'; },
                "Store number is missing. Please provide a store number for the order."],
            minlength : [10, "Store number must be at least 10 characters long."],
            maxlength : [10, "Store number cannot exceed 10 characters."],
            match : [/^[a-zA-Z0-9\-]+$/, "Store numbers may only contain letters, numbers, or hyphens."]
        },
        products : [
            {
                productId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product"
                },
                name : {
                    type : String,
                    trim : true,
                    maxlength : [100, "Product names are capped at 100 characters."],
                    match : [/^[a-zA-Z0-9\s'\-]+$/, "Product names may only contain letters, numbers, spaces, hyphens, or apostrophes."],
                    required : [true, "Product name is missing."]
                },
                sku : {
                    type : String,
                    trim : true,
                    minlength : [10, "SKU must be exactly 10 characters."],
                    maxlength : [10, "SKU must be exactly 10 characters."],
                    required : [true, "Product SKU is missing."]
                },
                color : {
                    type : String,
                    trim : true,
                    maxlength : [50, "Color must be under 50 characters."],
                    required : [true, "Product color is missing."]
                },
                size : {
                    type : String,
                    trim : true,
                    maxlength : [20, "Size must be under 20 characters."],
                    required : [true, "Product size is missing."]
                },
                image : {
                    type : String,
                    trim : true,
                    match : [/^https?:\/\/.+/, "Please provide a valid URL for the product image."],
                    required : [true, "Product image is missing."]
                },
                quantity : {
                    type : Number,
                    required : [true, "Product quantity is missing. Please provide a quantity for the product."],
                    min : [1, "Product quantity cannot be less than 1."],
                    max : [10, "Product quantity cannot exceed 10."]
                },
                originalPrice : {
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
            enum : ['credit_card', 'paypal', "cash"],
            required : [true, "Payment method is missing. Please provide a payment method for the order."]
        },
        paymentIntentId : {
            type : String,
            required : [
                function (this: any) { return this.paymentMethod === 'credit_card'; },
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
            const itemPrice = parseFloat(item.originalPrice.toString());
            return acc + (itemPrice * item.quantity);
        }, 0);

        this.totalAmount = mongoose.Types.Decimal128.fromString(calculatedTotal.toFixed(2));
    }

    return;
});

export type OrderRaw = InferSchemaType<typeof orderSchema>;
export type OrderDocument = HydratedDocument<OrderRaw>;

export default mongoose.model<OrderDocument>('Order', orderSchema);