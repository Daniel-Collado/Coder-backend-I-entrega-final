import express from 'express';
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';

const app = express();
app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

// Rutas de productos
app.get('/api/products', async (req, res) => {
    const productos = await productManager.getProducts();
    res.send({ productos });
});

app.get('/api/products/:pid', async (req, res) => {
    const producto = await productManager.getProductById(req.params.pid);
    if (!producto) return res.status(404).send({ error: 'Producto no encontrado' });
    res.send({ producto });
});

app.post('/api/products', async (req, res) => {
    const nuevoProducto = await productManager.addProduct(req.body);
    res.send({ mensaje: 'Producto agregado', producto: nuevoProducto });
});

app.put('/api/products/:pid', async (req, res) => {
    const productoActualizado = await productManager.updateProduct(req.params.pid, req.body);
    if (!productoActualizado) return res.status(404).send({ error: 'Producto no encontrado' });
    res.send({ mensaje: 'Producto actualizado', producto: productoActualizado });
});

app.delete('/api/products/:pid', async (req, res) => {
    await productManager.deleteProduct(req.params.pid);
    res.send({ mensaje: 'Producto eliminado' });
});

// Rutas de carritos
app.post('/api/carts', async (req, res) => {
    const carrito = await cartManager.createCart();
    res.send({ mensaje: 'Carrito creado', carrito });
});

app.get('/api/carts/:cid', async (req, res) => {
    const carrito = await cartManager.getCartById(req.params.cid);
    if (!carrito) return res.status(404).send({ error: 'Carrito no encontrado' });
    res.send({ productos: carrito.products });
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    const carritoActualizado = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!carritoActualizado) return res.status(404).send({ error: 'No se pudo agregar el producto' });
    res.send({ mensaje: 'Producto agregado al carrito', carrito: carritoActualizado });
});

// Servidor en puerto 8080
app.listen(8080, () => console.log('Servidor listo en puerto 8080'));
