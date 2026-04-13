import { bsonType } from 'bson';
import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";

type ProductVirtuals = {
    totalStock : number,
    isInStock : boolean
}

const productSchema = new Schema({
        // General
        name : {
            type : String,
            required : [true, "Product name is missing. Please provide a name for the product."],
            trim : true,
            minlength : [1, "Product name must be at least 1 characters long."],
            maxlength : [100, "Product name cannot exceed 100 characters."],
            match : [/^[a-zA-Z0-9\s',\-|]+$/, "Product names may only contain letters, numbers, spaces, apostrophes, commas, pipes, or dashes."]
        },
        slug : {
            type : String,
            unique : [true, "Product slug must be unique."]
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
            default : "pending"
        },
        description : {
            type : String,
            minlength : [10, "Product description must be at least 10 characters long."],
            maxLength : [5000, "Product description cannot exceed 5000 characters."],
            required : [true, "Product description is missing. Please provide a description for the product."],
            trim : true
        },
        price : {
            type : Schema.Types.Decimal128,
            required : [true, "Product price is missing. Please provide a price for the product."],
            get : (val: Schema.Types.Decimal128) => parseFloat(val.toString()).toFixed(2),
            min : [0, "Product price cannot be less than 0."],
            max : [1000000, "Product price cannot be greater than 1,000,000."]
        },
        salePrice : {
            type : Schema.Types.Decimal128,
            min : [0, "Product price cannot be less than 0."],
            max : [1000000, "Product price cannot be greater than 1,000,000."],
            get : (val: Schema.Types.Decimal128) => parseFloat(val.toString()).toFixed(2),
            validate : {
                validator : function (val: Schema.Types.Decimal128) {
                    const sale = parseFloat(val.toString());
                    const original = parseFloat(this.price.toString());

                    return sale <= original;
                },
                message : "Sale price ({VALUE}) cannot be higher than the original price."
            },
        },
        // TODO: Add rating system
        // ratingAverage : {
        //     type : Number,
        //     default : 0,
        //     min : [0, "Rating cannot be less than 0."],
        //     max : [5, "Rating cannot be greater than 5."],
        //     set : (val: number) => Math.round(val * 10) / 10
        // },
        // ratingCount : {
        //     type : Number,
        //     default : 0
        // },
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
            type : Schema.Types.ObjectId,
            ref : "Category",
            required : [true, "Product category is missing. Please provide a category for the product."]
        },
        materials : {
            type : String,
            required : [true, "Product materials are missing. Please provide materials for the product."],
            trim : true,
            minlength : [1, "Product materials must be at least 1 characters long."],
            maxLength : [100, "Product materials cannot exceed 100 characters."],
        },
        careInstructions : {
            type : String,
            required : [true, "Product care instructions are missing. Please provide care instructions for the product."],
            minlength : [1, "Product care instructions must be at least 1 characters long."],
            maxLength : [1000, "Product care instructions cannot exceed 1000 characters."],
            trim : true
        },
        mainImages : {
            type : [String],
            required : [true, "Product main images are missing. Please provide main images for the product."],
        },
        sku : {
            type : String,
            required : [true, "Product SKU is missing. Please provide a SKU for the product."],
            minlength : [10, "Product SKU must be at least 10 character long."],
            maxlength : [10, "Product SKU cannot be longer than 10 characters."],
            trim : true
        },
        // Variants
        variants : [{
            color : {
                type : String,
                required : [true, "Product color is missing. Please provide a color for the product."],
                minlength : [1, "Product color code must be at least 3 characters long."],
                maxlength : [50, "Product color code cannot be longer than 50 characters."],
                trim : true
            },
            colorCode : {
                type : String,
                required : [true, "Product color code is missing. Please provide a color code for the product."],
                trim : true,
                minlength : [1, "Product color code must be at least 1 characters long."],
                maxlength : [10, "Product color code cannot be longer than 10 characters."],
                match : [/^[a-zA-Z0-9]+$/, "Product color codes may only contain letters and numbers."]
            },
            images : {
                type : [String],
                required : [true, "Product images are missing. Please provide images for the product."],
            },
            // Sizing
            sizes : [{
                stock : {
                    type : Number,
                    required : [true, "Product stock is missing. Please provide stock for the product."],
                    min : [0, "Product stock cannot be less than 0."]
                },
                size : {
                    type : String,
                    required : [true, "Product size is missing. Please provide a size for the product."],
                    enum : {
                        values : ["XXS", "XS", "S", "M", "L", "XL", "XXL"],
                        message : "{VALUE} is not a valid size option"
                    }
                },
                measurement : {
                    // Default measurements are cm
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
                }
            }]
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
productSchema.index({"sku" : 1}, {unique : true});

// Virtuals
productSchema.virtual("totalStock").get(function () {
    return this.variants.reduce((total, variant) => {
        const sizeSum = variant.sizes.reduce((sum, s) => sum + s.stock, 0);
        return total + sizeSum;
    }, 0);
});

productSchema.virtual("isInStock").get(function () {
    return this.variants.some(variant =>
        variant.sizes.some(s => s.stock > 0)
    );
});

// Pre-save hook
productSchema.pre("save", function () {
    if (!this.isModified("name"))
        return;

    this.slug = slugify(this.name, {lower : true});
});

export type ProductRaw = InferSchemaType<typeof productSchema>;
export type ProductDocument = HydratedDocument<ProductRaw & ProductVirtuals>;

export default mongoose.model<ProductDocument>('Product', productSchema);