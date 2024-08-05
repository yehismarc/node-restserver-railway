import {Schema, model} from "mongoose";

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    status : {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    description: {
        type: String
    },
    available: {
        type: Boolean,
        default: true
    }

});

productSchema.methods.toJSON = function() {
    const { __v, status, ...data } = this.toObject();
    return data;
}

const Product = model('Product', productSchema);

export {
    Product
}