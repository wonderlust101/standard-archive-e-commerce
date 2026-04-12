import Category, { CategoryRaw } from "../models/Category.model";
import { NotFoundError } from "../errors/NotFoundError";
import mongoose from "mongoose";
import { CreateCategorySchema, UpdateCategorySchema } from "../validation/category.validation";

export type CategoryTreeNode = CategoryRaw & {
    _id: mongoose.Types.ObjectId;
    children: CategoryTreeNode[];
};

export default class CategoryService {
    public async getAllCategories() {
        const categories = await Category.find();

        // TODO: Add filtering logic here if needed

        return categories;
    }

    public async getCategoryTree() {
        const categories = await Category.find().sort({order : 1, name : 1}).lean();

        const categoryMap: Record<string, any> = {};
        const tree: CategoryTreeNode[] = [];

        categories.forEach(category => {
            categoryMap[category._id.toString()] = {...category, children : []};
        });

        categories.forEach(category => {
            const categoryID = category._id.toString();
            // If the category has a parent
            if (category.parentCategory) {
                const parentID = category.parentCategory.toString();

                // Add the category to its parent's children array'
                if (categoryMap[parentID]) {
                    categoryMap[parentID].children.push(categoryMap[categoryID]);
                    // If the category is a root category
                } else {
                    tree.push(categoryMap[categoryID]);
                }
            } else {
                // If the category is a root category
                tree.push(categoryMap[categoryID]);
            }
        });

        return tree;
    }

    public async getCategoryByID(categoryID: string) {
        const category = await Category.findById(categoryID);

        if (!category)
            throw new NotFoundError("Unable to find category. Please check the ID and try again.");

        return category;
    }

    public async getCategoryBySlug(slug: string) {
        const category = await Category.findOne({slug});

        if (!category)
            throw new NotFoundError("Unable to find category. Please check the URL and try again.");

        return category;
    }

    public async createCategory(createCategoryDTO: CreateCategorySchema) {
        return await Category.create(createCategoryDTO);
    }

    public async updateCategory(categoryID: string, updateCategoryDTO: UpdateCategorySchema) {
        const category = await Category.findById(categoryID);

        if (!category)
            throw new NotFoundError("Unable to find category. Please check the ID and try again.");

        Object.assign(category, updateCategoryDTO);

        return await category.save();
    }

    public async deleteCategory(categoryID: string) {
        const deletedCategory = await Category.findByIdAndDelete(categoryID);

        if (!deletedCategory)
            throw new NotFoundError("Unable to find category. Please check the ID and try again.");

        return deletedCategory;
    }
}