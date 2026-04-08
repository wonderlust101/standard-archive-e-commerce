import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";
import { ConflictError } from "../errors/ConflictError";

const categorySchema = new Schema({
    // General
    name : {
        type : String,
        required : [true, "Category name is missing. Please provide a name for the category."],
        trim : true
    },
    slug : {
        type : String,
        unique : true
    },
    description : {
        type : String,
        required : [true, "Category description is missing. Please provide a description for the category."],
        trim : true
    },
    shortDescription : {
        type : String,
        required : [true, "Category short description is missing. Please provide a short description for the category."],
        maxlength : [100, "Short description cannot exceed 100 characters."],
        trim : true
    },
    parentCategory : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        default : null
    },
    order : {
        type : Number,
        required : [true, "Category order is missing. Please provide an order for the category."]
    },
    // Clothing Specific
    thumbnail : {
        type : String,
        required : [true, "Category thumbnail is missing. Please provide a thumbnail for the category."]
    },
    status : {
        type : String,
        enum : ['active', 'inactive', 'archived'],
        default : 'active'
    }
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
});

// Indexes
categorySchema.index({order : 1});

// Helper Functions
async function generateFullSlug(name: string, parentID: mongoose.Types.ObjectId | null) {
    const baseSlug = slugify(name, {lower : true});

    if (!parentID)
        return baseSlug;

    const parent = await mongoose.model<CategoryDocument>('Category').findById(parentID).lean();

    if (parent && parent.slug)
        return `${parent.slug}/${baseSlug}`;

    return baseSlug;
}

// Pre-save hook
categorySchema.pre("save", async function () {
    if (!this.isModified("name") && !this.isModified("parentCategory"))
        return;

    this.slug = await generateFullSlug(this.name, this.parentCategory as mongoose.Types.ObjectId | null);
});

categorySchema.pre("findOneAndDelete", async function () {
    const docToUpdate = await this.model.findOne(this.getQuery()).lean();

    if (docToUpdate) {
        const hasChildren = await this.model.exists({parentCategory : docToUpdate._id});

        if (hasChildren) {
            throw new ConflictError("Cannot delete category because it has sub-categories. Please move or delete them first.");
        }
    }
});

categorySchema.post("save", async function (doc) {
    const children = await mongoose.model('Category').find({parentCategory : this._id}) as CategoryDocument[];

    for (const child of children) {
        const childBaseName = child.slug?.split('/').pop() || child.name;
        child.slug = `${doc.slug}/${slugify(childBaseName, {lower : true})}`;

        await child.save();
    }
});

export type CategoryRaw = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<CategoryRaw>;

export default mongoose.model<CategoryDocument>('Category', categorySchema);