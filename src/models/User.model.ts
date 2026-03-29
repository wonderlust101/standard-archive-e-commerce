import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

const userModel = new Schema({
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
                    type : Schema.Types.ObjectId,
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