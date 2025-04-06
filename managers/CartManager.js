import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/carts.json');

export default class CartManager {
    async getCarts() {
        try {
        const data = await fs.readFile(filePath, 'utf-8');
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
        await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id == id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id == cartId);
        if (!cart) return null;

        const prodInCart = cart.products.find(p => p.product == productId);
        if (prodInCart) {
        prodInCart.quantity += 1;
        } else {
        cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}
