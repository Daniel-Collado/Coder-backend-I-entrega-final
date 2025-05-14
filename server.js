import express from 'express';
import hbs from 'express-handlebars';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import ProductManager from './managers/ProductManager.js';
import CartManager from './managers/CartManager.js';
import productRouter from './routers/product.router.js';
import cartRouter from './routers/cart.router.js';
import viewsRouter from './routers/views.router.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importar modelos
import './models/Product.js';
import './models/Cart.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer); 

// Conectar a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tienda";
mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    });

app.use(express.json());

// Configurar Handlebars con helpers
const handlebars = hbs.create({
    helpers: {
        multiply: (a, b) => a * b,
        calculateTotal: (products) => products.reduce((total, item) => total + (item.quantity * item.product.price), 0),
        eq: (a, b) => a === b,
        join: (array, separator) => {
        if (Array.isArray(array)) {
            return array.join(separator);
        } else if (typeof array === 'string') {
            return array;
        } else {
            return '';
        }
        }
    }
});

app.engine("handlebars", handlebars.engine);
app.set("views", import.meta.dirname + "/views");
app.set("view engine", "handlebars");

// io rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get("/", (req, res) => res.render("index"));
app.use("/", viewsRouter);

const productManager = new ProductManager();
const cartManager = new CartManager();

// actualizaciones en tiempo real
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
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));