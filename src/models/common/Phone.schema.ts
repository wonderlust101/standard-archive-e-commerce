import { Schema } from "mongoose";

export const PhoneSchema = new Schema({
    phoneNumber : {
        type : String,
        required : [true, "Phone number is missing. Please provide a phone number."],
        match: [/^[0-9]{10,15}$/, "Please provide a valid contact number (e.g., 555 010 0123)."],
        trim : true
    },
    phoneNumberType : {
        type : String,
        enum : ['mobile', 'home', 'work'],
        default : 'mobile'
    },
    isPrimary : {
        type : Boolean,
        default : false,
    }
}, {
    _id : false
});