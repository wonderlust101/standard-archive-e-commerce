import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import { addressSchema } from "./common/Address.schema";
import argon2 from 'argon2';
import { PhoneSchema } from "./common/Phone.schema";

type UserMethods = {
    comparePassword : (candidatePassword : string) => Promise<boolean>
}

const userSchema = new Schema({
        firstName : {
            type : String,
            required : [true, "First name is missing. Please provide a first name for the user."],
            trim : true,
        },
        lastName : {
            type : String,
            required : [true, "Last name is missing. Please provide a last name for the user."],
            trim : true
        },
        email: {
            type : String,
            required : [true, "Email is missing. Please provide a email for the user."],
            unique : true,
            lowercase : true,
            match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"]
        },
        phoneNumbers: {
            type: [PhoneSchema],
            default: []
        },
        // Security
        password : {
            type : String,
            required : [true, "Password is missing. Please provide a password for the user."],
            minlength : [8, "Password must be at least 8 characters long."],
            select : false
        },
        role : {
            type : String,
            enum : ['user', 'admin'],
            default : 'user'
        },
        isEmailVerified : {
            type : Boolean,
            default : false
        },
        // Ecommerce
        stripeCustomerId : {
            type : String,
            unique : true,
            sparse : true
        },
        savedAddresses : {
            type : [addressSchema],
            default : []
        },
        wishList : [{
            type: Schema.Types.ObjectId,
            ref : "Product"
        }],
        // Cart
        cart : [
            {
                productId : {
                    type : Schema.Types.ObjectId,
                    ref : "Product"
                },
                quantity : {
                    type : Number,
                    default : 1
                },
                // Variant details
                sku: {
                    type: String,
                    required: [true, "Product SKU is missing. Please provide a SKU for the product."]
                },
                color: {
                    type: String,
                    required: [true, "Product color is missing. Please provide a color for the product."]
                },
                size: {
                    type: String,
                    required: [true, "Product size is missing. Please provide a size for the product."]
                }
            }
        ]
    },
    {
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
userSchema.index({ lastName: 1, firstName: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isEmailVerified: 1 });

// Methods
userSchema.methods.comparePassword = async function(candidatePassword : string) {
    return await argon2.verify(this.password, candidatePassword);
}

// Virtuals
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Hooks
userSchema.pre('save', async function() {
    if (!this.isModified('password'))
        return;

    this.password = await argon2.hash(this.password);
})

export type UserRaw = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserRaw, UserMethods>;

export default mongoose.model<UserDocument>('User', userSchema);