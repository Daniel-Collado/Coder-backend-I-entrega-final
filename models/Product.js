import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: [String], required: true },
    thumbnails: { type: [String], default: [] },
}, { 
    timestamps: true,
    collection: productCollection
 });

mongoosePaginate.paginate.options = {
    customLabels: {
        docs: 'payload',
        page: 'currentPage',
        limit: false,
        pagingCounter: false,
        totalDocs: false,
    },
};

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model('Product', productSchema);

export default productModel;