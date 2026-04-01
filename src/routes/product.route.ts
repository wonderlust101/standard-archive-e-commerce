import { Router } from 'express';
import {
    checkProductStock,
    createProduct,
    deleteProduct,
    getFeaturedProducts, getNewArrivals,
    getProduct,
    getProducts, getProductsByCategory,
    getRelatedProducts,
    searchProducts,
    updateProduct
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.route('/')
    .get(getProducts)
    .post(createProduct);

productRouter.route('/search').get(searchProducts);

productRouter.route('/featured').get(getFeaturedProducts);
productRouter.route('/new-arrivals').get(getNewArrivals);

productRouter.route('/category/:category').get(getProductsByCategory);

productRouter.route('/check-stock/:sku').get(checkProductStock);

productRouter.route('/:id')
    .get(getProduct)
    .patch(updateProduct)
    .delete(deleteProduct);

productRouter.route('/:id/related').get(getRelatedProducts);

export default productRouter;