import mongoose from 'mongoose';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
    products: [
        {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, 
        quantity: Number,
        },
    ],
}, { timestamps: true });

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;