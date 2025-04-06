import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/products.json');

export default class ProductManager {
    async getProducts() {
        try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
        } catch (error) {
        return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id == id) || null; 
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newId = (products.at(-1)?.id || 0) + 1;
        const newProduct = { 
        id: newId, 
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status !== undefined ? product.status : true, 
        stock: product.stock,
        category: product.category,
        thumbnails: product.thumbnails || [] 
        };
        products.push(newProduct);
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updateFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updateFields, id }; 
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return null; 
        products.splice(index, 1); 
        await fs.writeFile(filePath, JSON.stringify(products, null, 2));
        return true;
    }
}