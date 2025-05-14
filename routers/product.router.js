import express from 'express';

const router = express.Router();

export default (productManager, io) => {
  // POST: Agregar un nuevo producto
    router.post('/', async (req, res) => {
        try {
        console.log('Producto recibido:', req.body); // Depuración
        const newProduct = await productManager.addProduct(req.body);
        console.log('Producto creado:', newProduct); // Depuración
        io.emit('productoAgregado', newProduct); // Emitir evento para actualización en tiempo real
        res.status(201).json({ status: 'success', mensaje: 'Producto agregado', producto: newProduct });
        } catch (error) {
        console.error('Error en POST /api/products:', error); // Depuración
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', mensaje: 'El código del producto ya existe' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ status: 'error', mensaje: 'Faltan campos requeridos o son inválidos', detalles: error.message });
        }
        res.status(500).json({ status: 'error', mensaje: 'Error al agregar producto', detalles: error.message });
        }
    });

    // GET: Obtener todos los productos (con paginación y filtros)
    router.get('/', async (req, res) => {
        try {
        console.log('Obteniendo productos con query:', req.query); // Depuración
        const products = await productManager.getProducts(req.query);
        console.log('Productos obtenidos:', products); // Depuración
        res.status(200).json({ status: 'success', payload: products });
        } catch (error) {
        console.error('Error en GET /api/products:', error); // Depuración
        res.status(500).json({ status: 'error', mensaje: error.message });
        }
    });

    // GET: Obtener un producto por ID
    router.get('/:pid', async (req, res) => {
        try {
        const { pid } = req.params;
        console.log('Buscando producto con ID:', pid); // Depuración
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
        }
        console.log('Producto encontrado:', product); // Depuración
        res.status(200).json({ status: 'success', producto: product });
        } catch (error) {
        console.error('Error en GET /api/products/:pid:', error); // Depuración
        res.status(500).json({ status: 'error', mensaje: error.message });
        }
    });

    // PUT: Actualizar un producto por ID
    router.put('/:pid', async (req, res) => {
        try {
        const { pid } = req.params;
        console.log('Actualizando producto con ID:', pid, 'Datos:', req.body); // Depuración
        const updatedProduct = await productManager.updateProduct(pid, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
        }
        console.log('Producto actualizado:', updatedProduct); // Depuración
        io.emit('productoActualizado', updatedProduct); // Emitir evento para actualización en tiempo real
        res.status(200).json({ status: 'success', mensaje: 'Producto actualizado', producto: updatedProduct });
        } catch (error) {
        console.error('Error en PUT /api/products/:pid:', error); // Depuración
        if (error.code === 11000) {
            return res.status(400).json({ status: 'error', mensaje: 'El código del producto ya existe' });
        }
        res.status(500).json({ status: 'error', mensaje: 'Error al actualizar producto', detalles: error.message });
        }
    });

    // DELETE: Eliminar un producto por ID
    router.delete('/:pid', async (req, res) => {
        try {
        const { pid } = req.params;
        console.log('Eliminando producto con ID:', pid); // Depuración
        const deletedProduct = await productManager.deleteProduct(pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: 'error', mensaje: 'Producto no encontrado' });
        }
        console.log('Producto eliminado:', deletedProduct); // Depuración
        io.emit('productoEliminado', pid); // Emitir evento para actualización en tiempo real
        res.status(200).json({ status: 'success', mensaje: 'Producto eliminado' });
        } catch (error) {
        console.error('Error en DELETE /api/products/:pid:', error); // Depuración
        res.status(500).json({ status: 'error', mensaje: 'Error al eliminar producto', detalles: error.message });
        }
    });

    return router;
};