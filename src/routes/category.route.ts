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
import { validate } from "../middleware/validate.middleware";
import { categorySlug, createCategorySchema } from "../validation/category.validation";
import { objectIdValidation } from "../validation/common/objectID.validation";

const categoryRouter = Router();

categoryRouter.route('/')
    .get(getCategories)
    .post(validate({body : createCategorySchema}), createCategory);

categoryRouter.route('/tree').get(getCategoryTree);

categoryRouter.route('/slug/{*slug}').get(validate({params : categorySlug}), getCategoryBySlug);

categoryRouter.route('/:id')
    .get(validate({params : objectIdValidation}), getCategory)
    .patch(validate({params : objectIdValidation}), updateCategory)
    .delete(validate({params : objectIdValidation}), deleteCategory);

export default categoryRouter;