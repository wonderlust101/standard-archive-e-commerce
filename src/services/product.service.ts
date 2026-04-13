import Product from "../models/Product.model";
import { NotFoundError } from "../errors/NotFoundError";
import { CreateProductSchema, UpdateProductSchema } from "../validation/product.validation";

export class ProductService {
    public async getAllProducts() {
        const products = await Product.find();

        // TODO: Add filtering logic here if needed

        return products;
    }

    public async getAllFeaturedProducts() {
        return Product.find({isFeatured: true});
    }

    public getNewArrivalProducts() {
        return Product.find().sort({createdAt : -1}).limit(25);
    }

    public async checkProductStock(sku: string) {
        const product = await Product.findOne({sku})

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        return product.totalStock;
    }

    public async getProduct(productID: string) {
        const product = await Product.findById(productID);

        if (!product)
            throw new NotFoundError("Unable to find product. Please check the ID and try again.");

        return product;
    }

    public async createProduct(productDTO: CreateProductSchema) {
        return await Product.create(productDTO);
    }

    public async updateProduct(productID: string, productDTO: UpdateProductSchema) {
        const updatedProduct = await Product.findByIdAndUpdate(productID, productDTO, {
            runValidators : true,
            returnDocument : "after"
        });

        if (!updatedProduct)
            throw new NotFoundError("Unable to find product. Please check the ID and try again.");

        return updatedProduct;
    }

    public async deleteProduct(productID: string) {
        const deletedProduct = await Product.findByIdAndDelete(productID);

        if (!deletedProduct)
            throw new NotFoundError("Unable to find product. Please check the ID and try again.");

        return deletedProduct;
    }
}