import express from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta para /products
router.get('/products', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const queryObj = query ? JSON.parse(query) : {};

    const result = await productManager.getProductsWithFilters({
        limit: parseInt(limit),
        page: parseInt(page),
        sort,
        query: queryObj,
    });

    res.render('index', {
        payload: result.payload,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${encodeURIComponent(JSON.stringify(queryObj))}` : ''}` : null,
        nextLink: result.hasNextPage ? `/products?page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${encodeURIComponent(JSON.stringify(queryObj))}` : ''}` : null,
        query: query ? JSON.stringify(queryObj) : null,
        sort,
    });
});

// Ruta para /products/:pid
router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).render('error', { message: 'Producto no encontrado' });
    res.render('productDetail', { product });
});

// Ruta para /carts/:cid
router.get('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });
    res.render('cart', { cart });
});

// Ruta para /cart
router.get('/cart', async (req, res) => {
    let cartId = req.query.cartId;
    if (!cartId) {
        const newCart = await cartManager.createCart();
        if (!newCart) return res.status(500).render('error', { message: 'Error al crear carrito' });
        cartId = newCart._id;
    }

    const cart = await cartManager.getCartById(cartId);
    if (!cart) return res.status(404).render('error', { message: 'Carrito no encontrado' });
    res.render('cart', { cart });
});

// Ruta para /home
router.get('/home', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('home', { productos });
});

// Ruta para /realtimeproducts
router.get('/realtimeproducts', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('realTimeProducts', { productos });
});

export default router;