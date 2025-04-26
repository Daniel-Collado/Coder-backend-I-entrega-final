import express from 'express';
import hbs from 'express-handlebars';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import viewsRouter from './routers/views.router.js';

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer); 

app.use(express.json());

// Configurar Handlebars
app.engine("handlebars", hbs.engine());
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

// Middleware para hacer que io esté disponible en las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get("/", (req, res) => res.render("index"));
app.use("/", viewsRouter);

const productManager = new ProductManager('data/products.json');
const cartManager = new CartManager('data/carts.json');

// Pasar productManager a productRouter para actualizaciones en tiempo real
app.use('/api/products', productRouter(productManager, io));
app.use('/api/carts', cartRouter(cartManager));

// Conexión con Socket.IO
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
httpServer.listen(8080, () => console.log('Servidor listo en puerto 8080'));