import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export default class CartManager {
    constructor() {}

    async getCarts() {
        try {
        return await Cart.find().lean();
        } catch (error) {
        console.error('Error al obtener carritos:', error);
        return [];
        }
    }

    async createCart() {
        try {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        return newCart.toObject();
        } catch (error) {
        console.error('Error al crear carrito:', error);
        return null;
        }
    }

    async getCartById(id) {
        try {
        return await Cart.findById(id).populate('products.product').lean();
        } catch (error) {
        console.error('Error al obtener carrito por ID:', error);
        return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            cart.products.push({ product: productId, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();
        return await Cart.findById(cartId).populate('products.product').lean();
        } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        return null;
        }
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return await Cart.findById(cartId).populate('products.product').lean();
        } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        return null;
        }
    }

    // Actualizar todos los productos del carrito
    async updateCart(cartId, products) {
        try {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = products.map(p => ({
            product: p.product,
            quantity: p.quantity || 1,
        }));
        await cart.save();
        return await Cart.findById(cartId).populate('products.product').lean();
        } catch (error) {
        console.error('Error al actualizar carrito:', error);
        return null;
        }
    }

    // Actualizar la cantidad de un producto específico
    async updateProductQuantity(cartId, productId, quantity) {
        try {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) return null;

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        return await Cart.findById(cartId).populate('products.product').lean();
        } catch (error) {
        console.error('Error al actualizar cantidad del producto:', error);
        return null;
        }
    }

    // Eliminar todos los productos del carrito
    async clearCart(cartId) {
        try {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return cart.toObject();
        } catch (error) {
        console.error('Error al vaciar carrito:', error);
        return null;
        }
    }
}