import { Schema } from "mongoose";

export const addressSchema = new Schema({
    street : {
        type : String,
        required : [true, "Street address is missing. Please provide a street address for the order."],
        trim : true,
        minlength : [1, "address must be at least 1 characters long."],
        maxlength : [100, "address cannot exceed 100 characters."],
        match : [/^[a-zA-Z0-9\s,.'#\-\/]+$/, "Street address may only contain letters, numbers, spaces, and standard punctuation (e.g. 12 Arch St, Apt #3)."]
    },
    city : {
        type : String,
        required : [true, "City is missing. Please provide a city for the order."],
        trim : true,
        minlength : [1, "City must be at least 1 characters long."],
        maxlength : [100, "City cannot exceed 100 characters."],
        match : [/^[a-zA-Z\s'\-]+$/, "City names may only contain letters, spaces, hyphens, or apostrophes."]
    },
    state : {
        type : String,
        required : [true, "State is missing. Please provide a state or province for the order."],
        trim : true,
        minlength : [1, "State must be at least 1 characters long."],
        maxlength : [100, "State cannot exceed 100 characters."],
        match : [/^[a-zA-Z\s'\-]+$/, "State or province may only contain letters, spaces, hyphens, or apostrophes."]
    },
    postalCode : {
        type : String,
        required : [true, "Postal code is missing. Please provide a postal code for the order."],
        trim : true,
        minlength : [1, "Postal code must be at least 1 characters long."],
        maxlength : [12, "Postal code cannot exceed 12 characters."],
        match: [/^[a-zA-Z0-9\s\-]{3,12}$/, "Please enter a valid postal code (3–12 alphanumeric characters)."]
    },
    country : {
        type : String,
        required : [true, "Country is missing. Please provide a country for the order."],
        trim : true,
        minlength : [1, "Country must be at least 1 characters long."],
        maxlength : [100, "Country cannot exceed 100 characters."],
        match : [/^[a-zA-Z\s'\-]+$/, "Country names may only contain letters, spaces, hyphens, or apostrophes."]
    }
}, {
    _id : false
});