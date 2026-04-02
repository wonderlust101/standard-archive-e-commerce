import { Schema } from "mongoose";

export const PhoneSchema = new Schema({
    phoneNumber : {
        type : String,
        required : [true, "Phone number is missing. Please provide a phone number for the user."],
        match : [/^[0-9]{10}$/, "Please fill a valid 10-digit phone number"],
        trim : true
    },
    phoneNumberType : {
        type : String,
        enum : ['mobile', 'home', 'work'],
        default : 'mobile'
    },
    isPrimary : {
        type : Boolean,
        default : false
    }
}, {
    _id : false
});