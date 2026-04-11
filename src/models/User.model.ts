import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import { addressSchema } from "./common/Address.schema";
import argon2 from 'argon2';
import { PhoneSchema } from "./common/Phone.schema";

type UserMethods = {
    comparePassword: (candidatePassword: string) => Promise<boolean>
}

type UserVirtuals = {
    fullName: string
}

const userSchema = new Schema({
        firstName : {
            type : String,
            required : [true, "First name is missing. Please provide a first name for the user."],
            trim : true,
            minLength : [1, "First name must be at least 1 characters long."],
            maxLength : [100, "First name cannot exceed 100 characters."],
            match : [/^[a-zA-Z\s'\-]+$/, "First name may only contain letters, spaces, hyphens, and apostrophes."]
        },
        lastName : {
            type : String,
            required : [true, "Last name is missing. Please provide a last name for the user."],
            trim : true,
            minLength : [1, "Last name must be at least 1 characters long."],
            maxLength : [100, "Last name cannot exceed 100 characters."],
            match : [/^[a-zA-Z\s'\-]+$/, "Last name may only contain letters, spaces, hyphens, and apostrophes."]
        },
        dateOfBirth : {
            type : Date
        },
        gender : {
            type : String,
            enum : ['male', 'female', "other"],
            required : [true, "Gender is missing. Please provide a gender for the user."]
        },
        email : {
            type : String,
            required : [true, "Email is missing. Please provide a email for the user."],
            unique : true,
            lowercase : true,
            match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please fill a valid email address"],
            minlength : [1, "Email must be at least 10 characters long."],
            maxlength : [255, "Email cannot exceed 255 characters."]
        },
        verificationCode : {
            type : String,
            unique : true,
            sparse : true
        },
        verificationCodeExpiry : {
            type : Date,
            default : null
        },
        resetPasswordToken : {
            type : String,
            unique : true,
            sparse : true
        },
        resetPasswordExpires : {
            type : Date,
            default : null
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
            sparse : true,
            match : [/^cus_[a-zA-Z0-9]+$/, "Invalid Stripe Customer ID format."]
        },
        savedAddress : {
            type : addressSchema,
            default : null
        },
        phoneNumber : {
            type : PhoneSchema,
            default : null
        },
        wishList : [{
            type : Schema.Types.ObjectId,
            ref : "Product"
        }],
        newsletterSubscription : {
            type : Boolean,
            default : true
        },
        status : {
            type : String,
            enum : ['active', 'inactive'],
            default : 'active'
        },
        // Cart
        cart : [
            {
                productId : {
                    type : Schema.Types.ObjectId,
                    ref : "Product"
                },
                quantity : {
                    type : Number,
                    default : 1,
                    min : [1, "Quantity must be at least 1."],
                    max : [100, "The maximum quantity per item is 100."]
                },
                sku : {
                    type : String,
                    required : [true, "Product SKU is missing. Please provide a SKU for the product."],
                    minlength : [10, "Product SKU must be at least 10 character long."],
                    maxlength : [10, "Product SKU cannot be longer than 10 characters."],
                    trim : true
                },
                color : {
                    type : String,
                    required : [true, "Product color is missing. Please provide a color for the product."],
                    minlength : [1, "Product color code must be at least 3 characters long."],
                    maxlength : [50, "Product color code cannot be longer than 50 characters."],
                    trim : true
                },
                size : {
                    type : String,
                    required : [true, "Product size is missing. Please provide a size for the product."],
                    enum : {
                        values : ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
                        message : "{VALUE} is not a valid size option"
                    }
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
userSchema.index({lastName : 1, firstName : 1});
userSchema.index({role : 1});
userSchema.index({isEmailVerified : 1});

// Methods
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await argon2.verify(this.password, candidatePassword);
};

// Virtuals
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Hooks
userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;

    this.password = await argon2.hash(this.password);
});

export type UserRaw = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserRaw & UserMethods & UserVirtuals>;

export default mongoose.model<UserDocument>('User', userSchema);