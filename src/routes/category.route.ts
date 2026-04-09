import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    getCategoryBySlug,
    getCategoryTree,
    updateCategory
} from "../controllers/category.controller";

const categoryRouter = Router();

categoryRouter.route('/')
    .get(getCategories)
    .post(createCategory);

categoryRouter.route('/tree').get(getCategoryTree);

categoryRouter.route('/slug/{*slug}').get(getCategoryBySlug);

categoryRouter.route('/:id')
    .get(getCategory)
    .patch(updateCategory)
    .delete(deleteCategory);

export default categoryRouter;