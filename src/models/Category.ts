import mongoose, {HydratedDocument, InferSchemaType, Schema} from "mongoose";
import slugify from "slugify";

const categorySchema = new Schema({
    // General
    name: {
        type: String,
        required: [true, "Category name is missing. Please provide a name for the category."],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Category description is missing. Please provide a description for the category."],
        trim: true,
    },
    shortDescription: {
        type: String,
        required: [true, "Category short description is missing. Please provide a short description for the category."],
        maxlength: [100, "Short description cannot exceed 100 characters."],
        trim: true,
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    order: {
      type: Number,
      required: [true, "Category order is missing. Please provide an order for the category."],
    },
    // Clothing Specific
    thumbnail: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
},{
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true
    },
    toObject: {
        virtuals: true,
        getters: true
    }
})

// Indexes
categorySchema.index({order : 1});

// Virtuals
categorySchema.virtual('fullPath').get(function() {
    if (this.parentCategory && typeof this.parentCategory === 'object' && 'slug' in this.parentCategory) {
        return `${(this.parentCategory as any).slug}/${this.slug}`;
    }
    return this.slug;
});

// Pre-save hook
categorySchema.pre("save", function () {
    if (!this.isModified("name"))
        return;

    this.slug = slugify(this.name, {lower : true});
});

export type CategoryRaw = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<CategoryRaw>;

export default mongoose.model<CategoryDocument>('Category', categorySchema);