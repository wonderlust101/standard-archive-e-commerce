import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";
import slugify from "slugify";
import { ConflictError } from "../errors/ConflictError";

const categorySchema = new Schema({
    // General
    name : {
        type : String,
        trim : true,
        required : [true, "Category name is missing. Please provide a name for the category."],
        minlength : [1, "Category name must be at least 1 character long."],
        maxlength : [100, "Category name cannot exceed 100 characters."],
        match : [/^[a-zA-Z0-9\s',\-|]+$/, "Category names may only contain letters, numbers, spaces, apostrophes, commas, pipes, or dashes."] // Added ' and ,
    },
    slug : {
        type : String,
        unique : true,
        minlength : [3, "Category slug must be at least 3 characters long."],
        match : [/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/, "Slugs may only contain lowercase letters, numbers, hyphens, and forward slashes for sub-categories (e.g. mens/new-arrivals)."]
    },
    description : {
        type : String,
        trim : true,
        required : [true, "Category description is missing. Please provide a description for the category."],
        minlength : [10, "Description must be at least 10 characters long."],
        maxlength : [2000, "Description cannot exceed 2000 characters."]
    },
    shortDescription : {
        type : String,
        trim : true,
        required : [true, "Category short description is missing. Please provide a short description for the category."],
        minlength : [10, "Short description must be at least 10 characters long."],
        maxlength : [100, "Short description cannot exceed 100 characters."]
    },
    parentCategory : {
        type : Schema.Types.ObjectId,
        ref : "Category",
        default : null
    },
    order : {
        type : Number,
        min : [0, "Category order cannot be less than 0."],
        default : 0
    },
    // Clothing Specific
    thumbnail : {
        type : String,
        trim : true,
        required : [true, "Category thumbnail is missing. Please provide a thumbnail for the category."],
        minlength : [10, "Thumbnail must be at least 10 characters long."],
        match : [/^https?:\/\/.+/, "Please provide a valid URL for the thumbnail."]
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