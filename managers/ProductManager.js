import productModel from '../models/Product.js';

class ProductManager {
    async getProductById(id) {
        return await productModel.findById(id).lean();
    }

    async getProducts() {
        return await productModel.find().lean();
    }

    async getProductsWithFilters({ limit, page, sort, query }) {
        const options = {
        page: page || 1,
        limit: limit || 10,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        lean: true,
        };
        return await productModel.paginate(query || {}, options);
    }

    async addProduct(product) {
        return await productModel.create(product);
    }

    async updateProduct(id, updatedProduct) {
        return await productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    }

    async deleteProduct(id) {
        return await productModel.findByIdAndDelete(id);
    }
}

export default ProductManager;