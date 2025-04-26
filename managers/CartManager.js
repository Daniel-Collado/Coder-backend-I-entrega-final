import fs from 'fs/promises';
import path from 'path';

export default class CartManager {
    constructor(filePath) {
        this.path = path.resolve(filePath);
    }

    async getCarts() {
        try {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
        } catch (error) {
        return [];
        }
    }

    async createCart() {
        const carts = await this.getCarts();
        const newId = (carts.at(-1)?.id || 0) + 1;
        const newCart = { id: newId, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null; // Manejo básico de errores
        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
        cart.products.push({ id: productId, quantity: 1 });
        } else {
        cart.products[productIndex].quantity += 1;
        }
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

