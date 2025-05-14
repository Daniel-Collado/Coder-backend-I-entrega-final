import express from 'express';
const router = express.Router();

export default function cartRouter(cartManager) {
    router.post('/', async (req, res) => {
        const carrito = await cartManager.createCart();
        if (!carrito) return res.status(500).send({ error: 'Error al crear carrito' });
        res.send({ mensaje: 'Carrito creado', carrito });
    });

    router.get('/:cid', async (req, res) => {
        const cid = req.params.cid;
        const carrito = await cartManager.getCartById(cid);
        if (!carrito) return res.status(404).send({ error: 'Carrito no encontrado' });
        res.send({ productos: carrito.products });
    });

    router.post('/:cid/product/:pid', async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const carritoActualizado = await cartManager.addProductToCart(cid, pid);
        if (!carritoActualizado) return res.status(404).send({ error: 'No se pudo agregar el producto' });
        res.send({ mensaje: 'Producto agregado al carrito', carrito: carritoActualizado });
    });

    // Nuevo endpoint: Eliminar un producto del carrito
    router.delete('/:cid/products/:pid', async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const carritoActualizado = await cartManager.removeProductFromCart(cid, pid);
        if (!carritoActualizado) return res.status(404).send({ error: 'Carrito o producto no encontrado' });
        res.send({ mensaje: 'Producto eliminado del carrito', carrito: carritoActualizado });
    });

    // Nuevo endpoint: Actualizar todos los productos del carrito
    router.put('/:cid', async (req, res) => {
        const cid = req.params.cid;
        const { products } = req.body;
        if (!products || !Array.isArray(products)) return res.status(400).send({ error: 'Se requiere un arreglo de productos' });
        const carritoActualizado = await cartManager.updateCart(cid, products);
        if (!carritoActualizado) return res.status(404).send({ error: 'Carrito no encontrado' });
        res.send({ mensaje: 'Carrito actualizado', carrito: carritoActualizado });
    });

    // Nuevo endpoint: Actualizar la cantidad de un producto en el carrito
    router.put('/:cid/products/:pid', async (req, res) => {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        if (typeof quantity !== 'number' || quantity < 1) return res.status(400).send({ error: 'Cantidad inválida' });
        const carritoActualizado = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (!carritoActualizado) return res.status(404).send({ error: 'Carrito o producto no encontrado' });
        res.send({ mensaje: 'Cantidad actualizada', carrito: carritoActualizado });
    });

    // Nuevo endpoint: Eliminar todos los productos del carrito
    router.delete('/:cid', async (req, res) => {
        const cid = req.params.cid;
        const carrito = await cartManager.clearCart(cid);
        if (!carrito) return res.status(404).send({ error: 'Carrito no encontrado' });
        res.send({ mensaje: 'Carrito vaciado', carrito });
    });

    return router;
}