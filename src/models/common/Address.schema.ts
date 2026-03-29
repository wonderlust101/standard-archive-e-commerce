import { Schema } from "mongoose";

export const addressSchema = new Schema({
    street : {
        type : String,
        required : [true, "Shipping address is missing. Please provide a shipping address for the order."],
        trim : true
    },
    city : {
        type : String,
        required : [true, "Shipping city is missing. Please provide a shipping city for the order."],
        trim : true
    },
    state : {
        type : String,
        required : [true, "Shipping state is missing. Please provide a shipping state for the order."],
        trim : true
    },
    postalCode : {
        type : String,
        required : [true, "Shipping postal code is missing. Please provide a shipping postal code for the order."],
        trim : true
    },
    country : {
        type : String,
        required : [true, "Shipping country is missing. Please provide a shipping country for the order."],
        trim : true
    }
}, {
    _id : false
});