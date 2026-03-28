import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const productSchema = new mongoose.Schema({
        name : {
            type : String,
            required : true
        },
        price : {
            type : Number
        },
        description : {
            type : String
        },
        stock : {
            type : Number
        },
        category : {
            type : String
        },
        images : {
            type : [String]
        }
    }, {
        timestamps : true
    }
);

export type ProductRaw = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<ProductRaw>;

export default mongoose.model<ProductDocument>('Product', productSchema);