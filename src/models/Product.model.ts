import { bsonType } from 'bson';
import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";

const productSchema = new Schema({
        // General
        name : {
            type : String,
            required : [true, "Product name is missing. Please provide a name for the product."],
            trim : true
        },
        slug : {
            type : String
        },
        isFeatured : {
            type : Boolean,
            default : false
        },
        status : {
            type : String,
            enum : {
                values : ["pending", "draft", "published", "discontinued"],
                message : "{VALUE} is not a valid status option"
            },
            default : "draft"
        },
        description : {
            type : String,
            maxLength : 2000,
            required : [true, "Product description is missing. Please provide a description for the product."]
        },
        price : {
            type : Schema.Types.Decimal128,
            required : [true, "Product price is missing. Please provide a price for the product."],
            get : (val: Schema.Types.Decimal128) => parseFloat(val.toString()).toFixed(2)
        },
        // Discount is in percentage
        discountAmount : {
            type : Number,
            default : 0,
            min : [0, "Discount percentage cannot be less than 0."],
            max : [100, "Discount percentage cannot be greater than 100."]
        },
        ratingAverage : {
            type : Number,
            default : 0,
            min : [0, "Rating cannot be less than 0."],
            max : [5, "Rating cannot be greater than 5."],
            set : (val: number) => Math.round(val * 10) / 10
        },
        ratingCount : {
            type : Number,
            default : 0
        },
        images : {
            type : [String]
        },
        // Clothing Specific
        gender : {
            type : String,
            required : [true, "Product gender is missing. Please provide a gender for the product."],
            enum : {
                values : ["male", "female", "unisex"],
                message : "{VALUE} is not a valid gender option"
            }
        },
        category : {
            type : String
        },
        materials : {
            type : String,
            required : [true, "Product materials are missing. Please provide materials for the product."]
        },
        careInstructions : {
            type : String
        },
        // Variants
        variants : [{
            color : {
                type : String,
                required : [true, "Product color is missing. Please provide a color for the product."]
            },
            colorCode : {
                type : String,
                required : [true, "Product color code is missing. Please provide a color code for the product."]
            },
            stock : {
                type : Number,
                required : [true, "Product stock is missing. Please provide stock for the product."],
                min : [0, "Product stock cannot be less than 0."]
            },
            sku : {
                type : String,
                required : [true, "Product SKU is missing. Please provide a SKU for the product."]
            },
            // Sizing
            measurements : {
                unit : {
                    type : String,
                    enum : ["cm", "in"],
                    default : "cm"
                },
                size : {
                    type : String,
                    required : [true, "Product size is missing. Please provide a size for the product."],
                    enum : {
                        values : ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
                        message : "{VALUE} is not a valid size option"
                    }
                },
                // --- Tops, Jackets & Dresses ---
                chest : {type : Number, min : [0, "Chest size cannot be smaller than 0."]},
                bust : {type : Number, min : [0, "Bust size cannot be smaller than 0."]},
                shoulder : {type : Number, min : [0, "Shoulder size cannot be smaller than 0."]},
                sleeveLength : {type : Number, min : [0, "Sleeve length size cannot be smaller than 0."]},
                backLength : {type : Number, min : [0, "Back length size cannot be smaller than 0."]},

                // --- Bottoms & Skirts ---
                waist : {type : Number, min : [0, "Waist size cannot be smaller than 0."]},
                hips : {type : Number, min : [0, "Hips size cannot be smaller than 0."]},
                inseam : {type : Number, min : [0, "Inseam size cannot be smaller than 0."]},
                outseam : {type : Number, min : [0, "Outseam size cannot be smaller than 0."]},
                rise : {type : Number, min : [0, "Rise size cannot be smaller than 0."]},
                thigh : {type : Number, min : [0, "Thigh size cannot be smaller than 0."]},
                legOpening : {type : Number, min : [0, "Leg Opening size cannot be smaller than 0."]},

                // --- General/Dresses ---
                totalLength : {type : Number, min : [0, "Total length size cannot be smaller than 0."]},
                hem : {type : Number, min : [0, "Hem size cannot be smaller than 0."]},

                // Other measurements
                width : {type : Number, min : [0, "Width size cannot be smaller than 0."]},
                height : {type : Number, min : [0, "Height size cannot be smaller than 0."]},
                depth : {type : Number, min : [0, "Depth size cannot be smaller than 0."]}
            },
        }]
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
productSchema.index({name : 1});
productSchema.index({name : "text"});
productSchema.index({"variants.sku" : 1}, {unique : true});

// Virtuals
productSchema.virtual("totalStock").get(function () {
    return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

productSchema.virtual("isInStock").get(function () {
    return this.variants.some(variant => variant.stock > 0);
});

productSchema.virtual("salePrice").get(function () {
    const originalPrice = parseFloat(this.price?.toString() ?? "0");
    const discount = this.discountAmount / 100;

    return (originalPrice * (1 - discount)).toFixed(2);
});

// Pre-save hook
productSchema.pre("save", function () {
    if (!this.isModified("name"))
        return;

    this.slug = slugify(this.name, {lower : true});
});

export type ProductRaw = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<ProductRaw>;

export default mongoose.model<ProductDocument>('Product', productSchema);