import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const userModel = new mongoose.Schema({
        name : {
            type : String,
            required : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String
        },
        role : {
            type : String
        },
        cart : [
            {
                productId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Product"
                },
                quantity : {
                    type : Number,
                    default : 1
                }
            }
        ]
    },
    {
        timestamps : true
    }
);

export type UserRaw = InferSchemaType<typeof userModel>;
export type UserDocument = HydratedDocument<UserRaw>;

export default mongoose.model<UserDocument>('User', userModel);